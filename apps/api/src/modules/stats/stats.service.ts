import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { StatItem } from '@jeo/shared';

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
}
