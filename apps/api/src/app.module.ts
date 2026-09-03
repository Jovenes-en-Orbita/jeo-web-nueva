import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { StatsModule } from './modules/stats/stats.module';
import { NewsModule } from './modules/news/news.module';
import { UniverseModule } from './modules/universe/universe.module';
import { SolarSystemModule } from './modules/solar-system/solar-system.module';
import { ConstellationsModule } from './modules/constellations/constellations.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { MailModule } from './modules/mail/mail.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { ApplicationsModule } from './modules/applications/applications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    PrismaModule,
    AuthModule,
    AdminModule,
    MailModule,
    HealthModule,
    StatsModule,
    NewsModule,
    UniverseModule,
    SolarSystemModule,
    ConstellationsModule,
    GalleryModule,
    NewsletterModule,
    ApplicationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

