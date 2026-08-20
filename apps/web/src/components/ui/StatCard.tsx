/**
 * Individual stat card with high contrast colors and elegant styling.
 */
export function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="py-6 px-6 border-l border-white/10 first:border-l-0 hover:bg-white/[0.03] transition-colors">
      <b className="block font-[var(--font-montserrat)] text-[38px] leading-tight font-extrabold text-[var(--color-yellow)] drop-shadow-[0_2px_10px_rgba(255,199,44,0.2)]">
        {value}
      </b>
      <span className="text-[13px] font-medium text-slate-200 uppercase tracking-wide leading-snug block mt-1">
        {label}
      </span>
    </div>
  );
}
