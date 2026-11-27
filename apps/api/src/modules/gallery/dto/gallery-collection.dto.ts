import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  MaxLength,
  Matches,
  ValidateIf,
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateGalleryCollectionDto {
  @ApiProperty({
    example: "grandes-exploradores-apollo-11",
    required: false,
    description:
      "ID opcional personalizado (UUID generado automáticamente si se omite)",
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: "Grandes Exploradores: El Apollo 11",
    description: "Título de la colección fotográfica",
  })
  @IsNotEmpty({ message: "El título de la colección es obligatorio" })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example: "grandes-exploradores-el-apollo-11",
    required: false,
    description:
      "Slug único de la colección (se autogenera a partir del título si se omite)",
  })
  @IsOptional()
  @ValidateIf((o) => o.slug !== undefined && o.slug !== null && o.slug !== "")
  @IsString()
  @MaxLength(220)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "El slug debe contener solo letras minúsculas, números y guiones medios",
  })
  slug?: string;

  @ApiProperty({
    example:
      "Colección histórica de la llegada de la humanidad a la Luna en 1969.",
    description: "Descripción de la colección",
  })
  @IsNotEmpty({ message: "La descripción de la colección es obligatoria" })
  @IsString()
  @MaxLength(1000)
  description!: string;

  @ApiProperty({
    example: "Misiones Espaciales",
    required: false,
    description: "Categoría temática de la colección",
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;

  @ApiProperty({
    example: ["Apollo", "Luna", "NASA"],
    required: false,
    type: [String],
    description: "Etiquetas de búsqueda para la colección",
  })
  @IsOptional()
  @IsArray({ message: "tags debe ser un arreglo de textos" })
  @IsString({ each: true, message: "Cada tag debe ser una cadena de texto" })
  tags?: string[];

  @ApiProperty({
    example: true,
    required: false,
    default: false,
    description:
      "Indica si la colección debe destacarse en la página principal",
  })
  @IsOptional()
  @IsBoolean({ message: "featured debe ser un valor booleano" })
  featured?: boolean;

  @ApiProperty({
    example: "semanal",
    required: false,
    default: "semanal",
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  rotationFrequency?: string;
}

export class UpdateGalleryCollectionDto extends PartialType(
  CreateGalleryCollectionDto,
) {}
