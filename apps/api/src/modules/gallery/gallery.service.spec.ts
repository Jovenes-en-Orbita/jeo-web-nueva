import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { GalleryService } from "./gallery.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("GalleryService", () => {
  let service: GalleryService;

  const mockCollections = [
    {
      id: "col-1",
      title: "Grandes Exploradores: El Apollo 11",
      slug: "grandes-exploradores-el-apollo-11",
      description: "Misión histórica lunar de 1969",
      category: "Misiones Espaciales",
      tags: ["Apollo", "Luna", "NASA"],
      featured: true,
      rotationFrequency: "semanal",
      createdAt: new Date("2026-01-10T00:00:00Z"),
      updatedAt: new Date("2026-01-10T00:00:00Z"),
      images: [
        {
          id: "img-1",
          collectionId: "col-1",
          url: "https://images.nasa.gov/apollo-11-1.jpg",
          alt: "Observatorio espacial",
          caption: "Vista del observatorio",
          featured: true,
          order: 0,
          status: "LINKED",
          sourceType: "MANUAL",
          sourceId: null,
          tags: ["Luna"],
          photographer: "NASA",
          telescope: "LBT",
          camera: "Hasselblad",
          exposureTime: "1/250s",
          location: "Mar de la Tranquilidad",
          capturedAt: new Date("1969-07-20T20:17:00Z"),
          creditUrl: "https://images.nasa.gov",
          createdAt: new Date("2026-01-10T00:00:00Z"),
          updatedAt: new Date("2026-01-10T00:00:00Z"),
        },
      ],
      _count: { images: 1 },
    },
  ];

  const mockPendingImages = [
    {
      id: "img-pending-1",
      collectionId: null,
      url: "https://images.nasa.gov/news-guowang.jpg",
      alt: "Constelación Guowang",
      caption: "Lanzamiento satelital",
      featured: false,
      order: 0,
      status: "PENDING",
      sourceType: "NEWS",
      sourceId: "news-1",
      tags: ["Satélites"],
      photographer: "Equipo JEO",
      telescope: null,
      camera: null,
      exposureTime: null,
      location: null,
      capturedAt: null,
      creditUrl: null,
      createdAt: new Date("2026-03-01T00:00:00Z"),
      updatedAt: new Date("2026-03-01T00:00:00Z"),
    },
  ];

  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      $transaction: jest.fn(async (cb: (tx: any) => Promise<any>) =>
        cb(mockPrisma),
      ),
      galleryCollection: {
        count: jest.fn().mockResolvedValue(mockCollections.length),
        findFirst: jest.fn().mockResolvedValue(mockCollections[0]),
        findMany: jest.fn().mockResolvedValue(mockCollections),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          const found = mockCollections.find(
            (c) =>
              (where.id && c.id === where.id) ||
              (where.slug && c.slug === where.slug),
          );
          return Promise.resolve(found || null);
        }),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: data.id || "col-new",
            ...data,
            images: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ),
        update: jest.fn().mockImplementation(({ where, data }) =>
          Promise.resolve({
            ...mockCollections[0],
            id: where.id,
            ...data,
          }),
        ),
        delete: jest.fn().mockResolvedValue(mockCollections[0]),
      },
      galleryImage: {
        count: jest.fn().mockResolvedValue(1),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue(mockCollections[0].images),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          const all = [...mockCollections[0].images, ...mockPendingImages];
          return Promise.resolve(all.find((i) => i.id === where.id) || null);
        }),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: "img-new",
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ),
        update: jest.fn().mockImplementation(({ where, data }) =>
          Promise.resolve({
            ...mockPendingImages[0],
            id: where.id,
            ...data,
          }),
        ),
        updateMany: jest.fn().mockResolvedValue({ count: 3 }),
        delete: jest.fn().mockResolvedValue(mockCollections[0].images[0]),
      },
      planet: { findMany: jest.fn().mockResolvedValue([]) },
      universeTab: { findMany: jest.fn().mockResolvedValue([]) },
      constellation: { findMany: jest.fn().mockResolvedValue([]) },
      newsArticle: { findMany: jest.fn().mockResolvedValue([]) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GalleryService>(GalleryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Collections Search, Pagination & CRUD", () => {
    it("should search collections with filters and horizontal pagination metadata", async () => {
      const res = await service.searchCollections({
        search: "Apollo",
        category: "Misiones Espaciales",
        tags: ["Luna"],
        page: 1,
        limit: 6,
      });

      expect(res.data).toHaveLength(1);
      expect(res.total).toBe(1);
      expect(res.page).toBe(1);
      expect(res.limit).toBe(6);
      expect(res.totalPages).toBe(1);
      expect(mockPrisma.galleryCollection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
            category: { equals: "Misiones Espaciales", mode: "insensitive" },
            tags: { has: "Luna" },
          }),
          skip: 0,
          take: 6,
        }),
      );
    });

    it("should return collection detail with paginated images (default 12 for 4x3 grid)", async () => {
      const detail = await service.getCollectionByIdOrSlug(
        "grandes-exploradores-el-apollo-11",
        1,
        12,
      );
      expect(detail.collection.title).toBe(
        "Grandes Exploradores: El Apollo 11",
      );
      expect(detail.data).toHaveLength(1);
      expect(detail.limit).toBe(12);
      expect(detail.data[0].telescope).toBe("LBT");
    });

    it("should create a collection auto-generating slug and reject duplicate slug", async () => {
      const created = await service.createCollection({
        title: "Nebulosas del Sur",
        description: "Capturas de cielo profundo",
        category: "Cielo Profundo",
        tags: ["Nebulosa", "Nebulosa"],
        featured: true,
      });

      expect(created.slug).toBe("nebulosas-del-sur");
      expect(created.tags).toEqual(["Nebulosa"]);

      await expect(
        service.createCollection({
          title: "Grandes Exploradores: El Apollo 11",
          description: "Duplicada",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("should update collection fields partially", async () => {
      const updated = await service.updateCollection("col-1", {
        title: "Apollo 11 Remasterizado",
        featured: false,
      });
      expect(updated.title).toBe("Apollo 11 Remasterizado");
    });

    it("should move collection images to PENDING tray when deleting a collection", async () => {
      const result = await service.deleteCollection("col-1");
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(mockPrisma.galleryImage.updateMany).toHaveBeenCalledWith({
        where: { collectionId: "col-1" },
        data: { collectionId: null, status: "PENDING" },
      });
      expect(mockPrisma.galleryCollection.delete).toHaveBeenCalledWith({
        where: { id: "col-1" },
      });
      expect(result.success).toBe(true);
      expect(result.movedToPendingCount).toBe(3);
    });
  });

  describe("Images, Astrophoto Metadata & Pending Tray", () => {
    it("should list pending images paginated", async () => {
      mockPrisma.galleryImage.findMany.mockResolvedValueOnce(mockPendingImages);
      const res = await service.getPendingImages({ page: 1, limit: 12 });
      expect(res.data).toHaveLength(1);
      expect(res.data[0].status).toBe("PENDING");
      expect(res.data[0].sourceType).toBe("NEWS");
    });

    it("should add an image with astrophoto metadata as LINKED or PENDING", async () => {
      const linked = await service.addImage({
        collectionId: "col-1",
        alt: "Nebulosa de Orión",
        url: "https://images.nasa.gov/orion.jpg",
        photographer: "Comunidad JEO",
        telescope: 'Celestron EdgeHD 8"',
        camera: "ASI2600MC",
        exposureTime: "180s x 30",
        location: "Córdoba, Argentina",
        capturedAt: "2026-08-10T02:00:00Z",
        creditUrl: "https://images.nasa.gov/orion",
      });

      expect(linked.status).toBe("LINKED");
      expect(linked.telescope).toBe('Celestron EdgeHD 8"');

      const pending = await service.addImage({
        alt: "Foto sin álbum aún",
        url: "https://images.nasa.gov/unassigned.jpg",
      });
      expect(pending.status).toBe("PENDING");
      expect(pending.collectionId).toBeNull();
    });

    it("should assign a pending image to a target collection", async () => {
      const assigned = await service.assignImageToCollection("img-pending-1", {
        collectionId: "col-1",
        order: 2,
      });
      expect(assigned.collectionId).toBe("col-1");
      expect(assigned.status).toBe("LINKED");
    });

    it("should throw NotFoundException when assigning to a non-existent collection", async () => {
      await expect(
        service.assignImageToCollection("img-pending-1", {
          collectionId: "non-existent-col",
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should reject invalid pagination limits", async () => {
      await expect(
        service.searchCollections({ page: 1, limit: 250 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("Automatic Site & News Image Sync", () => {
    it("should sync site entities into collections and news images into PENDING tray", async () => {
      mockPrisma.planet.findMany.mockResolvedValueOnce([
        {
          id: "p-1",
          name: "Marte",
          imageUrl: "/assets/mars-real.webp",
          description: "Planeta rojo",
        },
      ]);
      mockPrisma.newsArticle.findMany.mockResolvedValueOnce([
        {
          id: "news-1",
          title: "Guowang supera 200 satélites",
          imageUrl: "/assets/guowang.webp",
          coverImageCaption: "Despliegue orbital",
          author: "Álvaro de Pedro",
          tags: ["Satélites"],
        },
      ]);

      const summary = await service.syncSiteAssets();
      expect(summary.linkedFromSite).toBe(1);
      expect(summary.pendingFromNews).toBe(1);
    });
  });
});
