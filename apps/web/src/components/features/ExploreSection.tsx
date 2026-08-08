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
    description: 'Acerca de Jóvenes en Órbita: quiénes somos y nuestra misión.',
    href: '/about',
  },
  {
    num: '02',
    title: 'Ecosistema Espacial Argentino',
    description: 'Organizaciones, iniciativas y actores del sector espacial en Argentina.',
    href: '/ecosistema',
  },
  {
    num: '03',
    title: 'Recursos de aprendizaje',
    description: 'Libros electrónicos y material para seguir aprendiendo.',
    subLink: 'Libros electrónicos',
    href: '/recursos',
  },
];

/**
 * Section 06: Seguí explorando
 * Static content — 3 exploration cards in a grid with 1px gap dividers.
 * Matches wireframe's .explore-grid + .explore-card layout.
 */
export function ExploreSection() {
  return (
    <section className="block alt py-16 border-b border-[var(--color-line)] bg-[#F7F8FA]" id="explora-mas">
      <div className="wrap">
        <SectionHeader eyebrow="Sección 06" title="Seguí explorando…" />

        <div className="grid grid-cols-3 gap-px bg-[var(--color-line)] max-[900px]:grid-cols-1">
          {cards.map((card) => (
            <Link
              key={card.num}
              href={card.href}
              className="bg-white py-[30px] px-[26px] group transition-colors duration-200 hover:bg-[#F2F4F7]"
            >
              <span className="font-[var(--font-barlow)] text-[13px] font-semibold text-[var(--color-red)] tracking-[0.1em]">
                {card.num}
              </span>
              <h3 className="text-[20px] text-[var(--color-navy)] my-2 normal-case group-hover:underline transition-all">
                {card.title}
              </h3>
              <p className="text-[12.5px] text-[var(--color-ink-2)] leading-[1.55] m-0 mb-3">
                {card.description}
              </p>
              {card.subLink && (
                <span className="text-[11px] text-[var(--color-ink-2)]">
                  ↳ {card.subLink}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
