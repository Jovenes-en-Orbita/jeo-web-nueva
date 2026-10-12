import type { Metadata } from "next";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { NewsCard } from "@/components/features/NewsCard";
import { getNews } from "@/lib/api";

export const metadata: Metadata = {
  title: "Noticias Espaciales — JEO (Jóvenes en Órbita)",
  description:
    "Explora todas las noticias, artículos y novedades de astronomía y ciencias espaciales.",
};

export default async function NoticiasPage() {
  const articles = await getNews();

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-white">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header strip */}
          <div className="mb-10 md:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white font-[var(--font-chakra)]">
              NOTICIAS ESPACIALES
            </h1>
          </div>

          {/* Grid of All News (Design 2: 3 columns grid) */}
          {articles.length === 0 ? (
            <div className="py-20 text-center border border-white/10 bg-[#080d1a]">
              <p className="text-base text-slate-400 font-[var(--font-inter)]">
                No hay noticias disponibles en la plataforma.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {articles.map((article) => (
                <NewsCard key={article.id || article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
