import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import type { NewsArticle } from '@jeo/shared';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    tag?: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ items: NewsArticle[]; total: number; page: number; totalPages: number } | NewsArticle[]> {
    const where: any = {};

    if (tag && tag.trim() !== '' && tag !== 'Todas' && tag !== 'Todos') {
      where.tags = {
        has: tag,
      };
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pageNum = page ? Math.max(1, Number(page)) : undefined;
    const limitNum = limit ? Math.max(1, Number(limit)) : undefined;

    if (pageNum && limitNum) {
      const [total, articles] = await Promise.all([
        this.prisma.newsArticle.count({ where }),
        this.prisma.newsArticle.findMany({
          where,
          orderBy: { date: 'desc' },
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
        }),
      ]);

      return {
        items: articles.map((a) => this.mapToDto(a)),
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      };
    }

    const articles = await this.prisma.newsArticle.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return articles.map((a) => this.mapToDto(a));
  }


  async findBySlug(slug: string): Promise<NewsArticle> {
    const article = await this.prisma.newsArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException(`Noticia con slug "${slug}" no encontrada`);
    }

    return this.mapToDto(article);
  }

  async create(dto: CreateNewsDto): Promise<NewsArticle> {
    const existing = await this.prisma.newsArticle.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Ya existe una noticia con el slug "${dto.slug}"`);
    }

    const article = await this.prisma.newsArticle.create({
      data: {
        title: dto.title,
        summary: dto.summary,
        imageUrl: dto.imageUrl || '/assets/hero-cosmos.svg',
        date: dto.date ? new Date(dto.date) : new Date(),
        readTimeMinutes: dto.readTimeMinutes || 4,
        slug: dto.slug,
        content: dto.content,
        author: dto.author || 'Equipo JEO',
        tags: dto.tags || [],
        coverImageCaption: dto.coverImageCaption,
      },
    });

    return this.mapToDto(article);
  }

  async update(id: string, dto: UpdateNewsDto): Promise<NewsArticle> {
    const existing = await this.prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Noticia con id "${id}" no encontrada`);
    }

    const updated = await this.prisma.newsArticle.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.date !== undefined && { date: new Date(dto.date) }),
        ...(dto.readTimeMinutes !== undefined && { readTimeMinutes: dto.readTimeMinutes }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.author !== undefined && { author: dto.author }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.coverImageCaption !== undefined && { coverImageCaption: dto.coverImageCaption }),
      },
    });

    return this.mapToDto(updated);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Noticia con id "${id}" no encontrada`);
    }

    await this.prisma.newsArticle.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Noticia eliminada correctamente',
    };
  }

  private mapToDto(a: any): NewsArticle {
    return {
      id: a.id,
      title: a.title,
      summary: a.summary,
      imageUrl: a.imageUrl,
      date: a.date instanceof Date ? a.date.toISOString() : a.date,
      readTimeMinutes: a.readTimeMinutes,
      slug: a.slug,
      content: a.content ?? undefined,
      author: a.author ?? 'Equipo JEO',
      tags: a.tags ?? [],
      coverImageCaption: a.coverImageCaption ?? undefined,
    };
  }
}
