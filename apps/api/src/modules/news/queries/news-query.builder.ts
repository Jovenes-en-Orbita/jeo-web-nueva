import { BadRequestException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_PAGE_LIMIT,
  type NewsRelationIncludeOptions,
  type NormalizedNewsQuery,
} from "./news-query.interfaces";
import {
  type NewsQueryDto,
  parseStringArrayParam,
} from "../dto/news-query.dto";
import { normalizeArticleStatus } from "../dto/create-news.dto";

const IGNORED_FILTER_PLACEHOLDERS = new Set(["todas", "todos", "all"]);

/**
 * Constructor centralizado, dinámico y composable de consultas para NewsArticle.
 * Aísla la lógica de validación semántica de filtros y generación de cláusulas parametrizadas.
 */
export class NewsQueryBuilder {
  /**
   * Resuelve qué relaciones deben incluirse en la consulta para evitar N+1
   * y permitir control granular desde la API.
   */
  static resolveIncludes(dto?: {
    include?: string;
    includeCategories?: boolean;
    includeReferences?: boolean;
  }): NewsRelationIncludeOptions {
    let categories = true;
    let references = true;

    if (dto?.include !== undefined && dto.include.trim() !== "") {
      const parts = dto.include
        .split(",")
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean);

      if (parts.includes("none")) {
        categories = false;
        references = false;
      } else if (parts.includes("all")) {
        categories = true;
        references = true;
      } else {
        categories = parts.includes("categories") || parts.includes("category");
        references =
          parts.includes("references") || parts.includes("reference");
      }
    }

    if (dto?.includeCategories !== undefined) {
      categories = Boolean(dto.includeCategories);
    }

    if (dto?.includeReferences !== undefined) {
      references = Boolean(dto.includeReferences);
    }

