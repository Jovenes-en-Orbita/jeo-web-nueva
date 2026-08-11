/**
 * Section header matching the wireframe's .sec-head + .eyebrow-num pattern.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-end mb-8 gap-6 flex-wrap">
      <div>
        {eyebrow && (
          <span className="font-[var(--font-montserrat)] font-semibold text-[13px] text-[var(--color-red)] tracking-[0.14em] mb-1.5 block">
            {eyebrow}
          </span>
        )}
        <h2 className="text-[34px] text-[var(--color-navy)] font-[var(--font-montserrat)] font-bold uppercase tracking-[0.02em]">
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-[480px] text-[13px] text-[var(--color-ink-2)] leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
