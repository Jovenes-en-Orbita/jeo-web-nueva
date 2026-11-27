import Link from "next/link";
import Image from "next/image";
import { FiCamera } from "react-icons/fi";
import type { GalleryCollection } from "@jeo/shared";

interface GalleryCollectionCardProps {
  collection: GalleryCollection;
  href?: string;
}

/**
 * Tarjeta reutilizable de colección fotográfica (Home y listado /galeria).
 * Adapta automáticamente el mosaico según la cantidad real de fotos (0, 1, 2 o 3+)
 * sin renderizar placeholders rotos.
 */
export function GalleryCollectionCard({
  collection,
  href,
}: GalleryCollectionCardProps) {
  const validImages = (collection.images ?? []).filter(
    (img) => typeof img.url === "string" && img.url.trim() !== "",
  );
  const totalImages = collection.totalImages ?? validImages.length;
  const targetHref =
    href ?? `/galeria/${encodeURIComponent(collection.slug || collection.id)}`;

  const imageCountLabel =
    totalImages === 1 ? "1 IMAGEN" : `${totalImages} IMÁGENES`;

  return (
    <Link
      href={targetHref}
      className="group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c648]"
    >
      {/* Mosaico adaptativo según cantidad de fotos reales */}
      {validImages.length === 0 ? (
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#0c1428] via-[#090e1d] to-[#050811] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300 flex flex-col items-center justify-center gap-2 text-slate-500">
          <FiCamera className="w-8 h-8 text-[#e8c648]/60" />
          <span className="text-[11px] uppercase tracking-widest font-semibold font-inter">
            Sin fotografías aún
          </span>
        </div>
      ) : validImages.length === 1 ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#090e1d] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300">
          <Image
            src={validImages[0].url!}
            alt={validImages[0].alt || collection.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : validImages.length === 2 ? (
        <div className="grid grid-cols-2 gap-2.5 aspect-[16/9] w-full">
          {validImages.slice(0, 2).map((img, idx) => (
            <div
              key={img.id || idx}
              className="relative overflow-hidden bg-[#090e1d] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300"
            >
              <Image
                src={img.url!}
                alt={img.alt || `${collection.title} — vista ${idx + 1}`}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 grid-rows-2 gap-2.5 aspect-[16/9] w-full">
          {/* Foto principal izquierda */}
          <div className="relative col-span-2 row-span-2 overflow-hidden bg-[#090e1d] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300">
            <Image
              src={validImages[0].url!}
              alt={validImages[0].alt || collection.title}
              fill
              sizes="(max-width: 1024px) 66vw, 35vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Foto secundaria superior derecha */}
          <div className="relative col-span-1 row-span-1 overflow-hidden bg-[#090e1d] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300">
            <Image
              src={validImages[1].url!}
              alt={validImages[1].alt || `${collection.title} — vista 2`}
              fill
              sizes="(max-width: 1024px) 33vw, 18vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Foto secundaria inferior derecha */}
          <div className="relative col-span-1 row-span-1 overflow-hidden bg-[#090e1d] border border-white/10 group-hover:border-[#e8c648]/40 transition-colors duration-300">
            <Image
              src={validImages[2].url!}
              alt={validImages[2].alt || `${collection.title} — vista 3`}
              fill
              sizes="(max-width: 1024px) 33vw, 18vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      )}

      {/* Información + CTA debajo de la tarjeta */}
      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white font-chakra leading-snug group-hover:text-[#e8c648] transition-colors line-clamp-2">
            {collection.title}
          </h3>
          <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-inter font-medium">
            {imageCountLabel}
            {collection.category ? ` · ${collection.category}` : ""}
          </p>
        </div>

        <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#e8c648] group-hover:translate-x-1 transition-transform font-inter">
          Ver colección →
        </span>
      </div>
    </Link>
  );
}
