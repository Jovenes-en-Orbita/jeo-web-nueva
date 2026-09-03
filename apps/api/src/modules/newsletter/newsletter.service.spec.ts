import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterService } from './newsletter.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ConflictException } from '@nestjs/common';

describe('NewsletterService', () => {
  let service: NewsletterService;

  const mockPrismaService = {
    newsletterSubscriber: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockMailService = {
    sendNewsletterWelcome: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<NewsletterService>(NewsletterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should successfully subscribe a new email', async () => {
      mockPrismaService.newsletterSubscriber.findUnique.mockResolvedValue(null);
      mockPrismaService.newsletterSubscriber.create.mockResolvedValue({
        id: 'sub-123',
        email: 'astronomo@ejemplo.com',
        active: true,
        createdAt: new Date('2024-01-01'),
      });

      const result = await service.subscribe({ email: 'astronomo@ejemplo.com' });
      expect(result.email).toBe('astronomo@ejemplo.com');
      expect(result.active).toBe(true);
      expect(mockPrismaService.newsletterSubscriber.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if already active subscriber', async () => {
      mockPrismaService.newsletterSubscriber.findUnique.mockResolvedValue({
        id: 'sub-123',
        email: 'astronomo@ejemplo.com',
        active: true,
      });

      await expect(service.subscribe({ email: 'astronomo@ejemplo.com' })).rejects.toThrow(ConflictException);
    });
  });
});
