'use client';

import { Dropdown } from '@/components/ui/Dropdown';
import { Logo } from '@/components/ui/Logo';

/**
 * Main navigation bar matching the wireframe's header.nav.
 * Logo left, dropdown menus right.
 */
export function Navbar() {
  return (
    <header className="bg-[var(--color-navy)] border-b-[3px] border-[var(--color-yellow)] relative text-white">
      <div className="wrap flex justify-between items-center h-[76px] max-[900px]:h-auto max-[900px]:py-3.5 max-[900px]:px-6 max-[900px]:flex-col max-[900px]:gap-3.5">
        {/* Left: Logo oficial */}
        <div className="py-1">
          <Logo size={46} showText={true} />
        </div>

        {/* Right: Dropdown menus */}
        <nav className="flex justify-end items-center gap-7 max-[900px]:justify-center max-[900px]:flex-wrap">
          <Dropdown
            label="Cosmos"
            items={[
              { label: 'El Universo', href: '/universo' },
              { label: 'Sistema Solar', href: '/sistema-solar' },
              { label: 'Constelaciones', href: '/constelaciones' },
              { label: 'Noticias Espaciales', href: '/noticias' },
              { label: 'Fragmentos de Memoria', href: '/galeria' },
            ]}
          />
          <Dropdown
            label="Multimedia"
            items={[
              { label: 'Newsletter', href: '/newsletter' },
              { label: 'Libros electrónicos', href: '/libros' },
              { label: 'Redes sociales', href: '/redes' },
            ]}
          />
          <Dropdown
            label="Quiénes somos"
            items={[
              { label: 'Conoce a JEO', href: '/nosotros' },
              { label: 'Ecosistema Espacial Argentino', href: '/ecosistema' },
              { label: 'Unite a nosotros', href: '/unite' },
            ]}
          />
        </nav>
      </div>
    </header>
  );
}


