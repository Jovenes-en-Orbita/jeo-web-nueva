import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsArray,
  IsUrl,
  IsDateString,
  IsIn,
  Min,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateGalleryImageDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    required: false,
    nullable: true,
    description:
      "ID de la colección destino. Si se omite o es null, la imagen quedará pendiente de vincular.",
  })
  @IsOptional()
  @ValidateIf(
    (o) =>
      o.collectionId !== null &&
      o.collectionId !== undefined &&
      o.collectionId !== "",
  )
  @IsString()
  collectionId?: string | null;

  @ApiProperty({
    example: "Observatorio espacial bajo el cielo nocturno",
    description: "Título o texto alternativo de la fotografía",
  })
  @IsNotEmpty({ message: "El título/alt de la fotografía es obligatorio" })
  @IsString()
  @MaxLength(300)
  alt!: string;

  @ApiProperty({
    example: "Captura de larga exposición realizada en el hemisferio sur.",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  caption?: string;

  @ApiProperty({
    example: "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  url?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "order debe ser un número entero" })
  @Min(0, { message: "order no puede ser negativo" })
  order?: number;

  @ApiProperty({
    example: ["Nebulosa", "Cielo Profundo"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: "NASA / ESA / CSA", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  photographer?: string;

  @ApiProperty({
    example: "James Webb Space Telescope (NIRCam)",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  telescope?: string;

  @ApiProperty({ example: "ZWO ASI2600MC Pro", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  camera?: string;

  @ApiProperty({ example: "120s x 45 frames (90 min)", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  exposureTime?: string;

  @ApiProperty({ example: "Desierto de Atacama", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiProperty({ example: "2026-07-12T03:30:00.000Z", required: false })
  @IsOptional()
  @ValidateIf(
    (o) =>
      o.capturedAt !== undefined &&
      o.capturedAt !== null &&
      o.capturedAt !== "",
  )
  @IsDateString({}, { message: "capturedAt debe ser una fecha ISO válida" })
  capturedAt?: string;

  @ApiProperty({
    example: "https://images.nasa.gov/details/PIA12348",
    required: false,
  })
  @IsOptional()
  @ValidateIf(
    (o) =>
      o.creditUrl !== undefined && o.creditUrl !== null && o.creditUrl !== "",
  )
  @IsUrl(
    { require_protocol: true },
    { message: "creditUrl debe ser una URL válida con protocolo http/https" },
  )
  @MaxLength(2048)
  creditUrl?: string;
}

export class UpdateGalleryImageDto extends PartialType(CreateGalleryImageDto) {
  @ApiProperty({
    example: "LINKED",
    enum: ["LINKED", "PENDING", "IGNORED"],
    required: false,
  })
  @IsOptional()
  @IsIn(["LINKED", "PENDING", "IGNORED"], {
    message: "status debe ser LINKED, PENDING o IGNORED",
  })
  status?: "LINKED" | "PENDING" | "IGNORED";
}

export class AssignGalleryImageDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "ID de la colección a la cual vincular la imagen pendiente",
  })
  @IsNotEmpty({
    message: "collectionId es obligatorio para vincular la imagen",
  })
  @IsString()
  collectionId!: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}
