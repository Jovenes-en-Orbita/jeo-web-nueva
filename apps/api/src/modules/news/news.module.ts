import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { NEWS_SEARCH_STRATEGY } from "./queries/news-query.interfaces";
import { PrismaNewsSearchStrategy } from "./queries/prisma-news-search.strategy";

@Module({
  controllers: [NewsController],
  providers: [
    PrismaNewsSearchStrategy,
    {
      provide: NEWS_SEARCH_STRATEGY,
      useExisting: PrismaNewsSearchStrategy,
    },
    NewsService,
  ],
  exports: [NewsService],
})
export class NewsModule {}
