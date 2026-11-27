"use client";

import React, { useRef, useState } from "react";

interface CarouselProps<T> {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderSlide: (item: T, index: number) => React.ReactNode;
  ariaLabel: string;
  surface?: "light" | "dark";
  slideClassName?: string;
  showDots?: boolean;
  showArrows?: boolean;
  emptyMessage?: string;
}

function CarouselArrowButton({
  direction,
  onClick,
  surface,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  surface: "light" | "dark";
  className?: string;
}) {
  const surfaceClasses =
    surface === "light"
      ? "border-black text-black hover:bg-blue-950 hover:text-white"
      : "border-white/30 text-white hover:bg-[#e8c648] hover:border-[#e8c648] hover:text-[#050811]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Anterior" : "Siguiente"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors cursor-pointer md:h-10 md:w-10 ${surfaceClasses} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 md:h-5 md:w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

/**
 * Carrusel genérico reutilizable del Design System de JEO.
 * Soporta temas light/dark, flechas laterales en desktop, controles inferiores en mobile,
 * indicadores (dots) y gestos táctiles (swipe).
 */
export function Carousel<T>({
  items,
  getKey,
  renderSlide,
  ariaLabel,
  surface = "light",
  slideClassName = "w-full shrink-0 px-4 sm:px-14 md:px-16",
  showDots = true,
  showArrows = true,
  emptyMessage = "No hay elementos para mostrar.",
}: CarouselProps<T>) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = items.length;
  const safeCurrent = total > 0 ? Math.min(current, total - 1) : 0;

  if (total === 0) {
    return (
      <div
        className={`py-10 text-center text-sm ${
          surface === "light" ? "text-neutral-500" : "text-slate-400"
        }`}
      >
        {emptyMessage}
      </div>
    );
  }

  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx > 0) prev();
    else next();
  };

  const activeDotClass = surface === "light" ? "bg-blue-950" : "bg-[#e8c648]";
  const inactiveDotClass =
    surface === "light"
      ? "bg-gray-300 hover:bg-gray-400"
      : "bg-white/25 hover:bg-white/50";

  return (
    <div role="region" aria-roledescription="carrusel" aria-label={ariaLabel}>
      <div className="relative">
        {showArrows && total > 1 && (
          <>
            <CarouselArrowButton
              direction="prev"
              onClick={prev}
              surface={surface}
              className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 md:flex"
            />
            <CarouselArrowButton
              direction="next"
              onClick={next}
              surface={surface}
              className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 md:flex"
            />
          </>
        )}

        <div
          className="overflow-hidden touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <ul
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${safeCurrent * 100}%)` }}
          >
            {items.map((item, idx) => (
              <li
                key={getKey(item, idx)}
                className={slideClassName}
                aria-label={`${idx + 1} de ${total}`}
              >
                {renderSlide(item, idx)}
              </li>
            ))}
          </ul>
        </div>

        {(showDots || showArrows) && total > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            {showArrows && (
              <CarouselArrowButton
                direction="prev"
                onClick={prev}
                surface={surface}
                className="md:hidden"
              />
            )}

            {showDots && (
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`Ir a la tarjeta ${i + 1}`}
                    aria-current={i === safeCurrent}
                    className={`h-2.5 w-2.5 rounded-full transition-colors cursor-pointer ${
                      i === safeCurrent ? activeDotClass : inactiveDotClass
                    }`}
                  />
                ))}
              </div>
            )}

            {showArrows && (
              <CarouselArrowButton
                direction="next"
                onClick={next}
                surface={surface}
                className="md:hidden"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
