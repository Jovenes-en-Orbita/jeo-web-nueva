/**
 * Section header with customizable theme (light / dark) for clear visibility across all sections.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  theme = 'light',
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  theme?: 'light' | 'dark';
  children?: React.ReactNode;
}) {
  const isDark = theme === 'dark';

  return (
    <div className="flex justify-between items-end mb-8 gap-6 flex-wrap">
      <div>
        {eyebrow && (
          <span className="font-[var(--font-montserrat)] font-semibold text-[13px] text-[var(--color-yellow)] tracking-[0.14em] mb-1.5 block">
            {eyebrow}
          </span>
        )}
        <h2
          className={`text-[34px] font-[var(--font-montserrat)] font-bold uppercase tracking-[0.02em] ${
            isDark ? 'text-white' : 'text-[var(--color-navy)]'
          }`}
        >
          {title}
        </h2>
      </div>
      {description && (
        <p
          className={`max-w-[480px] text-[13px] leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-[var(--color-ink-2)]'
          }`}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
