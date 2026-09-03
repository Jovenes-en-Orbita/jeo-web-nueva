import { PartialType } from '@nestjs/swagger';
import { CreateConstellationDto } from './create-constellation.dto';

export class UpdateConstellationDto extends PartialType(CreateConstellationDto) {}
