"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Dropdown } from "@/components/ui/Dropdown";
import { Logo } from "@/components/ui/Logo";
import { FiMenu, FiX } from "react-icons/fi";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("Navbar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-black border-b-[3px] border-[#d83933] relative text-white sticky top-0 z-40 shadow-xl">
        <div className="wrap relative flex justify-between items-center h-[76px] px-4 md:px-6">
          {/* Mobile Layout Left */}
          <div className="flex lg:hidden items-center">
            <Link
              href="/"
              className="font-[var(--font-montserrat)] font-extrabold text-sm tracking-wider uppercase text-[#d83933]"
            >
              JEO
            </Link>
          </div>

          {/* Desktop Logo (izquierda) */}
          <div className="hidden lg:flex items-center">
            <Logo size={48} />
          </div>

          {/* Logo centrado (solo celular) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1 z-50 flex justify-center lg:hidden">
            <Logo size={90} />
          </div>

          {/* Desktop Navigation (derecha) */}
          <nav className="hidden lg:flex items-center gap-6">
            <Dropdown
              label={t("about")}
              items={[
                { label: t("aboutJeo"), href: "/nosotros" },
                { label: t("join"), href: "/unite" },
              ]}
            />
            <Dropdown
              label={t("cosmos")}
              items={[
                { label: t("universe"), href: "/universo" },
                { label: t("news"), href: "/noticias" },
                { label: t("gallery"), href: "/galeria" },
              ]}
            />
            <Dropdown
              label={t("multimedia")}
              items={[
                { label: t("newsletter"), href: "/newsletter" },
                { label: t("books"), href: "/libros" },
              ]}
            />
            <LanguageSwitcher />
          </nav>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-3 lg:hidden z-50">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-none border border-white/20 bg-white/10 text-white hover:bg-white/20"
              title={t("menu")}
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#060a17] border-b border-white/10 px-6 py-6 space-y-6 animate-fade-in-up">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-yellow)] block mb-2 font-[var(--font-montserrat)]">
                {t("cosmos")}
              </span>
              <div className="flex flex-col space-y-2 text-sm text-slate-300">
                <Link
                  href="/universo"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("universe")}
                </Link>
                {/* TODO: Secciones en desarrollo */}
                {/* <Link href="/sistema-solar" onClick={() => setIsMobileMenuOpen(false)}>Sistema Solar</Link> */}
                {/* <Link href="/constelaciones" onClick={() => setIsMobileMenuOpen(false)}>Constelaciones</Link> */}
                <Link
                  href="/noticias"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("news")}
                </Link>
                <Link
                  href="/galeria"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("gallery")}
                </Link>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-yellow)] block mb-2 font-[var(--font-montserrat)]">
                {t("multimediaMobile")}
              </span>
              <div className="flex flex-col space-y-2 text-sm text-slate-300">
                <Link
                  href="/newsletter"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("newsletter")}
                </Link>
                <Link href="/libros" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("books")}
                </Link>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-yellow)] block mb-2 font-[var(--font-montserrat)]">
                {t("about")}
              </span>
              <div className="flex flex-col space-y-2 text-sm text-slate-300">
                <Link
                  href="/nosotros"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("aboutJeo")}
                </Link>
                <Link href="/unite" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("join")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
