import { getGalleryCollections, getGalleryFeatured } from "@/lib/api";
import { EmptyState, SectionContainer } from "@/components/ui";
import { GalleryCollectionCard } from "./GalleryCollectionCard";

/**
 * Section 05: Galería de Fotos Astronómicas (Home)
 * Muestra las 2 colecciones destacadas usando SectionContainer y GalleryCollectionCard.
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
    <SectionContainer
      id="frag"
      surface="dark"
      eyebrow="Archivo fotográfico"
      title="GALERÍA DE"
      titleHighlight="FOTOS ASTRONÓMICAS"
      actionHref="/galeria"
      actionLabel={`Ver galería completa (${countLabel})`}
    >
      {highlightedCollections.length === 0 ? (
        <EmptyState message="Aún no hay colecciones fotográficas publicadas en la galería." />
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
    </SectionContainer>
  );
}
