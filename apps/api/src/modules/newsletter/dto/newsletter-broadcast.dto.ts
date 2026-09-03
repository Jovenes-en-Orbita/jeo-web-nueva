import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NewsletterBroadcastDto as INewsletterBroadcastDto } from '@jeo/shared';

export class NewsletterBroadcastDto implements INewsletterBroadcastDto {
  @ApiProperty({ example: '🚀 Edición #42: Novedades de Artemis y el James Webb' })
  @IsNotEmpty({ message: 'El asunto es obligatorio' })
  @IsString()
  subject!: string;

  @ApiProperty({ example: 'Resumen Semanal de Astrofísica y Exploración' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Estimada comunidad de exploradores, esta semana destacamos...' })
  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  @IsString()
  content!: string;
}
