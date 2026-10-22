import Image from "next/image";
import { getGalleryFeatured } from "@/lib/api";
import { Chakra_Petch } from "next/font/google";

const font = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
});

/**
 * Hero section matching the wireframe's .hero.
 * Full screen height visual background with embedded stats inside floating card.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-[calc(100vh-76px)] min-h-[560px] overflow-hidden flex items-center"
    >
      <Image
        src="/assets/hero_earth_f.jpg"
        alt="Jóvenes en Órbita — Divulgación Científica Espacial"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent" />
      <div className="relative z-10 h-full flex items-center pb-24 pl-6 sm:pl-10">
        <h1
          className={`${font.className} border-l-4 border-[#FFB800] pl-4 sm:pl-5 uppercase leading-none text-[#FFB800]`}
        >
          <span className="block text-5xl sm:text-7xl font-bold tracking-wide">
            Jóvenes
          </span>
          <span className="block mt-1 text-2xl sm:text-4xl font-semibold tracking-wide">
            en Órbita
          </span>
        </h1>
      </div>
    </section>
  );
}
