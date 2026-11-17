import { Injectable } from "@nestjs/common";
import type { NewsArticle, PaginatedNewsResponse } from "@jeo/shared";
import { PrismaService } from "../../../prisma/prisma.service";
import type { NewsQueryDto } from "../dto/news-query.dto";
import type {
  INewsSearchStrategy,
  NewsRelationIncludeOptions,
} from "./news-query.interfaces";
import { NewsQueryBuilder } from "./news-query.builder";

@Injectable()
export class PrismaNewsSearchStrategy implements INewsSearchStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async executeSearch(
    queryDto: NewsQueryDto = {},
    forcePagination = false,
  ): Promise<PaginatedNewsResponse | NewsArticle[]> {
    const normalized = NewsQueryBuilder.normalize(queryDto, forcePagination);
    const where = NewsQueryBuilder.buildPrismaWhere(normalized);
    const orderBy = NewsQueryBuilder.buildPrismaOrderBy(normalized);
    const include = NewsQueryBuilder.buildPrismaInclude(normalized.include);

    if (normalized.page !== undefined && normalized.limit !== undefined) {
      const skip = (normalized.page - 1) * normalized.limit;
      const take = normalized.limit;

      const [total, records] = await Promise.all([
        this.prisma.newsArticle.count({ where }),
        this.prisma.newsArticle.findMany({
          where,
          orderBy,
          skip,
          take,
          ...(include ? { include } : {}),
        }),
      ]);

      const mapped = records.map((r) =>
        PrismaNewsSearchStrategy.mapArticleToDto(r, normalized.include),
      );
      const totalPages = Math.ceil(total / normalized.limit) || 1;

      return {
        data: mapped,
        items: mapped,
        total,
        page: normalized.page,
        limit: normalized.limit,
        totalPages,
      };
    }

    const records = await this.prisma.newsArticle.findMany({
      where,
      orderBy,
      ...(include ? { include } : {}),
    });

    return records.map((r) =>
      PrismaNewsSearchStrategy.mapArticleToDto(r, normalized.include),
    );
  }

  static mapArticleToDto(
    a: any,
    includeOptions: NewsRelationIncludeOptions = {
      categories: true,
      references: true,
    },
  ): NewsArticle {
    const dto: NewsArticle = {
      id: a.id,
      title: a.title,
      summary: a.summary,
      imageUrl: a.imageUrl,
      date: a.date instanceof Date ? a.date.toISOString() : a.date,
      readTimeMinutes: a.readTimeMinutes,
      slug: a.slug,
      content: a.content ?? undefined,
      author: a.author ?? "Equipo JEO",
      tags: a.tags ?? [],
      coverImageCaption: a.coverImageCaption ?? undefined,
      status: a.status ?? "PUBLISHED",
      ...(a.createdAt && {
        createdAt:
          a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
      }),
      ...(a.updatedAt && {
        updatedAt:
          a.updatedAt instanceof Date ? a.updatedAt.toISOString() : a.updatedAt,
      }),
    };

    if (includeOptions.categories) {
      dto.categories = Array.isArray(a.categories)
        ? a.categories.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description ?? null,
            ...(c.createdAt && {
              createdAt:
                c.createdAt instanceof Date
                  ? c.createdAt.toISOString()
                  : c.createdAt,
            }),
            ...(c.updatedAt && {
              updatedAt:
                c.updatedAt instanceof Date
                  ? c.updatedAt.toISOString()
                  : c.updatedAt,
            }),
          }))
        : [];
    }

    if (includeOptions.references) {
      dto.references = Array.isArray(a.references)
        ? a.references.map((ref: any) => ({
            id: ref.id,
            articleId: ref.articleId,
            title: ref.title,
            author: ref.author ?? null,
            url: ref.url ?? null,
            publisher: ref.publisher ?? null,
            publishedAt:
              ref.publishedAt instanceof Date
                ? ref.publishedAt.toISOString()
                : (ref.publishedAt ?? null),
            accessedAt:
              ref.accessedAt instanceof Date
                ? ref.accessedAt.toISOString()
                : (ref.accessedAt ?? null),
            ...(ref.createdAt && {
              createdAt:
                ref.createdAt instanceof Date
                  ? ref.createdAt.toISOString()
                  : ref.createdAt,
            }),
            ...(ref.updatedAt && {
              updatedAt:
                ref.updatedAt instanceof Date
                  ? ref.updatedAt.toISOString()
                  : ref.updatedAt,
            }),
          }))
        : [];
    }

    return dto;
  }
}
