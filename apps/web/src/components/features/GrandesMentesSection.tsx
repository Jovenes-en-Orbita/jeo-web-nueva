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
      className="relative flex w-full scroll-mt-[76px] items-center bg-white py-10 sm:py-12 md:min-h-[calc(100vh-76px)] md:py-10"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <GrandesMentesCarousel />
      </div>
    </section>
  );
}
