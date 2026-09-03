import type {
  ApiResponse,
  StatItem,
  NewsArticle,
  UniverseSection,
  SolarSystemSection,
  ConstellationsSection,
  Constellation,
  GalleryCollection,
  SubscribeNewsletterDto,
  NewsletterSubscriberResponse,
  CreateApplicationDto,
  ApplicationResponse,
  LoginDto,
  AuthResponse,
  AdminUser,
  AdminDashboardStats,
  CreateConstellationDto,
  UpdateConstellationDto,
  UpdateNewsDto,
  UpdatePlanetDto,
  UpdateMoonDto,
  CreateGalleryCollectionDto,
  CreateGalleryImageDto,
  UpdateStatDto,
  NewsletterBroadcastDto,
} from '@jeo/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Envoltorio principal para llamadas a la API de NestJS.
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 30 },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`API Error [${res.status}] ${endpoint}: ${errorText}`);
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}

/**
 * Envoltorio para llamadas autenticadas con JWT.
 */
async function fetchAuthApi<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers || {}),
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Error en petición administrativa: ${res.status}`);
  }

  return (json.data !== undefined ? json.data : json) as T;
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Métodos Públicos ──
// ══════════════════════════════════════════════════════════════════════════════

export async function getStats(): Promise<StatItem[]> {
  try {
    return await fetchApi<StatItem[]>('/stats');
  } catch (err) {
    console.error('Error fetching /stats:', err);
    return [];
  }
}

export async function getNews(tag?: string, search?: string): Promise<NewsArticle[]> {
  try {
    const params = new URLSearchParams();
    if (tag && tag !== 'Todos' && tag !== 'Todas') params.append('tag', tag);
    if (search && search.trim() !== '') params.append('search', search.trim());

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await fetchApi<NewsArticle[]>(`/news${queryStr}`);
  } catch (err) {
    console.error('Error fetching /news:', err);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    return await fetchApi<NewsArticle>(`/news/${slug}`);
  } catch (err) {
    console.error(`Error fetching /news/${slug}:`, err);
    return null;
  }
}

export async function getUniverse(): Promise<UniverseSection> {
  try {
    return await fetchApi<UniverseSection>('/universe');
  } catch (err) {
    console.error('Error fetching /universe:', err);
    return {
      title: 'El Universo',
      description: 'Exploración de la estructura del cosmos y la astrofísica moderna.',
      coverImageUrl: null,
      tabs: [],
    };
  }
}

export async function getSolarSystem(): Promise<SolarSystemSection> {
  try {
    return await fetchApi<SolarSystemSection>('/solar-system');
  } catch (err) {
    console.error('Error fetching /solar-system:', err);
    return {
      coverImageUrl: null,
      planets: [],
      moons: [],
    };
  }
}

export async function getConstellations(): Promise<ConstellationsSection> {
  try {
    return await fetchApi<ConstellationsSection>('/constellations');
  } catch (err) {
    console.error('Error fetching /constellations:', err);
    return {
      description: 'Guía astronómica de constelaciones y orientación nocturna.',
      skyMapImageUrl: null,
      resources: [],
      constellations: [],
    };
  }
}

export async function getConstellationsCatalog(hemisphere?: string, season?: string): Promise<Constellation[]> {
  try {
    const params = new URLSearchParams();
    if (hemisphere && hemisphere !== 'Todos') params.append('hemisphere', hemisphere);
    if (season && season !== 'Todas') params.append('season', season);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await fetchApi<Constellation[]>(`/constellations/list${queryStr}`);
  } catch (err) {
    console.error('Error fetching /constellations/list:', err);
    return [];
  }
}

export async function getConstellationBySlug(slug: string): Promise<Constellation | null> {
  try {
    return await fetchApi<Constellation>(`/constellations/${slug}`);
  } catch (err) {
    console.error(`Error fetching /constellations/${slug}:`, err);
    return null;
  }
}

export async function getGalleryFeatured(): Promise<GalleryCollection> {
  try {
    return await fetchApi<GalleryCollection>('/gallery/featured');
  } catch (err) {
    console.error('Error fetching /gallery/featured:', err);
    return {
      id: 'empty',
      title: 'Fragmentos de Memoria',
      description: 'Galería fotográfica de misiones espaciales y astrofotografía.',
      totalImages: 0,
      rotationFrequency: 'semanal',
      images: [],
    };
  }
}

export async function getGalleryCollections(): Promise<GalleryCollection[]> {
  try {
    return await fetchApi<GalleryCollection[]>('/gallery');
  } catch (err) {
    console.error('Error fetching /gallery:', err);
    return [];
  }
}

export async function subscribeNewsletter(dto: SubscribeNewsletterDto): Promise<NewsletterSubscriberResponse> {
  const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Error al procesar la suscripción');
  }
  return json.data;
}

export async function submitApplication(dto: CreateApplicationDto): Promise<ApplicationResponse> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Error al enviar la postulación');
  }
  return json.data;
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Métodos de la Intranet Administrativa (Autenticados con JWT) ──
// ══════════════════════════════════════════════════════════════════════════════

export async function adminLogin(credentials: LoginDto): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Credenciales inválidas');
  }
  return json.data || json;
}

export async function adminGetMe(token: string): Promise<AdminUser> {
  return fetchAuthApi<AdminUser>('/auth/me', token);
}

export async function adminGetDashboardStats(token: string): Promise<AdminDashboardStats> {
  return fetchAuthApi<AdminDashboardStats>('/admin/dashboard-stats', token);
}

// ── Noticias (Admin) ──
export async function adminCreateNews(dto: any, token: string): Promise<NewsArticle> {
  return fetchAuthApi<NewsArticle>('/news', token, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function adminUpdateNews(id: string, dto: UpdateNewsDto, token: string): Promise<NewsArticle> {
  return fetchAuthApi<NewsArticle>(`/news/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export async function adminDeleteNews(id: string, token: string): Promise<{ success: boolean; message: string }> {
  return fetchAuthApi<{ success: boolean; message: string }>(`/news/${id}`, token, {
    method: 'DELETE',
  });
}

