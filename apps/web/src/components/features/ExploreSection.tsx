import { SectionHeader } from '@/components/ui/SectionHeader';
import Link from 'next/link';

interface ExploreCard {
  num: string;
  title: string;
  description: string;
  subLink?: string;
  href: string;
}

const cards: ExploreCard[] = [
  {
    num: '01',
    title: 'Conoce a JEO',
    description: 'Acerca de Jóvenes en Órbita: quiénes somos y nuestra misión de divulgación.',
    href: '/nosotros',
  },
  {
    num: '02',
    title: 'Ecosistema Espacial Argentino',
    description: 'Organizaciones, iniciativas y actores clave del sector aeroespacial en Argentina.',
    href: '/ecosistema',
  },
  {
    num: '03',
    title: 'Recursos de aprendizaje',
    description: 'Libros electrónicos, newsletters y material didáctico para seguir aprendiendo.',
    subLink: 'Libros electrónicos',
    href: '/libros',
  },
];

/**
 * Section 06: Seguí explorando…
 * High contrast dark theme cards with gold numbers & centered slide layout.
 */
export function ExploreSection() {
  return (
    <section className="block py-12 border-b border-white/10 bg-[#080d1a] min-h-full flex flex-col justify-center" id="explora-mas">
      <div className="wrap w-full">
        <SectionHeader title="Seguí explorando…" theme="dark" />

        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 mt-2">
          {cards.map((card) => (
            <Link
              key={card.num}
              href={card.href}
              className="bg-[#0d162a] border border-white/10 rounded-2xl p-7 group transition-all duration-300 hover:border-[var(--color-yellow)]/60 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <span className="font-[var(--font-montserrat)] text-[14px] font-bold text-[var(--color-yellow)] tracking-[0.14em] block mb-2">
                  {card.num}
                </span>
                <h3 className="text-[21px] font-bold text-white mb-3 normal-case group-hover:text-[var(--color-yellow)] transition-colors font-[var(--font-montserrat)]">
                  {card.title}
                </h3>
                <p className="text-[13.5px] text-slate-300 leading-relaxed m-0 mb-4">
                  {card.description}
                </p>
              </div>

              {card.subLink ? (
                <span className="text-[12px] font-semibold text-[var(--color-yellow)] group-hover:text-white transition-colors pt-3 border-t border-white/10">
                  ↳ {card.subLink}
                </span>
              ) : (
                <span className="text-[12px] font-semibold text-[var(--color-yellow)] group-hover:text-white transition-colors pt-3 border-t border-white/10 flex items-center justify-between">
                  <span>Saber más</span>
                  <span>→</span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
