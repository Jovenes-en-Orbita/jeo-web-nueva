import Link from 'next/link';

/**
 * CTA button with theme support (light / dark) for clear legibility on dark space backgrounds.
 */
export function Button({
  children,
  href = '#',
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  href?: string;
  variant?: 'default' | 'gold' | 'light';
  className?: string;
}) {
  let textColor = 'text-[var(--color-navy)]';
  let borderColor = 'border-[var(--color-red)]';

  if (variant === 'gold') {
    textColor = 'text-[#FFC72C] hover:text-white';
    borderColor = 'border-[#FFC72C]';
  } else if (variant === 'light') {
    textColor = 'text-white hover:text-[#FFC72C]';
    borderColor = 'border-[#FFC72C]';
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 font-[var(--font-montserrat)] font-bold text-sm tracking-[0.05em] uppercase border-b-2 pb-[3px] whitespace-nowrap transition-all duration-200 hover:gap-3 ${textColor} ${borderColor} ${className}`}
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
