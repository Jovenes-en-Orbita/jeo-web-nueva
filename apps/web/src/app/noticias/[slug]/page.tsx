import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { Tag } from '@/components/ui/Tag';
import { getNews, getNewsBySlug } from '@/lib/api';
import { FiCalendar, FiClock, FiUser, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { FaXTwitter, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa6';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return {
      title: 'Noticia no encontrada — JEO',
    };
  }

  return {
    title: `${article.title} — JEO (Jóvenes en Órbita)`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author || 'Equipo JEO'],
    },
  };
}

export default async function NoticiaDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const allNews = await getNews();
  const relatedNews = allNews.filter((n) => n.slug !== slug).slice(0, 2);

  const formattedDate = new Date(article.date).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const imageSrc =
    article.imageUrl && article.imageUrl.startsWith('/')
      ? article.imageUrl
      : slug === 'artemis-iii'
      ? '/assets/artemis.svg'
      : slug === 'exoplaneta-habitable'
      ? '/assets/exoplanet.svg'
      : '/assets/starship.svg';

  return (
    <div className="min-h-screen flex flex-col bg-[#060a17] text-white">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="wrap max-w-4xl mx-auto px-4">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-yellow)] hover:text-white transition-colors mb-8 font-semibold"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Volver a Noticias Espaciales</span>
          </Link>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <Tag key={tag} variant="gold">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 font-[var(--font-montserrat)] leading-tight">
            {article.title}
          </h1>

          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-slate-400 py-4 border-y border-white/10 mb-8 font-[var(--font-poppins)]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <FiUser className="w-4 h-4 text-[var(--color-yellow)]" />
              <span>{article.author || 'Equipo JEO'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar className="w-4 h-4 text-[var(--color-yellow)]" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="w-4 h-4 text-[var(--color-yellow)]" />
              <span>{article.readTimeMinutes} min de lectura</span>
            </span>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-[320px] md:h-[460px] rounded-2xl overflow-hidden mb-4 border border-white/10 bg-[#090d1a] shadow-2xl">
            <Image
              src={imageSrc}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {article.coverImageCaption && (
            <p className="text-xs text-slate-400 italic text-center mb-10">
              {article.coverImageCaption}
            </p>
          )}

          {/* Lead Summary */}
          <div className="bg-[#0d162a] border-l-4 border-[var(--color-yellow)] p-6 rounded-r-xl mb-10">
            <p className="text-base md:text-lg text-slate-200 leading-relaxed font-medium">
              {article.summary}
            </p>
          </div>

          {/* Content Body */}
          <article className="prose prose-invert max-w-none text-slate-200 text-base md:text-lg leading-relaxed space-y-6 font-[var(--font-poppins)]">
            {article.content ? (
              article.content
                .split('\n\n')
                .map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h2 key={index} className="text-2xl md:text-3xl font-bold text-white pt-4 pb-2 border-b border-white/10 font-[var(--font-montserrat)]">
                        {paragraph.replace('# ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-xl md:text-2xl font-bold text-[var(--color-yellow)] pt-3 font-[var(--font-montserrat)]">
                        {paragraph.replace('## ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={index} className="border-l-4 border-[var(--color-red)] pl-4 py-2 italic text-slate-300 bg-white/5 rounded-r">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })
            ) : (
              <p>{article.summary}</p>
            )}
          </article>

          {/* Share Box */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              <FiShare2 className="w-4 h-4 text-[var(--color-yellow)]" />
              <span>Compartir artículo:</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-yellow)] hover:text-[#060a17] transition-all"
                title="Compartir en X"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
                title="Compartir en WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                title="Compartir en LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Related Articles */}
          {relatedNews.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/10">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-6 font-[var(--font-montserrat)]">
                Otras noticias de interés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedNews.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/noticias/${rel.slug}`}
                    className="bg-[#0d162a] border border-white/10 rounded-xl p-5 group hover:border-[var(--color-yellow)]/60 transition-all hover:-translate-y-1 block"
                  >
                    <span className="text-[11px] text-[var(--color-yellow)] font-semibold uppercase block mb-1">
                      {rel.readTimeMinutes} min de lectura
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-[var(--color-yellow)] transition-colors line-clamp-2 font-[var(--font-montserrat)]">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
