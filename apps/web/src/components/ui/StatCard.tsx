/**
 * Individual stat card matching the wireframe's .stat style.
 */
export function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="py-[26px] px-6 border-l border-[var(--color-line)] first:border-l-0">
      <b className="block font-[var(--font-barlow)] text-[34px] text-[var(--color-navy)]">
        {value}
      </b>
      <span className="text-[12px] text-[var(--color-ink-2)]">{label}</span>
    </div>
  );
}
