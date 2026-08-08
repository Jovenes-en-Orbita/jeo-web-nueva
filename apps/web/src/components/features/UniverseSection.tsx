import { SectionHeader } from '@/components/ui/SectionHeader';
import { Placeholder } from '@/components/ui/Placeholder';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { getUniverse } from '@/lib/api';

/**
 * Section 01: El Universo
 * Server Component fetching universe data.
 * Matches wireframe's universo-grid layout.
 */
export async function UniverseSection() {
  const universe = await getUniverse();

  return (
    <section className="block py-16 border-b border-[var(--color-line)]" id="u">
      <div className="wrap">
        <SectionHeader eyebrow="Sección 01" title="El Universo" />

        <div className="grid grid-cols-[1.1fr_0.9fr] gap-10 items-start max-[900px]:grid-cols-1">
          {/* Left: Cover image + chips */}
          <div>
            {/* TODO: Replace with actual section cover image */}
            <Placeholder
              label="Imagen de portada de sección"
              style={{ height: 340 }}
            />
            <div className="flex flex-wrap gap-2.5 mt-[22px]">
              {universe.tabs.map((tab, i) => (
                <Chip key={tab.id} filled={i === 0} href={`#${tab.slug}`}>
                  {tab.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Right: Description + spectrum image + CTA */}
          <div>
            <p className="text-[13px] text-[var(--color-ink-2)] leading-relaxed mb-4">
              {universe.description}
            </p>
            {/* TODO: Replace with electromagnetic spectrum image */}
            <Placeholder
              label='Espectro electromagnético · pestaña propia "La Luz"'
              style={{ height: 150 }}
            />
            <div className="mt-5">
              <Button href="/universo">Explorar el universo</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
