import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import type { SubscribeNewsletterDto as ISubscribeNewsletterDto } from '@jeo/shared';

export class SubscribeNewsletterDto implements ISubscribeNewsletterDto {
  @ApiProperty({
    example: 'astronomo@ejemplo.com',
    description: 'Dirección de correo electrónico válida del suscriptor',
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'Por favor ingresa un correo electrónico válido' })
  email!: string;
}
