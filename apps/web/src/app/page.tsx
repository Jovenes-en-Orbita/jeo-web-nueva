import { Navbar } from '@/components/features/Navbar';
import { Hero } from '@/components/features/Hero';
import { StatsStrip } from '@/components/features/StatsStrip';
import { SolarSystemSection } from '@/components/features/SolarSystemSection';
import { ConstellationsSection } from '@/components/features/ConstellationsSection';
import { NewsSection } from '@/components/features/NewsSection';
import { GallerySection } from '@/components/features/GallerySection';
import { ExploreSection } from '@/components/features/ExploreSection';
import { Footer } from '@/components/features/Footer';
import { HorizontalLayout } from '@/components/features/HorizontalLayout';

/**
 * JEO Home Page — Horizontal scroll navigation using mouse wheel.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-[#080d1a]">
      <Navbar />
      <main className="flex-1 relative">
        <HorizontalLayout>
          {/* Section 1: Hero & Stats */}
          <div className="h-full flex flex-col justify-between bg-[#080d1a]">
            <Hero />
            <StatsStrip />
          </div>

          {/* Section 2: Sistema Solar */}
          <div className="min-h-full">
            <SolarSystemSection />
          </div>

          {/* Section 3: Constelaciones */}
          <div className="min-h-full">
            <ConstellationsSection />
          </div>

          {/* Section 4: Noticias */}
          <div className="min-h-full">
            <NewsSection />
          </div>

          {/* Section 5: Galería */}
          <div className="min-h-full">
            <GallerySection />
          </div>

          {/* Section 6: Explorá */}
          <div className="min-h-full">
            <ExploreSection />
          </div>

          {/* Section 7: Footer */}
          <div className="min-h-full">
            <Footer />
          </div>
        </HorizontalLayout>
      </main>
    </div>
  );
}
