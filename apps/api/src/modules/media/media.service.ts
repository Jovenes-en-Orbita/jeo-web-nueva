import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FreeImageResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  authorUrl: string;
  source: 'Unsplash' | 'NASA';
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Busca imágenes espaciales y astronómicas libres de derechos.
   * Utiliza la API de NASA Images por defecto (sin requirimiento de API key) 
   * y enriquece con Unsplash si hay clave configurada.
   */
  async searchImages(query: string = 'space'): Promise<FreeImageResult[]> {
    const searchTerm = query.trim() || 'space';
    const results: FreeImageResult[] = [];

    // 1. Buscar en NASA Images API (Gratuita y pública)
    try {
      const nasaUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image`;
      const response = await fetch(nasaUrl);
      if (response.ok) {
        const data: any = await response.json();
        const items = data.collection?.items?.slice(0, 12) || [];

        for (const item of items) {
          const itemData = item.data?.[0];
          const links = item.links || [];
          const previewLink = links.find((l: any) => l.rel === 'preview')?.href || links[0]?.href;

          if (itemData && previewLink) {
            results.push({
              id: `nasa-${itemData.nasa_id}`,
              title: itemData.title || 'NASA Image',
              url: previewLink, // URL directo de la imagen
              thumbnailUrl: previewLink,
              author: itemData.center || 'NASA',
              authorUrl: 'https://images.nasa.gov',
              source: 'NASA',
            });
          }
        }
      }
    } catch (err: any) {
      this.logger.error(`Error buscando imágenes en NASA API: ${err.message}`);
    }

    // 2. Si hay clave de Unsplash configurada, buscar en Unsplash API
    const unsplashAccessKey = this.configService.get<string>('UNSPLASH_ACCESS_KEY');
    if (unsplashAccessKey) {
      try {
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=12`;
        const response = await fetch(unsplashUrl, {
          headers: { Authorization: `Client-ID ${unsplashAccessKey}` },
        });

        if (response.ok) {
          const data: any = await response.json();
          for (const photo of data.results || []) {
            results.unshift({
              id: `unsplash-${photo.id}`,
              title: photo.alt_description || photo.description || 'Unsplash Photo',
              url: photo.urls?.regular || photo.urls?.full,
              thumbnailUrl: photo.urls?.small || photo.urls?.thumb,
              author: photo.user?.name || 'Unsplash Contributor',
              authorUrl: photo.user?.links?.html || 'https://unsplash.com',
              source: 'Unsplash',
            });
          }
        }
      } catch (err: any) {
        this.logger.error(`Error buscando imágenes en Unsplash API: ${err.message}`);
      }
    }


    return results;
  }
}
