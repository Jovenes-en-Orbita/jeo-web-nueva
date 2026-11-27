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
}: CatalogSearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto mb-10 sm:mb-12 space-y-4">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full bg-[#090e1d] border border-white/15 pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#e8c648] transition-colors font-inter"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {filtersSlot && <div>{filtersSlot}</div>}

      {resultSummary && (
        <p className="text-xs text-slate-400 text-center font-inter">
          {resultSummary}
        </p>
      )}
    </div>
  );
}
