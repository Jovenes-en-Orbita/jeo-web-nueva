import { StatCard } from '@/components/ui/StatCard';
import { getGalleryFeatured } from '@/lib/api';

/**
 * Stats strip matching the wireframe's .stats section.
 * Stat #4 dynamically counts the photos in Fragmentos de Memoria.
 */
export async function StatsStrip() {
  const collection = await getGalleryFeatured().catch(() => null);
  const photoCount = collection?.images?.length ?? collection?.totalImages ?? 0;

  const stats = [
    { id: '1', value: '93 %', label: 'del universo aún no se comprende del todo' },
    { id: '2', value: '8', label: 'planetas en el sistema solar' },
    { id: '3', value: '88', label: 'constelaciones reconocidas oficialmente' },
    { id: '4', value: `${photoCount}`, label: 'fotografías en Fragmentos de Memoria' },
  ];

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


