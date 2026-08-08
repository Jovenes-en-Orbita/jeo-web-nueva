import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StatsModule } from './modules/stats/stats.module';
import { NewsModule } from './modules/news/news.module';
import { UniverseModule } from './modules/universe/universe.module';
import { SolarSystemModule } from './modules/solar-system/solar-system.module';
import { ConstellationsModule } from './modules/constellations/constellations.module';
import { GalleryModule } from './modules/gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StatsModule,
    NewsModule,
    UniverseModule,
    SolarSystemModule,
    ConstellationsModule,
    GalleryModule,
  ],
})
export class AppModule {}
