import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getGalleryFeatured } from "@/lib/api";
import { Chakra_Petch } from "next/font/google";
import { GrandesMentesCarousel } from "./GrandesMentesCarousel";

const font = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export async function GrandesMentesSection() {
  const collection = await getGalleryFeatured().catch(() => null);

  return (
    <section
      id="fondo"
      className="relative w-full h-[calc(100vh-76px)] min-h-[560px] overflow-hidden flex items-center"
    >
      {/* Fondo de estrellas */}
      <Image
        src="/assets/imgs/Starry_sky.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full px-2">
        <GrandesMentesCarousel />
      </div>
    </section>
  );
}
