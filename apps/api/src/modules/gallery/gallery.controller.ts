import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import type {
  GalleryCollection,
  GalleryImage,
  PaginatedGalleryCollectionsResponse,
  PaginatedGalleryCollectionDetailResponse,
  PaginatedGalleryImagesResponse,
} from "@jeo/shared";
import { GalleryService } from "./gallery.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  CreateGalleryCollectionDto,
  UpdateGalleryCollectionDto,
} from "./dto/gallery-collection.dto";
import {
  CreateGalleryImageDto,
  UpdateGalleryImageDto,
  AssignGalleryImageDto,
} from "./dto/gallery-image.dto";
import {
  GalleryCollectionsQueryDto,
  GalleryImagesQueryDto,
} from "./dto/gallery-query.dto";

@ApiTags("gallery")
@Controller("gallery")
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // ══════════════════════════════════════════════════════════════════════════
  // ── Consultas Públicas ──
  // ══════════════════════════════════════════════════════════════════════════

  @Get("featured")
  @ApiOperation({
    summary: "Obtener la colección fotográfica destacada actual",
  })
  @ApiResponse({ status: 200, description: "Colección destacada" })
  async getFeatured(): Promise<GalleryCollection> {
    return this.galleryService.getFeaturedCollection();
  }

  @Get("collections")
  @ApiOperation({
    summary:
      "Buscar y listar colecciones fotográficas con paginación horizontal (grid 2x3)",
  })
  @ApiResponse({ status: 200, description: "Lista paginada de colecciones" })
  async searchCollections(
    @Query() query: GalleryCollectionsQueryDto,
  ): Promise<PaginatedGalleryCollectionsResponse> {
    return this.galleryService.searchCollections(query);
  }

  @Get("collections/:idOrSlug")
  @ApiOperation({
    summary:
      "Obtener el detalle de una colección y sus fotografías paginadas (grid 4x3)",
  })
  @ApiParam({ name: "idOrSlug", description: "UUID o slug de la colección" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Detalle de colección con fotos paginadas",
  })
  @ApiResponse({ status: 404, description: "Colección no encontrada" })
  async getCollectionDetail(
    @Param("idOrSlug") idOrSlug: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<PaginatedGalleryCollectionDetailResponse> {
    return this.galleryService.getCollectionByIdOrSlug(idOrSlug, page, limit);
  }

  @Get()
  @ApiOperation({
    summary:
      "Obtener todas las colecciones de la galería (con filtros y paginación opcional)",
  })
  @ApiResponse({ status: 200, description: "Lista de colecciones" })
  async getAll(
    @Query() query: GalleryCollectionsQueryDto,
  ): Promise<GalleryCollection[] | PaginatedGalleryCollectionsResponse> {
    return this.galleryService.getAllCollections(query);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Administración de Colecciones (Admin) ──
  // ══════════════════════════════════════════════════════════════════════════

  @Post("collections")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear una colección fotográfica (Admin)" })
  @ApiResponse({ status: 201, description: "Colección creada" })
  async createCollection(
    @Body() dto: CreateGalleryCollectionDto,
  ): Promise<GalleryCollection> {
    return this.galleryService.createCollection(dto);
  }

  @Patch("collections/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar una colección fotográfica (Admin)" })
  @ApiResponse({ status: 200, description: "Colección actualizada" })
  async updateCollection(
    @Param("id") id: string,
    @Body() dto: UpdateGalleryCollectionDto,
  ): Promise<GalleryCollection> {
    return this.galleryService.updateCollection(id, dto);
  }

  @Delete("collections/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Eliminar una colección fotográfica moviendo sus imágenes a pendientes de vincular (Admin)",
  })
  @ApiResponse({ status: 200, description: "Colección eliminada" })
  async deleteCollection(@Param("id") id: string) {
    return this.galleryService.deleteCollection(id);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Administración de Imágenes y Bandeja de Pendientes (Admin) ──
  // ══════════════════════════════════════════════════════════════════════════

  @Get("images/pending")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Obtener imágenes pendientes de vincular a una colección (ej. provenientes de Noticias) (Admin)",
  })
  @ApiResponse({
    status: 200,
    description: "Lista paginada de imágenes pendientes",
  })
  async getPendingImages(
    @Query() query: GalleryImagesQueryDto,
  ): Promise<PaginatedGalleryImagesResponse> {
    return this.galleryService.getPendingImages(query);
  }

  @Post("images")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Añadir una fotografía con metadatos astrofotográficos (a colección o como pendiente) (Admin)",
  })
  @ApiResponse({ status: 201, description: "Fotografía añadida" })
  async addImage(@Body() dto: CreateGalleryImageDto): Promise<GalleryImage> {
    return this.galleryService.addImage(dto);
  }

  @Patch("images/:id/assign")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Vincular una imagen pendiente a una colección destino (Admin)",
  })
  @ApiResponse({ status: 200, description: "Fotografía vinculada" })
  async assignImage(
    @Param("id") id: string,
    @Body() dto: AssignGalleryImageDto,
  ): Promise<GalleryImage> {
    return this.galleryService.assignImageToCollection(id, dto);
  }

  @Patch("images/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Actualizar una fotografía o sus metadatos astrofotográficos (Admin)",
  })
  @ApiResponse({ status: 200, description: "Fotografía actualizada" })
  async updateImage(
    @Param("id") id: string,
    @Body() dto: UpdateGalleryImageDto,
  ): Promise<GalleryImage> {
    return this.galleryService.updateImage(id, dto);
  }

  @Delete("images/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar una fotografía (Admin)" })
  @ApiResponse({ status: 200, description: "Fotografía eliminada" })
  async deleteImage(@Param("id") id: string) {
    return this.galleryService.deleteImage(id);
  }

  @Post("sync-site-assets")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Sincronizar imágenes del sitio (Sistema Solar, Universo, Constelaciones) y noticias hacia la galería (Admin)",
  })
  @ApiResponse({ status: 201, description: "Sincronización completada" })
  async syncSiteAssets() {
    return this.galleryService.syncSiteAssets();
  }
}
