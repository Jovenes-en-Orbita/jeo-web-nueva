import Link from "next/link";
import Image from "next/image";
import { UniverseCarousel } from "./UniverseCarousel";

/**
 * Section 01: El Universo (Home)
 * Matches Figma design:
 * - Clean white background layout
 * - Left: Title, description, "CONOCÉ MÁS" button leading to /universo
 * - Right: Deep field galaxy astronomical photo
 * - Bottom: "ESTRUCTURAS EN EL UNIVERSO" with horizontal animated carousel + hover tooltips + structure details modal
 */
export function UniverseSection() {
  return (
    <section
      className="py-16 md:py-24 bg-white text-slate-900 border-b border-slate-200"
      id="universe"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Two-Column Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-16 md:mb-20">
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-slate-900 font-chakra leading-tight">
              EL UNIVERSO HACE 13.800 MILLONES DE AÑOS
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-inter">
              Lorem Ipsum es simplemente el texto de relleno de las imprentas y
              archivos de texto. Lorem Ipsum ha sido el texto de relleno
              estándar de las industrias desde el año 1500, cuando un impresor
              (N. del T. persona que se dedica a la imprenta) desconocido usó
              una galería de textos y los mezcló de tal manera que logró hacer
              un libro de textos espécimen. No sólo sobrevivió 500 años, sino
              que tambien ingresó como texto de relleno en documentos
              electrónicos, quedando esencialmente igual al original. Fue
              popularizado en los 60s con la creación de las hojas
              &ldquo;Letraset&rdquo;, las cuales contenían pasajes de Lorem
              Ipsum, y más recientemente con software de autoedición, como por
              ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.
            </p>

            <div>
              <Link
                href="/universo"
                className="inline-block bg-[#1b1c3b] hover:bg-[#252854] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3 rounded-none shadow-md transition-all duration-200 hover:-translate-y-0.5 font-chakra"
              >
                CONOCÉ MÁS
              </Link>
            </div>
          </div>

          {/* Right Astronomical Image */}
          <div className="lg:col-span-6 relative aspect-[16/10] w-full bg-black overflow-hidden shadow-xl border border-slate-200">
            <Image
              src="/assets/hero-cosmos.svg"
              alt="Campo profundo del universo con galaxias y estrellas"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Lower Carousel Block */}
        <div className="mt-8">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 font-chakra">
              ESTRUCTURAS EN EL UNIVERSO
            </h3>
          </div>

          <UniverseCarousel />
        </div>
      </div>
    </section>
  );
}
