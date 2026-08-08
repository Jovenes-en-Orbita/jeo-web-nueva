import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Planet, Moon, SolarSystemSection } from '@jeo/shared';

@Injectable()
export class SolarSystemService {
  constructor(private readonly prisma: PrismaService) {}

  async getSection(): Promise<SolarSystemSection> {
    const [planets, moons] = await Promise.all([
      this.getPlanets(),
      this.getMoons(),
    ]);

    return {
      coverImageUrl: null, // TODO: Replace with actual solar system panoramic image
      planets,
      moons,
    };
  }

  async getPlanets(): Promise<Planet[]> {
    const planets = await this.prisma.planet.findMany({
      orderBy: { order: 'asc' },
    });

    return planets.map((p) => ({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      order: p.order,
      description: p.description ?? undefined,
      slug: p.slug,
    }));
  }

  async getMoons(): Promise<Moon[]> {
    const moons = await this.prisma.moon.findMany({
      orderBy: { order: 'asc' },
    });

    return moons.map((m) => ({
      id: m.id,
      name: m.name,
      imageUrl: m.imageUrl,
      planetId: m.planetId,
      order: m.order,
      description: m.description ?? undefined,
      slug: m.slug,
    }));
  }
}
