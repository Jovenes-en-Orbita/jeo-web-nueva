import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { NewsArticle } from '@jeo/shared';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las noticias (con filtros opcionales de tag y búsqueda)' })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de noticias' })
  async findAll(
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ): Promise<NewsArticle[]> {
    return this.newsService.findAll(tag, search);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener una noticia por su slug' })
  @ApiResponse({ status: 200, description: 'Noticia encontrada' })
  @ApiResponse({ status: 404, description: 'Noticia no encontrada' })
  async findBySlug(@Param('slug') slug: string): Promise<NewsArticle> {
    return this.newsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva noticia (Admin)' })
  @ApiResponse({ status: 201, description: 'Noticia creada exitosamente' })
  async create(@Body() createNewsDto: CreateNewsDto): Promise<NewsArticle> {
    return this.newsService.create(createNewsDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una noticia existente (Admin)' })
  @ApiResponse({ status: 200, description: 'Noticia actualizada exitosamente' })
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<NewsArticle> {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una noticia (Admin)' })
  @ApiResponse({ status: 200, description: 'Noticia eliminada exitosamente' })
  async delete(@Param('id') id: string) {
    return this.newsService.delete(id);
  }
}
