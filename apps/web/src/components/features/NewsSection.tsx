import Link from "next/link";
import { getNews } from "@/lib/api";
import { NewsCard } from "./NewsCard";

/**
 * Section 04: Noticias Espaciales (Home)
 * Displays the latest 3 news articles in a flex layout, matching the new design.
 */
export async function NewsSection() {
  const allArticles = await getNews();
  const recentArticles = allArticles.slice(0, 3);

  return (
    <section
      className="py-16 md:py-20 bg-[#050811] text-white border-b border-white/10"
      id="news"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header strip */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="block text-xs uppercase tracking-widest text-slate-400 mb-1 font-[var(--font-inter)] font-semibold">
              Noticias recientes
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white font-[var(--font-chakra)]">
              NOTICIAS ESPACIALES
            </h2>
          </div>

          <Link
            href="/noticias"
            className="inline-flex items-center text-xs sm:text-sm font-bold tracking-wider text-[#8a7cf8] hover:text-[#a89eff] transition-colors uppercase font-[var(--font-inter)] group self-start sm:self-auto"
          >
            <span>VER TODAS LAS NOTICIAS</span>
            <span className="ml-1 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* 3 Articles in Flex / Grid */}
        {recentArticles.length === 0 ? (
          <div className="py-12 text-center border border-white/10 bg-[#080d1a]">
            <p className="text-sm text-slate-400 font-[var(--font-inter)]">
              No hay noticias disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {recentArticles.map((article) => (
              <NewsCard key={article.id || article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
