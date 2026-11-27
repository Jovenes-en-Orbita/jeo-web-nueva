"use client";

import React from "react";
import { FiLoader } from "react-icons/fi";
import { CatalogSearchBar } from "./CatalogSearchBar";
import { EmptyState } from "./EmptyState";
import { PaginationControls } from "./PaginationControls";

interface SearchableCatalogProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchAriaLabel: string;
  resultSummary?: string | null;
  filtersSlot?: React.ReactNode;
  isLoading: boolean;
  emptyMessage: string;
  emptySearchMessage: string;
  hasActiveFilters: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationAriaLabel: string;
  containerClassName?: string;
  gridClassName?: string;
}

/**
 * Contenedor genérico reutilizable para catálogos con buscador, filtros,
 * estado de carga, estado vacío, grilla responsiva y paginación horizontal.
 * Compartido entre Galería (/galeria) y Noticias (/noticias).
 */
export function SearchableCatalog<T>({
  items,
  getKey,
  renderItem,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  resultSummary,
  filtersSlot,
  isLoading,
  emptyMessage,
  emptySearchMessage,
  hasActiveFilters,
  currentPage,
  totalPages,
  onPageChange,
  paginationAriaLabel,
  containerClassName = "w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12",
}: SearchableCatalogProps<T>) {
  const handlePageChange = (nextPage: number) => {
    onPageChange(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={containerClassName}>
      <CatalogSearchBar
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        ariaLabel={searchAriaLabel}
        resultSummary={resultSummary}
        filtersSlot={filtersSlot}
      />

      {isLoading ? (
        <div className="py-20 flex items-center justify-center">
          <FiLoader className="w-8 h-8 text-[#e8c648] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          message={hasActiveFilters ? emptySearchMessage : emptyMessage}
        />
      ) : (
        <div className={gridClassName}>
          {items.map((item) => (
            <React.Fragment key={getKey(item)}>
              {renderItem(item)}
            </React.Fragment>
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        ariaLabel={paginationAriaLabel}
      />
    </div>
  );
}
