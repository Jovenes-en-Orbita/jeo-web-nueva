import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import type { CreateApplicationDto as ICreateApplicationDto } from '@jeo/shared';

export class CreateApplicationDto implements ICreateApplicationDto {
  @ApiProperty({ example: 'Mariana López', description: 'Nombre completo del postulante' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  fullName!: string;

  @ApiProperty({ example: 'mariana.lopez@ejemplo.com', description: 'Correo electrónico de contacto' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido' })
  email!: string;

  @ApiProperty({ example: 'redaccion', description: 'Área de postulación: redaccion, diseno o tech' })
  @IsNotEmpty({ message: 'Debes seleccionar un área' })
  @IsString()
  area!: string;

  @ApiProperty({ example: 'Me apasiona la astronomía y me gustaría colaborar...', description: 'Mensaje de motivación' })
  @IsNotEmpty({ message: 'El mensaje de motivación es obligatorio' })
  @IsString()
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
  message!: string;

  @ApiPropertyOptional({ example: 'https://github.com/ejemplo o https://linkedin.com/in/ejemplo', description: 'Enlace opcional al portfolio o perfil profesional' })
  @IsOptional()
  @IsString()
  portfolioUrl?: string;
}
