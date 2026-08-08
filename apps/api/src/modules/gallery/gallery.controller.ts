import { Controller, Get } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  getAllCollections() {
    return this.galleryService.getAllCollections();
  }

  @Get('featured')
  getFeatured() {
    return this.galleryService.getFeaturedCollection();
  }
}
