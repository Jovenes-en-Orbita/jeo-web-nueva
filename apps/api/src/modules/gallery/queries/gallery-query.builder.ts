import { BadRequestException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type {
  GalleryCollectionsQueryDto,
  GalleryImagesQueryDto,
} from "../dto/gallery-query.dto";

export const DEFAULT_COLLECTIONS_LIMIT = 6;
export const DEFAULT_IMAGES_LIMIT = 12;
export const MAX_GALLERY_LIMIT = 100;

export class GalleryQueryBuilder {
  static buildCollectionWhere(
    query: GalleryCollectionsQueryDto = {},
  ): Prisma.GalleryCollectionWhereInput {
    const where: Prisma.GalleryCollectionWhereInput = {};

    if (query.search && query.search.trim() !== "") {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s, mode: "insensitive" } },
        { description: { contains: s, mode: "insensitive" } },
        { category: { contains: s, mode: "insensitive" } },
      ];
    }

    if (
      query.category &&
      query.category.trim() !== "" &&
      query.category.toLowerCase() !== "todas" &&
      query.category.toLowerCase() !== "todos"
    ) {
      where.category = {
        equals: query.category.trim(),
        mode: "insensitive",
      };
    }

    if (query.tags && query.tags.length > 0) {
      const cleanTags = query.tags
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      if (cleanTags.length === 1) {
        where.tags = { has: cleanTags[0] };
      } else if (cleanTags.length > 1) {
        where.tags = { hasSome: cleanTags };
      }
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    return where;
  }

  static buildCollectionOrderBy(
    query: GalleryCollectionsQueryDto = {},
  ): Prisma.GalleryCollectionOrderByWithRelationInput[] {
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";
    return [{ featured: "desc" }, { [sortBy]: sortOrder }];
  }

  static buildImageWhere(
    query: GalleryImagesQueryDto = {},
  ): Prisma.GalleryImageWhereInput {
    const where: Prisma.GalleryImageWhereInput = {};

    if (query.search && query.search.trim() !== "") {
      const s = query.search.trim();
      where.OR = [
        { alt: { contains: s, mode: "insensitive" } },
        { caption: { contains: s, mode: "insensitive" } },
        { photographer: { contains: s, mode: "insensitive" } },
        { telescope: { contains: s, mode: "insensitive" } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.sourceType) {
      where.sourceType = query.sourceType;
    }

    return where;
  }

  static resolvePagination(
    page?: number,
    limit?: number,
    defaultLimit = DEFAULT_COLLECTIONS_LIMIT,
  ): { page: number; limit: number; skip: number } {
    const resolvedPage = page !== undefined ? Number(page) : 1;
    const resolvedLimit = limit !== undefined ? Number(limit) : defaultLimit;

    if (!Number.isInteger(resolvedPage) || resolvedPage < 1) {
      throw new BadRequestException(
        "page debe ser un entero mayor o igual a 1",
      );
    }
    if (
      !Number.isInteger(resolvedLimit) ||
      resolvedLimit < 1 ||
      resolvedLimit > MAX_GALLERY_LIMIT
    ) {
      throw new BadRequestException(
        `limit debe ser un entero entre 1 y ${MAX_GALLERY_LIMIT}`,
      );
    }

    return {
      page: resolvedPage,
      limit: resolvedLimit,
      skip: (resolvedPage - 1) * resolvedLimit,
    };
  }
}
