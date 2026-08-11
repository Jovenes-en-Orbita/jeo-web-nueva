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
        className={`absolute top-full right-0 bg-white text-[var(--color-ink)] min-w-[210px] border-t-[3px] border-[var(--color-yellow)] shadow-[0_12px_28px_rgba(0,0,0,0.18)] z-30 transition-all duration-200 origin-top before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 ${
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
            className={`block px-4 py-2.5 font-[var(--font-poppins)] text-[13px] font-medium normal-case tracking-normal transition-colors duration-150 hover:bg-[#F2F4F7] hover:underline ${
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

