-- AlterTable
ALTER TABLE "news_articles" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PUBLISHED';

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_references" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "url" TEXT,
    "publisher" TEXT,
    "published_at" TIMESTAMP(3),
    "accessed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NewsArticleCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NewsArticleCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex
CREATE INDEX "article_references_article_id_idx" ON "article_references"("article_id");

-- CreateIndex
CREATE INDEX "_NewsArticleCategories_B_index" ON "_NewsArticleCategories"("B");

-- CreateIndex
CREATE INDEX "news_articles_title_idx" ON "news_articles"("title");

-- CreateIndex
CREATE INDEX "news_articles_date_idx" ON "news_articles"("date" DESC);

-- CreateIndex
CREATE INDEX "news_articles_read_time_minutes_idx" ON "news_articles"("read_time_minutes");

-- CreateIndex
CREATE INDEX "news_articles_status_idx" ON "news_articles"("status");

-- CreateIndex
CREATE INDEX "news_articles_status_date_idx" ON "news_articles"("status", "date" DESC);

-- CreateIndex
CREATE INDEX "news_articles_tags_idx" ON "news_articles" USING GIN ("tags");

-- AddForeignKey
ALTER TABLE "article_references" ADD CONSTRAINT "article_references_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "news_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsArticleCategories" ADD CONSTRAINT "_NewsArticleCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsArticleCategories" ADD CONSTRAINT "_NewsArticleCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "news_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
