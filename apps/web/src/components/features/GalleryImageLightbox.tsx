"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryImage } from "@jeo/shared";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface GalleryImageLightboxProps {
  images: GalleryImage[];
  activeIndex: number | null;
  onChangeIndex: (nextIndex: number) => void;
  onClose: () => void;
}

/**
 * Diseño 4: Visor modal de fotografía individual.
 * Fondo desenfocado sobre la grilla de colección, botones laterales de navegación
 * y únicamente el título de la imagen superpuesto en la esquina inferior izquierda.
 */
export function GalleryImageLightbox({
  images,
  activeIndex,
  onChangeIndex,
  onClose,
}: GalleryImageLightboxProps) {
  const isOpen = activeIndex !== null && images[activeIndex] !== undefined;
  const currentImage = isOpen ? images[activeIndex!] : null;

  const handleNext = useCallback(() => {
    if (activeIndex === null || images.length <= 1) return;
    onChangeIndex(activeIndex < images.length - 1 ? activeIndex + 1 : 0);
  }, [activeIndex, images.length, onChangeIndex]);

  const handlePrev = useCallback(() => {
    if (activeIndex === null || images.length <= 1) return;
    onChangeIndex(activeIndex > 0 ? activeIndex - 1 : images.length - 1);
  }, [activeIndex, images.length, onChangeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentImage) return null;

  const imageSrc =
    currentImage.url && currentImage.url.trim() !== ""
      ? currentImage.url
      : `/assets/gallery-${((activeIndex ?? 0) % 6) + 1}.svg`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.alt || "Vista ampliada de fotografía"}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#050811]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
    >
      {/* Botón cerrar discreto en esquina superior derecha */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Cerrar imagen"
        className="fixed top-5 right-5 z-50 p-2.5 bg-black/50 hover:bg-black/80 border border-white/20 text-white transition-colors cursor-pointer"
      >
        <FiX className="w-5 h-5" />
      </button>

      {/* Contenedor central con botones laterales */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl flex items-center justify-center gap-3 sm:gap-5"
      >
        {/* Botón anterior (costado izquierdo) */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto anterior"
            className="shrink-0 p-3 sm:p-3.5 bg-black/60 hover:bg-[#e8c648] hover:text-[#050811] border border-white/20 text-white transition-colors cursor-pointer"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Imagen con título superpuesto únicamente */}
        <div className="relative w-full aspect-[16/10] max-h-[82vh] overflow-hidden bg-[#090e1d] border border-white/15 shadow-2xl">
          <Image
            src={imageSrc}
            alt={currentImage.alt || "Fotografía astronómica"}
            fill
            sizes="(max-width: 1280px) 92vw, 1024px"
            className="object-cover"
            priority
          />

          {/* Degradado inferior sutil solo para asegurar legibilidad del título */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Título de la foto */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white font-chakra tracking-tight drop-shadow-md">
              {currentImage.alt}
            </h2>
          </div>
        </div>

        {/* Botón siguiente (costado derecho) */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto siguiente"
            className="shrink-0 p-3 sm:p-3.5 bg-black/60 hover:bg-[#e8c648] hover:text-[#050811] border border-white/20 text-white transition-colors cursor-pointer"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
