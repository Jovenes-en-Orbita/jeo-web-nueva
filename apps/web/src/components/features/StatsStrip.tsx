import { StatCard } from '@/components/ui/StatCard';
import { getStats } from '@/lib/api';

/**
 * Stats strip matching the wireframe's .stats section.
 * Server Component — fetches data from the API.
 */
export async function StatsStrip() {
  const stats = await getStats();

  return (
    <section className="border-b border-[var(--color-line)]">
      <div className="wrap grid grid-cols-4 max-[900px]:grid-cols-2">
        {stats.map((stat) => (
          <StatCard key={stat.id} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
