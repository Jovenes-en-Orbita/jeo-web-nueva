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
}

