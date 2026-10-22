"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { NewsArticle } from "@jeo/shared";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const [mousePos, setMousePos] = useState<{
    x: number;
    y: number;
    isNearRight?: boolean;
  } | null>(null);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Si el cursor se acerca al borde derecho, desplazar el tooltip a la izquierda
    const isNearRight = x > rect.width - 150;

    setMousePos({
      x,
      y,
      isNearRight,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <Link
      href={`/noticias/${article.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col bg-[#050811] border border-white/20 hover:border-white/50 transition-all duration-300 group w-full cursor-none hover:z-30"
    >
      {/* Floating Tooltip following the cursor */}
      {mousePos && (
        <div
          className="pointer-events-none absolute z-50 transition-transform duration-75 ease-out"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: mousePos.isNearRight
              ? "translate(calc(-100% + 12px), -100%)"
              : "translate(-8px, -100%)",
          }}
        >
          <div className="relative mb-2">
            {/* Tooltip Bubble */}
            <div className="bg-[#171a33] text-white text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-md shadow-2xl border border-white/30 whitespace-nowrap tracking-wide font-chakra">
              VER MAS INFORMACIÓN
            </div>

            {/* Downward triangle/pointer */}
            <div
              className={`absolute -bottom-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#171a33] ${
                mousePos.isNearRight ? "right-3" : "left-3"
              }`}
            />
          </div>
        </div>
      )}

      {/* Upper area for image (full cover) */}
      <div className="relative w-full aspect-[16/10] bg-[#090e1d] overflow-hidden">
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Lower dark area with date and title */}
      <div className="border-t border-white/20 p-4 sm:p-5 flex flex-col justify-between flex-1 bg-[#050811]">
        <div>
          <span className="block text-[11px] sm:text-xs tracking-wider text-slate-300 font-bold uppercase mb-1 font-inter">
            {formattedDate}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight font-inter line-clamp-2 group-hover:text-slate-100 transition-colors">
            {article.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
