import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { UniverseSection, UniverseTab } from '@jeo/shared';

@Injectable()
export class UniverseService {
  constructor(private readonly prisma: PrismaService) {}

  async getSection(): Promise<UniverseSection> {
    const tabs = await this.getTabs();

    return {
      title: 'El Universo',
      description:
        'Datos generales, origen del universo, composición (energía oscura, materia oscura, materia bariónica), estructuras del universo y una pestaña propia dedicada al espectro electromagnético.',
      coverImageUrl: null, // TODO: Replace with actual image URL
      tabs,
    };
  }

  async getTabs(): Promise<UniverseTab[]> {
    const tabs = await this.prisma.universeTab.findMany({
      orderBy: { order: 'asc' },
    });

    return tabs.map((t) => ({
      id: t.id,
      label: t.label,
      slug: t.slug,
      description: t.description ?? undefined,
      imageUrl: t.imageUrl,
      order: t.order,
    }));
  }
}
