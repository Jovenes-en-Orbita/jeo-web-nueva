import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { NewsSection } from '@/components/features/NewsSection';

export const metadata: Metadata = {
  title: 'Noticias Espaciales — JEO (Jóvenes en Órbita)',
  description: 'Últimas novedades, misiones espaciales, descubrimientos y actualidad astronómica.',
};

export default function NoticiasPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}
