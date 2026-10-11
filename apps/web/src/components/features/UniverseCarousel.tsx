"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  UNIVERSE_STRUCTURES,
  type UniverseStructure,
} from "@/lib/universeStructures";
import { StructureModal } from "./StructureModal";
import { TooltipCursor } from "@/components/ui/TooltipCursor";

export function UniverseCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedStructure, setSelectedStructure] =
    useState<UniverseStructure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cursor position state for hovered card
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{
    x: number;
    y: number;
    isNearRight?: boolean;
  } | null>(null);

  // Check scroll positions to enable/disable arrow buttons
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // Autoplay functionality: scroll horizontally smoothly every 3.2 seconds, pause when hovering
  useEffect(() => {
    if (isHovered || isModalOpen) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // If at end, loop back smoothly
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isHovered, isModalOpen]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleOpenModal = (struct: UniverseStructure) => {
    setSelectedStructure(struct);
    setIsModalOpen(true);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    structId: string,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isNearRight = x > rect.width - 140;

    setHoveredCardId(structId);
    setMousePos({ x, y, isNearRight });
  };

  const handleMouseLeave = () => {
    setHoveredCardId(null);
    setMousePos(null);
  };

  return (
    <>
      <div
        className="relative w-full py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseLeave();
        }}
      >
        {/* Left Circular Arrow */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Estructura anterior"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1b1c3b] text-white flex items-center justify-center shadow-lg transition-all ${
            canScrollLeft
              ? "opacity-100 hover:scale-105 hover:bg-[#252854]"
              : "opacity-35 cursor-not-allowed"
          }`}
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Scroll Container (pt-12 to prevent tooltip cut-off at top) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto overflow-y-visible scroll-smooth scrollbar-none pt-12 pb-6 px-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {UNIVERSE_STRUCTURES.map((struct) => {
            const isHover = hoveredCardId === struct.id && mousePos !== null;

            return (
              <div
                key={struct.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenModal(struct)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenModal(struct);
                  }
                }}
                onMouseMove={(e) => handleMouseMove(e, struct.id)}
                onMouseLeave={handleMouseLeave}
                className="relative shrink-0 w-[170px] sm:w-[190px] md:w-[210px] aspect-[16/10] bg-[#0c1022] rounded-none overflow-visible cursor-none group border border-slate-700/60 hover:border-[#1b1c3b] transition-all duration-300 hover:z-30"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Floating Tooltip following the cursor */}
                {isHover && mousePos && (
                  <TooltipCursor
                    x={mousePos.x}
                    y={mousePos.y}
                    isNearRight={mousePos.isNearRight}
                  />
                )}

                {/* Structure Image Background */}
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={struct.image}
                    alt={struct.name}
                    fill
                    sizes="(max-width: 768px) 190px, 210px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle dark gradient overlay to ensure text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </div>

                {/* Structure Name at bottom */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 pointer-events-none">
                  <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white font-chakra leading-tight drop-shadow-md">
                    {struct.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Circular Arrow */}
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Siguiente estructura"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1b1c3b] text-white flex items-center justify-center shadow-lg transition-all ${
            canScrollRight
              ? "opacity-100 hover:scale-105 hover:bg-[#252854]"
              : "opacity-35 cursor-not-allowed"
          }`}
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Structure Modal */}
      <StructureModal
        structure={selectedStructure}
        structures={UNIVERSE_STRUCTURES}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectStructure={setSelectedStructure}
      />
    </>
  );
}
