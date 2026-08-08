import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UniverseService } from './universe.service';

@ApiTags('Universe')
@Controller('universe')
export class UniverseController {
  constructor(private readonly universeService: UniverseService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener información general de la sección Universo' })
  @ApiResponse({ status: 200, description: 'Sección Universo obtenida exitosamente' })
  getSection() {
    return this.universeService.getSection();
  }

  @Get('tabs')
  @ApiOperation({ summary: 'Obtener las pestañas y fichas del Universo' })
  @ApiResponse({ status: 200, description: 'Pestañas de la sección Universo' })
  getTabs() {
    return this.universeService.getTabs();
  }
}

