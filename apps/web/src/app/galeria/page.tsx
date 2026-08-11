import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { GallerySection } from '@/components/features/GallerySection';

export const metadata: Metadata = {
  title: 'Fragmentos de Memoria (Galería) — JEO',
  description: 'Colecciones fotográficas de astrofotografía y capturas del espacio profundo.',
};

export default function GaleriaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <GallerySection />
      </main>
      <Footer />
    </>
  );
}
