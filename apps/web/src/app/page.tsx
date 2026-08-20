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
 * Each slide spans the exact viewport height and centers its section content without extra bottom gaps.
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
          <div className="h-full overflow-y-auto bg-[#080d1a]">
            <SolarSystemSection />
          </div>

          {/* Section 3: Constelaciones */}
          <div className="h-full overflow-y-auto bg-[#060a17]">
            <ConstellationsSection />
          </div>

          {/* Section 4: Noticias */}
          <div className="h-full overflow-y-auto bg-[#080d1a]">
            <NewsSection />
          </div>

          {/* Section 5: Galería */}
          <div className="h-full overflow-y-auto bg-[#060a17]">
            <GallerySection />
          </div>

          {/* Section 6: Explorá */}
          <div className="h-full overflow-y-auto bg-[#080d1a]">
            <ExploreSection />
          </div>

          {/* Section 7: Footer */}
          <div className="h-full overflow-y-auto bg-[#0b111e]">
            <Footer />
          </div>
        </HorizontalLayout>
      </main>
    </div>
  );
}
