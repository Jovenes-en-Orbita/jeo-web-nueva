import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { UniverseSection } from '@/components/features/UniverseSection';

export const metadata: Metadata = {
  title: 'El Universo — JEO (Jóvenes en Órbita)',
  description: 'Explora los misterios del cosmos, agujeros negros, galaxias y la evolución del universo.',
};

export default function UniversoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <UniverseSection />
      </main>
      <Footer />
    </>
  );
}
