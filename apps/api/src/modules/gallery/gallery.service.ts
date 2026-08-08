import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { GalleryCollection } from '@jeo/shared';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeaturedCollection(): Promise<GalleryCollection> {
    const collection = await this.prisma.galleryCollection.findFirst({
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!collection) {
      return {
        id: 'empty',
        title: 'Sin colección',
        description: '',
        totalImages: 0,
        rotationFrequency: 'semanal',
        images: [],
      };
    }

    return {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      totalImages: collection.images.length,
      rotationFrequency: collection.rotationFrequency,
      images: collection.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        caption: img.caption ?? undefined,
        featured: img.featured,
        order: img.order,
      })),
    };
  }

  async getAllCollections(): Promise<GalleryCollection[]> {
    const collections = await this.prisma.galleryCollection.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return collections.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      totalImages: c.images.length,
      rotationFrequency: c.rotationFrequency,
      images: c.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        caption: img.caption ?? undefined,
        featured: img.featured,
        order: img.order,
      })),
    }));
  }
}
