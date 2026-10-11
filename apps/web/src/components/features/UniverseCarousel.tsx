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
  // Triple array for seamless infinite scroll
  const items = [
    ...UNIVERSE_STRUCTURES.map((s) => ({ ...s, uniqueKey: `set1-${s.id}` })),
    ...UNIVERSE_STRUCTURES.map((s) => ({ ...s, uniqueKey: `set2-${s.id}` })),
    ...UNIVERSE_STRUCTURES.map((s) => ({ ...s, uniqueKey: `set3-${s.id}` })),
  ];

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

  // Drag-to-scroll state
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const dragMovedRef = useRef(false);
  const isResettingRef = useRef(false);

  // Initialize scroll position in the middle set
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      if (el) {
        const singleSetWidth = el.scrollWidth / 3;
        el.scrollLeft = singleSetWidth;
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Handle infinite wrap-around on scroll
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || isResettingRef.current) return;

    const singleSetWidth = el.scrollWidth / 3;
    if (singleSetWidth <= 0) return;

    // If reached set 1 (scrolled too far left), jump to set 2 seamlessly
    if (el.scrollLeft < singleSetWidth * 0.2) {
      isResettingRef.current = true;
      el.scrollLeft += singleSetWidth;
      requestAnimationFrame(() => {
        isResettingRef.current = false;
      });
    }
    // If reached set 3 (scrolled too far right), jump back to set 2 seamlessly
    else if (el.scrollLeft > singleSetWidth * 1.8) {
      isResettingRef.current = true;
      el.scrollLeft -= singleSetWidth;
      requestAnimationFrame(() => {
        isResettingRef.current = false;
      });
    }
  };

  // User interaction pause timer (resumes auto-scroll after inactivity)
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerInteractionPause = (durationMs = 3000) => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, durationMs);
  };

  // Continuous smooth auto-scroll to the right (ticker style) via requestAnimationFrame
  useEffect(() => {
    // Pause if user is hovering, interacting, dragging, or modal is open
    if (isHovered || isModalOpen || isDragging || isInteracting) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speedPixelsPerSecond = 45; // Smooth cinematic cruising speed

    const step = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (scrollRef.current && !isResettingRef.current) {
        scrollRef.current.scrollLeft += speedPixelsPerSecond * dt;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, isModalOpen, isDragging, isInteracting]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    triggerInteractionPause(3500);
    const offset = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleOpenModal = (struct: UniverseStructure) => {
    // Only open if the user didn't perform a drag gesture
    if (dragMovedRef.current) return;
    setSelectedStructure(struct);
    setIsModalOpen(true);
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    // Only primary button
    if (e.button !== 0) return;

    triggerInteractionPause(3500);
    isDraggingRef.current = true;
    setIsDragging(true);
    dragMovedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftStartRef.current = scrollRef.current.scrollLeft;
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;

    triggerInteractionPause(3500);
    const deltaX = e.pageX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      dragMovedRef.current = true;
    }

    scrollRef.current.scrollLeft = scrollLeftStartRef.current - deltaX;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      triggerInteractionPause(3500);
      // Wait a tick before resetting dragMovedRef to allow click handlers to inspect it
      setTimeout(() => {
        dragMovedRef.current = false;
      }, 50);
    }
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
    handleMouseUp();
  };

  return (
    <>
      <div
        className="relative w-full py-4 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseLeave();
        }}
      >
        {/* Left Circular Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Estructura anterior"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1b1c3b] text-white flex items-center justify-center shadow-lg transition-all opacity-100 hover:scale-105 hover:bg-[#252854]"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Scroll Container (pt-12 to prevent tooltip cut-off at top) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleContainerMouseMove}
          onMouseUp={handleMouseUp}
          className={`flex gap-4 sm:gap-5 overflow-x-auto overflow-y-visible scrollbar-none pt-12 pb-6 px-1 ${
            isDragging
              ? "cursor-grabbing select-none"
              : isInteracting
                ? "scroll-smooth"
                : ""
          }`}
          style={{
            scrollSnapType:
              isInteracting && !isDragging ? "x mandatory" : "none",
          }}
        >
          {items.map((struct) => {
            const isHover =
              hoveredCardId === struct.uniqueKey && mousePos !== null;

            return (
              <div
                key={struct.uniqueKey}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenModal(struct)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenModal(struct);
                  }
                }}
                onMouseMove={(e) => handleMouseMove(e, struct.uniqueKey)}
                onMouseLeave={handleMouseLeave}
                className={`relative shrink-0 w-[170px] sm:w-[190px] md:w-[210px] aspect-[16/10] bg-[#0c1022] rounded-none overflow-visible group border border-slate-700/60 hover:border-[#1b1c3b] transition-all duration-300 hover:z-30 ${
                  isDragging ? "cursor-grabbing" : "cursor-none"
                }`}
                style={{
                  scrollSnapAlign:
                    isInteracting && !isDragging ? "start" : "none",
                }}
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
          aria-label="Siguiente estructura"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1b1c3b] text-white flex items-center justify-center shadow-lg transition-all opacity-100 hover:scale-105 hover:bg-[#252854]"
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
