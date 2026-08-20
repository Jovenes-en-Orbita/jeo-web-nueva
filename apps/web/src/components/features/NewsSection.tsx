import { SectionHeader } from '@/components/ui/SectionHeader';
import { Placeholder } from '@/components/ui/Placeholder';
import { Button } from '@/components/ui/Button';
import { getNews } from '@/lib/api';

/**
 * Section 04: Noticias Espaciales
 * High contrast dark theme + centered slide layout to remove bottom gap.
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
    <section className="block py-12 border-b border-white/10 bg-[#080d1a] min-h-full flex flex-col justify-center" id="news">
      <div className="wrap w-full">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <SectionHeader title="Noticias Espaciales" theme="dark" />
          <div className="text-[#FFC72C] hover:text-white">
            <Button href="/noticias" variant="gold">
              Ver más noticias
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-[#0d162a] border border-white/10 rounded-2xl p-5 group cursor-pointer hover:border-[var(--color-yellow)]/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <Placeholder
                  label="Imagen noticia"
                  className="w-full mb-4 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ height: 180 }}
                />
                <div className="flex gap-2.5 text-[11px] font-semibold text-slate-400 mb-2.5 uppercase tracking-[0.03em]">
                  <span className="text-[var(--color-yellow)]">{formatDate(article.date)}</span>
                  <span>•</span>
                  <span>{article.readTimeMinutes} min de lectura</span>
                </div>
                <h3 className="font-bold text-[18px] leading-snug text-white mb-2.5 normal-case group-hover:text-[var(--color-yellow)] transition-colors font-[var(--font-montserrat)]">
                  {article.title}
                </h3>
                <p className="text-[13px] text-slate-300 leading-relaxed m-0 line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-[var(--color-yellow)] group-hover:text-white transition-colors flex items-center gap-1">
                <span>Leer artículo</span>
                <span>→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
