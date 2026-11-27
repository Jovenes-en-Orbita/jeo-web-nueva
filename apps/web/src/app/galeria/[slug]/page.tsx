import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { GalleryCollectionPhotosGrid } from "@/components/features/GalleryCollectionPhotosGrid";
import { getGalleryCollectionDetail } from "@/lib/api";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getGalleryCollectionDetail(slug, 1, 12);

  if (!detail) {
    return {
      title: "Colección no encontrada — Galería JEO",
    };
  }

  return {
    title: `${detail.collection.title} — Galería JEO`,
    description: detail.collection.description,
  };
}

export default async function GaleriaCollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const initialDetail = await getGalleryCollectionDetail(slug, 1, 12);

  if (!initialDetail) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-white">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <GalleryCollectionPhotosGrid
          idOrSlug={slug}
          initialDetail={initialDetail}
        />
      </main>

      <Footer />
    </div>
  );
}
