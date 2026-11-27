"use client";

import Link from "next/link";
import Image from "next/image";
import type { NewsArticle } from "@jeo/shared";
import { Badge } from "@/components/ui";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
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

  const primaryCategory =
    article.categories && article.categories.length > 0
      ? article.categories[0].name
      : article.tags && article.tags.length > 0
        ? article.tags[0]
        : null;

  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="relative flex flex-col bg-[#050811] border border-white/15 hover:border-[#e8c648]/60 transition-all duration-300 group w-full"
    >
      {/* Imagen principal */}
      <div className="relative w-full aspect-[16/10] bg-[#090e1d] overflow-hidden">
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {primaryCategory && (
          <Badge variant="gold" className="absolute top-3 left-3 py-1">
            {primaryCategory}
          </Badge>
        )}
      </div>

      {/* Contenido + CTA */}
      <div className="border-t border-white/15 p-5 flex flex-col justify-between flex-1 bg-[#050811]">
        <div>
          <div className="flex items-center gap-2 text-[11px] tracking-wider text-slate-400 font-semibold uppercase mb-2 font-inter">
            <span>{formattedDate}</span>
            {article.readTimeMinutes ? (
              <>
                <span className="text-slate-600">·</span>
                <span>{article.readTimeMinutes} MIN DE LECTURA</span>
              </>
            ) : null}
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight font-inter line-clamp-2 group-hover:text-[#e8c648] transition-colors">
            {article.title}
          </h3>

          {article.summary && (
            <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 font-inter">
              {article.summary}
            </p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#e8c648] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5 font-inter">
            <span>Ver artículo completo</span>
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
