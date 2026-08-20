/**
 * Tag component with theme support for dark or light backgrounds.
 */
export function Tag({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'dark';
}) {
  if (variant === 'dark') {
    return (
      <span className="text-[11px] font-semibold text-slate-200 border border-white/20 bg-white/5 px-3 py-[6px] rounded-md transition-colors duration-200 hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)]">
        {children}
      </span>
    );
  }

  return (
    <span className="text-[11px] font-semibold text-[var(--color-ink-2)] border border-[var(--color-line)] px-2.5 py-[5px] transition-colors duration-200 hover:border-[var(--color-navy)] hover:text-[var(--color-navy)]">
      {children}
    </span>
  );
}
