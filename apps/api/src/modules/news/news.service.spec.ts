import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { NewsArticle, PaginatedNewsResponse } from '@jeo/shared';
import { NewsService } from './news.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('NewsService', () => {
  let service: NewsService;

  const mockCategories = [
    {
      id: 'cat-1',
      name: 'Misiones Espaciales',
      slug: 'misiones-espaciales',
      description: 'Lanzamientos y misiones orbitales',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
      _count: { articles: 2 },
    },
    {
      id: 'cat-2',
      name: 'Astrobiología',
      slug: 'astrobiologia',
      description: 'Búsqueda de vida en el universo',
      createdAt: new Date('2026-01-02T00:00:00Z'),
      updatedAt: new Date('2026-01-02T00:00:00Z'),
      _count: { articles: 1 },
    },
  ];

  const mockReferences = [
    {
      id: 'ref-1',
      articleId: 'news-1',
      title: 'NASA Artemis III Mission Overview',
      author: 'NASA Press',
      url: 'https://www.nasa.gov/artemis-iii',
      publisher: 'NASA',
      publishedAt: new Date('2026-02-01T00:00:00Z'),
      accessedAt: new Date('2026-03-01T00:00:00Z'),
      createdAt: new Date('2026-03-01T00:00:00Z'),
      updatedAt: new Date('2026-03-01T00:00:00Z'),
    },
  ];

  const mockArticles = [
    {
      id: 'news-1',
      title: 'Artemis III: Regreso a la Luna',
      summary: 'Avances en la misión lunar de la NASA',
      imageUrl: '/assets/artemis.svg',
      date: new Date('2026-03-05T12:00:00Z'),
      readTimeMinutes: 6,
      slug: 'artemis-iii',
      content: 'Contenido del artículo lunar...',
      author: 'Equipo JEO',
      tags: ['Misiones Espaciales', 'Luna', 'NASA'],
      coverImageCaption: 'Módulo lunar',
      status: 'PUBLISHED',
      categories: [mockCategories[0]],
      references: [mockReferences[0]],
      createdAt: new Date('2026-03-05T12:00:00Z'),
      updatedAt: new Date('2026-03-05T12:00:00Z'),
    },
    {
      id: 'news-2',
      title: 'Exoplaneta habitable descubierto',
      summary: 'Descubrimiento con el telescopio James Webb',
      imageUrl: '/assets/exoplanet.svg',
      date: new Date('2026-02-02T10:00:00Z'),
      readTimeMinutes: 4,
      slug: 'exoplaneta-habitable',
      content: 'Contenido del artículo exoplaneta...',
      author: 'Divulgación JEO',
      tags: ['Astrobiología', 'James Webb'],
      coverImageCaption: 'Exoplaneta',
      status: 'PUBLISHED',
      categories: [mockCategories[0], mockCategories[1]],
      references: [],
      createdAt: new Date('2026-02-02T10:00:00Z'),
      updatedAt: new Date('2026-02-02T10:00:00Z'),
    },
  ];

  let mockPrismaService: any;

  beforeEach(async () => {
    mockPrismaService = {
      $transaction: jest.fn(async (cb: (tx: any) => Promise<any>) =>
        cb(mockPrismaService),
      ),
      newsArticle: {
        count: jest.fn().mockResolvedValue(mockArticles.length),
        findMany: jest.fn().mockResolvedValue(mockArticles),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          const found = mockArticles.find(
            (a) =>
              (where.slug && a.slug === where.slug) ||
              (where.id && a.id === where.id),
          );
          return Promise.resolve(found || null);
        }),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 'news-created',
            ...data,
            categories: mockCategories.filter((c) =>
              data.categories?.connect?.some((conn: any) => conn.id === c.id),
            ),
            references: (data.references?.create ?? []).map(
              (r: any, idx: number) => ({
                id: `ref-new-${idx + 1}`,
                articleId: 'news-created',
                ...r,
              }),
            ),
          }),
        ),
        update: jest.fn().mockImplementation(({ where, data }) => {
          const base = mockArticles.find((a) => a.id === where.id) ?? mockArticles[0];
          return Promise.resolve({
            ...base,
            ...data,
            categories: data.categories?.set
              ? mockCategories.filter((c) =>
                  data.categories.set.some((s: any) => s.id === c.id),
                )
              : base.categories,
            references: base.references,
          });
        }),
        delete: jest.fn().mockResolvedValue(mockArticles[0]),
      },
      category: {
        findMany: jest.fn().mockImplementation(({ where }) => {
          if (!where?.OR) return Promise.resolve(mockCategories);
          return Promise.resolve(
            mockCategories.filter((c) =>
              where.OR.some(
                (cond: any) =>
                  cond.id?.in?.includes(c.id) ||
                  cond.slug?.in?.includes(c.slug),
              ),
            ),
          );
        }),
        findFirst: jest.fn().mockResolvedValue(null),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          const found = mockCategories.find((c) => c.id === where.id);
          return Promise.resolve(found || null);
        }),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 'cat-created',
            ...data,
            _count: { articles: 0 },
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ),
        update: jest.fn().mockImplementation(({ where, data }) =>
          Promise.resolve({
            ...mockCategories[0],
            id: where.id,
            ...data,
          }),
        ),
        delete: jest.fn().mockResolvedValue(mockCategories[0]),
      },
      articleReference: {
        findMany: jest.fn().mockResolvedValue(mockReferences),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          const found = mockReferences.find((r) => r.id === where.id);
          return Promise.resolve(found || null);
        }),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 'ref-created',
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ),
        update: jest.fn().mockImplementation(({ where, data }) =>
          Promise.resolve({
            ...mockReferences[0],
            id: where.id,
            ...data,
          }),
        ),
        delete: jest.fn().mockResolvedValue(mockReferences[0]),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ── 1. Lectura y Control de Relaciones ──
  // ══════════════════════════════════════════════════════════════════════════

  describe('findAll & findBySlug', () => {
    it('should return an array of mapped articles including categories and references by default', async () => {
      const result = (await service.findAll()) as NewsArticle[];
      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe('artemis-iii');
      expect(result[0].author).toBe('Equipo JEO');
      expect(result[0].tags).toContain('Luna');
      expect(result[0].categories).toHaveLength(1);
      expect(result[0].categories?.[0].slug).toBe('misiones-espaciales');
      expect(result[0].references).toHaveLength(1);
      expect(result[0].references?.[0].title).toBe(
        'NASA Artemis III Mission Overview',
      );
    });

    it('should return paginated result with data, items, total, page, limit and totalPages', async () => {
      const result = (await service.findAll(
        undefined,
        undefined,
        1,
        10,
      )) as PaginatedNewsResponse;
      expect(result.data).toHaveLength(2);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should return a single article by slug and allow controlling included relations', async () => {
      const result = await service.findBySlug('artemis-iii', {
        include: 'none',
      });
      expect(result).toBeDefined();
      expect(result.slug).toBe('artemis-iii');
      expect(result.categories).toBeUndefined();
      expect(result.references).toBeUndefined();
      expect(mockPrismaService.newsArticle.findUnique).toHaveBeenCalledWith({
        where: { slug: 'artemis-iii' },
      });
    });

    it('should throw NotFoundException if article does not exist', async () => {
      await expect(service.findBySlug('non-existing-slug')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return unique sorted tags via findAvailableTags', async () => {
      const tags = await service.findAvailableTags();
      expect(tags).toEqual([
        'Astrobiología',
        'James Webb',
        'Luna',
        'Misiones Espaciales',
        'NASA',
      ]);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ── 2. Creación, Actualización y Eliminación de Artículos (CRUD) ──
  // ══════════════════════════════════════════════════════════════════════════

  describe('Article CRUD with Categories and References', () => {
    it('should create an article associating multiple categories and bibliographic references in a transaction', async () => {
      const created = await service.create({
        title: 'Nueva Misión a Europa',
        summary: 'Exploración del océano subterráneo joviano',
        slug: 'nueva-mision-a-europa',
        readTimeMinutes: 7,
        tags: ['Júpiter', 'Europa', 'Júpiter'], // incluye duplicado que debe limpiarse
        categories: ['misiones-espaciales', 'cat-2'],
        references: [
          {
            title: 'Europa Clipper Science Objectives',
            author: 'JPL Team',
            url: 'https://europa.nasa.gov/science',
            publisher: 'NASA JPL',
            publishedAt: '2026-01-15T00:00:00Z',
          },
        ],
      });

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.newsArticle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Nueva Misión a Europa',
            slug: 'nueva-mision-a-europa',
            tags: ['Júpiter', 'Europa'],
            categories: {
              connect: [{ id: 'cat-1' }, { id: 'cat-2' }],
            },
            references: {
              create: [
                expect.objectContaining({
                  title: 'Europa Clipper Science Objectives',
                  url: 'https://europa.nasa.gov/science',
                }),
              ],
            },
          }),
        }),
      );
      expect(created.categories).toHaveLength(2);
      expect(created.references).toHaveLength(1);
    });

    it('should reject article creation if slug already exists', async () => {
      await expect(
        service.create({
          title: 'Duplicado',
          summary: 'Resumen',
          slug: 'artemis-iii',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should reject article creation if a requested category does not exist', async () => {
      await expect(
        service.create({
          title: 'Artículo con categoría inexistente',
          summary: 'Resumen',
          slug: 'articulo-cat-inexistente',
          categories: ['misiones-espaciales', 'categoria-fantasma'],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject article creation if a reference has an invalid URL', async () => {
      await expect(
        service.create({
          title: 'Artículo con URL inválida',
          summary: 'Resumen',
          slug: 'articulo-url-invalida',
          references: [
            {
              title: 'Referencia rota',
              url: 'ftp://invalid-url',
            },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update article partial fields, categories and references within a transaction', async () => {
      const updated = await service.update('news-1', {
        title: 'Artemis III: Actualizado',
        categories: ['astrobiologia'],
        references: [
          {
            id: 'ref-1',
            title: 'NASA Artemis III Updated Report',
          },
          {
            title: 'Segunda fuente lunar',
            url: 'https://www.esa.int/artemis',
          },
        ],
      });

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.articleReference.update).toHaveBeenCalledWith({
        where: { id: 'ref-1' },
        data: { title: 'NASA Artemis III Updated Report' },
      });
      expect(mockPrismaService.articleReference.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            articleId: 'news-1',
            title: 'Segunda fuente lunar',
          }),
        }),
      );
      expect(updated.title).toBe('Artemis III: Actualizado');
    });

    it('should fail update if trying to modify a reference that does not belong to the article', async () => {
      await expect(
        service.update('news-1', {
          references: [
            {
              id: 'ref-other-article',
              title: 'Intento inválido',
            },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should delete an article and its references without deleting shared categories', async () => {
      const res = await service.delete('news-1');
      expect(res.success).toBe(true);
      expect(mockPrismaService.articleReference.deleteMany).toHaveBeenCalledWith(
        {
          where: { articleId: 'news-1' },
        },
      );
      expect(mockPrismaService.newsArticle.delete).toHaveBeenCalledWith({
        where: { id: 'news-1' },
      });
      expect(mockPrismaService.category.delete).not.toHaveBeenCalled();
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ── 3. Administración de Categorías (`Category`) ──
  // ══════════════════════════════════════════════════════════════════════════

  describe('Categories CRUD', () => {
    it('should list all categories with articleCount', async () => {
      const categories = await service.findAllCategories();
      expect(categories).toHaveLength(2);
      expect(categories[0].articleCount).toBe(2);
    });

    it('should create a category and auto-generate slug from name if omitted', async () => {
      const cat = await service.createCategory({
        name: 'Ingeniería Aeroespacial',
        description: 'Cohetería y propulsión',
      });
      expect(cat.slug).toBe('ingenieria-aeroespacial');
      expect(mockPrismaService.category.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: 'Ingeniería Aeroespacial',
            slug: 'ingenieria-aeroespacial',
            description: 'Cohetería y propulsión',
          },
        }),
      );
    });

    it('should throw ConflictException when creating a duplicate category', async () => {
      mockPrismaService.category.findFirst.mockResolvedValueOnce(
        mockCategories[0],
      );
      await expect(
        service.createCategory({ name: 'Misiones Espaciales' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should update and delete an existing category', async () => {
      const updated = await service.updateCategory('cat-1', {
        description: 'Descripción renovada',
      });
      expect(updated.description).toBe('Descripción renovada');

      const deleted = await service.deleteCategory('cat-1');
      expect(deleted.success).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ── 4. Sistema de Búsqueda, Combinación de Filtros y Escalabilidad ──
  // ══════════════════════════════════════════════════════════════════════════

  describe('Advanced Search & Composable Filtering', () => {
    it('should filter by partial case-insensitive title', async () => {
      await service.search({ title: 'NASA' });
      expect(mockPrismaService.newsArticle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: { contains: 'NASA', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should filter by categories (any vs all) and tags (any vs all)', async () => {
      await service.search({
        categories: ['misiones-espaciales', 'astrobiologia'],
        categoryMatch: 'all',
        tags: ['NASA', 'Luna'],
        tagMatch: 'all',
      });

      expect(mockPrismaService.newsArticle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tags: { hasEvery: ['NASA', 'Luna'] },
            AND: expect.arrayContaining([
              expect.objectContaining({
                categories: expect.any(Object),
              }),
            ]),
          }),
        }),
      );
    });

    it('should filter by reading time range, publication date range and status', async () => {
      await service.search({
        minReadTime: 2,
        maxReadTime: 5,
        dateFrom: '2026-01-01',
        dateTo: '2026-06-30',
        status: ['PUBLISHED'],
        sortBy: 'readTimeMinutes',
        sortOrder: 'asc',
        page: 2,
        limit: 5,
      });

      expect(mockPrismaService.newsArticle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            readTimeMinutes: { gte: 2, lte: 5 },
            date: {
              gte: new Date('2026-01-01'),
              lte: new Date('2026-06-30T23:59:59.999Z'),
            },
            status: 'PUBLISHED',
          }),
          orderBy: { readTimeMinutes: 'asc' },
          skip: 5,
          take: 5,
        }),
      );
    });

    it('should combine title, categories, tags, reading time, dates and status in a single query', async () => {
      await service.search({
        title: 'Artemis',
        categories: ['misiones-espaciales'],
        tags: ['Luna'],
        maxReadTime: 10,
        status: ['PUBLISHED'],
      });

      expect(mockPrismaService.newsArticle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: { contains: 'Artemis', mode: 'insensitive' },
            categories: expect.any(Object),
            tags: { has: 'Luna' },
            readTimeMinutes: { lte: 10 },
            status: 'PUBLISHED',
          }),
        }),
      );
    });

    it('should handle empty search results gracefully with consistent pagination metadata', async () => {
      mockPrismaService.newsArticle.count.mockResolvedValueOnce(0);
      mockPrismaService.newsArticle.findMany.mockResolvedValueOnce([]);

      const res = await service.search({
        title: 'Inexistente',
        page: 1,
        limit: 10,
      });

      expect(res).toEqual({
        data: [],
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should throw BadRequestException for invalid filter ranges or pagination limits', async () => {
      await expect(
        service.search({ minReadTime: 10, maxReadTime: 3 }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.search({
          dateFrom: '2026-10-01',
          dateTo: '2026-01-01',
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.search({ page: 0, limit: 10 }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.search({ page: 1, limit: 500 }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
