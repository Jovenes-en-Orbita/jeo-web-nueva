import { Navbar } from '@/components/features/Navbar';
import { Hero } from '@/components/features/Hero';
import { SolarSystemSection } from '@/components/features/SolarSystemSection';
import { ConstellationsSection } from '@/components/features/ConstellationsSection';
import { NewsSection } from '@/components/features/NewsSection';
import { GallerySection } from '@/components/features/GallerySection';
import { ExploreSection } from '@/components/features/ExploreSection';
import { Footer } from '@/components/features/Footer';

/**
 * JEO Home Page — Vertical layout.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Navbar />
      <main className="flex-1 relative">
        <Hero />
        <SolarSystemSection />
        <ConstellationsSection />
        <NewsSection />
        <GallerySection />
        <ExploreSection />
        <Footer />
      </main>
    </div>
  );
}
