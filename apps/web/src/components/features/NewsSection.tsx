import { SectionHeader } from '@/components/ui/SectionHeader';
import { Placeholder } from '@/components/ui/Placeholder';
import { getNews } from '@/lib/api';

/**
 * Section 04: Noticias Espaciales
 * Server Component. 3 news cards with vertical black dividers.
 * Matches wireframe's .news-grid + .news-card layout.
 */
export async function NewsSection() {
  const articles = await getNews();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section className="block alt py-16 border-b border-[var(--color-line)] bg-[#F7F8FA]" id="news">
      <div className="wrap">
        <SectionHeader eyebrow="Aprende" title="Noticias Espaciales" />

        <div className="grid grid-cols-3 max-[900px]:grid-cols-1">
          {articles.map((article, i) => (
            <article
              key={article.id}
              className={`px-[22px] relative group cursor-pointer ${
                i === 0 ? 'pl-0' : ''
              } ${i === articles.length - 1 ? 'pr-0' : ''} ${
                i > 0
                  ? 'border-l border-[var(--color-black)] max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pt-[22px] max-[900px]:mt-[22px]'
                  : ''
              }`}
            >
              {/* TODO: Replace with actual news article image */}
              <Placeholder
                label="Imagen noticia"
                className="w-full mb-3.5 transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ height: 170 }}
              />
              <div className="flex gap-2.5 text-[11px] font-semibold text-[var(--color-ink-2)] mb-2 uppercase tracking-[0.03em]">
                <span>{formatDate(article.date)}</span>
                <span className="text-[var(--color-line)]">•</span>
                <span>{article.readTimeMinutes} min de lectura</span>
              </div>
              <h3 className="font-bold text-[19px] leading-[1.15] text-[var(--color-ink)] mb-2 normal-case group-hover:text-[var(--color-navy)] transition-colors">
                {article.title}
              </h3>
              <p className="text-[12.5px] text-[var(--color-ink-2)] leading-relaxed m-0">
                {article.summary}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
