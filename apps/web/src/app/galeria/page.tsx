import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GalleryViewer } from '@/components/features/GalleryViewer';
import { getGalleryFeatured, getGalleryCollections } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Fragmentos de Memoria (Galería) — JEO',
  description: 'Galería de astrofotografía y capturas espaciales en alta resolución de misiones lunares y del universo profundo.',
};

export default async function GaleriaPage() {
  const [featured, collections] = await Promise.all([
    getGalleryFeatured(),
    getGalleryCollections(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#060a17] text-white">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="wrap max-w-6xl mx-auto px-4 mb-4">
          <SectionHeader
            title="Fragmentos de Memoria"
            theme="dark"
            eyebrow="Galería Fotográfica Espacial"
            description="Capturas astronómicas del telescopio James Webb, misiones Artemis y fotografías de la bóveda celeste obtenidas por la comunidad de Jóvenes en Órbita."
          />
        </div>

        <GalleryViewer
          initialFeatured={featured}
          collections={collections.length > 0 ? collections : [featured]}
        />
      </main>
      <Footer />
    </div>
  );
}
