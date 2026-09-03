import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ConstellationsService } from './constellations.service';
import { CreateConstellationDto } from './dto/create-constellation.dto';
import { UpdateConstellationDto } from './dto/update-constellation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Constellation, ConstellationsSection } from '@jeo/shared';

@ApiTags('constellations')
@Controller('constellations')
export class ConstellationsController {
  constructor(private readonly constellationsService: ConstellationsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener datos de la sección de constelaciones' })
  @ApiResponse({ status: 200, description: 'Datos de la sección' })
  async getSection(): Promise<ConstellationsSection> {
    return this.constellationsService.getSection();
  }

  @Get('list')
  @ApiOperation({ summary: 'Obtener catálogo de constelaciones con filtros' })
  @ApiQuery({ name: 'hemisphere', required: false, type: String })
  @ApiQuery({ name: 'season', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Catálogo de constelaciones' })
  async findAll(
    @Query('hemisphere') hemisphere?: string,
    @Query('season') season?: string,
  ): Promise<Constellation[]> {
    return this.constellationsService.findAll(hemisphere, season);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener una constelación por su slug' })
  @ApiResponse({ status: 200, description: 'Constelación encontrada' })
  @ApiResponse({ status: 404, description: 'Constelación no encontrada' })
  async findBySlug(@Param('slug') slug: string): Promise<Constellation> {
    return this.constellationsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una constelación (Admin)' })
  @ApiResponse({ status: 201, description: 'Constelación creada exitosamente' })
  async create(@Body() createDto: CreateConstellationDto): Promise<Constellation> {
    return this.constellationsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una constelación (Admin)' })
  @ApiResponse({ status: 200, description: 'Constelación actualizada exitosamente' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateConstellationDto,
  ): Promise<Constellation> {
    return this.constellationsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una constelación (Admin)' })
  @ApiResponse({ status: 200, description: 'Constelación eliminada exitosamente' })
  async delete(@Param('id') id: string) {
    return this.constellationsService.delete(id);
  }
}
