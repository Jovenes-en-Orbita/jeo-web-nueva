import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConstellationsService } from './constellations.service';

@ApiTags('Constellations')
@Controller('constellations')
export class ConstellationsController {
  constructor(private readonly constellationsService: ConstellationsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener información y mapa de constelaciones' })
  @ApiResponse({ status: 200, description: 'Sección de constelaciones obtenida exitosamente' })
  getSection() {
    return this.constellationsService.getSection();
  }
}

