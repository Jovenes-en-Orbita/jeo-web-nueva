import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener métricas y estadísticas de la plataforma' })
  @ApiResponse({ status: 200, description: 'Estadísticas globales obtenidas exitosamente' })
  findAll() {
    return this.statsService.findAll();
  }
}

