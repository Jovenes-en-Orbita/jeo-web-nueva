import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las colecciones de la galería astronómica' })
  @ApiResponse({ status: 200, description: 'Listado de colecciones de imágenes' })
  getAllCollections() {
    return this.galleryService.getAllCollections();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener la colección destacada de la galería' })
  @ApiResponse({ status: 200, description: 'Colección destacada' })
  getFeatured() {
    return this.galleryService.getFeaturedCollection();
  }
}

