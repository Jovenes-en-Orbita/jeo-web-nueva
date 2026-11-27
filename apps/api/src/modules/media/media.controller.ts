import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MediaService, FreeImageResult } from "./media.service";
import { StorageService } from "./storage.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

class PresignUploadDto {
  @IsNotEmpty({ message: "filename es obligatorio" })
  @IsString()
  filename!: string;

  @IsNotEmpty({ message: "contentType es obligatorio" })
  @IsString()
  contentType!: string;

  @IsOptional()
  @IsString()
  folder?: string;
}

@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
  ) {}

  @Get("search")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @ApiOperation({
    summary:
      "Buscar imágenes espaciales gratuitas y libres de derechos (NASA / Unsplash)",
  })
  @ApiQuery({
    name: "query",
    required: false,
    type: String,
    description: "Término de búsqueda (ej: mars, nebula, telescope)",
  })
  @ApiResponse({ status: 200, description: "Lista de imágenes encontradas" })
  async searchImages(
    @Query("query") query?: string,
  ): Promise<FreeImageResult[]> {
    return this.mediaService.searchImages(query);
  }

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB (compatible con límite serverless de Vercel)
    }),
  )
  @ApiOperation({
    summary: "Subir archivo de imagen a Neon Object Storage (Admin)",
  })
  @ApiResponse({ status: 201, description: "Archivo subido exitosamente" })
  async uploadFile(
    @UploadedFile() file?: Express.Multer.File,
    @Query("folder") folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Debes adjuntar un archivo en el campo "file"',
      );
    }

    return this.storageService.uploadBuffer({
      buffer: file.buffer,
      originalName: file.originalname,
      contentType: file.mimetype || "application/octet-stream",
      folder: folder || "gallery",
    });
  }

  @Post("presign-upload")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Generar URL prefirmada (PUT) para subir archivos grandes directamente a Neon Object Storage (Admin)",
  })
  @ApiResponse({ status: 201, description: "URL prefirmada generada" })
  async presignUpload(@Body() dto: PresignUploadDto) {
    return this.storageService.getPresignedUploadUrl({
      filename: dto.filename,
      contentType: dto.contentType,
      folder: dto.folder || "gallery",
    });
  }

  @Get("signed-url")
  @ApiOperation({
    summary:
      "Generar URL firmada temporal para visualizar un objeto de Neon Object Storage",
  })
  @ApiQuery({ name: "key", required: true, type: String })
  @ApiResponse({ status: 200, description: "URL firmada generada" })
  async getSignedUrl(@Query("key") key: string) {
    const url = await this.storageService.getSignedReadUrl(key);
    return { key, url };
  }

  @Delete("object")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Eliminar un objeto de Neon Object Storage (Admin)",
  })
  @ApiQuery({ name: "key", required: true, type: String })
  @ApiResponse({ status: 200, description: "Objeto eliminado" })
  async deleteObject(@Query("key") key: string) {
    return this.storageService.deleteObject(key);
  }
}
