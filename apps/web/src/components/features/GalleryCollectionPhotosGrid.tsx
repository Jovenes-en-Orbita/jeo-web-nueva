"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PaginatedGalleryCollectionDetailResponse } from "@jeo/shared";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { getGalleryCollectionDetail } from "@/lib/api";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { GalleryImageLightbox } from "./GalleryImageLightbox";

interface GalleryCollectionPhotosGridProps {
  idOrSlug: string;
  initialDetail: PaginatedGalleryCollectionDetailResponse;
}

const PHOTOS_PER_PAGE = 12; // Grid de 4 columnas x 3 filas

/**
 * Diseño 3: Vista previa de todas las fotos de una colección seleccionada.
 * Sin buscador, grilla estricta de 4 columnas x 3 filas, paginación horizontal
 * y apertura del visor Lightbox (Diseño 4) al hacer clic en cualquier foto.
 */
export function GalleryCollectionPhotosGrid({
  idOrSlug,
  initialDetail,
}: GalleryCollectionPhotosGridProps) {
  const [images, setImages] = useState(initialDetail.data);
  const [page, setPage] = useState(initialDetail.page);
  const [totalPages, setTotalPages] = useState(initialDetail.totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const res = await getGalleryCollectionDetail(
          idOrSlug,
          page,
          PHOTOS_PER_PAGE,
        );
        if (!cancelled && res) {
          setImages(res.data);
          setTotalPages(res.totalPages);
          setActiveImageIndex(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPage();
    return () => {
      cancelled = true;
    };
  }, [idOrSlug, page]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Volver al catálogo */}
      <div className="mb-6">
        <Link
          href="/galeria"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors font-inter"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Volver a colecciones</span>
        </Link>
      </div>

      {/* Título centrado de la colección */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wider text-neutral-950 font-chakra">
          {initialDetail.collection.title}
        </h1>
      </div>

      {/* Grilla 4 columnas x 3 filas (12 fotos por página) */}
      {isLoading ? (
        <div className="py-20 flex items-center justify-center">
          <FiLoader className="w-8 h-8 text-neutral-900 animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="py-16 text-center border border-neutral-200 bg-neutral-50">
          <p className="text-sm text-neutral-600 font-inter">
            Esta colección aún no tiene fotografías publicadas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {images.map((img, idx) => {
            const imageSrc =
              img.url && img.url.trim() !== ""
                ? img.url
                : "/assets/hero-cosmos.svg";

            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 border border-neutral-200 hover:border-neutral-900/60 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <Image
                  src={imageSrc}
                  alt={img.alt || "Fotografía astronómica"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Botonera horizontal de navegación */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        ariaLabel="Paginación de fotografías de la colección"
        surface="white"
      />

      {/* Diseño 4: Visor Lightbox minimalista con navegación lateral */}
      <GalleryImageLightbox
        images={images}
        activeIndex={activeImageIndex}
        onChangeIndex={setActiveImageIndex}
        onClose={() => setActiveImageIndex(null)}
      />
    </div>
  );
}
