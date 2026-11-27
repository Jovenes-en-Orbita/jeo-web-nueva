import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Optional,
  Inject,
} from "@nestjs/common";
import type {
  NewsArticle,
  NewsCategory,
  ArticleReference,
  PaginatedNewsResponse,
} from "@jeo/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateNewsDto, normalizeArticleStatus } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import {
  CreateArticleReferenceDto,
  UpdateArticleReferenceDto,
} from "./dto/article-reference.dto";
import { NewsQueryDto } from "./dto/news-query.dto";
import {
  NEWS_SEARCH_STRATEGY,
  type INewsSearchStrategy,
  type NewsRelationIncludeOptions,
} from "./queries/news-query.interfaces";
import { NewsQueryBuilder } from "./queries/news-query.builder";
import { PrismaNewsSearchStrategy } from "./queries/prisma-news-search.strategy";

@Injectable()
export class NewsService {
  private readonly searchStrategy: INewsSearchStrategy;

  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @Inject(NEWS_SEARCH_STRATEGY)
    searchStrategy?: INewsSearchStrategy,
  ) {
    this.searchStrategy =
      searchStrategy ?? new PrismaNewsSearchStrategy(this.prisma);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Búsqueda, Filtrado y Consulta de Artículos ──
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Ejecuta una consulta de noticias utilizando la capa centralizada de búsqueda.
   * Soporta tanto el nuevo objeto `NewsQueryDto` como la firma posicional previa.
   */
  async findAll(
    tagOrQuery?: string | NewsQueryDto,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedNewsResponse | NewsArticle[]> {
    const queryDto: NewsQueryDto =
      typeof tagOrQuery === "object" && tagOrQuery !== null
        ? tagOrQuery
        : {
            tag: tagOrQuery,
            search,
            page,
            limit,
          };

    return this.searchStrategy.executeSearch(queryDto, false);
  }

  /**
   * Endpoint dedicado de búsqueda avanzada que siempre retorna metadatos de paginación.
   */
  async search(queryDto: NewsQueryDto = {}): Promise<PaginatedNewsResponse> {
    return (await this.searchStrategy.executeSearch(
      queryDto,
      true,
    )) as PaginatedNewsResponse;
  }

  /**
   * Obtiene un artículo por su slug único permitiendo controlar las relaciones incluidas.
   */
  async findBySlug(
    slug: string,
    includeOptions?: {
      include?: string;
      includeCategories?: boolean;
      includeReferences?: boolean;
    },
  ): Promise<NewsArticle> {
    const resolvedIncludes = NewsQueryBuilder.resolveIncludes(includeOptions);
    const include = NewsQueryBuilder.buildPrismaInclude(resolvedIncludes);
    const article = await this.prisma.newsArticle.findUnique({
      where: { slug },
      ...(include ? { include } : {}),
    });

    if (!article) {
      throw new NotFoundException(`Noticia con slug "${slug}" no encontrada`);
    }

    return this.mapToDto(article, resolvedIncludes);
  }

  /**
   * Obtiene la lista de tags únicos disponibles en los artículos publicados.
   */
  async findAvailableTags(): Promise<string[]> {
    const articles = await this.prisma.newsArticle.findMany({
      select: { tags: true },
    });

    const tagSet = new Set<string>();
    for (const article of articles ?? []) {
      if (Array.isArray(article.tags)) {
        for (const tag of article.tags) {
          const trimmed = tag?.trim();
          if (trimmed) tagSet.add(trimmed);
        }
      }
    }

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "es"));
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── CRUD de Artículos (con Categorías y Referencias Bibliográficas) ──
  // ══════════════════════════════════════════════════════════════════════════

  async create(dto: CreateNewsDto): Promise<NewsArticle> {
    const normalizedSlug = dto.slug.trim();
    if (!normalizedSlug) {
      throw new BadRequestException("El slug no puede estar vacío");
    }

    const existing = await this.prisma.newsArticle.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe una noticia con el slug "${normalizedSlug}"`,
      );
    }

    const parsedDate = dto.date ? new Date(dto.date) : new Date();
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        "La fecha proporcionada para la noticia no es válida",
      );
    }

    const normalizedStatus = dto.status
      ? normalizeArticleStatus(dto.status)
      : "PUBLISHED";
    if (
      !normalizedStatus ||
      !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(normalizedStatus)
    ) {
      throw new BadRequestException(
        "Estado inválido. Valores permitidos: DRAFT, PUBLISHED, ARCHIVED",
      );
    }

    const deduplicatedTags = this.deduplicateStrings(dto.tags ?? []);
    const deduplicatedRefs = this.prepareReferenceCreatePayloads(
      dto.references ?? [],
    );
    const rawCategoryInputs = [
      ...(dto.categoryIds ?? []),
      ...(dto.categories ?? []),
    ];

    const created = await this.runInTransaction(async (tx) => {
      const resolvedCategories = await this.resolveCategoriesOrFail(
        tx,
        rawCategoryInputs,
      );

      const include = NewsQueryBuilder.buildPrismaInclude({
        categories: true,
        references: true,
      });

      return tx.newsArticle.create({
        data: {
          title: dto.title.trim(),
          summary: dto.summary.trim(),
          imageUrl: dto.imageUrl || "/assets/hero-cosmos.svg",
          date: parsedDate,
          readTimeMinutes: dto.readTimeMinutes || 4,
          slug: normalizedSlug,
          content: dto.content,
          author: dto.author?.trim() || "Equipo JEO",
          tags: deduplicatedTags,
          coverImageCaption: dto.coverImageCaption,
          status: normalizedStatus,
          ...(resolvedCategories.length > 0 && {
            categories: {
              connect: resolvedCategories.map((c) => ({ id: c.id })),
            },
          }),
          ...(deduplicatedRefs.length > 0 && {
            references: {
              create: deduplicatedRefs,
            },
          }),
        },
        ...(include ? { include } : {}),
      });
    });

    await this.syncArticleImageToGallery(created);

    return this.mapToDto(created);
  }

  async update(id: string, dto: UpdateNewsDto): Promise<NewsArticle> {
    const updated = await this.runInTransaction(async (tx) => {
      const existing = await tx.newsArticle.findUnique({
        where: { id },
        include: {
          references: true,
          categories: true,
        },
      });

      if (!existing) {
        throw new NotFoundException(`Noticia con id "${id}" no encontrada`);
      }

      if (dto.slug !== undefined) {
        const trimmedSlug = dto.slug.trim();
        if (!trimmedSlug) {
          throw new BadRequestException("El slug no puede estar vacío");
        }
        if (trimmedSlug !== existing.slug) {
          const slugConflict = await tx.newsArticle.findUnique({
            where: { slug: trimmedSlug },
          });
          if (slugConflict && slugConflict.id !== id) {
            throw new ConflictException(
              `Ya existe una noticia con el slug "${trimmedSlug}"`,
            );
          }
        }
      }

      let parsedDate: Date | undefined;
      if (dto.date !== undefined) {
        parsedDate = new Date(dto.date);
        if (Number.isNaN(parsedDate.getTime())) {
          throw new BadRequestException("La fecha proporcionada no es válida");
        }
      }

      let normalizedStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
      if (dto.status !== undefined) {
        normalizedStatus = normalizeArticleStatus(dto.status);
        if (
          !normalizedStatus ||
          !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(normalizedStatus)
        ) {
          throw new BadRequestException(
            "Estado inválido. Valores permitidos: DRAFT, PUBLISHED, ARCHIVED",
          );
        }
      }

      // 1. Gestión de Categorías (reemplazo declarativo y/o adición/remoción granular)
      const categoriesRelationUpdate: Record<string, any> = {};
      const hasDeclarativeCategories =
        dto.categoryIds !== undefined || dto.categories !== undefined;

      if (hasDeclarativeCategories) {
        const rawList = [...(dto.categoryIds ?? []), ...(dto.categories ?? [])];
        const resolved = await this.resolveCategoriesOrFail(tx, rawList);
        categoriesRelationUpdate.set = resolved.map((c) => ({ id: c.id }));
      }

      if (dto.addCategoryIds && dto.addCategoryIds.length > 0) {
        const toAdd = await this.resolveCategoriesOrFail(
          tx,
          dto.addCategoryIds,
        );
        categoriesRelationUpdate.connect = toAdd.map((c) => ({ id: c.id }));
      }

      if (dto.removeCategoryIds && dto.removeCategoryIds.length > 0) {
        const toRemove = await this.resolveCategoriesOrFail(
          tx,
          dto.removeCategoryIds,
        );
        categoriesRelationUpdate.disconnect = toRemove.map((c) => ({
          id: c.id,
        }));
      }

      // 2. Gestión de Referencias Bibliográficas
      const existingRefsList: Array<{ id: string }> = Array.isArray(
        existing.references,
      )
        ? existing.references
        : [];
      const existingRefIds = new Set(existingRefsList.map((r) => r.id));

      // Modo A: Sincronización declarativa completa mediante `dto.references`
      if (dto.references !== undefined) {
        const incomingWithId = dto.references.filter(
          (r) => r.id !== undefined && r.id !== "",
        );
        const incomingWithoutId = dto.references.filter((r) => !r.id);

        const keptIds: string[] = [];
        for (const item of incomingWithId) {
          const refId = item.id!.trim();
          if (!existingRefIds.has(refId)) {
            throw new BadRequestException(
              `La referencia bibliográfica con id "${refId}" no pertenece a este artículo o no existe`,
            );
          }
          if (keptIds.includes(refId)) {
            throw new BadRequestException(
              `ID de referencia duplicado en la solicitud: "${refId}"`,
            );
          }
          keptIds.push(refId);
        }

        // Eliminar las referencias que ya no estén en la lista enviada
        if (tx.articleReference?.deleteMany) {
          await tx.articleReference.deleteMany({
            where: {
              articleId: id,
              ...(keptIds.length > 0 ? { id: { notIn: keptIds } } : {}),
            },
          });
        }

        // Actualizar referencias existentes conservadas
        for (const item of incomingWithId) {
          const updateData = this.prepareReferenceUpdatePayload(item);
          if (Object.keys(updateData).length > 0) {
            await tx.articleReference.update({
              where: { id: item.id!.trim() },
              data: updateData,
            });
          }
        }

        // Crear nuevas referencias sin ID
        const newRefPayloads = this.prepareReferenceCreatePayloads(
          incomingWithoutId.map((r) => {
            if (!r.title || !r.title.trim()) {
              throw new BadRequestException(
                "Toda nueva referencia bibliográfica debe incluir un título (title)",
              );
            }
            return r as CreateArticleReferenceDto;
          }),
        );

        for (const payload of newRefPayloads) {
          await tx.articleReference.create({
            data: {
              ...payload,
              articleId: id,
            },
          });
        }
      } else {
        // Modo B: Operaciones granulares (removeReferenceIds, updateReferences, addReferences)
        if (dto.removeReferenceIds && dto.removeReferenceIds.length > 0) {
          const uniqueRemoveIds = this.deduplicateStrings(
            dto.removeReferenceIds,
          );
          for (const refId of uniqueRemoveIds) {
            if (!existingRefIds.has(refId)) {
              throw new BadRequestException(
                `La referencia bibliográfica con id "${refId}" no pertenece a este artículo o no existe`,
              );
            }
          }
          await tx.articleReference.deleteMany({
            where: {
              articleId: id,
              id: { in: uniqueRemoveIds },
            },
          });
          for (const refId of uniqueRemoveIds) {
            existingRefIds.delete(refId);
          }
        }

        if (dto.updateReferences && dto.updateReferences.length > 0) {
          for (const item of dto.updateReferences) {
            if (!item.id || !item.id.trim()) {
              throw new BadRequestException(
                "Cada elemento en updateReferences debe especificar su id",
              );
            }
            const refId = item.id.trim();
            if (!existingRefIds.has(refId)) {
              throw new BadRequestException(
                `La referencia bibliográfica con id "${refId}" no pertenece a este artículo o no existe`,
              );
            }
            const updateData = this.prepareReferenceUpdatePayload(item);
            if (Object.keys(updateData).length > 0) {
              await tx.articleReference.update({
                where: { id: refId },
                data: updateData,
              });
            }
          }
        }

        if (dto.addReferences && dto.addReferences.length > 0) {
          const toCreate = this.prepareReferenceCreatePayloads(
            dto.addReferences,
          );
          for (const payload of toCreate) {
            await tx.articleReference.create({
              data: {
                ...payload,
                articleId: id,
              },
            });
          }
        }
      }

      const include = NewsQueryBuilder.buildPrismaInclude({
        categories: true,
        references: true,
      });

      const updated = await tx.newsArticle.update({
        where: { id },
        data: {
          ...(dto.title !== undefined && { title: dto.title.trim() }),
          ...(dto.summary !== undefined && { summary: dto.summary.trim() }),
          ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
          ...(parsedDate !== undefined && { date: parsedDate }),
          ...(dto.readTimeMinutes !== undefined && {
            readTimeMinutes: dto.readTimeMinutes,
          }),
          ...(dto.slug !== undefined && { slug: dto.slug.trim() }),
          ...(dto.content !== undefined && { content: dto.content }),
          ...(dto.author !== undefined && { author: dto.author.trim() }),
          ...(dto.tags !== undefined && {
            tags: this.deduplicateStrings(dto.tags),
          }),
          ...(dto.coverImageCaption !== undefined && {
            coverImageCaption: dto.coverImageCaption,
          }),
          ...(normalizedStatus !== undefined && { status: normalizedStatus }),
          ...(Object.keys(categoriesRelationUpdate).length > 0 && {
            categories: categoriesRelationUpdate,
          }),
        },
        ...(include ? { include } : {}),
      });

      return updated;
    });

    await this.syncArticleImageToGallery(updated);

    return this.mapToDto(updated);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return this.runInTransaction(async (tx) => {
      const existing = await tx.newsArticle.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Noticia con id "${id}" no encontrada`);
      }

      // Eliminar referencias bibliográficas del artículo (además del ON DELETE CASCADE en BD)
      if (tx.articleReference?.deleteMany) {
        await tx.articleReference.deleteMany({
          where: { articleId: id },
        });
      }

      await tx.newsArticle.delete({
        where: { id },
      });

      // Limpiar imagen pendiente si aún no fue vinculada a una colección
      if (tx.galleryImage?.deleteMany) {
        await tx.galleryImage.deleteMany({
          where: {
            sourceType: "NEWS",
            sourceId: id,
            status: "PENDING",
          },
        });
      }

      return {
        success: true,
        message: "Noticia eliminada correctamente",
      };
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Administración Independiente de Categorías (`Category`) ──
  // ══════════════════════════════════════════════════════════════════════════

  async findAllCategories(): Promise<NewsCategory[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((c) => this.mapCategoryToDto(c));
  }

  async findCategoryByIdOrSlug(idOrSlug: string): Promise<NewsCategory> {
    const trimmed = idOrSlug.trim();
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id: trimmed }, { slug: trimmed.toLowerCase() }],
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría "${idOrSlug}" no encontrada`);
    }

    return this.mapCategoryToDto(category);
  }

  async createCategory(dto: CreateCategoryDto): Promise<NewsCategory> {
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException("El nombre de la categoría es obligatorio");
    }

    const slug = dto.slug?.trim()
      ? this.slugify(dto.slug.trim())
      : this.slugify(name);

    if (!slug) {
      throw new BadRequestException(
        "No se pudo generar un slug válido para la categoría",
      );
    }

    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe una categoría con el nombre "${name}" o el slug "${slug}"`,
      );
    }

    const created = await this.prisma.category.create({
      data: {
        name,
        slug,
        description: dto.description?.trim() ?? null,
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return this.mapCategoryToDto(created);
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<NewsCategory> {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Categoría con id "${id}" no encontrada`);
    }

    const nextName = dto.name !== undefined ? dto.name.trim() : undefined;
    if (nextName !== undefined && !nextName) {
      throw new BadRequestException(
        "El nombre de la categoría no puede estar vacío",
      );
    }

    const nextSlug =
      dto.slug !== undefined ? this.slugify(dto.slug.trim()) : undefined;
    if (dto.slug !== undefined && !nextSlug) {
      throw new BadRequestException("El slug de la categoría no es válido");
    }

    if (nextName || nextSlug) {
      const orConditions: any[] = [];
      if (nextName) {
        orConditions.push({ name: { equals: nextName, mode: "insensitive" } });
      }
      if (nextSlug) {
        orConditions.push({ slug: nextSlug });
      }

      const conflict = await this.prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: orConditions,
        },
      });

      if (conflict) {
        throw new ConflictException(
          "Ya existe otra categoría con el mismo nombre o slug",
        );
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        ...(nextName !== undefined && { name: nextName }),
        ...(nextSlug !== undefined && { slug: nextSlug }),
        ...(dto.description !== undefined && {
          description: dto.description ? dto.description.trim() : null,
        }),
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return this.mapCategoryToDto(updated);
  }

  async deleteCategory(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Categoría con id "${id}" no encontrada`);
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Categoría eliminada correctamente",
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Gestión Directa de Referencias Bibliográficas (`ArticleReference`) ──
  // ══════════════════════════════════════════════════════════════════════════

  async findArticleReferences(articleId: string): Promise<ArticleReference[]> {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException(
        `Noticia con id "${articleId}" no encontrada`,
      );
    }

    const references = await this.prisma.articleReference.findMany({
      where: { articleId },
      orderBy: { createdAt: "asc" },
    });

    return references.map((r) => this.mapReferenceToDto(r));
  }

  async addArticleReference(
    articleId: string,
    dto: CreateArticleReferenceDto,
  ): Promise<ArticleReference> {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException(
        `Noticia con id "${articleId}" no encontrada`,
      );
    }

    const [payload] = this.prepareReferenceCreatePayloads([dto]);
    const created = await this.prisma.articleReference.create({
      data: {
        ...payload,
        articleId,
      },
    });

    return this.mapReferenceToDto(created);
  }

  async updateArticleReference(
    articleId: string,
    referenceId: string,
    dto: UpdateArticleReferenceDto,
  ): Promise<ArticleReference> {
    const existing = await this.prisma.articleReference.findUnique({
      where: { id: referenceId },
    });

    if (!existing || existing.articleId !== articleId) {
      throw new NotFoundException(
        `Referencia bibliográfica "${referenceId}" no encontrada en el artículo "${articleId}"`,
      );
    }

    const updateData = this.prepareReferenceUpdatePayload(dto);
    const updated = await this.prisma.articleReference.update({
      where: { id: referenceId },
      data: updateData,
    });

    return this.mapReferenceToDto(updated);
  }

  async deleteArticleReference(
    articleId: string,
    referenceId: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.articleReference.findUnique({
      where: { id: referenceId },
    });

    if (!existing || existing.articleId !== articleId) {
      throw new NotFoundException(
        `Referencia bibliográfica "${referenceId}" no encontrada en el artículo "${articleId}"`,
      );
    }

    await this.prisma.articleReference.delete({
      where: { id: referenceId },
    });

    return {
      success: true,
      message: "Referencia bibliográfica eliminada correctamente",
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Métodos Privados de Validación, Resolución y Mapeo ──
  // ══════════════════════════════════════════════════════════════════════════

  private async runInTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    if (typeof this.prisma.$transaction === "function") {
      return this.prisma.$transaction(async (tx) => fn(tx));
    }
    return fn(this.prisma);
  }

  private async resolveCategoriesOrFail(
    tx: any,
    identifiers: string[],
  ): Promise<Array<{ id: string; name: string; slug: string }>> {
    const uniqueInputs = this.deduplicateStrings(identifiers);
    if (uniqueInputs.length === 0) {
      return [];
    }

    const lowerInputs = uniqueInputs.map((i) => i.toLowerCase());
    const foundCategories: Array<{ id: string; name: string; slug: string }> =
      await tx.category.findMany({
        where: {
          OR: [{ id: { in: uniqueInputs } }, { slug: { in: lowerInputs } }],
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

    const missingInputs = uniqueInputs.filter(
      (input) =>
        !foundCategories.some(
          (cat) =>
            cat.id === input || cat.slug.toLowerCase() === input.toLowerCase(),
        ),
    );

    if (missingInputs.length > 0) {
      throw new BadRequestException(
        `Las siguientes categorías no existen: ${missingInputs.join(", ")}`,
      );
    }

    // Deduplicar por ID real de categoría para evitar asociaciones duplicadas
    const uniqueById = new Map<
      string,
      { id: string; name: string; slug: string }
    >();
    for (const cat of foundCategories) {
      uniqueById.set(cat.id, cat);
    }

    return Array.from(uniqueById.values());
  }

  private prepareReferenceCreatePayloads(
    refs: CreateArticleReferenceDto[],
  ): Array<{
    title: string;
    author: string | null;
    url: string | null;
    publisher: string | null;
    publishedAt: Date | null;
    accessedAt: Date | null;
  }> {
    const seenKeys = new Set<string>();
    const result: Array<{
      title: string;
      author: string | null;
      url: string | null;
      publisher: string | null;
      publishedAt: Date | null;
      accessedAt: Date | null;
    }> = [];

    for (const ref of refs) {
      const title = ref.title?.trim();
      if (!title) {
        throw new BadRequestException(
          "El título de la referencia bibliográfica es obligatorio",
        );
      }

      const url = ref.url?.trim() || null;
      if (url && !this.isValidHttpUrl(url)) {
        throw new BadRequestException(
          `La URL de la referencia "${url}" no es válida. Debe usar http:// o https://`,
        );
      }

      const publishedAt = this.parseOptionalDate(
        ref.publishedAt,
        "publishedAt",
      );
      const accessedAt = this.parseOptionalDate(ref.accessedAt, "accessedAt");
      const author = ref.author?.trim() || null;
      const publisher = ref.publisher?.trim() || null;

      const dedupKey = `${title.toLowerCase()}|${(url ?? "").toLowerCase()}|${(author ?? "").toLowerCase()}`;
      if (seenKeys.has(dedupKey)) {
        continue;
      }
      seenKeys.add(dedupKey);

      result.push({
        title,
        author,
        url,
        publisher,
        publishedAt,
        accessedAt,
      });
    }

    return result;
  }

  private prepareReferenceUpdatePayload(
    dto: UpdateArticleReferenceDto,
  ): Record<string, any> {
    const data: Record<string, any> = {};

    if (dto.title !== undefined) {
      const title = dto.title.trim();
      if (!title) {
        throw new BadRequestException(
          "El título de la referencia bibliográfica no puede estar vacío",
        );
      }
      data.title = title;
    }

    if (dto.author !== undefined) {
      data.author = dto.author ? dto.author.trim() : null;
    }

    if (dto.url !== undefined) {
      const url = dto.url ? dto.url.trim() : null;
      if (url && !this.isValidHttpUrl(url)) {
        throw new BadRequestException(
          `La URL de la referencia "${url}" no es válida. Debe usar http:// o https://`,
        );
      }
      data.url = url;
    }

    if (dto.publisher !== undefined) {
      data.publisher = dto.publisher ? dto.publisher.trim() : null;
    }

    if (dto.publishedAt !== undefined) {
      data.publishedAt = dto.publishedAt
        ? this.parseOptionalDate(dto.publishedAt, "publishedAt")
        : null;
    }

    if (dto.accessedAt !== undefined) {
      data.accessedAt = dto.accessedAt
        ? this.parseOptionalDate(dto.accessedAt, "accessedAt")
        : null;
    }

    return data;
  }

  private isValidHttpUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  private parseOptionalDate(
    value: string | undefined,
    fieldName: string,
  ): Date | null {
    if (!value || !value.trim()) return null;
    const d = new Date(value.trim());
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException(
        `El campo ${fieldName} no contiene una fecha válida`,
      );
    }
    return d;
  }

  private deduplicateStrings(items: string[]): string[] {
    return Array.from(
      new Set(
        items
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
      ),
    );
  }

  private slugify(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  private mapToDto(
    a: any,
    includeOptions: NewsRelationIncludeOptions = {
      categories: true,
      references: true,
    },
  ): NewsArticle {
    return PrismaNewsSearchStrategy.mapArticleToDto(a, includeOptions);
  }

  private mapCategoryToDto(c: any): NewsCategory {
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? null,
      ...(c._count?.articles !== undefined && {
        articleCount: c._count.articles,
      }),
      ...(c.createdAt && {
        createdAt:
          c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
      }),
      ...(c.updatedAt && {
        updatedAt:
          c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
      }),
    };
  }

  private mapReferenceToDto(ref: any): ArticleReference {
    return {
      id: ref.id,
      articleId: ref.articleId,
      title: ref.title,
      author: ref.author ?? null,
      url: ref.url ?? null,
      publisher: ref.publisher ?? null,
      publishedAt:
        ref.publishedAt instanceof Date
          ? ref.publishedAt.toISOString()
          : (ref.publishedAt ?? null),
      accessedAt:
        ref.accessedAt instanceof Date
          ? ref.accessedAt.toISOString()
          : (ref.accessedAt ?? null),
      ...(ref.createdAt && {
        createdAt:
          ref.createdAt instanceof Date
            ? ref.createdAt.toISOString()
            : ref.createdAt,
      }),
      ...(ref.updatedAt && {
        updatedAt:
          ref.updatedAt instanceof Date
            ? ref.updatedAt.toISOString()
            : ref.updatedAt,
      }),
    };
  }

  private async syncArticleImageToGallery(article: {
    id: string;
    title: string;
    imageUrl?: string | null;
    coverImageCaption?: string | null;
    summary?: string | null;
    author?: string | null;
    tags?: string[];
  }): Promise<void> {
    if (!this.prisma.galleryImage?.findFirst) return;

    const url = article.imageUrl?.trim();
    const placeholders = new Set([
      "/assets/hero-cosmos.svg",
      "/assets/artemis.svg",
      "/assets/exoplanet.svg",
      "/assets/starship.svg",
    ]);
    if (!url || placeholders.has(url)) return;

    const existing = await this.prisma.galleryImage.findFirst({
      where: {
        sourceType: "NEWS",
        sourceId: article.id,
      },
    });

    if (existing) {
      await this.prisma.galleryImage.update({
        where: { id: existing.id },
        data: {
          url,
          alt: article.title,
          caption: article.coverImageCaption ?? article.summary ?? null,
          photographer: article.author ?? "Equipo JEO",
          tags: article.tags ?? [],
        },
      });
      return;
    }

    await this.prisma.galleryImage.create({
      data: {
        url,
        alt: article.title,
        caption: article.coverImageCaption ?? article.summary ?? null,
        photographer: article.author ?? "Equipo JEO",
        tags: article.tags ?? [],
        collectionId: null,
        status: "PENDING",
        sourceType: "NEWS",
        sourceId: article.id,
      },
    });
  }
}
