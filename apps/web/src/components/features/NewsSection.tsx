import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { getNews } from '@/lib/api';
import { FiArrowUpRight, FiLayers } from 'react-icons/fi';

/**
 * Section 04: Noticias Espaciales
 * Replicando exactamente el diseño de referencia editorial (NASA style):
 * - Fila Superior: Grilla asimétrica (Main Hero 50%, Vertical Hero 25%, Stacked 25%) con texto overlay sobre imagen.
 * - Fila Inferior: Lista de 4 noticias secundarias con avatar circular y metadatos.
 */
export async function NewsSection() {
  const articles = await getNews();

  const getArticleImage = (article: { slug: string; imageUrl?: string | null }) => {
    if (article.imageUrl && article.imageUrl.trim() !== '') {
      return article.imageUrl;
    }
    switch (article.slug) {
      case 'artemis-iii':
        return '/assets/artemis.svg';
      case 'exoplaneta-habitable':
        return '/assets/exoplanet.svg';
      case 'spacex-starship':
        return '/assets/starship.svg';
      default:
        return '/assets/hero-cosmos.svg';
    }
  };

  // Asignaciones para las grillas
  const mainHero = articles[0] || null;
  const verticalHero = articles[1] || null;
  const stackedTop = articles[2] || null;
  const stackedBottom = articles[3] || null;

  // Fila inferior de miniaturas circulares (usar siguientes artículos o fallback)
  const bottomArticles = articles.length > 4 ? articles.slice(4, 8) : articles.slice(0, 4);

  return (
    <section className="block py-12 border-b border-white/10 bg-[#060a17] text-white" id="news">
      <div className="wrap w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <SectionHeader title="Noticias Espaciales" theme="dark" />
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 font-[var(--font-montserrat)] font-bold text-xs uppercase tracking-wider text-[var(--color-yellow)] hover:text-white transition-colors group"
          >
            <span>Recientemente publicadas</span>
            <span className="w-6 h-6 rounded-full bg-[var(--color-red)] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              →
            </span>
          </Link>
        </div>

        {/* TOP ASYMMETRIC GRID (4 Featured Overlay Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Main Hero Card (Span 2 Columns) */}
          {mainHero && (
            <Link
              href={`/noticias/${mainHero.slug}`}
              className="group relative lg:col-span-2 h-[340px] overflow-hidden border border-white/10 hover:border-[var(--color-yellow)]/60 transition-all duration-300 bg-[#090d1a]"
            >
              <Image
                src={getArticleImage(mainHero)}
                alt={mainHero.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  <FiLayers className="text-[var(--color-yellow)]" />
                  <span>Blog</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase block mb-1 font-[var(--font-poppins)]">
                    {mainHero.readTimeMinutes} Min Read
                  </span>
                  <h3 className="font-extrabold text-xl sm:text-2xl text-white leading-tight font-[var(--font-montserrat)] group-hover:text-[var(--color-yellow)] transition-colors">
                    {mainHero.title}
                  </h3>
                </div>
              </div>
            </Link>
          )}

          {/* Vertical Hero Card (Span 1 Column) */}
          {verticalHero && (
            <Link
              href={`/noticias/${verticalHero.slug}`}
              className="group relative lg:col-span-1 h-[340px] overflow-hidden border border-white/10 hover:border-[var(--color-yellow)]/60 transition-all duration-300 bg-[#090d1a]"
            >
              <Image
                src={getArticleImage(verticalHero)}
                alt={verticalHero.title}
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  <FiLayers className="text-[var(--color-yellow)]" />
                  <span>Blog</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase block mb-1 font-[var(--font-poppins)]">
                    {verticalHero.readTimeMinutes} Min Read
                  </span>
                  <h3 className="font-extrabold text-lg text-white leading-tight font-[var(--font-montserrat)] group-hover:text-[var(--color-yellow)] transition-colors line-clamp-3">
                    {verticalHero.title}
                  </h3>
                </div>
              </div>
            </Link>
          )}

          {/* Stacked Right Column (Span 1 Column, 2 Horizontal Stacked Cards) */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-[340px]">
            {stackedTop && (
              <Link
                href={`/noticias/${stackedTop.slug}`}
                className="group relative flex-1 overflow-hidden border border-white/10 hover:border-[var(--color-yellow)]/60 transition-all duration-300 bg-[#090d1a]"
              >
                <Image
                  src={getArticleImage(stackedTop)}
                  alt={stackedTop.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    <FiLayers className="text-[var(--color-yellow)]" />
                    <span>Blog</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase block mb-1 font-[var(--font-poppins)]">
                      {stackedTop.readTimeMinutes} Min Read
                    </span>
                    <h3 className="font-bold text-sm text-white leading-snug font-[var(--font-montserrat)] group-hover:text-[var(--color-yellow)] transition-colors line-clamp-2">
                      {stackedTop.title}
                    </h3>
                  </div>
                </div>
              </Link>
            )}

            {stackedBottom && (
              <Link
                href={`/noticias/${stackedBottom.slug}`}
                className="group relative flex-1 overflow-hidden border border-white/10 hover:border-[var(--color-yellow)]/60 transition-all duration-300 bg-[#090d1a]"
              >
                <Image
                  src={getArticleImage(stackedBottom)}
                  alt={stackedBottom.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    <FiLayers className="text-[var(--color-yellow)]" />
                    <span>Blog</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase block mb-1 font-[var(--font-poppins)]">
                      {stackedBottom.readTimeMinutes} Min Read
                    </span>
                    <h3 className="font-bold text-sm text-white leading-snug font-[var(--font-montserrat)] group-hover:text-[var(--color-yellow)] transition-colors line-clamp-2">
                      {stackedBottom.title}
                    </h3>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* BOTTOM ROW (4 Columns of Circular Thumbnails + Meta Details) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/10">
          {bottomArticles.map((art, idx) => (
            <Link
              key={art.id || idx}
              href={`/noticias/${art.slug}`}
              className="group flex items-start gap-3 p-2 hover:bg-white/[0.03] transition-colors"
            >
              {/* Circular Avatar Image */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/20 group-hover:border-[var(--color-yellow)] transition-colors">
                <Image
                  src={getArticleImage(art)}
                  alt={art.title}
                  fill
                  sizes="48px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Text Meta Content */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-0.5 font-[var(--font-poppins)]">
                  {art.readTimeMinutes} Min Read
                </span>
                <h4 className="font-bold text-xs text-white leading-snug font-[var(--font-montserrat)] group-hover:text-[var(--color-yellow)] transition-colors line-clamp-2">
                  {art.title}
                </h4>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase mt-1">
                  <FiLayers className="w-3 h-3 text-[var(--color-yellow)]" />
                  <span>Article</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
