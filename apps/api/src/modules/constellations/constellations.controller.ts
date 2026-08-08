import { Controller, Get } from '@nestjs/common';
import { ConstellationsService } from './constellations.service';

@Controller('constellations')
export class ConstellationsController {
  constructor(private readonly constellationsService: ConstellationsService) {}

  @Get()
  getSection() {
    return this.constellationsService.getSection();
  }
}
