import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsIn,
  IsArray,
  IsBoolean,
  ValidateIf,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

function parseStringArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const raw = Array.isArray(value) ? value : [value];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      out.push(
        ...item
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
    }
  }
  return out.length > 0 ? Array.from(new Set(out)) : [];
}

function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (lower === "true" || lower === "1") return true;
    if (lower === "false" || lower === "0") return false;
  }
  return value as boolean;
}

export class GalleryCollectionsQueryDto {
  @ApiPropertyOptional({
    description: "Búsqueda parcial por título o descripción de la colección",
    example: "Apollo",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Filtro por categoría temática de la colección",
    example: "Misiones Espaciales",
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description:
      "Filtro por uno o varios tags (separados por comas o repetidos)",
    type: [String],
    example: ["Luna", "NASA"],
  })
  @IsOptional()
  @Transform(({ value }) => parseStringArray(value))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: "Filtrar solo colecciones destacadas",
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: "Campo de ordenamiento",
    enum: ["createdAt", "title"],
    default: "createdAt",
  })
  @IsOptional()
  @IsIn(["createdAt", "title"], {
    message: 'sortBy debe ser "createdAt" o "title"',
  })
  sortBy?: "createdAt" | "title";

  @ApiPropertyOptional({
    description: "Dirección del ordenamiento",
    enum: ["asc", "desc"],
    default: "desc",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  )
  @IsIn(["asc", "desc"], { message: 'sortOrder debe ser "asc" o "desc"' })
  sortOrder?: "asc" | "desc";

  @ApiPropertyOptional({ description: "Número de página (>= 1)", example: 1 })
  @IsOptional()
  @ValidateIf((o) => o.page !== undefined && o.page !== "")
  @Type(() => Number)
  @IsInt({ message: "page debe ser un número entero" })
  @Min(1, { message: "page debe ser mayor o igual a 1" })
  page?: number;

  @ApiPropertyOptional({
    description: "Resultados por página (1..100)",
    example: 6,
  })
  @IsOptional()
  @ValidateIf((o) => o.limit !== undefined && o.limit !== "")
  @Type(() => Number)
  @IsInt({ message: "limit debe ser un número entero" })
  @Min(1, { message: "limit debe ser mayor o igual a 1" })
  @Max(100, { message: "limit no puede superar 100" })
  limit?: number;
}

export class GalleryImagesQueryDto {
  @ApiPropertyOptional({
    description: "Búsqueda en título/alt, caption o fotógrafo",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Filtro por estado de vinculación",
    enum: ["LINKED", "PENDING", "IGNORED"],
  })
  @IsOptional()
  @IsIn(["LINKED", "PENDING", "IGNORED"])
  status?: "LINKED" | "PENDING" | "IGNORED";

  @ApiPropertyOptional({
    description: "Filtro por origen de la imagen",
    enum: [
      "MANUAL",
      "NEWS",
      "UNIVERSE",
      "SOLAR_SYSTEM",
      "CONSTELLATION",
      "SITE_ASSET",
    ],
  })
  @IsOptional()
  @IsIn([
    "MANUAL",
    "NEWS",
    "UNIVERSE",
    "SOLAR_SYSTEM",
    "CONSTELLATION",
    "SITE_ASSET",
  ])
  sourceType?:
    | "MANUAL"
    | "NEWS"
    | "UNIVERSE"
    | "SOLAR_SYSTEM"
    | "CONSTELLATION"
    | "SITE_ASSET";

  @ApiPropertyOptional({ description: "Número de página (>= 1)", example: 1 })
  @IsOptional()
  @ValidateIf((o) => o.page !== undefined && o.page !== "")
  @Type(() => Number)
  @IsInt({ message: "page debe ser un número entero" })
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: "Resultados por página (1..100)",
    example: 12,
  })
  @IsOptional()
  @ValidateIf((o) => o.limit !== undefined && o.limit !== "")
  @Type(() => Number)
  @IsInt({ message: "limit debe ser un número entero" })
  @Min(1)
  @Max(100)
  limit?: number;
}
