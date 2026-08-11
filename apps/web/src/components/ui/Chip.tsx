/**
 * Chip/pill component matching the wireframe's .chip style.
 * Used in the "El Universo" section for sub-topic navigation.
 */
export function Chip({
  children,
  filled = false,
  href,
}: {
  children: React.ReactNode;
  filled?: boolean;
  href?: string;
}) {
  const baseClasses =
    'font-[var(--font-montserrat)] font-semibold text-[13px] tracking-[0.04em] uppercase px-3.5 py-[7px] transition-colors duration-200 cursor-pointer';

  const variantClasses = filled
    ? 'bg-[var(--color-navy)] text-white border border-[var(--color-navy)] hover:bg-[var(--color-navy-2)]'
    : 'bg-transparent text-[var(--color-navy)] border border-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white';

  const Tag = href ? 'a' : 'span';

  return (
    <Tag href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </Tag>
  );
}
