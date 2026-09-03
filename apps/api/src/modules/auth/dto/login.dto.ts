import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginDto as ILoginDto } from '@jeo/shared';

export class LoginDto implements ILoginDto {
  @ApiProperty({ example: 'admin@jovenesenorbita.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email!: string;

  @ApiProperty({ example: 'admin1234' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}
