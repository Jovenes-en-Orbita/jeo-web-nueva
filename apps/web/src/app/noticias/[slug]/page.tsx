import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { ArticleShareButton } from "@/components/features/ArticleShareButton";
import { getNewsBySlug } from "@/lib/api";
import { renderArticleContentToHtml } from "@/lib/content-renderer";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatEditorialDate(isoDate?: string | null): string {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    const day = d.getUTCDate();
    const month = MONTHS_ES[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day} de ${month} de ${year}`;
  } catch {
    return "";
  }
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

  const formattedLongDate =
    formatEditorialDate(article.date) || "Fecha no especificada";

  const imageSrc =
    article.imageUrl && article.imageUrl.trim() !== ""
      ? article.imageUrl
      : "/assets/artemis.svg";

  const renderedHtml = renderArticleContentToHtml(
    article.content || article.summary || "",
  );

  const categoryLabels =
    article.categories && article.categories.length > 0
      ? article.categories.map((c) => c.name.toUpperCase())
      : article.tags && article.tags.length > 0
        ? article.tags.slice(0, 3).map((t) => t.toUpperCase())
        : ["CIENCIA", "ASTRONOMÍA"];

  const references = article.references ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      {/* Fondo negro lateral + Hoja editorial blanca centrada estilo periódico */}
      <main className="flex-1 bg-black px-0 sm:px-6 md:px-10 py-0 sm:py-10">
        <article className="editorial-sheet max-w-[820px] mx-auto bg-white text-neutral-900 shadow-[0_0_60px_rgba(0,0,0,0.85)]">
          {/* Franja superior tipo periódico: píldora + volver + línea divisoria negra */}
          <div className="px-6 sm:px-12 pt-8 pb-5 border-b-2 border-neutral-900 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/noticias"
              className="inline-flex items-center px-3.5 py-1 rounded-full border border-neutral-900 text-[11px] font-bold uppercase tracking-widest text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors font-inter"
            >
              Noticias Espaciales
            </Link>

            <span className="text-xs text-neutral-500 font-medium font-inter">
              Jóvenes en Órbita
            </span>
          </div>

          {/* Contenido editorial */}
          <div className="px-6 sm:px-12 py-8 sm:py-10">
            {/* Etiquetas / Categorías | Fecha | Tiempo de lectura */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-4 font-inter">
              {categoryLabels.map((label, index) => (
                <span
                  key={`${label}-${index}`}
                  className="inline-flex items-center gap-2.5"
                >
                  <span className="text-neutral-900">|</span>
                  <span className="text-neutral-900">{label}</span>
                </span>
              ))}
              <span className="text-neutral-400">·</span>
              <span className="font-semibold text-neutral-500">
                {formattedLongDate}
              </span>
              {article.readTimeMinutes ? (
                <>
                  <span className="text-neutral-400">·</span>
                  <span className="font-semibold text-neutral-500">
                    {article.readTimeMinutes} min de lectura
                  </span>
                </>
              ) : null}
            </div>

            {/* Título principal */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 leading-[1.15] font-[var(--font-montserrat)] mb-4">
              {article.title}
            </h1>

            {/* Bajada / Subtítulo en cursiva */}
            {article.summary && (
              <p className="text-sm sm:text-base italic text-neutral-700 leading-relaxed mb-5 font-inter">
                {article.summary}
              </p>
            )}

            {/* Línea de autor alineada a la derecha (estilo periódico) */}
            <div className="flex justify-end items-center text-xs text-neutral-600 mb-6 pb-4 border-b border-neutral-200 font-inter">
              <span>
                <strong className="text-neutral-900 font-semibold">
                  Autor:
                </strong>{" "}
                {article.author || "Equipo JEO"}
              </span>
            </div>

            {/* Imagen principal grande dentro de la columna editorial */}
            <figure className="mb-8">
              <div className="relative w-full aspect-[16/10] bg-neutral-950 overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={article.title}
                  fill
                  sizes="(max-width: 820px) 100vw, 760px"
                  className="object-cover"
                  priority
                />
              </div>
              {article.coverImageCaption && (
                <figcaption className="mt-2.5 text-xs text-neutral-500 italic font-inter">
                  {article.coverImageCaption}
                </figcaption>
              )}
            </figure>

            {/* Cuerpo del artículo con renderizado rico (TipTap HTML / Markdown) */}
            {renderedHtml ? (
              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            ) : (
              <p className="article-prose">{article.summary}</p>
            )}

            {/* Etiquetas (tags) */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mr-1 font-inter">
                  Etiquetas:
                </span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/noticias`}
                    className="px-2.5 py-1 text-[11px] font-medium bg-neutral-100 hover:bg-neutral-900 text-neutral-700 hover:text-white transition-colors font-inter"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Sección de Bibliografía (formato académico/editorial) */}
            {references.length > 0 && (
              <section className="mt-10 pt-8 border-t-2 border-neutral-900">
                <h2 className="text-lg font-extrabold text-neutral-950 mb-4 font-[var(--font-montserrat)]">
                  Bibliografía
                </h2>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-800 leading-relaxed font-inter">
                  {references.map((ref) => {
                    const refDate = formatEditorialDate(ref.publishedAt);
                    const cleanAuthor = ref.author?.trim().replace(/\.+$/, "");
                    return (
                      <li key={ref.id} className="pl-5 -indent-5">
                        {cleanAuthor ? <span>{cleanAuthor}. </span> : null}
                        {refDate ? <span>({refDate}). </span> : null}
                        <em className="italic">{ref.title}</em>.{" "}
                        {ref.publisher ? (
                          <span>Obtenido de {ref.publisher}: </span>
                        ) : null}
                        {ref.url ? (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!text-blue-700 hover:!text-blue-900 underline break-all"
                          >
                            {ref.url}
                          </a>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* Colofón / Créditos editoriales (Departamento de Periodismo JEO) */}
            <footer className="mt-10 pt-8 border-t border-neutral-300 text-xs sm:text-sm text-neutral-700 space-y-1.5 font-inter">
              <p className="font-bold text-neutral-950 text-sm">
                Jóvenes en Órbita
              </p>
              <p>Departamento de Periodismo</p>
              <p>Fecha de publicación: {formattedLongDate}</p>
              <p>
                <span className="underline">Autor</span>:{" "}
                {article.author || "Equipo JEO"}
              </p>
            </footer>

            {/* Barra de Call-To-Action */}
            <div className="mt-10 pt-6 border-t-2 border-neutral-900 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 !text-white text-xs font-bold uppercase tracking-wider transition-colors font-inter"
              >
                <span>← Ver todas las noticias</span>
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <ArticleShareButton title={article.title} />
                <Link
                  href="/galeria"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#e8c648] hover:bg-[#d9b634] !text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors font-inter"
                >
                  <span>Explorar galería →</span>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
