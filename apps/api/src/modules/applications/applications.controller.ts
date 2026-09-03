import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { ApplicationResponse } from '@jeo/shared';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @ApiOperation({ summary: 'Enviar postulación de voluntario o colaborador' })
  @ApiResponse({ status: 201, description: 'Postulación recibida' })
  async create(@Body() createDto: CreateApplicationDto): Promise<ApplicationResponse> {
    return this.applicationsService.create(createDto);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las postulaciones recibidas (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de postulaciones' })
  async findAll() {
    return this.applicationsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de una postulación (Admin)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una postulación (Admin)' })
  @ApiResponse({ status: 200, description: 'Postulación eliminada' })
  async delete(@Param('id') id: string) {
    return this.applicationsService.delete(id);
  }
}
