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
}

/**
 * Colección/álbum de galería.
 */
export interface GalleryCollection {
  id: string;
  title: string;
  description: string;
  totalImages: number;
  rotationFrequency: string;
  images: GalleryImage[];
}
