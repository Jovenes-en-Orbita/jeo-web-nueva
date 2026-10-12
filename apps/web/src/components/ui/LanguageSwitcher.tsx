"use client";

import { useState, useRef, useEffect } from "react";
import { FiGlobe } from "react-icons/fi";

const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<LanguageCode>("es");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setCurrent(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative text-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Cambiar idioma"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center p-1 transition-colors hover:text-[#d83933]"
      >
        <FiGlobe className="w-5 h-5" />
      </button>

      <div
        role="menu"
        className={`absolute top-full right-0 z-50 mt-1 min-w-[160px] border border-white/10 bg-[#0a0a0a] transition-all duration-200 ${
          open
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        {LANGUAGES.map((lang, i) => (
          <button
            key={lang.code}
            type="button"
            role="menuitem"
            onClick={() => handleSelect(lang.code)}
            className={`block w-full px-4 py-3 text-left font-[var(--font-poppins)] text-xs font-semibold transition-colors hover:bg-white/10 ${
              current === lang.code ? "text-[#d83933]" : "text-white"
            } ${i < LANGUAGES.length - 1 ? "border-b border-white/10" : ""}`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
