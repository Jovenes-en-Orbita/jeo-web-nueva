import Link from 'next/link';

/**
 * CTA button matching the wireframe style: text with arrow → and red bottom border.
 */
export function Button({
  children,
  href = '#',
  className = '',
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 font-[var(--font-montserrat)] font-semibold text-sm tracking-[0.05em] uppercase text-[var(--color-navy)] border-b-2 border-[var(--color-red)] pb-[3px] whitespace-nowrap transition-all duration-200 hover:gap-3 ${className}`}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        width={14}
        height={14}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="13 6 19 12 13 18" />
      </svg>
    </Link>
  );
}
