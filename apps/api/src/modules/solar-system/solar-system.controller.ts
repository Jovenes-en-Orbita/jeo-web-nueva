import { Controller, Get, Patch, Param, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { SolarSystemService } from './solar-system.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { SolarSystemSection, Planet, Moon, UpdatePlanetDto, UpdateMoonDto } from '@jeo/shared';

@ApiTags('solar-system')
@Controller('solar-system')
export class SolarSystemController {
  constructor(private readonly solarSystemService: SolarSystemService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Obtener datos de la sección del Sistema Solar' })
  @ApiResponse({ status: 200, description: 'Datos del sistema solar' })
  async getSection(): Promise<SolarSystemSection> {
    return this.solarSystemService.getSection();
  }

  @Get('planets')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Obtener lista de planetas' })
  @ApiResponse({ status: 200, description: 'Lista de planetas' })
  async getPlanets(): Promise<Planet[]> {
    return this.solarSystemService.getPlanets();
  }

  @Get('moons')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Obtener lista de lunas principales' })
  @ApiResponse({ status: 200, description: 'Lista de lunas' })
  async getMoons(): Promise<Moon[]> {
    return this.solarSystemService.getMoons();
  }


  @Patch('planets/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información de un planeta (Admin)' })
  @ApiResponse({ status: 200, description: 'Planeta actualizado' })
  async updatePlanet(
    @Param('id') id: string,
    @Body() updateDto: UpdatePlanetDto,
  ): Promise<Planet> {
    return this.solarSystemService.updatePlanet(id, updateDto);
  }

  @Patch('moons/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información de una luna (Admin)' })
  @ApiResponse({ status: 200, description: 'Luna actualizada' })
  async updateMoon(
    @Param('id') id: string,
    @Body() updateDto: UpdateMoonDto,
  ): Promise<Moon> {
    return this.solarSystemService.updateMoon(id, updateDto);
  }
}
