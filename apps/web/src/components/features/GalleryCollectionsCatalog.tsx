"use client";

import React, { useState, useEffect, useRef } from "react";
import type { PaginatedGalleryCollectionsResponse } from "@jeo/shared";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";
import { searchGalleryCollections } from "@/lib/api";
import { GalleryCollectionCard } from "./GalleryCollectionCard";
import { PaginationControls } from "@/components/ui/PaginationControls";

interface GalleryCollectionsCatalogProps {
  initialResponse: PaginatedGalleryCollectionsResponse;
}

const COLLECTIONS_PER_PAGE = 6; // Grid de 2 columnas x 3 filas

/**
 * Diseño 2: Catálogo completo de colecciones de galería.
 * Incluye buscador de colecciones, grilla de 2 columnas x 3 filas con la tarjeta estándar
 * y navegación horizontal por paginación con botones.
 */
export function GalleryCollectionsCatalog({
  initialResponse,
}: GalleryCollectionsCatalogProps) {
  const [data, setData] = useState(initialResponse.data);
  const [page, setPage] = useState(initialResponse.page);
  const [totalPages, setTotalPages] = useState(initialResponse.totalPages);
  const [total, setTotal] = useState(initialResponse.total);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const res = await searchGalleryCollections({
          search: debouncedSearch || undefined,
          page,
          limit: COLLECTIONS_PER_PAGE,
        });
        if (!cancelled) {
          setData(res.data);
          setTotalPages(res.totalPages);
          setTotal(res.total);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPage();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, page]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Buscador de colecciones */}
      <div className="max-w-xl mx-auto mb-10 sm:mb-12">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar colecciones por título, categoría o temática..."
            aria-label="Buscar colecciones fotográficas"
            className="w-full bg-[#090e1d] border border-white/15 pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#e8c648] transition-colors font-inter"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
        {debouncedSearch && !isLoading && (
          <p className="text-xs text-slate-400 mt-2 text-center font-inter">
            {total === 1
              ? `1 colección encontrada para "${debouncedSearch}"`
              : `${total} colecciones encontradas para "${debouncedSearch}"`}
          </p>
        )}
      </div>

      {/* Grilla de 2 columnas x 3 filas */}
      {isLoading ? (
        <div className="py-20 flex items-center justify-center">
          <FiLoader className="w-8 h-8 text-[#e8c648] animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="py-16 text-center border border-white/10 bg-[#080d1a]">
          <p className="text-sm text-slate-400 font-inter">
            {debouncedSearch
              ? "No se encontraron colecciones que coincidan con tu búsqueda."
              : "Aún no hay colecciones fotográficas disponibles."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
          {data.map((collection) => (
            <GalleryCollectionCard
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>
      )}

      {/* Paginación horizontal por botones */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        ariaLabel="Paginación de colecciones fotográficas"
      />
    </div>
  );
}
