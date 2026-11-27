"use client";

import React from "react";

export interface TabItem {
  key: string;
  label: string;
  badge?: number | string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  ariaLabel: string;
  variant?: "underline" | "pill";
  surface?: "light" | "dark";
  className?: string;
}

/**
 * Componente de pestañas reutilizable del Design System de JEO.
 * - `underline`: pestañas editoriales con subrayado dorado (ej. Grandes Mentes).
 * - `pill`: pestañas tipo botón con contador opcional (ej. Panel Admin, filtros).
 */
export function Tabs({
  items,
  activeKey,
  onChange,
  ariaLabel,
  variant = "underline",
  surface = "light",
  className = "",
}: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex flex-wrap items-center gap-x-6 gap-y-2 ${className}`}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;

        if (variant === "pill") {
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer font-inter ${
                isActive
                  ? "bg-[#e8c648] text-[#050811] border-[#e8c648]"
                  : surface === "dark"
                    ? "bg-[#090e1d] text-slate-300 border-white/15 hover:border-[#e8c648]/60"
                    : "bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-neutral-900"
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive
                      ? "bg-[#050811] text-[#e8c648]"
                      : "bg-[#d83933] text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        }

        const textClass = surface === "light" ? "text-black" : "text-white";
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.key)}
            className={`border-b-2 pb-1 text-sm font-medium capitalize transition-colors cursor-pointer sm:text-base ${textClass} ${
              isActive
                ? "border-yellow-500"
                : "border-transparent hover:border-yellow-500/50"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
