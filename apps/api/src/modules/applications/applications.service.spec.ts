import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  const mockPrismaService = {
    applicationSubmission: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockMailService = {
    sendApplicationConfirmation: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
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

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an application submission and send confirmation', async () => {
      mockPrismaService.applicationSubmission.create.mockResolvedValue({
        id: 'app-123',
        fullName: 'Lucía Benítez',
        email: 'lucia@ejemplo.com',
        area: 'tech',
        message: 'Quiero aportar al desarrollo web',
        portfolioUrl: 'https://github.com/lucia',
        createdAt: new Date('2024-01-01'),
      });

      const result = await service.create({
        fullName: 'Lucía Benítez',
        email: 'lucia@ejemplo.com',
        area: 'tech',
        message: 'Quiero aportar al desarrollo web',
        portfolioUrl: 'https://github.com/lucia',
      });

      expect(result.id).toBe('app-123');
      expect(result.fullName).toBe('Lucía Benítez');
      expect(result.area).toBe('tech');
      expect(mockPrismaService.applicationSubmission.create).toHaveBeenCalled();
    });
  });
});
