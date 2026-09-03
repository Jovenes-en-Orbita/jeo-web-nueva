import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { StatItem, UpdateStatDto } from '@jeo/shared';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener métricas astronómicas destacadas' })
  @ApiResponse({ status: 200, description: 'Lista de métricas' })
  async findAll(): Promise<StatItem[]> {
    return this.statsService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un valor estadístico (Admin)' })
  @ApiResponse({ status: 200, description: 'Estadística actualizada' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStatDto,
  ): Promise<StatItem> {
    return this.statsService.update(id, updateDto);
  }
}
