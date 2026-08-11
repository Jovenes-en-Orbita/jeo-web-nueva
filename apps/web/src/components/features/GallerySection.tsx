import { Placeholder } from '@/components/ui/Placeholder';
import { Button } from '@/components/ui/Button';
import { getGalleryFeatured } from '@/lib/api';

/**
 * Section 05: Fragmentos de Memoria
 * Server Component. Photo collage with featured large image.
 * Matches wireframe's .collage grid layout.
 */
export async function GallerySection() {
  const collection = await getGalleryFeatured();

  return (
    <section className="block py-16 border-b border-[var(--color-line)]" id="frag">
      <div className="wrap">
        {/* Header */}
        <div className="flex justify-between items-end mb-5 flex-wrap gap-3.5">
          <div>
            <span className="text-[12px] text-[var(--color-ink-2)] tracking-[0.04em] uppercase font-semibold block mb-1.5">
              Galería de fotos astronómicas
            </span>
            <h2 className="text-[34px] text-[var(--color-navy)] font-[var(--font-montserrat)] font-bold uppercase tracking-[0.02em]">
              Fragmentos de Memoria
            </h2>
          </div>
          <Button href="/galeria">Ver galería</Button>
        </div>

        <p className="text-[13px] text-[var(--color-ink-2)] leading-relaxed mb-2.5">
          {collection.title}
        </p>
        <span className="text-[12px] text-[var(--color-ink-2)] flex items-center gap-1.5 mb-[18px]">
          <svg
            viewBox="0 0 24 24"
            width={13}
            height={13}
            fill="none"
            stroke="var(--color-ink-2)"
            strokeWidth={2}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          {collection.totalImages} imágenes · se cambia cada semana
        </span>

        {/* Collage grid */}
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 140px)',
          }}
        >
          {collection.images.map((img, i) => (
            <div
              key={img.id}
              className={`group cursor-pointer ${
                i === 0 ? 'row-span-2 col-span-2' : ''
              }`}
            >
              {/* TODO: Replace with actual gallery image */}
              <Placeholder
                label={i === 0 ? 'Foto predominante' : undefined}
                className="w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ fontSize: i > 0 ? 0 : undefined }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
