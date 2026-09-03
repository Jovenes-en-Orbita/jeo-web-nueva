import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { GalleryCollection, CreateGalleryCollectionDto, CreateGalleryImageDto } from '@jeo/shared';

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

  async createCollection(dto: CreateGalleryCollectionDto): Promise<GalleryCollection> {
    const created = await this.prisma.galleryCollection.create({
      data: {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        rotationFrequency: dto.rotationFrequency || 'semanal',
      },
      include: { images: true },
    });

    return {
      id: created.id,
      title: created.title,
      description: created.description,
      totalImages: 0,
      rotationFrequency: created.rotationFrequency,
      images: [],
    };
  }

  async addImage(dto: CreateGalleryImageDto) {
    const created = await this.prisma.galleryImage.create({
      data: {
        collectionId: dto.collectionId,
        alt: dto.alt,
        caption: dto.caption,
        url: dto.url || '/assets/gallery-1.svg',
        featured: dto.featured ?? false,
        order: dto.order ?? 0,
      },
    });

    return created;
  }

  async deleteImage(id: string) {
    const existing = await this.prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Imagen no encontrada');
    }

    await this.prisma.galleryImage.delete({
      where: { id },
    });

    return { success: true, message: 'Imagen eliminada correctamente' };
  }
}
