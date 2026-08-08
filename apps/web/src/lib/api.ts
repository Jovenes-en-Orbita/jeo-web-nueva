import type {
  ApiResponse,
  StatItem,
  NewsArticle,
  UniverseSection,
  SolarSystemSection,
  ConstellationsSection,
  GalleryCollection,
} from '@jeo/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper that unwraps the ApiResponse envelope.
 * Falls back to mock data when the API is unreachable (dev without backend).
 */
async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json: ApiResponse<T> = await res.json();
    return json.data;
  } catch {
    console.warn(`⚠️ API unreachable for ${endpoint}, using fallback data`);
    return getFallbackData<T>(endpoint);
  }
}

// ── Public API methods ──

export async function getStats(): Promise<StatItem[]> {
  return fetchApi<StatItem[]>('/stats');
}

export async function getNews(): Promise<NewsArticle[]> {
  return fetchApi<NewsArticle[]>('/news');
}

export async function getUniverse(): Promise<UniverseSection> {
  return fetchApi<UniverseSection>('/universe');
}

export async function getSolarSystem(): Promise<SolarSystemSection> {
  return fetchApi<SolarSystemSection>('/solar-system');
}

export async function getConstellations(): Promise<ConstellationsSection> {
  return fetchApi<ConstellationsSection>('/constellations');
}

export async function getGalleryFeatured(): Promise<GalleryCollection> {
  return fetchApi<GalleryCollection>('/gallery/featured');
}

// ── Fallback mock data (when API is not running) ──

function getFallbackData<T>(endpoint: string): T {
  const fallbacks: Record<string, unknown> = {
    '/stats': [
      { id: '1', value: '93 %', label: 'del universo aún no se comprende del todo', order: 1 },
      { id: '2', value: '8', label: 'planetas en el sistema solar', order: 2 },
      { id: '3', value: '88', label: 'constelaciones reconocidas oficialmente', order: 3 },
      { id: '4', value: '+400', label: 'fotografías en Fragmentos de Memoria', order: 4 },
    ],
    '/news': [
      {
        id: '1',
        title: 'Artemis III: El regreso a la Luna se acerca',
        summary: 'La NASA confirma avances clave en la misión que llevará astronautas a la superficie lunar.',
        imageUrl: null,
        date: '2024-03-05T00:00:00.000Z',
        readTimeMinutes: 6,
        slug: 'artemis-iii',
      },
      {
        id: '2',
        title: 'Descubren exoplaneta con posible atmósfera habitable',
        summary: 'El telescopio James Webb detectó señales de vapor de agua en la atmósfera de un exoplaneta.',
        imageUrl: null,
        date: '2024-02-02T00:00:00.000Z',
        readTimeMinutes: 4,
        slug: 'exoplaneta-habitable',
      },
      {
        id: '3',
        title: 'SpaceX logra captura de Starship con la torre',
        summary: 'Un hito histórico en la historia de la ingeniería aeroespacial.',
        imageUrl: null,
        date: '2024-01-18T00:00:00.000Z',
        readTimeMinutes: 3,
        slug: 'spacex-starship',
      },
    ],
    '/universe': {
      title: 'El Universo',
      description: 'Datos generales, origen del universo, composición (energía oscura, materia oscura, materia bariónica), estructuras del universo y una pestaña propia dedicada al espectro electromagnético.',
      coverImageUrl: null,
      tabs: [
        { id: '1', label: 'Origen', slug: 'origen', order: 1 },
        { id: '2', label: 'Composición', slug: 'composicion', order: 2 },
        { id: '3', label: 'Estructuras', slug: 'estructuras', order: 3 },
        { id: '4', label: 'La luz', slug: 'la-luz', order: 4 },
        { id: '5', label: 'Ondas gravitacionales', slug: 'ondas-gravitacionales', order: 5 },
      ],
    },
    '/solar-system': {
      coverImageUrl: null,
      planets: [
        { id: '1', name: 'Mercurio', slug: 'mercurio', imageUrl: null, order: 1 },
        { id: '2', name: 'Venus', slug: 'venus', imageUrl: null, order: 2 },
        { id: '3', name: 'Tierra', slug: 'tierra', imageUrl: null, order: 3 },
        { id: '4', name: 'Marte', slug: 'marte', imageUrl: null, order: 4 },
        { id: '5', name: 'Júpiter', slug: 'jupiter', imageUrl: null, order: 5 },
        { id: '6', name: 'Saturno', slug: 'saturno', imageUrl: null, order: 6 },
        { id: '7', name: 'Urano', slug: 'urano', imageUrl: null, order: 7 },
        { id: '8', name: 'Neptuno', slug: 'neptuno', imageUrl: null, order: 8 },
      ],
      moons: [
        { id: '1', name: 'Ganímedes', slug: 'ganimedes', planetId: '5', imageUrl: null, order: 1 },
        { id: '2', name: 'Titán', slug: 'titan', planetId: '6', imageUrl: null, order: 2 },
        { id: '3', name: 'Calisto', slug: 'calisto', planetId: '5', imageUrl: null, order: 3 },
        { id: '4', name: 'Ío', slug: 'io', planetId: '5', imageUrl: null, order: 4 },
        { id: '5', name: 'Europa', slug: 'europa', planetId: '5', imageUrl: null, order: 5 },
      ],
    },
    '/constellations': {
      description: 'Explicación de cada constelación, mapa del cielo y materiales descargables.',
      skyMapImageUrl: null,
      resources: [
        { id: '1', label: 'Plantillas descargables', type: 'template' },
        { id: '2', label: 'Apps recomendadas', type: 'app' },
        { id: '3', label: 'Material didáctico', type: 'didactic' },
      ],
      constellations: [],
    },
    '/gallery/featured': {
      id: 'featured',
      title: 'Sobrevuelo lunar de Artemis II',
      description: 'Galería de fotos astronómicas',
      totalImages: 80,
      rotationFrequency: 'semanal',
      images: Array.from({ length: 6 }, (_, i) => ({
        id: String(i + 1),
        url: null,
        alt: `Foto astronómica ${i + 1}`,
        featured: i === 0,
        order: i + 1,
      })),
    },
  };

  return (fallbacks[endpoint] ?? null) as T;
}
