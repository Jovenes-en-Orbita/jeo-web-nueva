import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MediaService } from './media.service';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty or nasa image array when searching', async () => {
    // Mock global fetch for testing environment
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        collection: {
          items: [
            {
              data: [{ nasa_id: 'PIA123', title: 'Mars Rover' }],
              links: [{ rel: 'preview', href: 'https://images.nasa.gov/PIA123.jpg' }],
            },
          ],
        },
      }),
    } as any);

    const results = await service.searchImages('mars');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Mars Rover');
    expect(results[0].source).toBe('NASA');
  });
});
