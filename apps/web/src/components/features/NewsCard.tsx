import Link from "next/link";
import Image from "next/image";
import type { NewsArticle } from "@jeo/shared";

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

  return (
    <div className="flex flex-col bg-[#050811] border border-white/20 hover:border-white/50 transition-all duration-300 group overflow-hidden w-full">
      {/* Upper area for image (full cover without white border) */}
      <div className="relative w-full aspect-[16/10] bg-[#090e1d] overflow-hidden">
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Lower dark area with border top */}
      <div className="border-t border-white/20 p-4 sm:p-5 flex flex-col justify-between flex-1 bg-[#050811]">
        <div>
          <span className="block text-[11px] sm:text-xs tracking-wider text-slate-300 font-bold uppercase mb-1 font-[var(--font-inter)]">
            {formattedDate}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight mb-4 font-[var(--font-inter)] line-clamp-2">
            {article.title}
          </h3>
        </div>

        <div>
          <Link
            href={`/noticias/${article.slug}`}
            className="inline-flex items-center text-xs sm:text-sm font-bold tracking-wide text-[#8a7cf8] group-hover:text-[#a89eff] transition-colors uppercase font-[var(--font-inter)]"
          >
            <span>VER ARTÍCULO COMPLETO</span>
            <span className="ml-1 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
