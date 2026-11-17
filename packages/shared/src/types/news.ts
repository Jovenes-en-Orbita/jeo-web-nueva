/**
 * Estados posibles de un artículo de noticias.
 */
export type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Categoría de noticias administrable de forma independiente.
 */
export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  articleCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type Category = NewsCategory;

/**
 * Referencia bibliográfica asociada a un artículo de noticias.
 */
export interface ArticleReference {
  id: string;
  articleId: string;
  title: string;
  author?: string | null;
  url?: string | null;
  publisher?: string | null;
  publishedAt?: string | null;
  accessedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Artículo de noticias espaciales.
 */
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  date: string;
  readTimeMinutes: number;
  slug: string;
  content?: string;
  author?: string;
  tags?: string[];
  coverImageCaption?: string;
  status?: ArticleStatus | string;
  categories?: NewsCategory[];
  references?: ArticleReference[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO para crear una categoría de noticias.
 */
export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
}

/**
 * DTO para actualizar una categoría de noticias.
 */
export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
}

/**
 * DTO para crear una referencia bibliográfica.
 */
export interface CreateArticleReferenceDto {
  title: string;
  author?: string;
  url?: string;
  publisher?: string;
  publishedAt?: string;
  accessedAt?: string;
}

/**
 * DTO para actualizar una referencia bibliográfica.
 */
export interface UpdateArticleReferenceDto {
  id?: string;
  title?: string;
  author?: string;
  url?: string;
  publisher?: string;
  publishedAt?: string;
  accessedAt?: string;
}

/**
 * DTO para crear una noticia.
 */
export interface CreateNewsDto {
  title: string;
  summary: string;
  imageUrl?: string;
  date: string;
  readTimeMinutes: number;
  slug?: string;
  content?: string;
  author?: string;
  tags?: string[];
  coverImageCaption?: string;
  status?: ArticleStatus;
  categoryIds?: string[];
  categories?: string[];
  references?: CreateArticleReferenceDto[];
}

/**
 * Parámetros de consulta y filtrado para búsqueda de noticias.
 */
export interface NewsSearchFilterParams {
  title?: string;
  search?: string;
  category?: string;
  categories?: string | string[];
  categoryIds?: string | string[];
  categorySlugs?: string | string[];
  categoryMatch?: "any" | "all";
  tag?: string;
  tags?: string | string[];
  tagMatch?: "any" | "all";
  readTimeMinutes?: number;
  minReadTime?: number;
  maxReadTime?: number;
  dateFrom?: string;
  dateTo?: string;
  status?: ArticleStatus | string | string[];
  author?: string;
  sortBy?: "date" | "title" | "readTimeMinutes";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  include?: string;
  includeCategories?: boolean;
  includeReferences?: boolean;
}

/**
 * Respuesta paginada de búsqueda de noticias.
 */
export interface PaginatedNewsResponse {
  data: NewsArticle[];
  items: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
