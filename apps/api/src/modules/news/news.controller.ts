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
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import type {
  NewsArticle,
  NewsCategory,
  ArticleReference,
  PaginatedNewsResponse,
} from "@jeo/shared";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import {
  CreateArticleReferenceDto,
  UpdateArticleReferenceDto,
} from "./dto/article-reference.dto";
import { NewsQueryDto, parseBooleanParam } from "./dto/news-query.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("news")
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // ══════════════════════════════════════════════════════════════════════════
  // ── Búsqueda, Filtrado y Catálogos Auxiliares ──
  // ══════════════════════════════════════════════════════════════════════════

  @Get()
  @ApiOperation({
    summary:
      "Obtener y filtrar noticias (título, categorías, tags, tiempo de lectura, fechas, estado, ordenamiento y paginación)",
  })
  @ApiResponse({
    status: 200,
    description:
      "Lista de noticias o respuesta paginada cuando se especifica page/limit",
  })
  async findAll(
    @Query() query: NewsQueryDto,
  ): Promise<PaginatedNewsResponse | NewsArticle[]> {
    return this.newsService.findAll(query);
  }

  @Get("search")
  @ApiOperation({
    summary:
      "Búsqueda avanzada paginada de noticias con combinación de múltiples filtros y metadatos de paginación",
  })
  @ApiResponse({
    status: 200,
    description:
      "Resultados paginados con data, total, page, limit y totalPages",
  })
  async search(@Query() query: NewsQueryDto): Promise<PaginatedNewsResponse> {
    return this.newsService.search(query);
  }

  @Get("tags")
  @ApiOperation({
    summary: "Obtener todos los tags únicos disponibles en noticias",
  })
  @ApiResponse({
    status: 200,
    description: "Lista ordenada de tags disponibles",
  })
  async findAvailableTags(): Promise<string[]> {
    return this.newsService.findAvailableTags();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Administración y Consulta de Categorías (`Category`) ──
  // ══════════════════════════════════════════════════════════════════════════

  @Get("categories")
  @ApiOperation({
    summary: "Obtener todas las categorías de noticias disponibles",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de categorías con conteo de artículos",
  })
  async findAllCategories(): Promise<NewsCategory[]> {
    return this.newsService.findAllCategories();
  }

  @Get("categories/:idOrSlug")
  @ApiOperation({ summary: "Obtener una categoría por su ID o slug" })
  @ApiParam({
    name: "idOrSlug",
    description: "UUID o slug único de la categoría",
  })
  @ApiResponse({ status: 200, description: "Categoría encontrada" })
  @ApiResponse({ status: 404, description: "Categoría no encontrada" })
  async findCategory(
    @Param("idOrSlug") idOrSlug: string,
  ): Promise<NewsCategory> {
    return this.newsService.findCategoryByIdOrSlug(idOrSlug);
  }

  @Post("categories")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear una nueva categoría de noticias (Admin)" })
  @ApiResponse({ status: 201, description: "Categoría creada exitosamente" })
  @ApiResponse({
    status: 409,
    description: "Categoría duplicada (nombre o slug)",
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<NewsCategory> {
    return this.newsService.createCategory(createCategoryDto);
  }

  @Patch("categories/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar una categoría existente (Admin)" })
  @ApiResponse({
    status: 200,
    description: "Categoría actualizada exitosamente",
  })
  @ApiResponse({ status: 404, description: "Categoría no encontrada" })
  @ApiResponse({
    status: 409,
    description: "Conflicto de nombre o slug duplicado",
  })
  async updateCategory(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<NewsCategory> {
    return this.newsService.updateCategory(id, updateCategoryDto);
  }

  @Delete("categories/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar una categoría de noticias (Admin)" })
  @ApiResponse({ status: 200, description: "Categoría eliminada exitosamente" })
  @ApiResponse({ status: 404, description: "Categoría no encontrada" })
  async deleteCategory(@Param("id") id: string) {
    return this.newsService.deleteCategory(id);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Gestión de Referencias Bibliográficas (`ArticleReference`) ──
  // ══════════════════════════════════════════════════════════════════════════

  @Get(":articleId/references")
  @ApiOperation({
    summary: "Obtener las referencias bibliográficas de un artículo",
  })
  @ApiParam({ name: "articleId", description: "ID del artículo" })
  @ApiResponse({
    status: 200,
    description: "Lista de referencias bibliográficas del artículo",
  })
  async findArticleReferences(
    @Param("articleId") articleId: string,
  ): Promise<ArticleReference[]> {
    return this.newsService.findArticleReferences(articleId);
  }

  @Post(":articleId/references")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Agregar una referencia bibliográfica a un artículo (Admin)",
  })
  @ApiResponse({ status: 201, description: "Referencia creada exitosamente" })
  async addArticleReference(
    @Param("articleId") articleId: string,
    @Body() createReferenceDto: CreateArticleReferenceDto,
  ): Promise<ArticleReference> {
    return this.newsService.addArticleReference(articleId, createReferenceDto);
  }

  @Patch(":articleId/references/:referenceId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Actualizar una referencia bibliográfica de un artículo (Admin)",
  })
  @ApiResponse({
    status: 200,
    description: "Referencia actualizada exitosamente",
  })
  async updateArticleReference(
    @Param("articleId") articleId: string,
    @Param("referenceId") referenceId: string,
    @Body() updateReferenceDto: UpdateArticleReferenceDto,
  ): Promise<ArticleReference> {
    return this.newsService.updateArticleReference(
      articleId,
      referenceId,
      updateReferenceDto,
    );
  }

  @Delete(":articleId/references/:referenceId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Eliminar una referencia bibliográfica de un artículo (Admin)",
  })
  @ApiResponse({
    status: 200,
    description: "Referencia eliminada exitosamente",
  })
  async deleteArticleReference(
    @Param("articleId") articleId: string,
    @Param("referenceId") referenceId: string,
  ) {
    return this.newsService.deleteArticleReference(articleId, referenceId);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Detalle y CRUD de Artículos (`NewsArticle`) ──
  // ══════════════════════════════════════════════════════════════════════════

  @Get(":slug")
  @ApiOperation({
    summary:
      "Obtener una noticia por su slug (con control opcional de relaciones incluidas)",
  })
  @ApiQuery({
    name: "include",
    required: false,
    type: String,
    description:
      'Relaciones a incluir: "categories,references", "categories", "references", "all" o "none"',
  })
  @ApiQuery({ name: "includeCategories", required: false, type: Boolean })
  @ApiQuery({ name: "includeReferences", required: false, type: Boolean })
  @ApiResponse({ status: 200, description: "Noticia encontrada" })
  @ApiResponse({ status: 404, description: "Noticia no encontrada" })
  async findBySlug(
    @Param("slug") slug: string,
    @Query("include") include?: string,
    @Query("includeCategories") includeCategories?: string,
    @Query("includeReferences") includeReferences?: string,
  ): Promise<NewsArticle> {
    return this.newsService.findBySlug(slug, {
      include,
      includeCategories: parseBooleanParam(includeCategories),
      includeReferences: parseBooleanParam(includeReferences),
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Crear una nueva noticia con categorías y referencias bibliográficas (Admin)",
  })
  @ApiResponse({ status: 201, description: "Noticia creada exitosamente" })
  async create(@Body() createNewsDto: CreateNewsDto): Promise<NewsArticle> {
    return this.newsService.create(createNewsDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Actualizar una noticia existente, incluyendo sus categorías y referencias bibliográficas (Admin)",
  })
  @ApiResponse({ status: 200, description: "Noticia actualizada exitosamente" })
  async update(
    @Param("id") id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<NewsArticle> {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Eliminar una noticia y limpiar sus relaciones (Admin)",
  })
  @ApiResponse({ status: 200, description: "Noticia eliminada exitosamente" })
  async delete(@Param("id") id: string) {
    return this.newsService.delete(id);
  }
}
