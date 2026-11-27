import React from "react";

type BadgeVariant =
  | "gold"
  | "gold-solid"
  | "red"
  | "success"
  | "warning"
  | "neutral"
  | "outline-dark";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  gold: "bg-[#050811]/85 border border-[#e8c648]/50 text-[#e8c648]",
  "gold-solid": "bg-[#e8c648] border border-[#e8c648] text-[#050811]",
  red: "bg-[#d83933]/15 border border-[#d83933]/40 text-red-300",
  success: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300",
  warning: "bg-amber-500/15 border border-amber-500/30 text-amber-300",
  neutral: "bg-white/5 border border-white/10 text-slate-300",
  "outline-dark": "bg-white border border-neutral-900 text-neutral-900",
};

/**
 * Insignia / etiqueta reutilizable del Design System de JEO.
 */
export function Badge({
  children,
  variant = "gold",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest font-inter ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
