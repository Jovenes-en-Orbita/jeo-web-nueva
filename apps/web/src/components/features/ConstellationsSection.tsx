import { SectionHeader } from '@/components/ui/SectionHeader';
import { Placeholder } from '@/components/ui/Placeholder';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { getConstellations } from '@/lib/api';

/**
 * Section 03: Constelaciones
 * Server Component. Sky map + description + resource tags + CTA.
 * Matches wireframe's .const-grid layout.
 */
export async function ConstellationsSection() {
  const data = await getConstellations();

  return (
    <section className="block py-16 border-b border-[var(--color-line)]" id="const">
      <div className="wrap">
        <SectionHeader eyebrow="Sección 03" title="Constelaciones" />

        <div className="grid grid-cols-2 gap-10 items-center max-[900px]:grid-cols-1">
          {/* Left: Sky map placeholder */}
          {/* TODO: Replace with interactive sky map image or component */}
          <Placeholder label="Mapa del cielo interactivo" style={{ height: 320 }} />

          {/* Right: Description + tags + CTA */}
          <div>
            <p className="text-[13px] text-[var(--color-ink-2)] leading-relaxed mb-3.5">
              {data.description}
            </p>
            <div className="flex gap-2 mt-[18px]">
              {data.resources.map((res) => (
                <Tag key={res.id}>{res.label}</Tag>
              ))}
            </div>
            <div className="mt-5">
              <Button href="/constelaciones">Ver constelaciones</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
