"use client";

import React, { useState } from "react";
import { FiShare2, FiCheck } from "react-icons/fi";

interface ArticleShareButtonProps {
  title: string;
}

export function ArticleShareButton({ title }: ArticleShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // Fallback a copiar al portapapeles
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignorar si el portapapeles no está disponible
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-900 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-inter"
    >
      {copied ? (
        <>
          <FiCheck className="w-3.5 h-3.5" />
          <span>Enlace copiado</span>
        </>
      ) : (
        <>
          <FiShare2 className="w-3.5 h-3.5" />
          <span>Compartir artículo</span>
        </>
      )}
    </button>
  );
}
