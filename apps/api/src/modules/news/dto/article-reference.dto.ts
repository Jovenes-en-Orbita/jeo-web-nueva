import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsDateString,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateArticleReferenceDto {
  @ApiProperty({
    example: "GuoWang Expands Again via Latest Wenchang Launch Mission",
    description: "Título de la obra, publicación o fuente bibliográfica",
  })
  @IsNotEmpty({ message: "El título de la referencia es obligatorio" })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiProperty({
    example: "Gillinger, G.",
    required: false,
    description: "Autor o autores de la referencia",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  author?: string;

  @ApiProperty({
    example: "https://www.thespacereview.com/article/5004/1",
    required: false,
    description:
      "URL de la fuente bibliográfica (debe incluir protocolo http/https)",
  })
  @IsOptional()
  @ValidateIf((o) => o.url !== undefined && o.url !== null && o.url !== "")
  @IsUrl(
    { require_protocol: true },
    {
      message:
        "La URL de la referencia debe ser una dirección web válida con protocolo (http/https)",
    },
  )
  @MaxLength(2048)
  url?: string;

  @ApiProperty({
    example: "The Space Review",
    required: false,
    description: "Editorial, revista o portal que publica la fuente",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  publisher?: string;

  @ApiProperty({
    example: "2025-06-16T00:00:00.000Z",
    required: false,
    description: "Fecha de publicación de la fuente original (ISO 8601)",
  })
  @IsOptional()
  @ValidateIf(
    (o) =>
      o.publishedAt !== undefined &&
      o.publishedAt !== null &&
      o.publishedAt !== "",
  )
  @IsDateString(
    {},
    { message: "publishedAt debe tener un formato de fecha ISO válido" },
  )
  publishedAt?: string;

  @ApiProperty({
    example: "2026-09-23T12:00:00.000Z",
    required: false,
    description: "Fecha en que se consultó la fuente (ISO 8601)",
  })
  @IsOptional()
  @ValidateIf(
    (o) =>
      o.accessedAt !== undefined &&
      o.accessedAt !== null &&
      o.accessedAt !== "",
  )
  @IsDateString(
    {},
    { message: "accessedAt debe tener un formato de fecha ISO válido" },
  )
  accessedAt?: string;
}

export class UpdateArticleReferenceDto extends PartialType(
  CreateArticleReferenceDto,
) {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    required: false,
    description:
      "ID de la referencia existente (cuando se actualiza desde el artículo)",
  })
  @IsOptional()
  @IsString()
  id?: string;
}
