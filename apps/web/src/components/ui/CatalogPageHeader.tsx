import React from "react";

interface CatalogPageHeaderProps {
  titlePrefix: string;
  titleHighlight: string;
  subtitle?: string;
  maxWidthClass?: string;
  surface?: "dark" | "white";
}

/**
 * Encabezado reutilizable y centrado para páginas de catálogo (Noticias, Galería, etc.).
 */
export function CatalogPageHeader({
  titlePrefix,
  titleHighlight,
  subtitle,
  maxWidthClass = "max-w-5xl",
  surface = "dark",
}: CatalogPageHeaderProps) {
  const isWhite = surface === "white";

  return (
    <div
      className={`w-full ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12`}
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight font-chakra">
        <span className={isWhite ? "text-neutral-950" : "text-white"}>
          {titlePrefix}{" "}
        </span>
        <span className={isWhite ? "text-[#b89212]" : "text-[#e8c648]"}>
          {titleHighlight}
        </span>
      </h1>
      {subtitle && (
        <p
          className={`mt-3 text-sm max-w-2xl mx-auto font-inter ${
            isWhite ? "text-neutral-600" : "text-slate-400"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
