import { getNews } from "@/lib/api";
import { EmptyState, SectionContainer } from "@/components/ui";
import { NewsCard } from "./NewsCard";

/**
 * Noticias Espaciales (Home) — ubicada inmediatamente después del Hero,
 * fundiéndose con su transparencia inferior sobre fondo oscuro (#050811).
 */
export async function NewsSection() {
  const allArticles = await getNews();
  const recentArticles = allArticles.slice(0, 3);

  return (
    <SectionContainer
      id="news"
      surface="dark"
      title="NOTICIAS"
      titleHighlight="ESPACIALES"
      actionHref="/noticias"
      actionLabel="Ver todas las noticias"
      className="-mt-12 relative z-20 pt-8 md:pt-10"
    >
      {recentArticles.length === 0 ? (
        <EmptyState message="No hay noticias disponibles en este momento." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {recentArticles.map((article) => (
            <NewsCard key={article.id || article.slug} article={article} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
