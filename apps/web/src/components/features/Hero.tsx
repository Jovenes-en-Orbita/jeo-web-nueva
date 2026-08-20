import { Placeholder } from '@/components/ui/Placeholder';

/**
 * Hero section matching the wireframe's .hero.
 * Full-width image placeholder with navy overlay containing title and description.
 */
export function Hero() {
  return (
    <section className="relative flex-1 min-h-[460px]" id="hero">
      {/* TODO: Replace placeholder with actual hero image */}
      <Placeholder
        label="Imagen real · fondo plano, sin efectos transparentes"
        className="w-full h-full min-h-[460px]"
      />
      <div className="absolute left-0 bottom-0 bg-[var(--color-navy)] text-white p-[28px_40px_30px] max-w-[560px] animate-fade-in-up">
        <span className="text-[var(--color-yellow)] font-[var(--font-montserrat)] font-semibold text-[13px] tracking-[0.14em] mb-2 block">
          Divulgación científica espacial
        </span>
        <h1 className="font-[var(--font-montserrat)] font-bold text-[40px] leading-none mb-2.5 uppercase tracking-[0.02em]">
          Jóvenes en Órbita
        </h1>
        <p className="text-sm leading-relaxed text-[#D6DCE6] m-0">
          Exploramos el universo, el sistema solar y las noticias del espacio
          con rigurosidad y cercanía.
        </p>
      </div>
    </section>
  );
}
