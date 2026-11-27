import { PartialType, OmitType, ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateNewsDto } from "./create-news.dto";
import {
  CreateArticleReferenceDto,
  UpdateArticleReferenceDto,
} from "./article-reference.dto";

export class UpdateNewsDto extends PartialType(
  OmitType(CreateNewsDto, ["references"] as const),
) {
  @ApiProperty({
    example: ["misiones-espaciales"],
    required: false,
    type: [String],
    description:
      "IDs o slugs de categorías a agregar sin remover las existentes",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addCategoryIds?: string[];

  @ApiProperty({
    example: ["astrobiologia"],
    required: false,
    type: [String],
    description: "IDs o slugs de categorías a desvincular del artículo",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removeCategoryIds?: string[];

  @ApiProperty({
    type: [UpdateArticleReferenceDto],
    required: false,
    description:
      "Sincronización declarativa de referencias del artículo: actualiza las que tienen id existente, crea las nuevas sin id y elimina las omitidas.",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateArticleReferenceDto)
  references?: UpdateArticleReferenceDto[];

  @ApiProperty({
    type: [CreateArticleReferenceDto],
    required: false,
    description:
      "Nuevas referencias bibliográficas a agregar al artículo manteniendo las actuales",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArticleReferenceDto)
  addReferences?: CreateArticleReferenceDto[];

  @ApiProperty({
    type: [UpdateArticleReferenceDto],
    required: false,
    description:
      "Referencias existentes del artículo a actualizar parcialmente por su id",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateArticleReferenceDto)
  updateReferences?: UpdateArticleReferenceDto[];

  @ApiProperty({
    example: ["550e8400-e29b-41d4-a716-446655440000"],
    required: false,
    type: [String],
    description:
      "IDs de referencias bibliográficas específicas a eliminar del artículo",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removeReferenceIds?: string[];
}