// ── Constelaciones (Admin) ──
export async function adminCreateConstellation(dto: CreateConstellationDto, token: string): Promise<Constellation> {
  return fetchAuthApi<Constellation>('/constellations', token, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function adminUpdateConstellation(id: string, dto: UpdateConstellationDto, token: string): Promise<Constellation> {
  return fetchAuthApi<Constellation>(`/constellations/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export async function adminDeleteConstellation(id: string, token: string): Promise<{ success: boolean; message: string }> {
  return fetchAuthApi<{ success: boolean; message: string }>(`/constellations/${id}`, token, {
    method: 'DELETE',
  });
}

// ── Sistema Solar (Admin) ──
export async function adminUpdatePlanet(id: string, dto: UpdatePlanetDto, token: string) {
  return fetchAuthApi(`/solar-system/planets/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export async function adminUpdateMoon(id: string, dto: UpdateMoonDto, token: string) {
  return fetchAuthApi(`/solar-system/moons/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

// ── Galería (Admin) ──
export async function adminCreateGalleryCollection(dto: CreateGalleryCollectionDto, token: string) {
  return fetchAuthApi('/gallery/collections', token, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function adminAddGalleryImage(dto: CreateGalleryImageDto, token: string) {
  return fetchAuthApi('/gallery/images', token, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function adminDeleteGalleryImage(id: string, token: string) {
  return fetchAuthApi(`/gallery/images/${id}`, token, {
    method: 'DELETE',
  });
}

// ── Newsletter & Broadcast (Admin) ──
export async function adminGetSubscribers(token: string) {
  return fetchAuthApi<Array<{ id: string; email: string; active: boolean; createdAt: string }>>('/newsletter/subscribers', token);
}

export async function adminDeleteSubscriber(id: string, token: string) {
  return fetchAuthApi(`/newsletter/subscribers/${id}`, token, {
    method: 'DELETE',
  });
}

export async function adminSendNewsletterBroadcast(dto: NewsletterBroadcastDto, token: string) {
  return fetchAuthApi<{ sentCount: number; errors: number; totalRecipients: number; message: string }>('/newsletter/broadcast', token, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

// ── Postulaciones (Admin) ──
export async function adminGetApplications(token: string) {
  return fetchAuthApi<Array<{
    id: string;
    fullName: string;
    email: string;
    area: string;
    message: string;
    portfolioUrl?: string;
    status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
  }>>('/applications', token);
}

export async function adminUpdateApplicationStatus(id: string, status: string, token: string) {
  return fetchAuthApi(`/applications/${id}/status`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function adminDeleteApplication(id: string, token: string) {
  return fetchAuthApi(`/applications/${id}`, token, {
    method: 'DELETE',
  });
}

// ── Estadísticas Home (Admin) ──
export async function adminUpdateStat(id: string, dto: UpdateStatDto, token: string): Promise<StatItem> {
  return fetchAuthApi<StatItem>(`/stats/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}
