"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  ariaLabel?: string;
}

/**
 * Botonera horizontal reutilizable para paginación (colecciones 2x3 y fotos 4x3).
 */
export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  ariaLabel = "Navegación de páginas",
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): Array<number | "ellipsis"> => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages: Array<number | "ellipsis"> = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("ellipsis");
    for (let p = start; p <= end; p++) {
      pages.push(p);
    }
    if (end < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      aria-label={ariaLabel}
      className="mt-12 flex items-center justify-center gap-2 flex-wrap"
    >
      <button
        type="button"
        disabled={currentPage <= 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-white/15 bg-[#090e1d] text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-[#e8c648] hover:text-[#e8c648] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer font-inter"
      >
        <FiChevronLeft className="w-4 h-4" />
        <span>Anterior</span>
      </button>

      <div className="flex items-center gap-1.5">
        {visiblePages.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-xs text-slate-500 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              disabled={isLoading}
              aria-current={item === currentPage ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={`min-w-[38px] h-[38px] px-2.5 border text-xs font-bold font-chakra transition-colors cursor-pointer ${
                item === currentPage
                  ? "bg-[#e8c648] border-[#e8c648] text-[#050811]"
                  : "bg-[#090e1d] border-white/15 text-slate-300 hover:border-[#e8c648]/60 hover:text-white"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-white/15 bg-[#090e1d] text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-[#e8c648] hover:text-[#e8c648] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer font-inter"
      >
        <span>Siguiente</span>
        <FiChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
