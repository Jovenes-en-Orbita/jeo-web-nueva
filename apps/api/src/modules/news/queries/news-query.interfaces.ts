import type { NewsArticle, PaginatedNewsResponse } from "@jeo/shared";
import type { NewsQueryDto } from "../dto/news-query.dto";

export const NEWS_SEARCH_STRATEGY = Symbol("NEWS_SEARCH_STRATEGY");

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_PAGE_LIMIT = 100;

export interface NewsRelationIncludeOptions {
  categories: boolean;
  references: boolean;
}

export interface NormalizedNewsQuery {
  title?: string;
  search?: string;
  categories: string[];
  categoryMatch: "any" | "all";
  tags: string[];
  tagMatch: "any" | "all";
  readTimeMinutes?: number;
  minReadTime?: number;
  maxReadTime?: number;
  dateFrom?: Date;
  dateTo?: Date;
  statuses: Array<"DRAFT" | "PUBLISHED" | "ARCHIVED">;
  author?: string;
  sortBy: "date" | "title" | "readTimeMinutes";
  sortOrder: "asc" | "desc";
  page?: number;
  limit?: number;
  include: NewsRelationIncludeOptions;
}

/**
 * Contrato agnóstico del motor de búsqueda de noticias.
 * Permite reemplazar o extender la estrategia de consulta (ej. Prisma/PostgreSQL,
 * PostgreSQL Full-Text Search o Elasticsearch/OpenSearch) sin acoplar controladores ni CRUD.
 */
export interface INewsSearchStrategy {
  executeSearch(
    queryDto: NewsQueryDto,
    forcePagination?: boolean,
  ): Promise<PaginatedNewsResponse | NewsArticle[]>;
}
