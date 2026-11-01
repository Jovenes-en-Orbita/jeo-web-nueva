"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Chakra_Petch } from "next/font/google";
import { MENTES_DATA } from "@/lib/grandesMentesData";

const font = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
});

// const mentes: Mente[] = [nicolas, galileo, johannes, edwin, konstantin, robert, hermann, serguei, wernher, valentin, maxime, hermann_noordung, aleksandr, tom, karl, jocelyn, ada, margaret, yuri, neil];

export function GrandesMentesCarousel() {
  const [current, setCurrent] = useState(0);
  const total = MENTES_DATA.length;

  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);

  return (
    <div
      className="relative mx-auto w-full max-w-6xl"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Grandes mentes"
    >
      <div className="overflow-hidden">
        <ul
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {MENTES_DATA.map((mente, i) => (
            <li
              key={i}
              className="w-full shrink-0 px-12 sm:px-16"
              aria-label={`${i + 1} de ${total}`}
            >
              <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-center">
                {/* Tarjeta: solo nombre y bio */}
                <article className="border border-white/10 bg-black/10 p-6 text-white backdrop-blur-sm sm:p-8 md:flex-1">
                  <h3
                    className={`${font.className} mb-5 text-center text-3xl font-bold sm:text-5xl`}
                  >
                    {mente.name}
                  </h3>
                  <div className="space-y-2 text-sm leading-snug text-white/90 sm:text-base">
                    {mente.subtitle}
                  </div>
                  <kbd
                    className="
                                px-30 
                                py-0.05 
                                shadow-[0_2px_0_rgba(0,0,0,0.2)] 
                                dark:bg-black-700 
                                dark:text-black-200 
                                dark:border-black-500"
                  ></kbd>

                  <div className="space-y-2 text-sm leading-snug text-white/90 sm:text-base">
                    {mente.bio}
                  </div>
                </article>

                {/* Imagen: fuera de la tarjeta, sin fondo ni borde */}
                <div className="relative order-first h-64 w-full shrink-0 md:order-none md:h-[28rem] md:w-72">
                  <Image
                    src={
                      "/assets/imgs/grandes-mentes/" +
                      mente.area +
                      "/" +
                      mente.name +
                      "." +
                      mente.extension
                    }
                    alt={mente.name}
                    fill
                    sizes="(min-width: 768px) 288px, 100vw"
                    className="object-cover object-top [mask-image:linear-gradient(to_right,transparent,black_35%)]"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Flechas (quedan en el margen lateral, sin tapar la tarjeta) */}
      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#FFB800] text-[#FFB800] transition-colors hover:bg-[#FFB800] hover:text-black"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#FFB800] text-[#FFB800] transition-colors hover:bg-[#FFB800] hover:text-black"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="mt-6 flex justify-center gap-2">
        {MENTES_DATA.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Ir a la tarjeta ${i + 1}`}
            aria-current={i === current}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === current ? "bg-yellow-500" : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
