import { Module } from '@nestjs/common';
import { SolarSystemController } from './solar-system.controller';
import { SolarSystemService } from './solar-system.service';

@Module({
  controllers: [SolarSystemController],
  providers: [SolarSystemService],
})
export class SolarSystemModule {}
