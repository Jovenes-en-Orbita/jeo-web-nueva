import { Navbar } from "@/components/features/Navbar";
import { Hero } from "@/components/features/Hero";
import { NewsSection } from "@/components/features/NewsSection";
import { GrandesMentesSection } from "@/components/features/GrandesMentesSection";
import { GallerySection } from "@/components/features/GallerySection";
// TODO: Habilitar SolarSystemSection una vez finalizado el desarrollo de la sección Sistema Solar
// import { SolarSystemSection } from '@/components/features/SolarSystemSection';
// TODO: Habilitar ConstellationsSection una vez finalizado el desarrollo de la sección Constelaciones
// import { ConstellationsSection } from '@/components/features/ConstellationsSection';
// TODO: Habilitar ExploreSection una vez finalizado el desarrollo de las secciones de exploración
// import { ExploreSection } from '@/components/features/ExploreSection';
import { Footer } from "@/components/features/Footer";

export const dynamic = "force-dynamic";

/**
 * JEO Home Page — Vertical layout con secciones alternadas (oscuro / blanco).
 * Hero se funde con transparencia hacia Noticias (oscuro) -> Grandes Mentes (blanco) -> Galería (oscuro).
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050811]">
      <Navbar />
      <main className="flex-1 relative">
        <Hero />
        <NewsSection />
        <GrandesMentesSection />
        <GallerySection />
        {/* TODO: Incluir SolarSystemSection cuando se complete su desarrollo */}
        {/* <SolarSystemSection /> */}
        {/* TODO: Incluir ConstellationsSection cuando se complete su desarrollo */}
        {/* <ConstellationsSection /> */}
        {/* TODO: Incluir ExploreSection cuando se complete su desarrollo */}
        {/* <ExploreSection /> */}
        <Footer />
      </main>
    </div>
  );
}
