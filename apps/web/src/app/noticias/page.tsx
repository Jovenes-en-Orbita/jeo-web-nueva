import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NewsFeed } from '@/components/features/NewsFeed';
import { getNews } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Noticias Espaciales — JEO (Jóvenes en Órbita)',
  description: 'Explora las últimas noticias, misiones astronómicas, descubrimientos de exoplanetas y avances del sector espacial.',
};

export default async function NoticiasPage() {
  const articles = await getNews();

  return (
    <div className="min-h-screen flex flex-col bg-[#060a17] text-white">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="wrap max-w-6xl mx-auto px-4 mb-4">
          <SectionHeader
            title="Noticias Espaciales"
            theme="dark"
            eyebrow="Actualidad Astronómica"
            description="Información rigurosa, misiones espaciales y descubrimientos del cosmos contados por la comunidad de Jóvenes en Órbita."
          />
        </div>

        <NewsFeed initialArticles={articles} />
      </main>
      <Footer />
    </div>
  );
}
