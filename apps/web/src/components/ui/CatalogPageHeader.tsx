import React from "react";

interface CatalogPageHeaderProps {
  titlePrefix: string;
  titleHighlight: string;
  subtitle?: string;
  maxWidthClass?: string;
}

/**
 * Encabezado reutilizable y centrado para páginas de catálogo (Noticias, Galería, etc.).
 */
export function CatalogPageHeader({
  titlePrefix,
  titleHighlight,
  subtitle,
  maxWidthClass = "max-w-5xl",
}: CatalogPageHeaderProps) {
  return (
    <div
      className={`w-full ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12`}
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight font-chakra">
        <span className="text-white">{titlePrefix} </span>
        <span className="text-[#e8c648]">{titleHighlight}</span>
      </h1>
      {subtitle && (
        <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto font-inter">
          {subtitle}
        </p>
      )}
    </div>
  );
}
