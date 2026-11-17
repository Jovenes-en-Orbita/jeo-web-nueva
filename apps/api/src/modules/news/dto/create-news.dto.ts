import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsIn,
  Min,
  MaxLength,
  ValidateNested,
  ValidateIf,
  IsDateString,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CreateArticleReferenceDto } from "./article-reference.dto";

export const ALLOWED_ARTICLE_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "borrador",
  "publicado",
  "archivado",
] as const;

export function normalizeArticleStatus(
  value?: string,
): "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined {
  if (!value || typeof value !== "string") return undefined;
  const trimmed = value.trim().toUpperCase();
  if (trimmed === "DRAFT" || trimmed === "BORRADOR") return "DRAFT";
  if (trimmed === "PUBLISHED" || trimmed === "PUBLICADO") return "PUBLISHED";
  if (trimmed === "ARCHIVED" || trimmed === "ARCHIVADO") return "ARCHIVED";
  return trimmed as any;
}

export class CreateNewsDto {
  @ApiProperty({ example: "Nuevo descubrimiento en Marte" })
  @IsNotEmpty({ message: "El título es obligatorio" })
  @IsString()
  @MaxLength(300)
  title!: string;

  @ApiProperty({ example: "El rover Perseverance encuentra indicios..." })
  @IsNotEmpty({ message: "El resumen es obligatorio" })
  @IsString()
  summary!: string;

  @ApiProperty({ example: "/assets/artemis.svg", required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: "2026-03-05T12:00:00.000Z", required: false })
  @IsOptional()
  @ValidateIf((o) => o.date !== undefined && o.date !== null && o.date !== "")
  @IsDateString({}, { message: "La fecha debe tener un formato ISO válido" })
  date?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "El tiempo de lectura debe ser un número" })
  @Min(1, { message: "El tiempo de lectura debe ser de al menos 1 minuto" })
  readTimeMinutes?: number;

  @ApiProperty({ example: "nuevo-descubrimiento-marte" })
  @IsNotEmpty({ message: "El slug es obligatorio" })
  @IsString()
  @MaxLength(320)
  slug!: string;

  @ApiProperty({ example: "# Título del contenido...", required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: "Equipo JEO", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  author?: string;

  @ApiProperty({ example: ["Marte", "NASA"], required: false, type: [String] })
  @IsOptional()
  @IsArray({ message: "tags debe ser un arreglo de textos" })
  @IsString({ each: true, message: "Cada tag debe ser una cadena de texto" })
  tags?: string[];

  @ApiProperty({ example: "Panorámica de Marte", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImageCaption?: string;

  @ApiProperty({
    example: "PUBLISHED",
    enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
    default: "PUBLISHED",
    required: false,
    description:
      "Estado del artículo (DRAFT/borrador, PUBLISHED/publicado, ARCHIVED/archivado)",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? normalizeArticleStatus(value) : value,
  )
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    message:
      "El estado debe ser DRAFT (borrador), PUBLISHED (publicado) o ARCHIVED (archivado)",
  })
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @ApiProperty({
    example: ["550e8400-e29b-41d4-a716-446655440000"],
    required: false,
    type: [String],
    description:
      "Lista de IDs de categorías existentes para asociar al artículo",
  })
  @IsOptional()
  @IsArray({ message: "categoryIds debe ser un arreglo de strings" })
  @IsString({ each: true, message: "Cada categoryId debe ser un string" })
  categoryIds?: string[];

  @ApiProperty({
    example: ["misiones-espaciales", "astrobiologia"],
    required: false,
    type: [String],
    description:
      "Lista de IDs o slugs de categorías existentes para asociar al artículo",
  })
  @IsOptional()
  @IsArray({
    message: "categories debe ser un arreglo de IDs o slugs de categorías",
  })
  @IsString({
    each: true,
    message: "Cada categoría debe ser un ID o slug en texto",
  })
  categories?: string[];

  @ApiProperty({
    type: [CreateArticleReferenceDto],
    required: false,
    description: "Referencias bibliográficas asociadas al artículo",
  })
  @IsOptional()
  @IsArray({
    message: "references debe ser un arreglo de referencias bibliográficas",
  })
  @ValidateNested({ each: true })
  @Type(() => CreateArticleReferenceDto)
  references?: CreateArticleReferenceDto[];
}
