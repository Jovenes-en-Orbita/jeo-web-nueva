import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConstellationDto } from './dto/create-constellation.dto';
import { UpdateConstellationDto } from './dto/update-constellation.dto';
import type { Constellation, ConstellationsSection } from '@jeo/shared';

@Injectable()
export class ConstellationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSection(): Promise<ConstellationsSection> {
    const constellations = await this.findAll();

    return {
      description:
        'Explicación de cada constelación, mapa del cielo interactivo y materiales descargables para la observación astronómica.',
      skyMapImageUrl: null,
      resources: [
        { id: 'res-1', label: 'Plantillas descargables', type: 'template', url: '/downloads/guia-astrofotografia.pdf' },
        { id: 'res-2', label: 'Apps recomendadas (Stellarium / SkyView)', type: 'app', url: 'https://stellarium.org/' },
        { id: 'res-3', label: 'Material didáctico y mapas', type: 'didactic', url: '/downloads/manual-sistema-solar.pdf' },
      ],
      constellations,
    };
  }

  async findAll(hemisphere?: string, season?: string): Promise<Constellation[]> {
    const where: { hemisphere?: string; season?: string } = {};
    if (hemisphere && hemisphere !== 'Todos') where.hemisphere = hemisphere;
    if (season && season !== 'Todas') where.season = season;

    const constellations = await this.prisma.constellation.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return constellations.map((c) => this.mapToDto(c));
  }

  async findBySlug(slug: string): Promise<Constellation> {
    const constellation = await this.prisma.constellation.findUnique({
      where: { slug },
    });

    if (!constellation) {
      throw new NotFoundException(`Constelación con slug "${slug}" no encontrada`);
    }

    return this.mapToDto(constellation);
  }

  async create(dto: CreateConstellationDto): Promise<Constellation> {
    const existing = await this.prisma.constellation.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Ya existe una constelación con el slug "${dto.slug}"`);
    }

    const created = await this.prisma.constellation.create({
      data: {
        name: dto.name,
        latinName: dto.latinName,
        season: dto.season,
        hemisphere: dto.hemisphere,
        description: dto.description,
        brightestStar: dto.brightestStar,
        funFact: dto.funFact,
        starsCount: dto.starsCount,
        bestMonth: dto.bestMonth,
        imageUrl: dto.imageUrl,
        slug: dto.slug,
      },
    });

    return this.mapToDto(created);
  }

  async update(id: string, dto: UpdateConstellationDto): Promise<Constellation> {
    const existing = await this.prisma.constellation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Constelación con id "${id}" no encontrada`);
    }

    const updated = await this.prisma.constellation.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.latinName !== undefined && { latinName: dto.latinName }),
        ...(dto.season !== undefined && { season: dto.season }),
        ...(dto.hemisphere !== undefined && { hemisphere: dto.hemisphere }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.brightestStar !== undefined && { brightestStar: dto.brightestStar }),
        ...(dto.funFact !== undefined && { funFact: dto.funFact }),
        ...(dto.starsCount !== undefined && { starsCount: dto.starsCount }),
        ...(dto.bestMonth !== undefined && { bestMonth: dto.bestMonth }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
      },
    });

    return this.mapToDto(updated);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.constellation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Constelación con id "${id}" no encontrada`);
    }

    await this.prisma.constellation.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Constelación eliminada correctamente',
    };
  }

  private mapToDto(c: any): Constellation {
    return {
      id: c.id,
      name: c.name,
      latinName: c.latinName ?? undefined,
      season: c.season ?? undefined,
      hemisphere: c.hemisphere ?? undefined,
      description: c.description ?? undefined,
      brightestStar: c.brightestStar ?? undefined,
      funFact: c.funFact ?? undefined,
      starsCount: c.starsCount ?? undefined,
      bestMonth: c.bestMonth ?? undefined,
      imageUrl: c.imageUrl,
      slug: c.slug,
    };
  }
}
