import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsIn,
  IsDateString,
  IsArray,
  IsBoolean,
  ValidateIf,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { normalizeArticleStatus } from "./create-news.dto";

export function parseStringArrayParam(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const rawList = Array.isArray(value) ? value : [value];
  const result: string[] = [];
  for (const item of rawList) {
    if (typeof item === "string") {
      const parts = item
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      result.push(...parts);
    }
  }
  return result.length > 0 ? Array.from(new Set(result)) : [];
}

export function parseBooleanParam(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (lower === "true" || lower === "1") return true;
    if (lower === "false" || lower === "0") return false;
  }
  return value as boolean;
}

export class NewsQueryDto {
  @ApiPropertyOptional({
    description:
      "Búsqueda parcial por título (insensible a mayúsculas y minúsculas)",
    example: "NASA",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description:
      "Búsqueda general en título, resumen y autor (insensible a mayúsculas y minúsculas)",
    example: "Artemis",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description:
      "Filtro por una categoría (ID o slug) o lista separada por comas",
    example: "espacio",
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description:
      "Filtro por uno o varios IDs o slugs de categorías (repetido o separado por comas)",
    type: [String],
    example: ["espacio", "misiones-espaciales"],
  })
  @IsOptional()
  @Transform(({ value }) => parseStringArrayParam(value))
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    description: "Filtro por uno o varios IDs de categoría",
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => parseStringArrayParam(value))
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: "Filtro por uno o varios slugs de categoría",
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => parseStringArrayParam(value))
  @IsArray()
  @IsString({ each: true })
  categorySlugs?: string[];

  @ApiPropertyOptional({
    description:
      'Modo de coincidencia cuando se filtran múltiples categorías: "any" (al menos una) o "all" (todas)',
    enum: ["any", "all"],
    default: "any",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  )
  @IsIn(["any", "all"], { message: 'categoryMatch debe ser "any" o "all"' })
  categoryMatch?: "any" | "all";

  @ApiPropertyOptional({
    description: "Filtro por un tag o lista de tags separados por comas",
    example: "Luna",
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: "Filtro por uno o varios tags (repetido o separado por comas)",
    type: [String],
    example: ["NASA", "Luna"],
  })
  @IsOptional()
  @Transform(({ value }) => parseStringArrayParam(value))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description:
      'Modo de coincidencia para múltiples tags: "any" (al menos uno) o "all" (todos)',
    enum: ["any", "all"],
    default: "any",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  )
  @IsIn(["any", "all"], { message: 'tagMatch debe ser "any" o "all"' })
  tagMatch?: "any" | "all";

  @ApiPropertyOptional({
    description: "Tiempo exacto estimado de lectura en minutos",
    example: 5,
  })
  @IsOptional()
  @ValidateIf(
    (o) => o.readTimeMinutes !== undefined && o.readTimeMinutes !== "",
  )
  @Type(() => Number)
  @IsInt({ message: "readTimeMinutes debe ser un número entero" })
  @Min(1, { message: "readTimeMinutes debe ser mayor o igual a 1" })
  readTimeMinutes?: number;

  @ApiPropertyOptional({
    description: "Tiempo mínimo estimado de lectura en minutos (>=)",
    example: 2,
  })
  @IsOptional()
  @ValidateIf((o) => o.minReadTime !== undefined && o.minReadTime !== "")
  @Type(() => Number)
  @IsInt({ message: "minReadTime debe ser un número entero" })
  @Min(0, { message: "minReadTime no puede ser negativo" })
  minReadTime?: number;

  @ApiPropertyOptional({
    description: "Tiempo máximo estimado de lectura en minutos (<=)",
    example: 5,
  })
  @IsOptional()
  @ValidateIf((o) => o.maxReadTime !== undefined && o.maxReadTime !== "")
  @Type(() => Number)
  @IsInt({ message: "maxReadTime debe ser un número entero" })
  @Min(1, { message: "maxReadTime debe ser mayor o igual a 1" })
  maxReadTime?: number;

  @ApiPropertyOptional({
    description: "Fecha inicial de publicación en formato ISO 8601 (>=)",
    example: "2026-01-01",
  })
  @IsOptional()
  @ValidateIf((o) => o.dateFrom !== undefined && o.dateFrom !== "")
  @IsDateString(
    {},
    { message: "dateFrom debe tener un formato de fecha ISO válido" },
  )
  dateFrom?: string;

  @ApiPropertyOptional({
    description: "Fecha final de publicación en formato ISO 8601 (<=)",
    example: "2026-12-31",
  })
  @IsOptional()
  @ValidateIf((o) => o.dateTo !== undefined && o.dateTo !== "")
  @IsDateString(
    {},
    { message: "dateTo debe tener un formato de fecha ISO válido" },
  )
  dateTo?: string;

  @ApiPropertyOptional({
    description:
      "Filtro por estado del artículo (DRAFT/borrador, PUBLISHED/publicado, ARCHIVED/archivado)",
    type: [String],
    example: ["PUBLISHED"],
  })
  @IsOptional()
  @Transform(({ value }) => {
    const arr = parseStringArrayParam(value);
    if (!arr) return undefined;
    return arr.map((v) => normalizeArticleStatus(v) ?? v);
  })
  @IsArray()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    each: true,
    message:
      "Cada estado debe ser DRAFT (borrador), PUBLISHED (publicado) o ARCHIVED (archivado)",
  })
  status?: Array<"DRAFT" | "PUBLISHED" | "ARCHIVED">;

  @ApiPropertyOptional({
    description:
      "Filtro parcial por nombre de autor (insensible a mayúsculas/minúsculas)",
    example: "Equipo JEO",
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: "Campo por el cual ordenar los resultados",
    enum: ["date", "title", "readTimeMinutes"],
    default: "date",
  })
  @IsOptional()
  @IsIn(["date", "title", "readTimeMinutes"], {
    message: 'sortBy debe ser "date", "title" o "readTimeMinutes"',
  })
  sortBy?: "date" | "title" | "readTimeMinutes";

  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento ("asc" o "desc")',
    enum: ["asc", "desc"],
    default: "desc",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  )
  @IsIn(["asc", "desc"], { message: 'sortOrder debe ser "asc" o "desc"' })
  sortOrder?: "asc" | "desc";

  @ApiPropertyOptional({
    description: "Número de página (comenzando en 1)",
    example: 1,
  })
  @IsOptional()
  @ValidateIf((o) => o.page !== undefined && o.page !== "")
  @Type(() => Number)
  @IsInt({ message: "page debe ser un número entero" })
  @Min(1, { message: "page debe ser mayor o igual a 1" })
  page?: number;

  @ApiPropertyOptional({
    description: "Cantidad de resultados por página (máximo 100)",
    example: 10,
  })
  @IsOptional()
  @ValidateIf((o) => o.limit !== undefined && o.limit !== "")
  @Type(() => Number)
  @IsInt({ message: "limit debe ser un número entero" })
  @Min(1, { message: "limit debe ser mayor o igual a 1" })
  @Max(100, { message: "limit no puede superar los 100 elementos por página" })
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Control de relaciones a incluir en la respuesta: "categories,references", "categories", "references", "all" o "none"',
    example: "categories,references",
  })
  @IsOptional()
  @IsString()
  include?: string;

  @ApiPropertyOptional({
    description:
      "Indica si se deben incluir las categorías del artículo en la respuesta",
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => parseBooleanParam(value))
  @IsBoolean({
    message: "includeCategories debe ser un valor booleano (true/false)",
  })
  includeCategories?: boolean;

  @ApiPropertyOptional({
    description:
      "Indica si se deben incluir las referencias bibliográficas en la respuesta",
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => parseBooleanParam(value))
  @IsBoolean({
    message: "includeReferences debe ser un valor booleano (true/false)",
  })
  includeReferences?: boolean;
}
