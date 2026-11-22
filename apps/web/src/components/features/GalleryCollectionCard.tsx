import Link from "next/link";
import Image from "next/image";
import type { GalleryCollection } from "@jeo/shared";

interface GalleryCollectionCardProps {
  collection: GalleryCollection;
  href?: string;
}

const FALLBACK_IMAGES = [
  "/assets/gallery-1.svg",
  "/assets/gallery-2.svg",
  "/assets/gallery-3.svg",
];

function resolveImageSrc(
  url: string | null | undefined,
  fallbackIndex: number,
): string {
  if (url && url.trim() !== "") {
    return url;
  }
  return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
}

/**
 * Tarjeta reutilizable de colección fotográfica (Home y listado de colecciones /galeria).
 * Diseño: mosaico de 3 imágenes (1 principal izquierda + 2 apiladas derecha) con título y conteo debajo.
 */
export function GalleryCollectionCard({
  collection,
  href,
}: GalleryCollectionCardProps) {
  const images = collection.images ?? [];
  const totalImages = collection.totalImages ?? images.length;
  const targetHref =
    href ?? `/galeria/${encodeURIComponent(collection.slug || collection.id)}`;

  const primaryImage = images[0];
  const secondaryTopImage = images[1];
  const secondaryBottomImage = images[2];

  const primarySrc = resolveImageSrc(primaryImage?.url, 0);
  const topSrc = resolveImageSrc(secondaryTopImage?.url, 1);
  const bottomSrc = resolveImageSrc(secondaryBottomImage?.url, 2);

  const imageCountLabel =
    totalImages === 1 ? "1 IMAGEN" : `${totalImages} IMÁGENES`;

  return (
    <Link
      href={targetHref}
      className="group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c648]"
    >
      {/* Mosaico 3 fotos: 1 grande izquierda (~67%) + 2 apiladas derecha (~33%) */}
      <div className="grid grid-cols-3 grid-rows-2 gap-2.5 aspect-[16/9] w-full">
        {/* Foto principal izquierda */}
        <div className="relative col-span-2 row-span-2 overflow-hidden bg-[#090e1d] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300">
          <Image
            src={primarySrc}
            alt={primaryImage?.alt || collection.title}
            fill
            sizes="(max-width: 1024px) 66vw, 35vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Foto secundaria superior derecha */}
        <div className="relative col-span-1 row-span-1 overflow-hidden bg-[#090e1d] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300">
          <Image
            src={topSrc}
            alt={secondaryTopImage?.alt || `${collection.title} — vista 2`}
            fill
            sizes="(max-width: 1024px) 33vw, 18vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Foto secundaria inferior derecha */}
        <div className="relative col-span-1 row-span-1 overflow-hidden bg-[#090e1d] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300">
          <Image
            src={bottomSrc}
            alt={secondaryBottomImage?.alt || `${collection.title} — vista 3`}
            fill
            sizes="(max-width: 1024px) 33vw, 18vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Información debajo de la tarjeta */}
      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white font-chakra leading-snug group-hover:text-[#e8c648] transition-colors line-clamp-2">
          {collection.title}
        </h3>
        <p className="text-xs uppercase tracking-wider text-slate-400 mt-1.5 font-inter font-medium">
          {imageCountLabel}
        </p>
      </div>
    </Link>
  );
}
