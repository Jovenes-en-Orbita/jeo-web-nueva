import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getGalleryFeatured } from '@/lib/api';
import { FiCamera } from 'react-icons/fi';

/**
 * Section 05: Fragmentos de Memoria
 * High contrast dark theme + photo collage + link to full gallery.
 */
export async function GallerySection() {
  const collection = await getGalleryFeatured();

  return (
    <section className="block py-12 border-b border-white/10 bg-[#060a17] min-h-full flex flex-col justify-center" id="frag">
      <div className="wrap w-full">
        {/* Header */}
        <div className="flex justify-between items-end mb-4 flex-wrap gap-4">
          <div>
            <span className="text-[12px] text-[var(--color-yellow)] tracking-[0.06em] uppercase font-semibold block mb-1.5 font-[var(--font-montserrat)]">
              Galería de fotos astronómicas
            </span>
            <SectionHeader title="Fragmentos de Memoria" theme="dark" />
          </div>
          <div className="text-[#FFC72C] hover:text-white">
            <Button href="/galeria" variant="gold">
              Ver galería completa
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <p className="text-[14px] text-slate-200 leading-relaxed m-0 font-medium">
            {collection.title}
          </p>
          <span className="text-[12px] text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <FiCamera className="w-3.5 h-3.5 text-[var(--color-yellow)]" />
            <span>{collection.totalImages} imágenes · actualización semanal</span>
          </span>
        </div>

        {/* Collage grid */}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 160px)',
          }}
        >
          {collection.images.map((img, i) => (
            <Link
              key={img.id || i}
              href="/galeria"
              className={`group cursor-pointer overflow-hidden rounded-2xl border border-white/10 relative hover:border-[var(--color-yellow)]/60 transition-all duration-300 bg-[#090d1a] ${
                i === 0 ? 'row-span-2 col-span-2' : ''
              }`}
            >
              <Image
                src={img.url && img.url.startsWith('/') ? img.url : `/assets/gallery-${(i % 6) + 1}.svg`}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-semibold text-white tracking-wide">
                  {img.alt || 'Ver fotografía'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
