import { Module } from '@nestjs/common';
import { ConstellationsController } from './constellations.controller';
import { ConstellationsService } from './constellations.service';

@Module({
  controllers: [ConstellationsController],
  providers: [ConstellationsService],
})
export class ConstellationsModule {}
