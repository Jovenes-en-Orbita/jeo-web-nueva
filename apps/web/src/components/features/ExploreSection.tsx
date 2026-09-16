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
    <section className="block py-12 border-b border-slate-200 bg-white min-h-full flex flex-col justify-center text-slate-900" id="explora-mas">
      <div className="wrap w-full">
        <SectionHeader title="Seguí explorando…" theme="light" />

        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 mt-2">
          {cards.map((card) => (
            <Link
              key={card.num}
              href={card.href}
              className="bg-slate-50 border border-slate-200 rounded-none p-7 group transition-all duration-300 hover:border-[#d83933]/60 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <span className="font-[var(--font-montserrat)] text-[14px] font-bold text-[#d83933] tracking-[0.14em] block mb-2">
                  {card.num}
                </span>
                <h3 className="text-[21px] font-bold text-slate-900 mb-3 normal-case group-hover:text-[#d83933] transition-colors font-[var(--font-montserrat)]">
                  {card.title}
                </h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed m-0 mb-4">
                  {card.description}
                </p>
              </div>

              {card.subLink ? (
                <span className="text-[12px] font-semibold text-[#d83933] group-hover:text-slate-900 transition-colors pt-3 border-t border-slate-200">
                  ↳ {card.subLink}
                </span>
              ) : (
                <span className="text-[12px] font-semibold text-[#d83933] group-hover:text-slate-900 transition-colors pt-3 border-t border-slate-200 flex items-center justify-between">
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
