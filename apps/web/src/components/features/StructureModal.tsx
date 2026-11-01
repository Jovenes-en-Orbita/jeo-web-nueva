"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import type { UniverseStructure } from "@/lib/universeStructures";

interface StructureModalProps {
  structure: UniverseStructure | null;
  structures: UniverseStructure[];
  isOpen: boolean;
  onClose: () => void;
  onSelectStructure: (structure: UniverseStructure) => void;
}

export function StructureModal({
  structure,
  structures,
  isOpen,
  onClose,
  onSelectStructure,
}: StructureModalProps) {
  const currentIndex = structure
    ? structures.findIndex((s) => s.id === structure.id)
    : -1;
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= structures.length - 1;

  const handlePrev = () => {
    if (!isFirst && currentIndex > 0) {
      onSelectStructure(structures[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!isLast && currentIndex < structures.length - 1) {
      onSelectStructure(structures[currentIndex + 1]);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowLeft") {
        handlePrev();
      }
      if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, currentIndex, isFirst, isLast]);

  if (!isOpen || !structure) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-structure-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Dark overlay backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#11162b] text-white rounded-lg shadow-2xl overflow-hidden border border-white/20 animate-fade-in-up">
        {/* Circular close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
          {/* Left Column: Image */}
          <div className="md:col-span-5 relative h-64 md:h-auto min-h-[220px] bg-black">
            <Image
              src={structure.image}
              alt={structure.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Right Column: Info & Details */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="block text-xs uppercase tracking-widest text-[#e5a912] font-bold font-inter mb-2">
                ESTRUCTURA DEL UNIVERSO
              </span>

              <h2
                id="modal-structure-title"
                className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-chakra mb-4"
              >
                {structure.name}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-inter mb-6">
                {structure.description}
              </p>

              {/* Key Facts */}
              <div className="space-y-2.5 text-xs sm:text-sm font-inter">
                {structure.size && (
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-[#e5a912] font-bold uppercase tracking-wider min-w-[80px]">
                      TAMAÑO:
                    </span>
                    <span className="text-slate-200">{structure.size}</span>
                  </div>
                )}
                {structure.example && (
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-[#e5a912] font-bold uppercase tracking-wider min-w-[80px]">
                      EJEMPLO:
                    </span>
                    <span className="text-slate-200">{structure.example}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Navigation controls */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10 text-xs sm:text-sm font-chakra tracking-wide">
              <button
                onClick={handlePrev}
                disabled={isFirst}
                className={`font-semibold flex items-center gap-1 transition-colors ${
                  isFirst
                    ? "text-white/20 cursor-not-allowed"
                    : "text-white hover:text-[#e5a912]"
                }`}
              >
                ‹ ANTERIOR
              </button>

              <span className="text-slate-400 font-medium">
                {currentIndex + 1} / {structures.length}
              </span>

              <button
                onClick={handleNext}
                disabled={isLast}
                className={`font-semibold flex items-center gap-1 transition-colors ${
                  isLast
                    ? "text-white/20 cursor-not-allowed"
                    : "text-white hover:text-[#e5a912]"
                }`}
              >
                SIGUIENTE ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
