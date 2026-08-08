import { Controller, Get } from '@nestjs/common';
import { SolarSystemService } from './solar-system.service';

@Controller('solar-system')
export class SolarSystemController {
  constructor(private readonly solarSystemService: SolarSystemService) {}

  @Get()
  getSection() {
    return this.solarSystemService.getSection();
  }

  @Get('planets')
  getPlanets() {
    return this.solarSystemService.getPlanets();
  }

  @Get('moons')
  getMoons() {
    return this.solarSystemService.getMoons();
  }
}
