"use client";

import React, { useState, useEffect, useRef } from "react";
import type { NewsCategory, PaginatedNewsResponse } from "@jeo/shared";
import { searchNews } from "@/lib/api";
import { NewsCard } from "./NewsCard";
import { SearchableCatalog } from "@/components/ui/SearchableCatalog";

interface NewsCatalogProps {
  initialResponse: PaginatedNewsResponse;
  categories: NewsCategory[];
  tags: string[];
}

const NEWS_PER_PAGE = 6;

/**
 * Catálogo completo de noticias espaciales con búsqueda en tiempo real,
 * filtros por categoría/tag, ordenamiento y paginación, compartiendo SearchableCatalog con Galería.
 */
export function NewsCatalog({
  initialResponse,
  categories,
  tags,
}: NewsCatalogProps) {
  const [data, setData] = useState(initialResponse.data);
  const [page, setPage] = useState(initialResponse.page);
  const [totalPages, setTotalPages] = useState(initialResponse.totalPages);
  const [total, setTotal] = useState(initialResponse.total);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "readTimeMinutes">(
    "date",
  );
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
        const res = await searchNews({
          search: debouncedSearch || undefined,
          category: selectedCategory || undefined,
          tag: selectedTag || undefined,
          status: "PUBLISHED",
          sortBy,
          sortOrder: sortBy === "title" ? "asc" : "desc",
          page,
          limit: NEWS_PER_PAGE,
          include: "categories",
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
  }, [debouncedSearch, selectedCategory, selectedTag, sortBy, page]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory((prev) => (prev === slug ? "" : slug));
    setPage(1);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? "" : tag));
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSelectedTag("");
    setSortBy("date");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch || selectedCategory || selectedTag,
  );

  const resultSummary =
    hasActiveFilters && !isLoading
      ? total === 1
        ? "1 noticia encontrada con los filtros actuales"
        : `${total} noticias encontradas con los filtros actuales`
      : null;

  const filtersSlot = (
    <div className="space-y-3">
      {/* Categorías + Ordenamiento */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("");
                setPage(1);
              }}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer font-inter ${
                selectedCategory === ""
                  ? "bg-[#e8c648] text-[#050811] border-[#e8c648]"
                  : "bg-[#090e1d] text-slate-300 border-white/15 hover:border-[#e8c648]/60"
              }`}
            >
              Todas las categorías
            </button>
            {categories.map((cat) => {
              const active = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer font-inter ${
                    active
                      ? "bg-[#e8c648] text-[#050811] border-[#e8c648]"
                      : "bg-[#090e1d] text-slate-300 border-white/15 hover:border-[#e8c648]/60"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </>
        )}

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as "date" | "title" | "readTimeMinutes");
            setPage(1);
          }}
          aria-label="Ordenar noticias por"
          className="bg-[#090e1d] border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-200 outline-none focus:border-[#e8c648] cursor-pointer font-inter"
        >
          <option value="date">Más recientes</option>
          <option value="title">Título (A-Z)</option>
          <option value="readTimeMinutes">Tiempo de lectura</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-white underline cursor-pointer font-inter"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tags populares */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {tags.slice(0, 10).map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagChange(tag)}
                className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer font-inter ${
                  active
                    ? "bg-white text-[#050811] border-white font-bold"
                    : "bg-transparent text-slate-400 border-white/10 hover:border-white/40 hover:text-white"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <SearchableCatalog
      items={data}
      getKey={(article) => article.id || article.slug}
      renderItem={(article) => <NewsCard article={article} />}
      searchValue={searchInput}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar noticias por título, resumen, autor o etiqueta..."
      searchAriaLabel="Buscar noticias espaciales"
      resultSummary={resultSummary}
      filtersSlot={filtersSlot}
      isLoading={isLoading}
      hasActiveFilters={hasActiveFilters}
      emptyMessage="No hay noticias disponibles en la plataforma."
      emptySearchMessage="No se encontraron noticias que coincidan con tu búsqueda o filtros."
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      paginationAriaLabel="Paginación de noticias espaciales"
      containerClassName="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
    />
  );
}
