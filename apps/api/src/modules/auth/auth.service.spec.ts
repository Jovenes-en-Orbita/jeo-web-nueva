import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'user-123',
    email: 'admin@jovenesenorbita.com',
    passwordHash: '',
    name: 'Director JEO',
    role: 'SUPERADMIN',
    createdAt: new Date('2024-01-01'),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token-12345'),
  };

  beforeAll(async () => {
    mockUser.passwordHash = await bcrypt.hash('admin1234', 10);
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return auth response with accessToken on valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'admin@jovenesenorbita.com',
        password: 'admin1234',
      });

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('mock-jwt-token-12345');
      expect(result.user.email).toBe('admin@jovenesenorbita.com');
      expect(result.user.role).toBe('SUPERADMIN');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'unknown@jovenesenorbita.com',
          password: 'admin1234',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.login({
          email: 'admin@jovenesenorbita.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('should return admin user data by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const user = await service.getMe('user-123');
      expect(user.id).toBe('user-123');
      expect(user.name).toBe('Director JEO');
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('non-existent-user')).rejects.toThrow(UnauthorizedException);
    });
  });
});
