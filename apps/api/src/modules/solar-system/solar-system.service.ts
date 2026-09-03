import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Planet, Moon, SolarSystemSection, UpdatePlanetDto, UpdateMoonDto } from '@jeo/shared';

@Injectable()
export class SolarSystemService {
  constructor(private readonly prisma: PrismaService) {}

  async getSection(): Promise<SolarSystemSection> {
    const [planets, moons] = await Promise.all([
      this.getPlanets(),
      this.getMoons(),
    ]);

    return {
      coverImageUrl: null,
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

  async updatePlanet(id: string, dto: UpdatePlanetDto): Promise<Planet> {
    const existing = await this.prisma.planet.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Planeta con id "${id}" no encontrado`);
    }

    const updated = await this.prisma.planet.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      imageUrl: updated.imageUrl,
      order: updated.order,
      description: updated.description ?? undefined,
      slug: updated.slug,
    };
  }

  async updateMoon(id: string, dto: UpdateMoonDto): Promise<Moon> {
    const existing = await this.prisma.moon.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Luna con id "${id}" no encontrada`);
    }

    const updated = await this.prisma.moon.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      imageUrl: updated.imageUrl,
      planetId: updated.planetId,
      order: updated.order,
      description: updated.description ?? undefined,
      slug: updated.slug,
    };
  }
}
