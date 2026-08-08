import { SectionHeader } from '@/components/ui/SectionHeader';
import { Placeholder } from '@/components/ui/Placeholder';
import { getSolarSystem } from '@/lib/api';

/**
 * Section 02: Sistema Solar
 * Server Component. Panoramic image + 8 planets + 5 moons.
 * Matches wireframe's .ss-hero, .planet-row, .moon-strip layouts.
 */
export async function SolarSystemSection() {
  const data = await getSolarSystem();

  return (
    <section className="block alt py-16 border-b border-[var(--color-line)] bg-[#F7F8FA]" id="ss">
      <div className="wrap">
        <SectionHeader eyebrow="Sección 02" title="Sistema Solar" />

        {/* Panoramic cover */}
        {/* TODO: Replace with actual solar system panoramic image */}
        <Placeholder
          label="Foto completa del sistema solar (agrandada)"
          style={{ height: 300, marginBottom: 22 }}
        />

        {/* Planets row */}
        <div className="grid grid-cols-8 gap-3.5 max-[900px]:grid-cols-4 max-[900px]:row-gap-4">
          {data.planets.map((planet) => (
            <div key={planet.id} className="text-center group cursor-pointer">
              {/* TODO: Replace with actual planet image */}
              <Placeholder
                className="w-full rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ aspectRatio: '1/1', fontSize: 0 }}
              />
              <span className="block mt-2 text-[11px] font-semibold text-[var(--color-ink-2)] group-hover:text-[var(--color-navy)] transition-colors">
                {planet.name}
              </span>
            </div>
          ))}
        </div>

        {/* Moons strip */}
        <div className="mt-[30px]">
          <p className="text-[11px] font-semibold text-[var(--color-ink-2)] tracking-[0.03em] uppercase mb-3">
            Las 5 lunas más grandes
          </p>
          <div className="flex gap-3">
            {data.moons.map((moon) => (
              <div key={moon.id} className="flex-1 group cursor-pointer relative">
                {/* TODO: Replace with actual moon image */}
                <Placeholder
                  style={{ height: 90, fontSize: 0 }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white bg-black/50 px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {moon.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
