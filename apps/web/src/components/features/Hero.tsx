import Image from 'next/image';

/**
 * Hero section matching the wireframe's .hero.
 * Full-width visual background with navy overlay containing title and description.
 */
export function Hero() {
  return (
    <section className="relative flex-1 min-h-[460px] overflow-hidden" id="hero">
      <div className="relative w-full h-full min-h-[460px] bg-[#030712]">
        <Image
          src="/assets/hero-cosmos.svg"
          alt="Jóvenes en Órbita — Divulgación Científica Espacial"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a]/90 via-[#080d1a]/40 to-transparent" />
      </div>

      <div className="absolute left-0 bottom-0 bg-[var(--color-navy)] text-white p-[28px_40px_30px] max-w-[560px] animate-fade-in-up border-t-2 border-r-2 border-[var(--color-yellow)]/30 rounded-tr-2xl shadow-2xl">
        <span className="text-[var(--color-yellow)] font-[var(--font-montserrat)] font-semibold text-[13px] tracking-[0.14em] mb-2 block">
          Divulgación científica espacial
        </span>
        <h1 className="font-[var(--font-montserrat)] font-bold text-[36px] sm:text-[40px] leading-none mb-2.5 uppercase tracking-[0.02em]">
          Jóvenes en Órbita
        </h1>
        <p className="text-sm leading-relaxed text-[#D6DCE6] m-0">
          Exploramos el universo, el sistema solar y las noticias del espacio
          con rigurosidad, pasión y cercanía.
        </p>
      </div>
    </section>
  );
}
