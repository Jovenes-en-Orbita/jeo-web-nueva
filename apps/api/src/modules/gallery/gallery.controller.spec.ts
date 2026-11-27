import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { GUARDS_METADATA } from "@nestjs/common/constants";
import { GalleryController } from "./gallery.controller";
import { GalleryService } from "./gallery.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GalleryCollectionsQueryDto } from "./dto/gallery-query.dto";
import { CreateGalleryImageDto } from "./dto/gallery-image.dto";

describe("GalleryController", () => {
  let controller: GalleryController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = {
      getFeaturedCollection: jest
        .fn()
        .mockResolvedValue({ id: "col-1", images: [] }),
      searchCollections: jest.fn().mockResolvedValue({
        data: [],
        items: [],
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 1,
      }),
      getCollectionByIdOrSlug: jest.fn().mockResolvedValue({
        collection: { id: "col-1", title: "Apollo 11" },
        data: [],
        items: [],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 1,
      }),
      getAllCollections: jest.fn().mockResolvedValue([]),
      createCollection: jest.fn().mockResolvedValue({ id: "col-1" }),
      updateCollection: jest.fn().mockResolvedValue({ id: "col-1" }),
      deleteCollection: jest
        .fn()
        .mockResolvedValue({ success: true, movedToPendingCount: 2 }),
      getPendingImages: jest.fn().mockResolvedValue({
        data: [],
        items: [],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 1,
      }),
      addImage: jest.fn().mockResolvedValue({ id: "img-1" }),
      assignImageToCollection: jest
        .fn()
        .mockResolvedValue({ id: "img-1", status: "LINKED" }),
      updateImage: jest.fn().mockResolvedValue({ id: "img-1" }),
      deleteImage: jest.fn().mockResolvedValue({ success: true }),
      syncSiteAssets: jest
        .fn()
        .mockResolvedValue({ linkedFromSite: 3, pendingFromNews: 2 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryController],
      providers: [{ provide: GalleryService, useValue: service }],
    }).compile();

    controller = module.get<GalleryController>(GalleryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should delegate collection search and detail endpoints", async () => {
    await controller.searchCollections({ search: "Apollo", page: 1, limit: 6 });
    expect(service.searchCollections).toHaveBeenCalledWith({
      search: "Apollo",
      page: 1,
      limit: 6,
    });

    await controller.getCollectionDetail("apollo-11", 2, 12);
    expect(service.getCollectionByIdOrSlug).toHaveBeenCalledWith(
      "apollo-11",
      2,
      12,
    );
  });

  it("should validate query DTOs and astrophoto image DTOs via ValidationPipe", async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    const query = (await pipe.transform(
      {
        search: "Luna",
        tags: "NASA,Apollo",
        featured: "true",
        page: "2",
        limit: "6",
      },
      { type: "query", metatype: GalleryCollectionsQueryDto },
    )) as GalleryCollectionsQueryDto;

    expect(query.tags).toEqual(["NASA", "Apollo"]);
    expect(query.featured).toBe(true);
    expect(query.page).toBe(2);
    expect(query.limit).toBe(6);

    await expect(
      pipe.transform(
        { alt: "Foto", creditUrl: "invalid-url" },
        { type: "body", metatype: CreateGalleryImageDto },
      ),
    ).rejects.toThrow();
  });

  it("should protect administrative gallery routes with JwtAuthGuard", () => {
    const protectedMethods = [
      "createCollection",
      "updateCollection",
      "deleteCollection",
      "getPendingImages",
      "addImage",
      "assignImage",
      "updateImage",
      "deleteImage",
      "syncSiteAssets",
    ] as const;

    for (const method of protectedMethods) {
      const guards = Reflect.getMetadata(
        GUARDS_METADATA,
        GalleryController.prototype[method],
      );
      expect(guards).toContain(JwtAuthGuard);
    }

    const publicMethods = [
      "getFeatured",
      "searchCollections",
      "getCollectionDetail",
      "getAll",
    ] as const;

    for (const method of publicMethods) {
      const guards = Reflect.getMetadata(
        GUARDS_METADATA,
        GalleryController.prototype[method],
      );
      expect(guards).toBeUndefined();
    }
  });
});
