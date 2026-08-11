'use client';

import Link from 'next/link';
import { Dropdown } from '@/components/ui/Dropdown';
import { Logo } from '@/components/ui/Logo';

/**
 * Main navigation bar matching the wireframe's header.nav.
 * Search and links left, Logo centered, dropdown menus right.
 */
export function Navbar() {
  return (
    <header className="bg-[var(--color-navy)] border-b-[3px] border-[var(--color-yellow)] relative text-white">
      <div className="wrap grid grid-cols-[1fr_auto_1fr] items-center h-[76px] max-[900px]:grid-cols-1 max-[900px]:h-auto max-[900px]:py-3.5 max-[900px]:px-6 max-[900px]:gap-2.5">
        {/* Left: Hogar + Search */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-white font-[var(--font-montserrat)] font-semibold text-[15px] uppercase tracking-[0.05em] hover:text-[var(--color-yellow)] transition-colors"
          >
            Hogar
          </Link>
          <span className="text-white font-[var(--font-montserrat)] font-semibold text-[15px] uppercase tracking-[0.05em] whitespace-nowrap">
            Explora
          </span>
          <div className="flex items-center gap-2 bg-white/[0.08] border border-white/25 rounded-[3px] px-2.5 py-1.5 min-w-[160px] max-[900px]:hidden">
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="none"
              stroke="#fff"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar en JEO…"
              className="bg-transparent border-0 outline-none text-white text-[13px] w-full placeholder:text-white/50"
              id="search-input"
            />
          </div>
        </div>

        {/* Center: Logo oficial */}
        <div className="justify-self-center py-1">
          <Logo size={46} showText={true} />
        </div>

        {/* Right: Dropdown menus */}
        <nav className="flex justify-end items-center gap-7 max-[900px]:justify-start max-[900px]:flex-wrap">
          <Dropdown
            label="Cosmos"
            items={[
              { label: 'El Universo', href: '#u' },
              { label: 'Sistema Solar', href: '#ss' },
              { label: 'Constelaciones', href: '#const' },
              { label: 'Noticias Espaciales', href: '#news' },
              { label: 'Fragmentos de Memoria', href: '#frag' },
            ]}
          />
          <Dropdown
            label="Multimedia"
            items={[
              { label: 'Newsletter', href: '#' },
              { label: 'Libros electrónicos', href: '#' },
              { label: 'Redes sociales', href: '#' },
            ]}
          />
          <Dropdown
            label="Quiénes somos"
            items={[
              { label: 'Conoce a JEO', href: '#' },
              { label: 'Ecosistema Espacial Argentino', href: '#' },
              { label: 'Unite a nosotros', href: '#' },
            ]}
          />
        </nav>
      </div>
    </header>
  );
}

