import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ConstellationsCatalog } from '@/components/features/ConstellationsCatalog';
import { getConstellationsCatalog } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Catálogo de Constelaciones — JEO (Jóvenes en Órbita)',
  description: 'Exploración interactiva del cielo nocturno, mapa celeste 2D, estrellas principales y guía astronómica de constelaciones.',
};

export default async function ConstelacionesPage() {
  const constellations = await getConstellationsCatalog();

  return (
    <div className="min-h-screen flex flex-col bg-[#060a17] text-white">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="wrap max-w-6xl mx-auto px-4 mb-4">
          <SectionHeader
            title="Constelaciones & Bóveda Celeste"
            theme="dark"
            eyebrow="Astronomía Observacional"
            description="Guía interactiva de las constelaciones oficiales, figuras mitológicas y técnicas para la orientación nocturna en ambos hemisferios."
          />
        </div>

        <ConstellationsCatalog constellations={constellations} />
      </main>
      <Footer />
    </div>
  );
}