    return { categories, references };
  }

  /**
   * Normaliza y valida la combinación de parámetros de búsqueda.
   */
  static normalize(
    dto: NewsQueryDto = {},
    forcePagination = false,
  ): NormalizedNewsQuery {
    // 1. Categorías (unificar category, categories, categoryIds, categorySlugs)
    const rawCategories = [
      ...(parseStringArrayParam(dto.category) ?? []),
      ...(dto.categories ?? []),
      ...(dto.categoryIds ?? []),
      ...(dto.categorySlugs ?? []),
    ];
    const categories = Array.from(
      new Set(
        rawCategories
          .map((c) => c.trim())
          .filter(
            (c) =>
              c.length > 0 && !IGNORED_FILTER_PLACEHOLDERS.has(c.toLowerCase()),
          ),
      ),
    );

    // 2. Tags (unificar tag y tags)
    const rawTags = [
      ...(parseStringArrayParam(dto.tag) ?? []),
      ...(dto.tags ?? []),
    ];
    const tags = Array.from(
      new Set(
        rawTags
          .map((t) => t.trim())
          .filter(
            (t) =>
              t.length > 0 && !IGNORED_FILTER_PLACEHOLDERS.has(t.toLowerCase()),
          ),
      ),
    );

    // 3. Tiempo de lectura y validación de rango
    const readTimeMinutes =
      dto.readTimeMinutes !== undefined && dto.readTimeMinutes !== null
        ? Number(dto.readTimeMinutes)
        : undefined;
    const minReadTime =
      dto.minReadTime !== undefined && dto.minReadTime !== null
        ? Number(dto.minReadTime)
        : undefined;
    const maxReadTime =
      dto.maxReadTime !== undefined && dto.maxReadTime !== null
        ? Number(dto.maxReadTime)
        : undefined;

    if (
      readTimeMinutes !== undefined &&
      (Number.isNaN(readTimeMinutes) || readTimeMinutes < 1)
    ) {
      throw new BadRequestException(
        "readTimeMinutes debe ser un número entero mayor o igual a 1",
      );
    }
    if (
      minReadTime !== undefined &&
      (Number.isNaN(minReadTime) || minReadTime < 0)
    ) {
      throw new BadRequestException(
        "minReadTime debe ser un número entero mayor o igual a 0",
      );
    }
    if (
      maxReadTime !== undefined &&
      (Number.isNaN(maxReadTime) || maxReadTime < 1)
    ) {
      throw new BadRequestException(
        "maxReadTime debe ser un número entero mayor o igual a 1",
      );
    }
    if (
      minReadTime !== undefined &&
      maxReadTime !== undefined &&
      minReadTime > maxReadTime
    ) {
      throw new BadRequestException(
        "El tiempo mínimo de lectura (minReadTime) no puede ser mayor que el máximo (maxReadTime)",
      );
    }

    // 4. Rango de fechas de publicación
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    if (dto.dateFrom && dto.dateFrom.trim() !== "") {
      dateFrom = new Date(dto.dateFrom.trim());
      if (Number.isNaN(dateFrom.getTime())) {
        throw new BadRequestException("dateFrom no es una fecha válida");
      }
    }

    if (dto.dateTo && dto.dateTo.trim() !== "") {
      const rawDateTo = dto.dateTo.trim();
      dateTo = new Date(rawDateTo);
      if (Number.isNaN(dateTo.getTime())) {
        throw new BadRequestException("dateTo no es una fecha válida");
      }
      // Si se envía solo YYYY-MM-DD, cubrir hasta el final de ese día en UTC
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawDateTo)) {
        dateTo.setUTCHours(23, 59, 59, 999);
      }
    }

    if (dateFrom && dateTo && dateFrom.getTime() > dateTo.getTime()) {
      throw new BadRequestException(
        "La fecha inicial (dateFrom) no puede ser posterior a la fecha final (dateTo)",
      );
    }

    // 5. Estado del artículo
    const rawStatuses = Array.isArray(dto.status)
      ? dto.status
      : dto.status
        ? (parseStringArrayParam(dto.status) ?? [])
        : [];
    const statuses: Array<"DRAFT" | "PUBLISHED" | "ARCHIVED"> = [];
    for (const st of rawStatuses) {
      if (IGNORED_FILTER_PLACEHOLDERS.has(String(st).toLowerCase())) continue;
      const normalized = normalizeArticleStatus(String(st));
      if (
        !normalized ||
        !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(normalized)
      ) {
        throw new BadRequestException(
          `Estado de artículo inválido: "${st}". Valores permitidos: DRAFT, PUBLISHED, ARCHIVED`,
        );
      }
      if (!statuses.includes(normalized)) {
        statuses.push(normalized);
      }
    }

    // 6. Ordenamiento seguro (whitelisted)
    const allowedSortFields = ["date", "title", "readTimeMinutes"] as const;
    const sortBy = dto.sortBy ?? "date";
    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(
        `Campo de ordenamiento inválido: "${sortBy}". Valores permitidos: date, title, readTimeMinutes`,
      );
    }

    const sortOrder = (dto.sortOrder?.toLowerCase() ?? "desc") as
      "asc" | "desc";
    if (sortOrder !== "asc" && sortOrder !== "desc") {
      throw new BadRequestException('sortOrder debe ser "asc" o "desc"');
    }

    // 7. Paginación controlada
    const hasPaginationParams =
      forcePagination ||
      (dto.page !== undefined && dto.page !== null) ||
      (dto.limit !== undefined && dto.limit !== null);

    let page: number | undefined;
    let limit: number | undefined;

    if (hasPaginationParams) {
      const rawPage =
        dto.page !== undefined && dto.page !== null
          ? Number(dto.page)
          : DEFAULT_PAGE;
      const rawLimit =
        dto.limit !== undefined && dto.limit !== null
          ? Number(dto.limit)
          : DEFAULT_LIMIT;

      if (Number.isNaN(rawPage) || !Number.isInteger(rawPage) || rawPage < 1) {
        throw new BadRequestException(
          "El parámetro page debe ser un entero mayor o igual a 1",
        );
      }
      if (
        Number.isNaN(rawLimit) ||
        !Number.isInteger(rawLimit) ||
        rawLimit < 1 ||
        rawLimit > MAX_PAGE_LIMIT
      ) {
        throw new BadRequestException(
          `El parámetro limit debe ser un entero entre 1 y ${MAX_PAGE_LIMIT}`,
        );
      }

      page = rawPage;
      limit = rawLimit;
    }

    return {
      title: dto.title?.trim() || undefined,
      search: dto.search?.trim() || undefined,
      categories,
      categoryMatch: dto.categoryMatch === "all" ? "all" : "any",
      tags,
      tagMatch: dto.tagMatch === "all" ? "all" : "any",
      readTimeMinutes,
      minReadTime,
      maxReadTime,
      dateFrom,
      dateTo,
      statuses,
      author: dto.author?.trim() || undefined,
      sortBy,
      sortOrder,
      page,
      limit,
      include: NewsQueryBuilder.resolveIncludes(dto),
    };
  }

  /**
   * Construye el objeto `where` parametrizado para Prisma combinando todos los criterios activos.
   */
  static buildPrismaWhere(
    query: NormalizedNewsQuery,
  ): Prisma.NewsArticleWhereInput {
    const where: Prisma.NewsArticleWhereInput = {};
    const andConditions: Prisma.NewsArticleWhereInput[] = [];

    // Criterio 1: Título (búsqueda parcial insensible a mayúsculas/minúsculas)
    if (query.title) {
      where.title = {
        contains: query.title,
        mode: "insensitive",
      };
    }

    // Criterio 2: Búsqueda general (título, resumen, autor)
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { summary: { contains: query.search, mode: "insensitive" } },
        { author: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Criterio 3: Autor
    if (query.author) {
      where.author = {
        contains: query.author,
        mode: "insensitive",
      };
    }

    // Criterio 4: Categorías (por ID o slug, soportando coincidencia 'any' o 'all')
    if (query.categories.length > 0) {
      if (query.categoryMatch === "all" && query.categories.length > 1) {
        for (const cat of query.categories) {
          andConditions.push({
            categories: {
              some: {
                OR: [
                  { id: cat },
                  { slug: { equals: cat, mode: "insensitive" } },
                  { name: { equals: cat, mode: "insensitive" } },
                ],
              },
            },
          });
        }
      } else {
        where.categories = {
          some: {
            OR: [
              { id: { in: query.categories } },
              { slug: { in: query.categories.map((c) => c.toLowerCase()) } },
              ...query.categories.map((c) => ({
                name: { equals: c, mode: "insensitive" as const },
              })),
            ],
          },
        };
      }
    }

    // Criterio 5: Tags (uno o varios tags, soportando 'any' o 'all')
    if (query.tags.length > 0) {
      if (query.tagMatch === "all") {
        where.tags =
          query.tags.length === 1
            ? { has: query.tags[0] }
            : { hasEvery: query.tags };
      } else {
        where.tags =
          query.tags.length === 1
            ? { has: query.tags[0] }
            : { hasSome: query.tags };
      }
    }

    // Criterio 6: Tiempo estimado de lectura (exacto, mínimo, máximo o rango)
    if (
      query.readTimeMinutes !== undefined ||
      query.minReadTime !== undefined ||
      query.maxReadTime !== undefined
    ) {
      if (
        query.readTimeMinutes !== undefined &&
        query.minReadTime === undefined &&
        query.maxReadTime === undefined
      ) {
        where.readTimeMinutes = query.readTimeMinutes;
      } else {
        where.readTimeMinutes = {
          ...(query.readTimeMinutes !== undefined && {
            equals: query.readTimeMinutes,
          }),
          ...(query.minReadTime !== undefined && { gte: query.minReadTime }),
          ...(query.maxReadTime !== undefined && { lte: query.maxReadTime }),
        };
      }
    }

    // Criterio 7: Fecha de publicación (desde, hasta o rango)
    if (query.dateFrom || query.dateTo) {
      where.date = {
        ...(query.dateFrom && { gte: query.dateFrom }),
        ...(query.dateTo && { lte: query.dateTo }),
      };
    }

    // Criterio 8: Estado del artículo (DRAFT, PUBLISHED, ARCHIVED)
    if (query.statuses.length > 0) {
      where.status =
        query.statuses.length === 1
          ? query.statuses[0]
          : { in: query.statuses };
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  /**
   * Construye la cláusula `orderBy` parametrizada para Prisma.
   */
  static buildPrismaOrderBy(
    query: NormalizedNewsQuery,
  ): Prisma.NewsArticleOrderByWithRelationInput {
    return {
      [query.sortBy]: query.sortOrder,
    };
  }

  /**
   * Construye la cláusula `include` para evitar consultas N+1.
   */
  static buildPrismaInclude(
    include: NewsRelationIncludeOptions,
  ): Prisma.NewsArticleInclude | undefined {
    if (!include.categories && !include.references) {
      return undefined;
    }

    return {
      ...(include.categories && {
        categories: {
          orderBy: { name: "asc" },
        },
      }),
      ...(include.references && {
        references: {
          orderBy: { createdAt: "asc" },
        },
      }),
    };
  }
}
