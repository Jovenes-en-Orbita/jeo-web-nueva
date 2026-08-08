import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SolarSystemService } from './solar-system.service';

@ApiTags('Solar System')
@Controller('solar-system')
export class SolarSystemController {
  constructor(private readonly solarSystemService: SolarSystemService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener información general de la sección Sistema Solar' })
  @ApiResponse({ status: 200, description: 'Información general del sistema solar' })
  getSection() {
    return this.solarSystemService.getSection();
  }

  @Get('planets')
  @ApiOperation({ summary: 'Obtener el listado de planetas del sistema solar' })
  @ApiResponse({ status: 200, description: 'Listado de planetas' })
  getPlanets() {
    return this.solarSystemService.getPlanets();
  }

  @Get('moons')
  @ApiOperation({ summary: 'Obtener el listado de lunas principales' })
  @ApiResponse({ status: 200, description: 'Listado de lunas' })
  getMoons() {
    return this.solarSystemService.getMoons();
  }
}

