'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { GalleryCollection, GalleryImage } from '@jeo/shared';
import { FiMaximize2, FiX, FiChevronLeft, FiChevronRight, FiDownload, FiCamera, FiInfo } from 'react-icons/fi';

interface GalleryViewerProps {
  initialFeatured: GalleryCollection;
  collections: GalleryCollection[];
}

export function GalleryViewer({ initialFeatured, collections }: GalleryViewerProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState(initialFeatured.id || 'artemis-ii-collection');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const activeCollection =
    collections.find((c) => c.id === selectedCollectionId) || initialFeatured;

  const images = activeCollection.images || [];

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setActiveImageIndex(null);
  };

  const handleNext = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  }, [activeImageIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  }, [activeImageIndex, images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, handleNext, handlePrev]);

  const currentImage: GalleryImage | null =
    activeImageIndex !== null ? images[activeImageIndex] : null;

  return (
    <div className="wrap max-w-6xl mx-auto px-4 py-8">
      {/* Header Info & Collection Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold block mb-1">
            Colección Activa
          </span>
          <h2 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
            {activeCollection.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {activeCollection.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <FiCamera className="text-[var(--color-yellow)]" />
            <span>{images.length} fotografías en alta resolución</span>
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => {
          const imageSrc =
            img.url && img.url.startsWith('/') ? img.url : `/assets/gallery-${(idx % 6) + 1}.svg`;

          return (
            <div
              key={img.id || idx}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative h-[280px] rounded-2xl overflow-hidden bg-[#0d162a] border border-white/10 cursor-pointer hover:border-[var(--color-yellow)]/60 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <Image
                src={imageSrc}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white drop-shadow">
                    {img.alt}
                  </span>
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <FiMaximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                {img.caption && (
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    {img.caption}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {currentImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 md:p-8 animate-fade-in-up">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold">
                {activeImageIndex !== null ? activeImageIndex + 1 : 1} / {images.length}
              </span>
              <span className="text-sm font-semibold text-white">
                {currentImage.alt}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseLightbox}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Cerrar (Esc)"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image Container */}
          <div className="relative w-full max-w-5xl h-[65vh] flex items-center justify-center my-auto">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[var(--color-yellow)] hover:text-[#060a17] text-white transition-all z-20"
              title="Foto anterior (Flecha izquierda)"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[var(--color-yellow)] hover:text-[#060a17] text-white transition-all z-20"
              title="Foto siguiente (Flecha derecha)"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>

            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#090d1a]">
              <Image
                src={
                  currentImage.url && currentImage.url.startsWith('/')
                    ? currentImage.url
                    : `/assets/gallery-${((activeImageIndex ?? 0) % 6) + 1}.svg`
                }
                alt={currentImage.alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="w-full max-w-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <FiInfo className="w-4 h-4 text-[var(--color-yellow)] flex-shrink-0 mt-0.5" />
              <p>{currentImage.caption || currentImage.alt}</p>
            </div>

            <a
              href={
                currentImage.url && currentImage.url.startsWith('/')
                  ? currentImage.url
                  : `/assets/gallery-${((activeImageIndex ?? 0) % 6) + 1}.svg`
              }
              download
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-yellow)] text-[#060a17] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors flex-shrink-0"
            >
              <FiDownload className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
