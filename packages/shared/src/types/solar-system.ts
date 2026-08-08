/**
 * Planeta del sistema solar.
 */
export interface Planet {
  id: string;
  name: string;
  imageUrl: string | null;
  order: number;
  description?: string;
  slug: string;
}

/**
 * Luna notable del sistema solar.
 */
export interface Moon {
  id: string;
  name: string;
  imageUrl: string | null;
  planetId: string;
  order: number;
  description?: string;
  slug: string;
}

/**
 * Datos completos de la sección Sistema Solar.
 */
export interface SolarSystemSection {
  coverImageUrl: string | null;
  planets: Planet[];
  moons: Moon[];
}
