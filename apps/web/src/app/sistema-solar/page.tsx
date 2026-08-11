import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SolarSystemSection } from '@/components/features/SolarSystemSection';

export const metadata: Metadata = {
  title: 'Sistema Solar — JEO (Jóvenes en Órbita)',
  description: 'Conoce los 8 planetas, lunas principales, asteroides y la estructura de nuestro vecindario cósmico.',
};

export default function SistemaSolarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <SolarSystemSection />
      </main>
      <Footer />
    </>
  );
}
