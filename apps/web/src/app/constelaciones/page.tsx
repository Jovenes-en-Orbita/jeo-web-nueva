import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { ConstellationsSection } from '@/components/features/ConstellationsSection';

export const metadata: Metadata = {
  title: 'Constelaciones — JEO (Jóvenes en Órbita)',
  description: 'Guía astronómica del mapa del cielo, estrellas principales y constelaciones visibles.',
};

export default function ConstelacionesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <ConstellationsSection />
      </main>
      <Footer />
    </>
  );
}
