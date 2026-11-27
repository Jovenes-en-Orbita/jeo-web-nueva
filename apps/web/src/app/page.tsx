import { Navbar } from "@/components/features/Navbar";
import { Hero } from "@/components/features/Hero";
// TODO: Habilitar SolarSystemSection una vez finalizado el desarrollo de la sección Sistema Solar
// import { SolarSystemSection } from '@/components/features/SolarSystemSection';
// TODO: Habilitar ConstellationsSection una vez finalizado el desarrollo de la sección Constelaciones
// import { ConstellationsSection } from '@/components/features/ConstellationsSection';
import { NewsSection } from "@/components/features/NewsSection";
import { GallerySection } from "@/components/features/GallerySection";
// TODO: Habilitar ExploreSection una vez finalizado el desarrollo de las secciones de exploración
// import { ExploreSection } from '@/components/features/ExploreSection';
import { Footer } from "@/components/features/Footer";

export const dynamic = "force-dynamic";

/**
 * JEO Home Page — Vertical layout.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Navbar />
      <main className="flex-1 relative">
        <Hero />
        {/* TODO: Incluir SolarSystemSection cuando se complete su desarrollo */}
        {/* <SolarSystemSection /> */}
        {/* TODO: Incluir ConstellationsSection cuando se complete su desarrollo */}
        {/* <ConstellationsSection /> */}
        <NewsSection />
        <GallerySection />
        {/* TODO: Incluir ExploreSection cuando se complete su desarrollo */}
        {/* <ExploreSection /> */}
        <Footer />
      </main>
    </div>
  );
}
