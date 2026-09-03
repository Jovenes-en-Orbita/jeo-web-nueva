import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NewsService', () => {
  let service: NewsService;
  let prisma: PrismaService;

  const mockArticles = [
    {
      id: 'news-1',
      title: 'Artemis III: Regreso a la Luna',
      summary: 'Avances en la misión lunar',
      imageUrl: '/assets/artemis.svg',
      date: new Date('2024-03-05'),
      readTimeMinutes: 6,
      slug: 'artemis-iii',
      content: 'Contenido del artículo lunar...',
      author: 'Equipo JEO',
      tags: ['Misiones Espaciales', 'Luna'],
      coverImageCaption: 'Módulo lunar',
    },
    {
      id: 'news-2',
      title: 'Exoplaneta habitable',
      summary: 'Descubrimiento James Webb',
      imageUrl: '/assets/exoplanet.svg',
      date: new Date('2024-02-02'),
      readTimeMinutes: 4,
      slug: 'exoplaneta-habitable',
      content: 'Contenido del artículo exoplaneta...',
      author: 'Divulgación JEO',
      tags: ['Astrobiología', 'James Webb'],
      coverImageCaption: 'Exoplaneta',
    },
  ];

  const mockPrismaService = {
    newsArticle: {
      findMany: jest.fn().mockResolvedValue(mockArticles),
      findUnique: jest.fn().mockImplementation(({ where: { slug } }) => {
        const found = mockArticles.find((a) => a.slug === slug);
        return Promise.resolve(found || null);
      }),
    },
  };

  beforeEach(async () => {
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
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of mapped articles', async () => {
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe('artemis-iii');
      expect(result[0].author).toBe('Equipo JEO');
      expect(result[0].tags).toContain('Luna');
    });
  });

  describe('findBySlug', () => {
    it('should return a single article by slug', async () => {
      const result = await service.findBySlug('artemis-iii');
      expect(result).toBeDefined();
      expect(result.slug).toBe('artemis-iii');
      expect(result.title).toBe('Artemis III: Regreso a la Luna');
    });

    it('should throw NotFoundException if article does not exist', async () => {
      await expect(service.findBySlug('non-existing-slug')).rejects.toThrow(NotFoundException);
    });
  });
});
