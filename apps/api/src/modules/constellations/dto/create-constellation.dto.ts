import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConstellationDto {
  @ApiProperty({ example: 'Orión' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Orion (El Cazador)', required: false })
  @IsOptional()
  @IsString()
  latinName?: string;

  @ApiProperty({ example: 'Invierno', required: false })
  @IsOptional()
  @IsString()
  season?: string;

  @ApiProperty({ example: 'Ambos', required: false })
  @IsOptional()
  @IsString()
  hemisphere?: string;

  @ApiProperty({ example: 'Constelación prominente...', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Rigel', required: false })
  @IsOptional()
  @IsString()
  brightestStar?: string;

  @ApiProperty({ example: 'Betelgeuse es gigante...', required: false })
  @IsOptional()
  @IsString()
  funFact?: string;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsNumber()
  starsCount?: number;

  @ApiProperty({ example: 'Enero', required: false })
  @IsOptional()
  @IsString()
  bestMonth?: string;

  @ApiProperty({ example: '/assets/orion.svg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'orion' })
  @IsNotEmpty({ message: 'El slug es obligatorio' })
  @IsString()
  slug!: string;
}
