import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AdminDashboardStats } from '@jeo/shared';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const [
      totalArticles,
      totalSubscribers,
      pendingApplications,
      totalConstellations,
      totalGalleryImages,
    ] = await Promise.all([
      this.prisma.newsArticle.count(),
      this.prisma.newsletterSubscriber.count({ where: { active: true } }),
      this.prisma.applicationSubmission.count({ where: { status: 'PENDING' } }),
      this.prisma.constellation.count(),
      this.prisma.galleryImage.count(),
    ]);

    return {
      totalArticles,
      totalSubscribers,
      pendingApplications,
      totalConstellations,
      totalGalleryImages,
      serverStatus: 'online',
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
