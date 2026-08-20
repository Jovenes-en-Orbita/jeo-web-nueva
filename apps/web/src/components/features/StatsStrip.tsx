import { StatCard } from '@/components/ui/StatCard';
import { getStats } from '@/lib/api';

/**
 * Stats strip matching the wireframe's .stats section.
 * Server Component — fetches data from the API.
 * Uses dark background with high-contrast text and subtle gold accents.
 */
export async function StatsStrip() {
  const stats = await getStats();

  return (
    <section className="bg-[#080d1a] border-y border-white/10 py-2">
      <div className="wrap grid grid-cols-4 max-[900px]:grid-cols-2">
        {stats.map((stat) => (
          <StatCard key={stat.id} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
