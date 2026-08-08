'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface DropdownItem {
  label: string;
  href: string;
}

/**
 * Dropdown menu matching the wireframe's .dd + .menu pattern.
 * Accessible: uses hover + click toggle.
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative text-white font-[var(--font-barlow)] font-semibold text-[15px] uppercase tracking-[0.05em] flex items-center gap-1 cursor-default group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        onClick={() => setOpen(!open)}
        className="select-none"
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
      >
        {label}
      </span>
      <svg
        viewBox="0 0 24 24"
        width={10}
        height={10}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>

      {/* Dropdown menu */}
      <div
        className={`absolute top-full right-0 mt-3.5 bg-white text-[var(--color-ink)] min-w-[200px] border-t-[3px] border-[var(--color-yellow)] shadow-[0_12px_28px_rgba(0,0,0,0.18)] z-20 transition-all duration-200 origin-top ${
          open
            ? 'opacity-100 scale-y-100 pointer-events-auto'
            : 'opacity-0 scale-y-95 pointer-events-none'
        }`}
      >
        {items.map((item, i) => (
          <Link
            key={item.href + i}
            href={item.href}
            className={`block px-4 py-2.5 font-[var(--font-inter)] text-[13px] font-medium normal-case tracking-normal transition-colors duration-150 hover:bg-[#F2F4F7] hover:underline ${
              i < items.length - 1 ? 'border-b border-[var(--color-line)]' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
