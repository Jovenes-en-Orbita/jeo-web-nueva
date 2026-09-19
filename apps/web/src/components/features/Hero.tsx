import Image from 'next/image';
import { getGalleryFeatured } from '@/lib/api';

/**
 * Hero section matching the wireframe's .hero.
 * Full screen height visual background with embedded stats inside floating card.
 */
export async function Hero() {
  const collection = await getGalleryFeatured().catch(() => null);
  const photoCount = collection?.images?.length ?? collection?.totalImages ?? 0;

  const stats = [
    { value: '93 %', label: 'del universo incomprendido' },
    { value: '8', label: 'planetas en el sistema solar' },
    { value: '88', label: 'constelaciones oficiales' },
    { value: `${photoCount}`, label: 'fotografías en memoria' },
  ];

  return (
    <section className="relative w-full h-[calc(100vh-76px)] min-h-[560px] overflow-hidden flex items-center" id="hero">
      <div className="absolute inset-0 bg-black">
        <Image
          src="/assets/hero-cosmos.svg"
          alt="Jóvenes en Órbita — Divulgación Científica Espacial"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 wrap w-full">
        <div className="bg-black/90 backdrop-blur-md text-white p-7 sm:p-9 max-w-[640px] animate-fade-in-up border border-[#d83933]/60 rounded-none shadow-2xl space-y-6">
          <div>
            <span className="text-[#d83933] font-[var(--font-montserrat)] font-bold text-xs sm:text-sm tracking-[0.14em] mb-2 block uppercase">
              Divulgación científica espacial
            </span>
            <h1 className="font-[var(--font-montserrat)] font-bold text-3xl sm:text-5xl leading-tight mb-3 uppercase tracking-[0.02em]">
              Jóvenes en Órbita
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[#D6DCE6] m-0 font-[var(--font-poppins)]" >
              Exploramos el universo, el sistema solar y las noticias del espacio
              con rigurosidad, pasión y cercanía.
            </p>
          </div>


          {/* Integrated Statistics Grid */}
          <div className="pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-[var(--font-montserrat)] font-extrabold text-xl sm:text-2xl text-[var(--color-yellow)] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium leading-snug mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


