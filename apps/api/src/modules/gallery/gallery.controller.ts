import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { GalleryCollection, CreateGalleryCollectionDto, CreateGalleryImageDto } from '@jeo/shared';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get('featured')
  @ApiOperation({ summary: 'Obtener la colección fotográfica destacada actual' })
  @ApiResponse({ status: 200, description: 'Colección destacada' })
  async getFeatured(): Promise<GalleryCollection> {
    return this.galleryService.getFeaturedCollection();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las colecciones de la galería' })
  @ApiResponse({ status: 200, description: 'Lista de colecciones' })
  async getAll(): Promise<GalleryCollection[]> {
    return this.galleryService.getAllCollections();
  }

  @Post('collections')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una colección fotográfica (Admin)' })
  @ApiResponse({ status: 201, description: 'Colección creada' })
  async createCollection(@Body() dto: CreateGalleryCollectionDto) {
    return this.galleryService.createCollection(dto);
  }

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Añadir una fotografía a una colección (Admin)' })
  @ApiResponse({ status: 201, description: 'Fotografía añadida' })
  async addImage(@Body() dto: CreateGalleryImageDto) {
    return this.galleryService.addImage(dto);
  }

  @Delete('images/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una fotografía (Admin)' })
  @ApiResponse({ status: 200, description: 'Fotografía eliminada' })
  async deleteImage(@Param('id') id: string) {
    return this.galleryService.deleteImage(id);
  }
}
