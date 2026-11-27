import type { Metadata } from "next";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { GalleryCollectionsCatalog } from "@/components/features/GalleryCollectionsCatalog";
import { searchGalleryCollections } from "@/lib/api";

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
    <div className="min-h-screen flex flex-col bg-[#050811] text-white">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        {/* Encabezado centrado (Diseño 2) */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight font-chakra">
            <span className="text-white">GALERÍA DE </span>
            <span className="text-[#e8c648]">FOTOS ASTRONÓMICAS</span>
          </h1>
        </div>

        <GalleryCollectionsCatalog initialResponse={initialResponse} />
      </main>

      <Footer />
    </div>
  );
}
