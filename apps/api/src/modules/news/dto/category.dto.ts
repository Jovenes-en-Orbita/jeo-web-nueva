import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  ValidateIf,
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({
    example: "Misiones Espaciales",
    description: "Nombre único de la categoría",
  })
  @IsNotEmpty({ message: "El nombre de la categoría es obligatorio" })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    example: "misiones-espaciales",
    required: false,
    description:
      "Slug único en formato kebab-case (se autogenera si no se provee)",
  })
  @IsOptional()
  @ValidateIf((o) => o.slug !== undefined && o.slug !== null && o.slug !== "")
  @IsString()
  @MaxLength(140)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "El slug debe contener solo letras minúsculas, números y guiones medios",
  })
  slug?: string;

  @ApiProperty({
    example:
      "Artículos sobre lanzamientos, sondas y exploración espacial tripulada y robótica.",
    required: false,
    description: "Descripción opcional de la categoría",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
