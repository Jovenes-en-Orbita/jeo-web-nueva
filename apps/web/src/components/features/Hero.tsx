import Image from "next/image";
import { Chakra_Petch } from "next/font/google";

const font = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
});

/**
 * Hero section con desvanecimiento transparente inferior que se funde
 * de manera continua con la sección de Noticias (#050811).
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-[calc(100vh-76px)] min-h-[540px] overflow-hidden flex items-center bg-[#050811]"
    >
      <Image
        src="/assets/imgs/hero_earth_f.jpg"
        alt="Jóvenes en Órbita — Divulgación Científica Espacial"
        fill
        sizes="100vw"
        className="object-cover object-center [mask-image:linear-gradient(to_bottom,black_52%,transparent_100%)]"
        priority
      />

      {/* Degradado superior sutil + fusión inferior hacia el fondo de Noticias (#050811) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-[#050811]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050811] via-[#050811]/85 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-20">
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
