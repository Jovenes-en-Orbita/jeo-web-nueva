"use client";

import React, { useState, useEffect, useRef } from "react";
import type { PaginatedGalleryCollectionsResponse } from "@jeo/shared";
import { searchGalleryCollections } from "@/lib/api";
import { GalleryCollectionCard } from "./GalleryCollectionCard";
import { SearchableCatalog } from "@/components/ui/SearchableCatalog";

interface GalleryCollectionsCatalogProps {
  initialResponse: PaginatedGalleryCollectionsResponse;
}

const COLLECTIONS_PER_PAGE = 6; // Grid de 2 columnas x 3 filas

/**
 * Catálogo completo de colecciones de galería usando el componente compartido SearchableCatalog.
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

  const resultSummary =
    debouncedSearch && !isLoading
      ? total === 1
        ? `1 colección encontrada para "${debouncedSearch}"`
        : `${total} colecciones encontradas para "${debouncedSearch}"`
      : null;

  return (
    <SearchableCatalog
      items={data}
      getKey={(collection) => collection.id}
      renderItem={(collection) => (
        <GalleryCollectionCard collection={collection} />
      )}
      searchValue={searchInput}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar colecciones por título, categoría o temática..."
      searchAriaLabel="Buscar colecciones fotográficas"
      resultSummary={resultSummary}
      isLoading={isLoading}
      hasActiveFilters={Boolean(debouncedSearch)}
      emptyMessage="Aún no hay colecciones fotográficas disponibles."
      emptySearchMessage="No se encontraron colecciones que coincidan con tu búsqueda."
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      paginationAriaLabel="Paginación de colecciones fotográficas"
      containerClassName="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      gridClassName="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12"
    />
  );
}
