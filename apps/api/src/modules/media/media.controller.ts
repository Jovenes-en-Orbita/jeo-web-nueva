import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { MediaService, FreeImageResult } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @ApiOperation({ summary: 'Buscar imágenes espaciales gratuitas y libres de derechos (NASA / Unsplash)' })
  @ApiQuery({ name: 'query', required: false, type: String, description: 'Término de búsqueda (ej: mars, nebula, telescope)' })
  @ApiResponse({ status: 200, description: 'Lista de imágenes encontradas' })
  async searchImages(@Query('query') query?: string): Promise<FreeImageResult[]> {
    return this.mediaService.searchImages(query);
  }
}
