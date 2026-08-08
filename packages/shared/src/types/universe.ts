/**
 * Pestaña/sub-sección del Universo.
 */
export interface UniverseTab {
  id: string;
  label: string;
  slug: string;
  description?: string;
  imageUrl: string | null;
  order: number;
}

/**
 * Datos de la sección "El Universo".
 */
export interface UniverseSection {
  title: string;
  description: string;
  coverImageUrl: string | null;
  tabs: UniverseTab[];
}
