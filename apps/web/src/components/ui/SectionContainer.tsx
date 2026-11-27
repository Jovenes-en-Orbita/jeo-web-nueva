import React from "react";
import Link from "next/link";

interface SectionContainerProps {
  id?: string;
  /** Alternancia visual de secciones en el Home: fondo oscuro o blanco */
  surface?: "dark" | "white";
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  actionHref?: string;
  actionLabel?: string;
  maxWidthClass?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Contenedor estándar de sección para el Home y páginas de JEO.
 * Alterna entre superficie oscura (#050811) y blanca (#ffffff).
 */
export function SectionContainer({
  id,
  surface = "dark",
  eyebrow,
  title,
  titleHighlight,
  actionHref,
  actionLabel,
  maxWidthClass = "max-w-7xl",
  className = "",
  children,
}: SectionContainerProps) {
  const isDark = surface === "dark";

  return (
    <section
      id={id}
      className={`py-16 md:py-20 scroll-mt-[76px] ${
        isDark ? "bg-[#050811] text-white" : "bg-white text-neutral-900"
      } ${className}`}
    >
      <div className={`w-full ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        {(eyebrow || title || actionHref) && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              {eyebrow && (
                <span
                  className={`block text-xs uppercase tracking-widest mb-1 font-inter font-semibold ${
                    isDark ? "text-slate-400" : "text-neutral-500"
                  }`}
                >
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight font-chakra">
                  <span className={isDark ? "text-white" : "text-blue-950"}>
                    {title}
                  </span>
                  {titleHighlight && (
                    <span className="text-[#e8c648]"> {titleHighlight}</span>
                  )}
                </h2>
              )}
            </div>

            {actionHref && actionLabel && (
              <Link
                href={actionHref}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-wider text-[#e8c648] hover:text-[#f5db76] transition-colors uppercase font-inter group self-start sm:self-auto"
              >
                <span>{actionLabel}</span>
                <span
                  aria-hidden="true"
                  className="text-[#d83933] transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
