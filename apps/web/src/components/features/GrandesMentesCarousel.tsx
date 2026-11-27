"use client";

import Image from "next/image";
import { useState } from "react";
import { MENTES_DATA } from "@/lib/grandesMentesData";
import { Carousel, Tabs, type TabItem } from "@/components/ui";

const AREAS: TabItem[] = [
  { key: "astronomía", label: "Astronomía" },
  { key: "aeroespacial", label: "Aeroespacial" },
  { key: "tecnología", label: "Tecnología" },
  { key: "astronautas", label: "Astronautas" },
];

/**
 * Carrusel de Grandes Mentes refactorizado sobre los componentes genéricos
 * `Tabs` y `Carousel` del Design System de JEO.
 */
export function GrandesMentesCarousel() {
  const [area, setArea] = useState(AREAS[0].key);
  const mentes = MENTES_DATA.filter((m) => m.area === area);

  return (
    <div>
      <h3 className="text-center text-3xl font-bold uppercase text-blue-950 sm:text-4xl p-6">
        Grandes mentes
      </h3>

      <Tabs
        items={AREAS}
        activeKey={area}
        onChange={setArea}
        ariaLabel="Áreas de grandes mentes"
        variant="underline"
        surface="light"
        className="mb-6 justify-start px-6 sm:px-16"
      />

      <Carousel
        key={area}
        items={mentes}
        getKey={(mente) => `${mente.area}-${mente.name}`}
        ariaLabel="Grandes mentes"
        surface="light"
        slideClassName="w-full shrink-0 px-6 sm:px-16"
        renderSlide={(mente) => (
          <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
            <article className="border border-white/10 p-2 text-black backdrop-blur-sm sm:p-2 md:flex-1">
              <h4 className="mb-4 text-start text-3xl font-bold sm:text-5xl">
                {mente.name}
              </h4>
              <div className="mb-4 text-center text-xs text-black/80 sm:text-sm md:text-start">
                {mente.subtitle}
              </div>
              <div className="space-y-2 text-sm leading-relaxed text-black/90 sm:text-base">
                {mente.bio}
              </div>
            </article>

            <div className="relative order-first mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-[45%_55%_50%_50%/55%_45%_55%_45%] sm:h-52 sm:w-52 md:order-none md:mx-0 md:h-56 md:w-56 lg:h-64 lg:w-64">
              <Image
                src={`/assets/imgs/grandes-mentes/${mente.area_real}/${mente.name}.${mente.extension}`}
                alt={mente.name}
                fill
                sizes="(min-width: 1024px) 256px, (min-width: 768px) 224px, (min-width: 640px) 208px, 160px"
                className="object-cover object-center"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
