'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dropdown } from '@/components/ui/Dropdown';
import { Logo } from '@/components/ui/Logo';
import { FiMenu, FiX } from 'react-icons/fi';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-[var(--color-navy)] border-b-[3px] border-[var(--color-yellow)] relative text-white sticky top-0 z-40 shadow-xl">
        <div className="wrap relative flex justify-between items-center h-[76px] px-4 md:px-6">

          {/* Mobile Layout Left */}
          <div className="flex lg:hidden items-center">
            <Link href="/" className="font-[var(--font-montserrat)] font-extrabold text-sm tracking-wider uppercase text-[var(--color-yellow)]">
              JEO
            </Link>
          </div>

          {/* Desktop Left Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Dropdown
              label="Cosmos"
              items={[
                { label: 'El Universo', href: '/universo' },
                { label: 'Noticias Espaciales', href: '/noticias' },
                { label: 'Fragmentos de Memoria', href: '/galeria' },
              ]}
            />
            <Dropdown
              label="Multimedia"
              items={[
                { label: 'Newsletter', href: '/newsletter' },
                { label: 'Libros electrónicos', href: '/libros' },
              ]}
            />
          </nav>

          {/* Centered Overhanging Prominent Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1 z-50 flex justify-center items-center">
            <Logo size={90} />
          </div>

          {/* Desktop Right Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Dropdown
              label="Quiénes somos"
              items={[
                { label: 'Conoce a JEO', href: '/nosotros' },
                { label: 'Ecosistema Espacial Argentino', href: '/ecosistema' },
                { label: 'Unite a nosotros', href: '/unite' },
              ]}
            />
          </nav>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-3 lg:hidden z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-none border border-white/20 bg-white/10 text-white hover:bg-white/20"
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
                {/* TODO: Secciones en desarrollo */}
                {/* <Link href="/sistema-solar" onClick={() => setIsMobileMenuOpen(false)}>Sistema Solar</Link> */}
                {/* <Link href="/constelaciones" onClick={() => setIsMobileMenuOpen(false)}>Constelaciones</Link> */}
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
    </>
  );
}

