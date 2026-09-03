import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { StatItem, UpdateStatDto } from '@jeo/shared';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<StatItem[]> {
    const stats = await this.prisma.stat.findMany({
      orderBy: { order: 'asc' },
    });

    return stats.map((s) => ({
      id: s.id,
      value: s.value,
      label: s.label,
      order: s.order,
    }));
  }

  async update(id: string, dto: UpdateStatDto): Promise<StatItem> {
    const existing = await this.prisma.stat.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Stat con id "${id}" no encontrado`);
    }

    const updated = await this.prisma.stat.update({
      where: { id },
      data: {
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.label !== undefined && { label: dto.label }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });

    return {
      id: updated.id,
      value: updated.value,
      label: updated.label,
      order: updated.order,
    };
  }
}
