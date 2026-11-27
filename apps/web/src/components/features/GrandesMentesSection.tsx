import { SectionContainer } from "@/components/ui";
import { GrandesMentesCarousel } from "./GrandesMentesCarousel";

export function GrandesMentesSection() {
  return (
    <SectionContainer
      id="fondo"
      surface="white"
      maxWidthClass="max-w-6xl"
      className="flex items-center md:min-h-[calc(100vh-76px)]"
    >
      <GrandesMentesCarousel />
    </SectionContainer>
  );
}
