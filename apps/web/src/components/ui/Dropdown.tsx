'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface DropdownItem {
  label: string;
  href: string;
}

/**
 * Dropdown menu with hover bridge and smooth transition.
 */
export function Dropdown({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative text-white font-[var(--font-montserrat)] font-semibold text-[15px] uppercase tracking-[0.05em] flex items-center gap-1 cursor-pointer group py-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        onClick={() => setOpen(!open)}
        className="select-none flex items-center gap-1 py-1"
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          width={10}
          height={10}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>

      {/* Dropdown menu con puente de hover invisible */}
      <div
        className={`absolute top-full left-0 bg-[#0a0a0a] text-white min-w-[220px] border border-white/10 border-t-[3px] border-t-[#d83933] shadow-2xl z-50 transition-all duration-200 origin-top before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 ${
          open
            ? 'opacity-100 scale-y-100 pointer-events-auto mt-1'
            : 'opacity-0 scale-y-95 pointer-events-none mt-2'
        }`}
      >
        {items.map((item, i) => (
          <Link
            key={item.href + i}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`block px-4 py-3 font-[var(--font-poppins)] text-xs font-semibold normal-case tracking-wide text-slate-200 transition-colors duration-150 hover:bg-[#161616] hover:text-[#d83933] ${
              i < items.length - 1 ? 'border-b border-white/10' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

