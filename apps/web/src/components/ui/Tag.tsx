/**
 * Tag component matching the wireframe's .tag style.
 * Used in the "Constelaciones" section for resource categories.
 */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold text-[var(--color-ink-2)] border border-[var(--color-line)] px-2.5 py-[5px] transition-colors duration-200 hover:border-[var(--color-navy)] hover:text-[var(--color-navy)]">
      {children}
    </span>
  );
}
