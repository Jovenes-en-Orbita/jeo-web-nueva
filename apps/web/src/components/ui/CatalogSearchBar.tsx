"use client";

import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface CatalogSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  resultSummary?: string | null;
  filtersSlot?: React.ReactNode;
  surface?: "dark" | "white";
}

/**
 * Barra de búsqueda reutilizable con botón de limpiar, resumen de resultados
 * y slot opcional para filtros avanzados (categorías, tags, ordenamiento).
 */
export function CatalogSearchBar({
  value,
  onChange,
  placeholder,
  ariaLabel,
  resultSummary,
  filtersSlot,
  surface = "dark",
}: CatalogSearchBarProps) {
  const isWhite = surface === "white";

  return (
    <div className="max-w-2xl mx-auto mb-10 sm:mb-12 space-y-4">
      <div className="relative">
        <FiSearch
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
            isWhite ? "text-neutral-400" : "text-slate-400"
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={`w-full border pl-11 pr-10 py-3 text-sm outline-none transition-colors font-inter ${
            isWhite
              ? "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
              : "bg-[#090e1d] border-white/15 text-white placeholder:text-slate-500 focus:border-[#e8c648]"
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpiar búsqueda"
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors cursor-pointer ${
              isWhite
                ? "text-neutral-500 hover:text-neutral-900"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {filtersSlot && <div>{filtersSlot}</div>}

      {resultSummary && (
        <p
          className={`text-xs text-center font-inter ${
            isWhite ? "text-neutral-600" : "text-slate-400"
          }`}
        >
          {resultSummary}
        </p>
      )}
    </div>
  );
}
