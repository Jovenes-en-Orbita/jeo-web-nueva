import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prisma: { applicationSubmission: any };
  let mailService: { sendApplicationConfirmation: jest.Mock };

  beforeEach(async () => {
    prisma = {
      applicationSubmission: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    mailService = {
      sendApplicationConfirmation: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an application submission and send email', async () => {
      const dto = {
        fullName: '  Cosmo Krauss ',
        email: 'COSMO@ORBITA.COM ',
        area: ' Redacción ',
        message: 'Hola, me encantaría colaborar',
        portfolioUrl: 'https://github.com/cosmo',
      };
      const now = new Date();

      prisma.applicationSubmission.create.mockResolvedValue({
        id: 'app-1',
        fullName: 'Cosmo Krauss',
        email: 'cosmo@orbita.com',
        area: 'redacción',
        message: 'Hola, me encantaría colaborar',
        portfolioUrl: 'https://github.com/cosmo',
        createdAt: now,
      });

      const result = await service.create(dto);

      expect(prisma.applicationSubmission.create).toHaveBeenCalledWith({
        data: {
          fullName: 'Cosmo Krauss',
          email: 'cosmo@orbita.com',
          area: 'redacción',
          message: 'Hola, me encantaría colaborar',
          portfolioUrl: 'https://github.com/cosmo',
        },
      });
      expect(result.id).toBe('app-1');
      expect(result.fullName).toBe('Cosmo Krauss');
      expect(mailService.sendApplicationConfirmation).toHaveBeenCalledWith(
        'cosmo@orbita.com',
        'Cosmo Krauss',
        'redacción',
      );
    });
  });

  describe('updateStatus', () => {
    it('should update status of existing application', async () => {
      prisma.applicationSubmission.findUnique.mockResolvedValue({ id: 'app-1', status: 'PENDING' });
      prisma.applicationSubmission.update.mockResolvedValue({ id: 'app-1', status: 'ACCEPTED' });

      const result = await service.updateStatus('app-1', { status: 'ACCEPTED' as any });

      expect(result.status).toBe('ACCEPTED');
    });

    it('should throw NotFoundException if application does not exist', async () => {
      prisma.applicationSubmission.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('app-999', { status: 'REVIEWED' as any })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
