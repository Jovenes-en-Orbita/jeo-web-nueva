import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el listado de todas las noticias' })
  @ApiResponse({ status: 200, description: 'Lista de noticias obtenida exitosamente' })
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener una noticia por su slug' })
  @ApiParam({ name: 'slug', description: 'Identificador único amigable de la noticia (slug)', example: 'descubrimiento-exoplaneta' })
  @ApiResponse({ status: 200, description: 'Detalle de la noticia' })
  @ApiResponse({ status: 404, description: 'Noticia no encontrada' })
  findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }
}

