"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { MENTES_DATA } from "@/lib/grandesMentesData";

const AREAS = [
  { key: "astronomía", label: "Astronomía" },
  { key: "aeroespacial", label: "aeroespacial" },
  { key: "tecnología", label: "tecnología" },
  { key: "astronautas", label: "astronautas" },
];

function ArrowButton({
  direction,
  onClick,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Anterior" : "Siguiente"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black text-black transition-colors hover:bg-blue-950 hover:text-white md:h-10 md:w-10 ${className}`}
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

export function GrandesMentesCarousel() {
  const [area, setArea] = useState(AREAS[0].key);
  const [current, setCurrent] = useState(0);
  // agregado para generar un diseño responsive, no está planeado en el figma, pero bueno.
  const touchStartX = useRef<number | null>(null);
  // const touchEndX = useRef<number | null>(null);

  const mentes = MENTES_DATA.filter((m) => m.area === area);
  const total = mentes.length;

  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);

  const changeArea = (key: string) => {
    setArea(key);
    setCurrent(0);
  };

  //Un Swipe táctil
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return; // Umbral de sensibilidad
    if (dx > 0) prev();
    else next();
  };

  return (
    <section>
      <h3 className="text-center text-3xl font-bold uppercase text-blue-950 sm:text-4xl p-6">
        Grandes mentes
      </h3>
      <div
        role="tablist"
        arial-label="Areas de grandes mentes"
        className="mb-4 flex flex-wrap justify-start gap-x-8 gap-y-2 px-12 sm:justify-start sm:px-25"
      >
        {AREAS.map((a) => (
          <button
            key={a.key}
            role="tab"
            aria-selected={area === a.key}
            onClick={() => changeArea(a.key)}
            className={`border-b-2 pb-1 text-sm font-medium text-black transition-colors sm:text-base ${
              area === a.key
                ? "border-yellow-500"
                : "border-transparent hover:border-yellow-500/50"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Grandes mentes"
        // className="relative mx-auto w-full max-w-6xl"
      >
        <div className="relative">
          {/* Flechas laterales: solo desde md */}
          <ArrowButton
            direction="prev"
            onClick={prev}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 md:flex"
          />
          <ArrowButton
            direction="next"
            onClick={next}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 md:flex"
          />

          <div
            className="overflow-hidden touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <ul
              className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {mentes.map((mente, i) => (
                <li
                  key={`${mente.area}-${mente.name}`}
                  className="w-full shrink-0 px-16 sm:px-16"
                  aria-label={`${i + 1} de ${total}`}
                >
                  <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
                    {/* Tarjeta: solo nombre y bio */}
                    <article className="border border-white/10 p-2 text-black backdrop-blur-sm sm:p-2 md:flex-1">
                      <h4
                        className={`mb-5 text-start text-3xl font-bold sm:text-5xl`}
                      >
                        {mente.name}
                      </h4>
                      <br></br>
                      <div className="mb-3 text-center text-xs text-black/80 sm:text-sm md:mb-4 md:text-start">
                        {mente.subtitle}
                      </div>

                      <br></br>

                      <div className="space-y-2 text-sm leading-relaxed text-black/90 sm:text-base">
                        {mente.bio}
                      </div>
                    </article>

                    {/* Imagen: fuera de la tarjeta, sin fondo ni borde */}
                    {/* Foto: arriba en mobile, a la derecha desde md */}
                    <div className="relative order-first h-40 w-40 shrink-0 overflow-hidden rounded-[45%_55%_50%_50%/55%_45%_55%_45%] sm:h-52 sm:w-52 md:order-none md:h-56 md:w-56 lg:h-64 lg:w-64">
                      <Image
                        src={`/assets/imgs/grandes-mentes/${mente.area_real}/${mente.name}.${mente.extension}`}
                        alt={mente.name}
                        fill
                        sizes="(min-width: 1024px) 256px, (min-width: 768px) 224px, (min-width: 640px) 208px, 160px"
                        className="object-cover object-center"
                      />
                    </div>
                    {/* <div className="relative order-first mx-auto h-52 w-52 shrink-0 overflow-hidden rounded-[45%_55%_50%_50%/55%_45%_55%_45%] md:order-none md:mx-0 md:h-76 md:w-76">
                      <Image
                        src={
                          "/assets/imgs/grandes-mentes/" +
                          mente.area_real +
                          "/" +
                          mente.name +
                          "." +
                          mente.extension
                        }
                        alt={mente.name}
                        fill
                        sizes="224px"
                        className="w-25 h-25 rounded-full object-cover object-center"
                      />
                    </div> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Controles inferiores: flechas (solo mobile) + puntos */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <ArrowButton
              direction="prev"
              onClick={prev}
              className="md:hidden"
            />

            <div className="flex items-center gap-2">
              {mentes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Ir a la tarjeta ${i + 1}`}
                  aria-current={i === current}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i === current
                      ? "bg-blue-950"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <ArrowButton
              direction="next"
              onClick={next}
              className="md:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
