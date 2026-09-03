/**
 * Métricas generales para el dashboard de la intranet.
 */
export interface AdminDashboardStats {
  totalArticles: number;
  totalSubscribers: number;
  pendingApplications: number;
  totalConstellations: number;
  totalGalleryImages: number;
  serverStatus: 'online' | 'degraded' | 'offline';
  uptimeSeconds: number;
}

/**
 * DTO para actualizar una noticia existente.
 */
export interface UpdateNewsDto {
  title?: string;
  summary?: string;
  imageUrl?: string;
  date?: string;
  readTimeMinutes?: number;
  slug?: string;
  content?: string;
  author?: string;
  tags?: string[];
  coverImageCaption?: string;
}

/**
 * DTO para crear una constelación.
 */
export interface CreateConstellationDto {
  name: string;
  latinName?: string;
  season?: string;
  hemisphere?: string;
  description?: string;
  brightestStar?: string;
  funFact?: string;
  starsCount?: number;
  bestMonth?: string;
  imageUrl?: string;
  slug: string;
}

/**
 * DTO para actualizar una constelación.
 */
export interface UpdateConstellationDto extends Partial<CreateConstellationDto> {}

/**
 * DTO para actualizar datos de un planeta.
 */
export interface UpdatePlanetDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

/**
 * DTO para actualizar datos de una luna.
 */
export interface UpdateMoonDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  planetId?: string;
}

/**
 * DTO para crear una colección de galería.
 */
export interface CreateGalleryCollectionDto {
  id: string;
  title: string;
  description: string;
  rotationFrequency?: string;
}

/**
 * DTO para agregar una imagen a la galería.
 */
export interface CreateGalleryImageDto {
  collectionId: string;
  alt: string;
  caption?: string;
  url?: string;
  featured?: boolean;
  order?: number;
}

/**
 * DTO para actualizar un stat de la home.
 */
export interface UpdateStatDto {
  value?: string;
  label?: string;
  order?: number;
}

/**
 * DTO para enviar una campaña masiva de newsletter vía Resend.
 */
export interface NewsletterBroadcastDto {
  subject: string;
  title: string;
  content: string; // Markdown or HTML
}

/**
 * DTO para actualizar el estado de una postulación.
 */
export interface UpdateApplicationStatusDto {
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
}
