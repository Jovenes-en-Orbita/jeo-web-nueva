import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

describe('NewsletterService', () => {
  let service: NewsletterService;
  let prisma: { newsletterSubscriber: any };
  let mailService: { sendNewsletterWelcome: jest.Mock; sendBroadcastEmail: jest.Mock };

  beforeEach(async () => {
    prisma = {
      newsletterSubscriber: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    mailService = {
      sendNewsletterWelcome: jest.fn().mockResolvedValue(true),
      sendBroadcastEmail: jest.fn().mockResolvedValue({ sentCount: 1, errors: 0 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<NewsletterService>(NewsletterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should create a new subscriber if email does not exist', async () => {
      const dto = { email: 'nuevo@orbita.com' };
      const now = new Date();
      prisma.newsletterSubscriber.findUnique.mockResolvedValue(null);
      prisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'sub-123',
        email: 'nuevo@orbita.com',
        active: true,
        createdAt: now,
      });

      const result = await service.subscribe(dto);

      expect(prisma.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
        where: { email: 'nuevo@orbita.com' },
      });
      expect(prisma.newsletterSubscriber.create).toHaveBeenCalledWith({
        data: { email: 'nuevo@orbita.com', active: true },
      });
      expect(result.id).toBe('sub-123');
      expect(result.email).toBe('nuevo@orbita.com');
      expect(mailService.sendNewsletterWelcome).toHaveBeenCalledWith('nuevo@orbita.com');
    });

    it('should throw ConflictException if subscriber is already active', async () => {
      const dto = { email: 'existente@orbita.com' };
      prisma.newsletterSubscriber.findUnique.mockResolvedValue({
        id: 'sub-456',
        email: 'existente@orbita.com',
        active: true,
      });

      await expect(service.subscribe(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete existing subscriber', async () => {
      prisma.newsletterSubscriber.findUnique.mockResolvedValue({ id: 'sub-1' });
      prisma.newsletterSubscriber.delete.mockResolvedValue({ id: 'sub-1' });

      const result = await service.delete('sub-1');
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if subscriber does not exist', async () => {
      prisma.newsletterSubscriber.findUnique.mockResolvedValue(null);

      await expect(service.delete('sub-99')).rejects.toThrow(NotFoundException);
    });
  });
});
