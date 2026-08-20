import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { getConstellations } from '@/lib/api';
import { SkyMap2D } from './SkyMap2D';

/**
 * Section 03: Constelaciones
 * Interactive 2D night sky map component + details.
 */
export async function ConstellationsSection() {
  const data = await getConstellations();

  return (
    <section className="block py-16 border-b border-[var(--color-line)]" id="const">
      <div className="wrap">
        <SectionHeader title="Constelaciones" />

        <div className="grid grid-cols-2 gap-10 items-center max-[900px]:grid-cols-1">
          {/* Left: Interactive 2D sky map */}
          <div>
            <SkyMap2D />
          </div>

          {/* Right: Description + tags + CTA */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-3">
              Exploración del Cielo Nocturno
            </h3>
            <p className="text-[13px] text-slate-300 leading-relaxed mb-4">
              {data.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-[18px] mb-6">
              {data.resources.map((res) => (
                <Tag key={res.id}>{res.label}</Tag>
              ))}
            </div>
            <div>
              <Button href="/constelaciones">Ver constelaciones completas</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
