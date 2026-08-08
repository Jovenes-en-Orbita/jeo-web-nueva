import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { ConstellationsSection } from '@jeo/shared';

@Injectable()
export class ConstellationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSection(): Promise<ConstellationsSection> {
    const constellations = await this.prisma.constellation.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      description:
        'Explicación de cada constelación, mapa del cielo y materiales descargables (plantillas, apps, recursos didácticos).',
      skyMapImageUrl: null, // TODO: Replace with actual interactive sky map image URL
      resources: [
        { id: 'res-1', label: 'Plantillas descargables', type: 'template' },
        { id: 'res-2', label: 'Apps recomendadas', type: 'app' },
        { id: 'res-3', label: 'Material didáctico', type: 'didactic' },
      ],
      constellations: constellations.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? undefined,
        imageUrl: c.imageUrl,
        slug: c.slug,
      })),
    };
  }
}
