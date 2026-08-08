import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { NewsArticle } from '@jeo/shared';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<NewsArticle[]> {
    const articles = await this.prisma.newsArticle.findMany({
      orderBy: { date: 'desc' },
    });

    return articles.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      imageUrl: a.imageUrl,
      date: a.date.toISOString(),
      readTimeMinutes: a.readTimeMinutes,
      slug: a.slug,
      content: a.content ?? undefined,
    }));
  }

  async findBySlug(slug: string): Promise<NewsArticle> {
    const article = await this.prisma.newsArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    return {
      id: article.id,
      title: article.title,
      summary: article.summary,
      imageUrl: article.imageUrl,
      date: article.date.toISOString(),
      readTimeMinutes: article.readTimeMinutes,
      slug: article.slug,
      content: article.content ?? undefined,
    };
  }
}
