'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dropdown } from '@/components/ui/Dropdown';
import { Logo } from '@/components/ui/Logo';
import { FiSearch, FiMenu, FiX, FiArrowRight, FiCompass, FiFileText } from 'react-icons/fi';

const SEARCH_ITEMS = [
  { title: 'El Universo (Vista 3D)', type: 'Cosmos', href: '/universo' },
  { title: 'Sistema Solar (Simulación 3D)', type: 'Cosmos', href: '/sistema-solar' },
  { title: 'Constelaciones & Bóveda Celeste', type: 'Cosmos', href: '/constelaciones' },
  { title: 'Noticias Espaciales', type: 'Noticias', href: '/noticias' },
  { title: 'Artemis III: El regreso a la Luna', type: 'Artículo', href: '/noticias/artemis-iii' },
  { title: 'Descubren exoplaneta con atmósfera habitable', type: 'Artículo', href: '/noticias/exoplaneta-habitable' },
  { title: 'SpaceX logra captura de Starship', type: 'Artículo', href: '/noticias/spacex-starship' },
  { title: 'Fragmentos de Memoria (Galería de Fotos)', type: 'Multimedia', href: '/galeria' },
  { title: 'Boletín Órbita Semanal (Newsletter)', type: 'Multimedia', href: '/newsletter' },
  { title: 'Libros Electrónicos & Guías PDF', type: 'Recursos', href: '/libros' },
  { title: 'Ecosistema Espacial Argentino (CONAE / INVAP)', type: 'Institucional', href: '/ecosistema' },
  { title: 'Conoce a JEO (Quiénes Somos)', type: 'Institucional', href: '/nosotros' },
  { title: 'Unite a Nosotros (Voluntariado)', type: 'Comunidad', href: '/unite' },
  { title: 'Redes Sociales Oficiales', type: 'Comunidad', href: '/redes' },
];

export function Navbar() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Keyboard shortcut (Ctrl+K or /) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 6);

  const handleSelectResult = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(href);
  };

  return (
    <>
      <header className="bg-[var(--color-navy)] border-b-[3px] border-[var(--color-yellow)] relative text-white sticky top-0 z-40 shadow-lg">
        <div className="wrap flex justify-between items-center h-[76px] px-4 md:px-6">
          {/* Left: Official Logo */}
          <div className="py-1">
            <Logo size={46} showText={true} />
          </div>

          {/* Center/Right: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
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

            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl text-xs text-slate-200 hover:text-white transition-all border border-white/10 cursor-pointer ml-2"
              title="Buscar en la plataforma (Ctrl+K)"
            >
              <FiSearch className="w-3.5 h-3.5 text-[var(--color-yellow)]" />
              <span>Buscar...</span>
              <kbd className="hidden sm:inline-block bg-black/40 text-[10px] px-1.5 py-0.5 rounded text-slate-400">
                Ctrl K
              </kbd>
            </button>
          </nav>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl bg-white/10 text-[var(--color-yellow)] hover:bg-white/20"
              title="Buscar"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
              title="Menú"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#060a17] border-b border-white/10 px-6 py-6 space-y-6 animate-fade-in-up">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-yellow)] block mb-2 font-[var(--font-montserrat)]">
                Cosmos
              </span>
              <div className="flex flex-col space-y-2 text-sm text-slate-300">
                <Link href="/universo" onClick={() => setIsMobileMenuOpen(false)}>El Universo</Link>
                <Link href="/sistema-solar" onClick={() => setIsMobileMenuOpen(false)}>Sistema Solar</Link>
                <Link href="/constelaciones" onClick={() => setIsMobileMenuOpen(false)}>Constelaciones</Link>
                <Link href="/noticias" onClick={() => setIsMobileMenuOpen(false)}>Noticias Espaciales</Link>
                <Link href="/galeria" onClick={() => setIsMobileMenuOpen(false)}>Fragmentos de Memoria</Link>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-yellow)] block mb-2 font-[var(--font-montserrat)]">
                Multimedia & Recursos
              </span>
              <div className="flex flex-col space-y-2 text-sm text-slate-300">
                <Link href="/newsletter" onClick={() => setIsMobileMenuOpen(false)}>Newsletter</Link>
                <Link href="/libros" onClick={() => setIsMobileMenuOpen(false)}>Libros electrónicos</Link>
                <Link href="/redes" onClick={() => setIsMobileMenuOpen(false)}>Redes sociales</Link>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-yellow)] block mb-2 font-[var(--font-montserrat)]">
                Quiénes somos
              </span>
              <div className="flex flex-col space-y-2 text-sm text-slate-300">
                <Link href="/nosotros" onClick={() => setIsMobileMenuOpen(false)}>Conoce a JEO</Link>
                <Link href="/ecosistema" onClick={() => setIsMobileMenuOpen(false)}>Ecosistema Espacial Argentino</Link>
                <Link href="/unite" onClick={() => setIsMobileMenuOpen(false)}>Unite a nosotros</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal (Command Palette) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
          <div className="bg-[#0b1120] border border-white/20 rounded-3xl max-w-xl w-full p-4 md:p-6 relative shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
              <FiSearch className="w-5 h-5 text-[var(--color-yellow)] flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículos, planetas, constelaciones o secciones..."
                className="w-full bg-transparent text-base text-white placeholder:text-slate-500 outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-2 scrollbar-none">
              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No se encontraron resultados para &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectResult(item.href)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-[var(--color-yellow)]/10 hover:border-[var(--color-yellow)]/30 border border-transparent text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10 text-[var(--color-yellow)]">
                        {item.type === 'Artículo' || item.type === 'Noticias' ? (
                          <FiFileText className="w-4 h-4" />
                        ) : (
                          <FiCompass className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white group-hover:text-[var(--color-yellow)] transition-colors block">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <FiArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[var(--color-yellow)] transition-transform group-hover:translate-x-1" />
                  </button>
                ))
              )}
            </div>

            <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
              <span>Navega con flechas o ratón</span>
              <span>Presiona Esc para cerrar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
