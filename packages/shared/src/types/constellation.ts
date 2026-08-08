/**
 * Constelación individual.
 */
export interface Constellation {
  id: string;
  name: string;
  description?: string;
  imageUrl: string | null;
  slug: string;
}

/**
 * Recurso descargable asociado a constelaciones.
 */
export interface ConstellationResource {
  id: string;
  label: string;
  type: 'template' | 'app' | 'didactic';
  url?: string;
}

/**
 * Datos de la sección Constelaciones.
 */
export interface ConstellationsSection {
  description: string;
  skyMapImageUrl: string | null;
  resources: ConstellationResource[];
  constellations: Constellation[];
}
