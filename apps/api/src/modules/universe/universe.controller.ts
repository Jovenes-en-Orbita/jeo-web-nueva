import { Controller, Get } from '@nestjs/common';
import { UniverseService } from './universe.service';

@Controller('universe')
export class UniverseController {
  constructor(private readonly universeService: UniverseService) {}

  @Get()
  getSection() {
    return this.universeService.getSection();
  }

  @Get('tabs')
  getTabs() {
    return this.universeService.getTabs();
  }
}
