import Link from "next/link";
import { getGalleryCollections, getGalleryFeatured } from "@/lib/api";
import { GalleryCollectionCard } from "./GalleryCollectionCard";

/**
 * Section 05: Galería de Fotos Astronómicas (Home)
 * Muestra las 2 colecciones destacadas con mosaico 1+2 y enlace a la galería completa.
 */
export async function GallerySection() {
  const [collections, featured] = await Promise.all([
    getGalleryCollections().catch(() => []),
    getGalleryFeatured().catch(() => null),
  ]);

  const validCollections =
    collections.length > 0
      ? collections
      : featured && featured.id !== "empty"
        ? [featured]
        : [];

  const highlightedCollections = validCollections.slice(0, 2);
  const totalImagesCount = validCollections.reduce(
    (acc, col) => acc + (col.totalImages ?? col.images?.length ?? 0),
    0,
  );

  const countLabel =
    totalImagesCount === 1 ? "1 IMAGEN" : `${totalImagesCount} IMÁGENES`;

  return (
    <section
      className="py-16 md:py-20 bg-[#050811] text-white border-b border-white/10"
      id="frag"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título principal */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight font-chakra">
            <span className="text-white">GALERÍA DE </span>
            <span className="text-[#e8c648]">FOTOS ASTRONÓMICAS</span>
          </h2>
        </div>

        {/* Enlace superior derecho hacia galería completa */}
        <div className="flex justify-end mb-6">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-wider text-[#e8c648] hover:text-[#f5db76] transition-colors uppercase font-inter group"
          >
            <span>VER GALERÍA COMPLETA ({countLabel})</span>
            <span
              aria-hidden="true"
              className="text-[#d83933] transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* Grilla de 2 colecciones destacadas */}
        {highlightedCollections.length === 0 ? (
          <div className="py-14 text-center border border-white/10 bg-[#080d1a]">
            <p className="text-sm text-slate-400 font-inter">
              Aún no hay colecciones fotográficas publicadas en la galería.
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {highlightedCollections.map((collection) => (
              <GalleryCollectionCard
                key={collection.id}
                collection={collection}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
