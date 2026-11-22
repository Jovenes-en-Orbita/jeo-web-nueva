-- DropForeignKey
ALTER TABLE "gallery_images" DROP CONSTRAINT "gallery_images_collection_id_fkey";

-- AlterTable
ALTER TABLE "gallery_collections" ADD COLUMN     "category" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "gallery_images" ADD COLUMN     "camera" TEXT,
ADD COLUMN     "captured_at" TIMESTAMP(3),
ADD COLUMN     "credit_url" TEXT,
ADD COLUMN     "exposure_time" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "photographer" TEXT,
ADD COLUMN     "source_id" TEXT,
ADD COLUMN     "source_type" TEXT NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'LINKED',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "telescope" TEXT,
ALTER COLUMN "collection_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "gallery_collections_slug_key" ON "gallery_collections"("slug");

-- CreateIndex
CREATE INDEX "gallery_collections_title_idx" ON "gallery_collections"("title");

-- CreateIndex
CREATE INDEX "gallery_collections_featured_idx" ON "gallery_collections"("featured");

-- CreateIndex
CREATE INDEX "gallery_collections_category_idx" ON "gallery_collections"("category");

-- CreateIndex
CREATE INDEX "gallery_collections_tags_idx" ON "gallery_collections" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "gallery_images_collection_id_order_idx" ON "gallery_images"("collection_id", "order");

-- CreateIndex
CREATE INDEX "gallery_images_status_idx" ON "gallery_images"("status");

-- CreateIndex
CREATE INDEX "gallery_images_source_type_source_id_idx" ON "gallery_images"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "gallery_images_tags_idx" ON "gallery_images" USING GIN ("tags");

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "gallery_collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
