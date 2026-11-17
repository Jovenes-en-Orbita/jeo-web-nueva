import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { GUARDS_METADATA } from "@nestjs/common/constants";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { NewsQueryDto } from "./dto/news-query.dto";
import { CreateNewsDto } from "./dto/create-news.dto";

describe("NewsController", () => {
  let controller: NewsController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue([]),
      search: jest.fn().mockResolvedValue({
        data: [],
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
      findAvailableTags: jest.fn().mockResolvedValue(["NASA", "Luna"]),
      findAllCategories: jest
        .fn()
        .mockResolvedValue([
          { id: "cat-1", name: "Espacio", slug: "espacio", articleCount: 3 },
        ]),
      findCategoryByIdOrSlug: jest.fn().mockResolvedValue({
        id: "cat-1",
        name: "Espacio",
        slug: "espacio",
      }),
      createCategory: jest.fn().mockResolvedValue({
        id: "cat-1",
        name: "Espacio",
        slug: "espacio",
      }),
      updateCategory: jest.fn().mockResolvedValue({
        id: "cat-1",
        name: "Espacio Profundo",
        slug: "espacio",
      }),
      deleteCategory: jest
        .fn()
        .mockResolvedValue({ success: true, message: "Eliminada" }),
      findArticleReferences: jest.fn().mockResolvedValue([]),
      addArticleReference: jest.fn().mockResolvedValue({
        id: "ref-1",
        articleId: "news-1",
        title: "Ref 1",
      }),
      updateArticleReference: jest.fn().mockResolvedValue({
        id: "ref-1",
        articleId: "news-1",
        title: "Ref 1 Updated",
      }),
      deleteArticleReference: jest
        .fn()
        .mockResolvedValue({ success: true, message: "Eliminada" }),
      findBySlug: jest.fn().mockResolvedValue({
        id: "news-1",
        slug: "artemis-iii",
        title: "Artemis III",
      }),
      create: jest.fn().mockResolvedValue({
        id: "news-1",
        slug: "artemis-iii",
        title: "Artemis III",
      }),
      update: jest.fn().mockResolvedValue({
        id: "news-1",
        slug: "artemis-iii",
        title: "Artemis III Updated",
      }),
      delete: jest
        .fn()
        .mockResolvedValue({ success: true, message: "Eliminada" }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Endpoints delegation", () => {
    it("should delegate search and filter queries to NewsService", async () => {
      const query: NewsQueryDto = {
        title: "NASA",
        categories: ["espacio"],
        maxReadTime: 5,
        page: 1,
        limit: 10,
      };
      await controller.search(query);
      expect(service.search).toHaveBeenCalledWith(query);
    });

    it("should return available tags and categories", async () => {
      await expect(controller.findAvailableTags()).resolves.toEqual([
        "NASA",
        "Luna",
      ]);
      await expect(controller.findAllCategories()).resolves.toHaveLength(1);
    });

    it("should pass relation inclusion options on findBySlug", async () => {
      await controller.findBySlug("artemis-iii", "categories", "true", "false");
      expect(service.findBySlug).toHaveBeenCalledWith("artemis-iii", {
        include: "categories",
        includeCategories: true,
        includeReferences: false,
      });
    });

    it("should delegate reference CRUD operations to NewsService", async () => {
      await controller.findArticleReferences("news-1");
      expect(service.findArticleReferences).toHaveBeenCalledWith("news-1");

      await controller.addArticleReference("news-1", {
        title: "Ref 1",
        url: "https://nasa.gov",
      });
      expect(service.addArticleReference).toHaveBeenCalledWith("news-1", {
        title: "Ref 1",
        url: "https://nasa.gov",
      });

      await controller.updateArticleReference("news-1", "ref-1", {
        title: "Ref 1 Updated",
      });
      expect(service.updateArticleReference).toHaveBeenCalledWith(
        "news-1",
        "ref-1",
        { title: "Ref 1 Updated" },
      );

      await controller.deleteArticleReference("news-1", "ref-1");
      expect(service.deleteArticleReference).toHaveBeenCalledWith(
        "news-1",
        "ref-1",
      );
    });
  });

  describe("DTO Validation & Security", () => {
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    it("should transform and validate comma-separated query parameters in NewsQueryDto", async () => {
      const transformed = (await validationPipe.transform(
        {
          title: "NASA",
          categories: "espacio,misiones-espaciales",
          tags: "Luna,Artemis",
          minReadTime: "2",
          maxReadTime: "8",
          status: "publicado",
          page: "1",
          limit: "15",
          includeCategories: "true",
          includeReferences: "false",
        },
        { type: "query", metatype: NewsQueryDto },
      )) as NewsQueryDto;

      expect(transformed.categories).toEqual([
        "espacio",
        "misiones-espaciales",
      ]);
      expect(transformed.tags).toEqual(["Luna", "Artemis"]);
      expect(transformed.minReadTime).toBe(2);
      expect(transformed.maxReadTime).toBe(8);
      expect(transformed.status).toEqual(["PUBLISHED"]);
      expect(transformed.page).toBe(1);
      expect(transformed.limit).toBe(15);
      expect(transformed.includeCategories).toBe(true);
      expect(transformed.includeReferences).toBe(false);
    });

    it("should reject invalid pagination limit (> 100) or invalid reference URLs", async () => {
      await expect(
        validationPipe.transform(
          { limit: "250" },
          { type: "query", metatype: NewsQueryDto },
        ),
      ).rejects.toThrow();

      await expect(
        validationPipe.transform(
          {
            title: "Test",
            summary: "Resumen",
            slug: "test-slug",
            references: [{ title: "Fuente", url: "not-a-valid-url" }],
          },
          { type: "body", metatype: CreateNewsDto },
        ),
      ).rejects.toThrow();
    });

    it("should protect administrative write endpoints with JwtAuthGuard", () => {
      const protectedMethods = [
        "create",
        "update",
        "delete",
        "createCategory",
        "updateCategory",
        "deleteCategory",
        "addArticleReference",
        "updateArticleReference",
        "deleteArticleReference",
      ] as const;

      for (const methodName of protectedMethods) {
        const guards = Reflect.getMetadata(
          GUARDS_METADATA,
          NewsController.prototype[methodName],
        );
        expect(guards).toBeDefined();
        expect(guards).toContain(JwtAuthGuard);
      }

      const publicMethods = [
        "findAll",
        "search",
        "findBySlug",
        "findAllCategories",
        "findCategory",
        "findAvailableTags",
        "findArticleReferences",
      ] as const;

      for (const methodName of publicMethods) {
        const guards = Reflect.getMetadata(
          GUARDS_METADATA,
          NewsController.prototype[methodName],
        );
        expect(guards).toBeUndefined();
      }
    });
  });
});
