export type GalleryImageStatus = "LINKED" | "PENDING" | "IGNORED";

export type GalleryImageSourceType =
  | "MANUAL"
  | "NEWS"
  | "UNIVERSE"
  | "SOLAR_SYSTEM"
  | "CONSTELLATION"
  | "SITE_ASSET";

/**
 * Imagen de la galería "Fragmentos de Memoria".
 */
export interface GalleryImage {
  id: string;
  url: string | null;
  alt: string;
  caption?: string;
  featured: boolean;
  order: number;
  collectionId?: string | null;
  status?: GalleryImageStatus | string;
  sourceType?: GalleryImageSourceType | string;
  sourceId?: string | null;
  tags?: string[];
  photographer?: string | null;
  telescope?: string | null;
  camera?: string | null;
  exposureTime?: string | null;
  location?: string | null;
  capturedAt?: string | null;
  creditUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Colección/álbum de galería.
 */
export interface GalleryCollection {
  id: string;
  title: string;
  slug?: string | null;
  description: string;
  category?: string | null;
  tags?: string[];
  featured?: boolean;
  totalImages: number;
  rotationFrequency: string;
  images: GalleryImage[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Respuesta paginada de colecciones de galería.
 */
export interface PaginatedGalleryCollectionsResponse {
  data: GalleryCollection[];
  items: GalleryCollection[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Detalle de colección con imágenes paginadas.
 */
export interface PaginatedGalleryCollectionDetailResponse {
  collection: Omit<GalleryCollection, "images">;
  data: GalleryImage[];
  items: GalleryImage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Respuesta paginada de imágenes de galería (ej. pendientes de vincular).
 */
export interface PaginatedGalleryImagesResponse {
  data: GalleryImage[];
  items: GalleryImage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
