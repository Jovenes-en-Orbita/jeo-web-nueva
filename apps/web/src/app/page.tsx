import { Navbar } from '@/components/features/Navbar';
import { Hero } from '@/components/features/Hero';
import { StatsStrip } from '@/components/features/StatsStrip';
import { UniverseSection } from '@/components/features/UniverseSection';
import { SolarSystemSection } from '@/components/features/SolarSystemSection';
import { ConstellationsSection } from '@/components/features/ConstellationsSection';
import { NewsSection } from '@/components/features/NewsSection';
import { GallerySection } from '@/components/features/GallerySection';
import { ExploreSection } from '@/components/features/ExploreSection';
import { Footer } from '@/components/features/Footer';

/**
 * JEO Home Page — Composes all wireframe sections into a single landing page.
 * Uses React Server Components for data fetching (StatsStrip, UniverseSection, etc.)
 * and Client Components for interactivity (Navbar dropdowns).
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <UniverseSection />
        <SolarSystemSection />
        <ConstellationsSection />
        <NewsSection />
        <GallerySection />
        <ExploreSection />
      </main>
      <Footer />
    </>
  );
}
