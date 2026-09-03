import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({ example: 'Nuevo descubrimiento en Marte' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'El rover Perseverance encuentra indicios...' })
  @IsNotEmpty({ message: 'El resumen es obligatorio' })
  @IsString()
  summary!: string;

  @ApiProperty({ example: '/assets/artemis.svg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: '2024-03-05', required: false })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  readTimeMinutes?: number;

  @ApiProperty({ example: 'nuevo-descubrimiento-marte' })
  @IsNotEmpty({ message: 'El slug es obligatorio' })
  @IsString()
  slug!: string;

  @ApiProperty({ example: '# Título del contenido...', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'Equipo JEO', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ example: ['Marte', 'NASA'], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ example: 'Panorámica de Marte', required: false })
  @IsOptional()
  @IsString()
  coverImageCaption?: string;
}
