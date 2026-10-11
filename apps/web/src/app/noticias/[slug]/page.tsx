import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { getNewsBySlug } from "@/lib/api";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return {
      title: "Noticia no encontrada — JEO",
    };
  }

  return {
    title: `${article.title} — JEO (Jóvenes en Órbita)`,
    description: article.summary,
  };
}

export default async function NoticiaDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = (() => {
    try {
      const d = new Date(article.date);
      if (isNaN(d.getTime())) return "00/00/0000";
      const day = String(d.getUTCDate()).padStart(2, "0");
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const year = d.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "00/00/0000";
    }
  })();

  const imageSrc =
    article.imageUrl && article.imageUrl.trim() !== ""
      ? article.imageUrl
      : "/assets/artemis.svg";

  const defaultContent =
    'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos espécimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenían pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.';

  const paragraphs = article.content
    ? article.content.split("\n\n").filter((p) => p.trim() !== "")
    : [article.summary || defaultContent, defaultContent];

  const firstParagraph = paragraphs[0] || defaultContent;
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner: Starry background with Yellow Accent Title */}
        <section className="relative w-full h-[220px] sm:h-[280px] lg:h-[320px] overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-black">
            <Image
              src="/assets/hero-cosmos.svg"
              alt="Fondo estelar cosmos"
              fill
              sizes="100vw"
              className="object-cover opacity-75"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050811]" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-1.5 sm:w-2 h-12 sm:h-16 lg:h-20 bg-[#e5a912] shrink-0" />
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-[#e5a912] font-[var(--font-chakra)]">
                NOTICIAS ESPACIALES
              </h1>
            </div>
          </div>
        </section>

        {/* Article Body Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Centered Main Title */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider text-white font-[var(--font-chakra)]">
              {article.title}
            </h2>
          </div>

          {/* Author & Date metadata block */}
          <div className="mb-8">
            <span className="block text-xs uppercase tracking-widest text-slate-300 font-bold font-[var(--font-inter)]">
              {article.author ? article.author.toUpperCase() : "AUTOR"}
            </span>
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-[var(--font-inter)] mt-0.5">
              {formattedDate}
            </span>
          </div>

          {/* Row 1: Image Left + Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-24">
            <div className="lg:col-span-5 bg-[#090e1d] aspect-[16/10] flex items-center justify-center relative overflow-hidden border border-white/20">
              <Image
                src={imageSrc}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="lg:col-span-7 font-[var(--font-inter)] text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
              <p>{firstParagraph}</p>
            </div>
          </div>

          {/* Row 2: Text Left (with Subtitle/Author) + Image Right */}
          {remainingParagraphs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-white/10">
              <div className="lg:col-span-7 order-2 lg:order-1 font-[var(--font-inter)] text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
                <div className="mb-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-white font-[var(--font-chakra)] tracking-wide">
                    {article.title}
                  </h3>
                  <span className="block text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">
                    {article.author ? article.author.toUpperCase() : "AUTOR"}
                  </span>
                </div>
                {remainingParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2 bg-[#090e1d] aspect-[16/10] flex items-center justify-center relative overflow-hidden border border-white/20">
                <Image
                  src={imageSrc}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
            <Link
              href="/noticias"
              className="inline-flex items-center text-xs sm:text-sm font-bold tracking-wider text-[#8a7cf8] hover:text-[#a89eff] transition-colors uppercase font-[var(--font-inter)]"
            >
              <span>← VOLVER A NOTICIAS</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
