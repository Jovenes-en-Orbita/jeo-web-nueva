import type { Metadata } from "next";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { GalleryCollectionsCatalog } from "@/components/features/GalleryCollectionsCatalog";
import { CatalogPageHeader } from "@/components/ui/CatalogPageHeader";
import { searchGalleryCollections } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galería de Fotos Astronómicas — JEO",
  description:
    "Explora todas las colecciones de astrofotografía y capturas espaciales de Jóvenes en Órbita.",
};

export default async function GaleriaPage() {
  const initialResponse = await searchGalleryCollections({
    page: 1,
    limit: 6,
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <CatalogPageHeader
          titlePrefix="GALERÍA DE"
          titleHighlight="FOTOS ASTRONÓMICAS"
          maxWidthClass="max-w-5xl"
          surface="white"
        />

        <GalleryCollectionsCatalog
          initialResponse={initialResponse}
          surface="white"
        />
      </main>

      <Footer />
    </div>
  );
}
