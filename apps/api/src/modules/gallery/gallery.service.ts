import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import type {
  GalleryCollection,
  GalleryImage,
  PaginatedGalleryCollectionsResponse,
  PaginatedGalleryCollectionDetailResponse,
  PaginatedGalleryImagesResponse,
} from "@jeo/shared";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateGalleryCollectionDto,
  UpdateGalleryCollectionDto,
} from "./dto/gallery-collection.dto";
import {
  CreateGalleryImageDto,
  UpdateGalleryImageDto,
  AssignGalleryImageDto,
} from "./dto/gallery-image.dto";
import {
  GalleryCollectionsQueryDto,
  GalleryImagesQueryDto,
} from "./dto/gallery-query.dto";
import {
  DEFAULT_COLLECTIONS_LIMIT,
  DEFAULT_IMAGES_LIMIT,
  GalleryQueryBuilder,
} from "./queries/gallery-query.builder";

const DEFAULT_PLACEHOLDER_URLS = new Set([
  "/assets/hero-cosmos.svg",
  "/assets/artemis.svg",
  "/assets/exoplanet.svg",
  "/assets/starship.svg",
  "/assets/gallery-1.svg",
]);

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  // ══════════════════════════════════════════════════════════════════════════
  // ── Consultas Públicas y Búsqueda Paginada ──
  // ══════════════════════════════════════════════════════════════════════════

  async getFeaturedCollection(): Promise<GalleryCollection> {
    const collection =
      (await this.prisma.galleryCollection.findFirst({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            where: { status: "LINKED" },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
          },
        },
      })) ??
      (await this.prisma.galleryCollection.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            where: { status: "LINKED" },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
          },
        },
      }));

    if (!collection) {
      return {
        id: "empty",
        title: "Sin colección",
        slug: "sin-coleccion",
        description: "",
        totalImages: 0,
        rotationFrequency: "semanal",
        images: [],
      };
    }

    return this.mapCollectionToDto(collection);
  }

  async getAllCollections(
    query: GalleryCollectionsQueryDto = {},
  ): Promise<GalleryCollection[] | PaginatedGalleryCollectionsResponse> {
    if (query.page !== undefined || query.limit !== undefined) {
      return this.searchCollections(query);
    }

    const where = GalleryQueryBuilder.buildCollectionWhere(query);
    const orderBy = GalleryQueryBuilder.buildCollectionOrderBy(query);

    const collections = await this.prisma.galleryCollection.findMany({
      where,
      orderBy,
      include: {
        images: {
          where: { status: "LINKED" },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
      },
    });

    return collections.map((c) => this.mapCollectionToDto(c));
  }

  async searchCollections(
    query: GalleryCollectionsQueryDto = {},
  ): Promise<PaginatedGalleryCollectionsResponse> {
    const where = GalleryQueryBuilder.buildCollectionWhere(query);
    const orderBy = GalleryQueryBuilder.buildCollectionOrderBy(query);
    const { page, limit, skip } = GalleryQueryBuilder.resolvePagination(
      query.page,
      query.limit,
      DEFAULT_COLLECTIONS_LIMIT,
    );

    const [total, collections] = await Promise.all([
      this.prisma.galleryCollection.count({ where }),
      this.prisma.galleryCollection.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            where: { status: "LINKED" },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
            take: 3,
          },
          _count: {
            select: {
              images: {
                where: { status: "LINKED" },
              },
            },
          },
        },
      }),
    ]);

    const mapped = collections.map((c) => this.mapCollectionToDto(c));

    return {
      data: mapped,
      items: mapped,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getCollectionByIdOrSlug(
    idOrSlug: string,
    pageParam?: number,
    limitParam?: number,
  ): Promise<PaginatedGalleryCollectionDetailResponse> {
    const trimmed = idOrSlug.trim();
    const collection = await this.prisma.galleryCollection.findFirst({
      where: {
        OR: [{ id: trimmed }, { slug: trimmed.toLowerCase() }],
      },
    });

    if (!collection) {
      throw new NotFoundException(`Colección "${idOrSlug}" no encontrada`);
    }

    const { page, limit, skip } = GalleryQueryBuilder.resolvePagination(
      pageParam,
      limitParam,
      DEFAULT_IMAGES_LIMIT,
    );

    const imageWhere = {
      collectionId: collection.id,
      status: "LINKED",
    };

    const [total, images] = await Promise.all([
      this.prisma.galleryImage.count({ where: imageWhere }),
      this.prisma.galleryImage.findMany({
        where: imageWhere,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
    ]);

    const mappedImages = images.map((img) => this.mapImageToDto(img));

    return {
      collection: {
        id: collection.id,
        title: collection.title,
        slug: collection.slug ?? null,
        description: collection.description,
        category: collection.category ?? null,
        tags: collection.tags ?? [],
        featured: collection.featured ?? false,
        totalImages: total,
        rotationFrequency: collection.rotationFrequency,
        ...(collection.createdAt && {
          createdAt: collection.createdAt.toISOString(),
        }),
        ...(collection.updatedAt && {
          updatedAt: collection.updatedAt.toISOString(),
        }),
      },
      data: mappedImages,
      items: mappedImages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── CRUD de Colecciones (Admin) ──
  // ══════════════════════════════════════════════════════════════════════════

  async createCollection(
    dto: CreateGalleryCollectionDto,
  ): Promise<GalleryCollection> {
    const title = dto.title.trim();
    const slug = dto.slug?.trim()
      ? this.slugify(dto.slug.trim())
      : this.slugify(title);

    if (!slug) {
      throw new BadRequestException(
        "No se pudo generar un slug válido para la colección",
      );
    }

    const existingSlug = await this.prisma.galleryCollection.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(
        `Ya existe una colección con el slug "${slug}"`,
      );
    }

    const created = await this.prisma.galleryCollection.create({
      data: {
        ...(dto.id ? { id: dto.id } : {}),
        title,
        slug,
        description: dto.description.trim(),
        category: dto.category?.trim() || null,
        tags: this.deduplicateStrings(dto.tags ?? []),
        featured: dto.featured ?? false,
        rotationFrequency: dto.rotationFrequency?.trim() || "semanal",
      },
      include: { images: true },
    });

    return this.mapCollectionToDto(created);
  }

  async updateCollection(
    id: string,
    dto: UpdateGalleryCollectionDto,
  ): Promise<GalleryCollection> {
    const existing = await this.prisma.galleryCollection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Colección con id "${id}" no encontrada`);
    }

    const nextSlug =
      dto.slug !== undefined ? this.slugify(dto.slug.trim()) : undefined;
    if (dto.slug !== undefined && !nextSlug) {
      throw new BadRequestException("El slug de la colección no es válido");
    }

    if (nextSlug && nextSlug !== existing.slug) {
      const conflict = await this.prisma.galleryCollection.findUnique({
        where: { slug: nextSlug },
      });
      if (conflict && conflict.id !== id) {
        throw new ConflictException(
          `Ya existe otra colección con el slug "${nextSlug}"`,
        );
      }
    }

    const updated = await this.prisma.galleryCollection.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(nextSlug !== undefined && { slug: nextSlug }),
        ...(dto.description !== undefined && {
          description: dto.description.trim(),
        }),
        ...(dto.category !== undefined && {
          category: dto.category ? dto.category.trim() : null,
        }),
        ...(dto.tags !== undefined && {
          tags: this.deduplicateStrings(dto.tags),
        }),
        ...(dto.featured !== undefined && { featured: dto.featured }),
        ...(dto.rotationFrequency !== undefined && {
          rotationFrequency: dto.rotationFrequency.trim(),
        }),
      },
      include: {
        images: {
          where: { status: "LINKED" },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        },
      },
    });

    return this.mapCollectionToDto(updated);
  }

  /**
   * Elimina una colección y mueve automáticamente todas sus imágenes a la bandeja
   * de "pendientes de vincular" (`collectionId = null`, `status = 'PENDING'`).
   */
  async deleteCollection(
    id: string,
  ): Promise<{
    success: boolean;
    movedToPendingCount: number;
    message: string;
  }> {
    return this.runInTransaction(async (tx) => {
      const existing = await tx.galleryCollection.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Colección con id "${id}" no encontrada`);
      }

      const moved = await tx.galleryImage.updateMany({
        where: { collectionId: id },
        data: {
          collectionId: null,
          status: "PENDING",
        },
      });

      await tx.galleryCollection.delete({
        where: { id },
      });

      return {
        success: true,
        movedToPendingCount: moved?.count ?? 0,
        message:
          "Colección eliminada correctamente. Sus imágenes pasaron a la bandeja de pendientes de vincular.",
      };
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── CRUD de Imágenes y Bandeja de Pendientes (Admin) ──
  // ══════════════════════════════════════════════════════════════════════════

  async getPendingImages(
    query: GalleryImagesQueryDto = {},
  ): Promise<PaginatedGalleryImagesResponse> {
    const baseWhere = GalleryQueryBuilder.buildImageWhere(query);
    const where = {
      ...baseWhere,
      status: query.status ?? "PENDING",
    };

    const { page, limit, skip } = GalleryQueryBuilder.resolvePagination(
      query.page,
      query.limit,
      DEFAULT_IMAGES_LIMIT,
    );

    const [total, images] = await Promise.all([
      this.prisma.galleryImage.count({ where }),
      this.prisma.galleryImage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const mapped = images.map((img) => this.mapImageToDto(img));

    return {
      data: mapped,
      items: mapped,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async addImage(dto: CreateGalleryImageDto): Promise<GalleryImage> {
    const collectionId = dto.collectionId?.trim() || null;

    if (collectionId) {
      const col = await this.prisma.galleryCollection.findUnique({
        where: { id: collectionId },
      });
      if (!col) {
        throw new NotFoundException(
          `Colección con id "${collectionId}" no encontrada`,
        );
      }
    }

    const capturedAt = this.parseOptionalDate(dto.capturedAt, "capturedAt");

    const created = await this.prisma.galleryImage.create({
      data: {
        collectionId,
        status: collectionId ? "LINKED" : "PENDING",
        sourceType: "MANUAL",
        alt: dto.alt.trim(),
        caption: dto.caption?.trim() || null,
        url: dto.url?.trim() || "/assets/gallery-1.svg",
        featured: dto.featured ?? false,
        order: dto.order ?? 0,
        tags: this.deduplicateStrings(dto.tags ?? []),
        photographer: dto.photographer?.trim() || null,
        telescope: dto.telescope?.trim() || null,
        camera: dto.camera?.trim() || null,
        exposureTime: dto.exposureTime?.trim() || null,
        location: dto.location?.trim() || null,
        capturedAt,
        creditUrl: dto.creditUrl?.trim() || null,
      },
    });

    return this.mapImageToDto(created);
  }

  async updateImage(
    id: string,
    dto: UpdateGalleryImageDto,
  ): Promise<GalleryImage> {
    const existing = await this.prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Imagen con id "${id}" no encontrada`);
    }

    let nextCollectionId: string | null | undefined = undefined;
    let nextStatus = dto.status;

    if (dto.collectionId !== undefined) {
      nextCollectionId = dto.collectionId ? dto.collectionId.trim() : null;
      if (nextCollectionId) {
        const col = await this.prisma.galleryCollection.findUnique({
          where: { id: nextCollectionId },
        });
        if (!col) {
          throw new NotFoundException(
            `Colección con id "${nextCollectionId}" no encontrada`,
          );
        }
        if (!nextStatus) {
          nextStatus = "LINKED";
        }
      } else if (!nextStatus) {
        nextStatus = "PENDING";
      }
    }

    const capturedAt =
      dto.capturedAt !== undefined
        ? this.parseOptionalDate(dto.capturedAt, "capturedAt")
        : undefined;

    const updated = await this.prisma.galleryImage.update({
      where: { id },
      data: {
        ...(nextCollectionId !== undefined && {
          collectionId: nextCollectionId,
        }),
        ...(nextStatus !== undefined && { status: nextStatus }),
        ...(dto.alt !== undefined && { alt: dto.alt.trim() }),
        ...(dto.caption !== undefined && {
          caption: dto.caption ? dto.caption.trim() : null,
        }),
        ...(dto.url !== undefined && { url: dto.url.trim() }),
        ...(dto.featured !== undefined && { featured: dto.featured }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.tags !== undefined && {
          tags: this.deduplicateStrings(dto.tags),
        }),
        ...(dto.photographer !== undefined && {
          photographer: dto.photographer ? dto.photographer.trim() : null,
        }),
        ...(dto.telescope !== undefined && {
          telescope: dto.telescope ? dto.telescope.trim() : null,
        }),
        ...(dto.camera !== undefined && {
          camera: dto.camera ? dto.camera.trim() : null,
        }),
        ...(dto.exposureTime !== undefined && {
          exposureTime: dto.exposureTime ? dto.exposureTime.trim() : null,
        }),
        ...(dto.location !== undefined && {
          location: dto.location ? dto.location.trim() : null,
        }),
        ...(capturedAt !== undefined && { capturedAt }),
        ...(dto.creditUrl !== undefined && {
          creditUrl: dto.creditUrl ? dto.creditUrl.trim() : null,
        }),
      },
    });

    return this.mapImageToDto(updated);
  }

  async assignImageToCollection(
    id: string,
    dto: AssignGalleryImageDto,
  ): Promise<GalleryImage> {
    const [image, collection] = await Promise.all([
      this.prisma.galleryImage.findUnique({ where: { id } }),
      this.prisma.galleryCollection.findUnique({
        where: { id: dto.collectionId },
      }),
    ]);

    if (!image) {
      throw new NotFoundException(`Imagen con id "${id}" no encontrada`);
    }
    if (!collection) {
      throw new NotFoundException(
        `Colección con id "${dto.collectionId}" no encontrada`,
      );
    }

    const updated = await this.prisma.galleryImage.update({
      where: { id },
      data: {
        collectionId: collection.id,
        status: "LINKED",
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });

    return this.mapImageToDto(updated);
  }

  async deleteImage(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Imagen no encontrada");
    }

    await this.prisma.galleryImage.delete({
      where: { id },
    });

    return { success: true, message: "Imagen eliminada correctamente" };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Vinculación Automática de Imágenes del Sitio y Noticias ──
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Sincroniza idempotentemente las imágenes de secciones estáticas (Sistema Solar,
   * Universo, Constelaciones) hacia colecciones base y registra imágenes de Noticias
   * como pendientes de vincular (`status = 'PENDING'`).
   */
  async syncSiteAssets(): Promise<{
    linkedFromSite: number;
    pendingFromNews: number;
  }> {
    let linkedFromSite = 0;
    let pendingFromNews = 0;

    // 1. Asegurar colecciones base para secciones del sitio
    const ensureCollection = async (
      slug: string,
      title: string,
      description: string,
      category: string,
    ) => {
      const existing = await this.prisma.galleryCollection.findUnique({
        where: { slug },
      });
      if (existing) return existing;
      return this.prisma.galleryCollection.create({
        data: {
          title,
          slug,
          description,
          category,
          rotationFrequency: "mensual",
        },
      });
    };

    const [planets, universeTabs, constellations, newsArticles] =
      await Promise.all([
        this.prisma.planet.findMany({ where: { imageUrl: { not: null } } }),
        this.prisma.universeTab.findMany({
          where: { imageUrl: { not: null } },
        }),
        this.prisma.constellation.findMany({
          where: { imageUrl: { not: null } },
        }),
        this.prisma.newsArticle.findMany({
          where: { imageUrl: { not: null } },
        }),
      ]);

    const upsertSiteImage = async (params: {
      sourceType: string;
      sourceId: string;
      url: string;
      alt: string;
      caption?: string | null;
      collectionId: string;
    }) => {
      if (!this.isSyncableImageUrl(params.url)) return false;
      const existing = await this.prisma.galleryImage.findFirst({
        where: {
          sourceType: params.sourceType,
          sourceId: params.sourceId,
        },
      });
      if (existing) return false;
      await this.prisma.galleryImage.create({
        data: {
          url: params.url,
          alt: params.alt,
          caption: params.caption ?? null,
          collectionId: params.collectionId,
          status: "LINKED",
          sourceType: params.sourceType,
          sourceId: params.sourceId,
        },
      });
      return true;
    };

    if (planets.length > 0) {
      const col = await ensureCollection(
        "sistema-solar",
        "Sistema Solar",
        "Fotografías y representaciones de planetas y lunas del Sistema Solar.",
        "Sistema Solar",
      );
      for (const p of planets) {
        if (
          p.imageUrl &&
          (await upsertSiteImage({
            sourceType: "SOLAR_SYSTEM",
            sourceId: p.id,
            url: p.imageUrl,
            alt: p.name,
            caption: p.description,
            collectionId: col.id,
          }))
        ) {
          linkedFromSite++;
        }
      }
    }

    if (universeTabs.length > 0) {
      const col = await ensureCollection(
        "el-universo",
        "El Universo",
        "Imágenes astronómicas de cosmología y estructuras del universo profundo.",
        "Universo",
      );
      for (const u of universeTabs) {
        if (
          u.imageUrl &&
          (await upsertSiteImage({
            sourceType: "UNIVERSE",
            sourceId: u.id,
            url: u.imageUrl,
            alt: u.label,
            caption: u.description,
            collectionId: col.id,
          }))
        ) {
          linkedFromSite++;
        }
      }
    }

    if (constellations.length > 0) {
      const col = await ensureCollection(
        "constelaciones",
        "Constelaciones",
        "Mapas celestes y capturas de constelaciones del cielo nocturno.",
        "Constelaciones",
      );
      for (const c of constellations) {
        if (
          c.imageUrl &&
          (await upsertSiteImage({
            sourceType: "CONSTELLATION",
            sourceId: c.id,
            url: c.imageUrl,
            alt: c.name,
            caption: c.description,
            collectionId: col.id,
          }))
        ) {
          linkedFromSite++;
        }
      }
    }

    // 2. Registrar imágenes de Noticias como pendientes de vincular
    for (const art of newsArticles) {
      if (!art.imageUrl || !this.isSyncableImageUrl(art.imageUrl)) continue;
      const existing = await this.prisma.galleryImage.findFirst({
        where: { sourceType: "NEWS", sourceId: art.id },
      });
      if (existing) continue;

      await this.prisma.galleryImage.create({
        data: {
          url: art.imageUrl,
          alt: art.title,
          caption: art.coverImageCaption ?? art.summary ?? null,
          photographer: art.author ?? "Equipo JEO",
          tags: art.tags ?? [],
          collectionId: null,
          status: "PENDING",
          sourceType: "NEWS",
          sourceId: art.id,
        },
      });
      pendingFromNews++;
    }

    return { linkedFromSite, pendingFromNews };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Helpers Privados ──
  // ══════════════════════════════════════════════════════════════════════════

  private async runInTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    if (typeof this.prisma.$transaction === "function") {
      return this.prisma.$transaction(async (tx) => fn(tx));
    }
    return fn(this.prisma);
  }

  private isSyncableImageUrl(url?: string | null): boolean {
    if (!url || !url.trim()) return false;
    return !DEFAULT_PLACEHOLDER_URLS.has(url.trim());
  }

  private parseOptionalDate(
    value: string | undefined,
    fieldName: string,
  ): Date | null {
    if (!value || !value.trim()) return null;
    const d = new Date(value.trim());
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException(
        `El campo ${fieldName} no contiene una fecha ISO válida`,
      );
    }
    return d;
  }

  private deduplicateStrings(items: string[]): string[] {
    return Array.from(
      new Set(
        items
          .filter((i) => typeof i === "string")
          .map((i) => i.trim())
          .filter((i) => i.length > 0),
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

  private mapCollectionToDto(c: any): GalleryCollection {
    const images = Array.isArray(c.images)
      ? c.images.map((img: any) => this.mapImageToDto(img))
      : [];
    const totalImages =
      c._count?.images !== undefined ? c._count.images : images.length;

    return {
      id: c.id,
      title: c.title,
      slug: c.slug ?? null,
      description: c.description,
      category: c.category ?? null,
      tags: c.tags ?? [],
      featured: c.featured ?? false,
      totalImages,
      rotationFrequency: c.rotationFrequency,
      images,
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

  private mapImageToDto(img: any): GalleryImage {
    return {
      id: img.id,
      url: img.url,
      alt: img.alt,
      caption: img.caption ?? undefined,
      featured: img.featured ?? false,
      order: img.order ?? 0,
      collectionId: img.collectionId ?? null,
      status: img.status ?? "LINKED",
      sourceType: img.sourceType ?? "MANUAL",
      sourceId: img.sourceId ?? null,
      tags: img.tags ?? [],
      photographer: img.photographer ?? null,
      telescope: img.telescope ?? null,
      camera: img.camera ?? null,
      exposureTime: img.exposureTime ?? null,
      location: img.location ?? null,
      capturedAt:
        img.capturedAt instanceof Date
          ? img.capturedAt.toISOString()
          : (img.capturedAt ?? null),
      creditUrl: img.creditUrl ?? null,
      ...(img.createdAt && {
        createdAt:
          img.createdAt instanceof Date
            ? img.createdAt.toISOString()
            : img.createdAt,
      }),
      ...(img.updatedAt && {
        updatedAt:
          img.updatedAt instanceof Date
            ? img.updatedAt.toISOString()
            : img.updatedAt,
      }),
    };
  }
}
