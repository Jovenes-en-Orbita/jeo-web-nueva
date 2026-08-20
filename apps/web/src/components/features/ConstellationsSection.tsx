import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { getConstellations } from '@/lib/api';
import { SkyMap2D } from './SkyMap2D';

/**
 * Section 03: Constelaciones
 * High contrast dark theme + Interactive 2D night sky map component + details.
 */
export async function ConstellationsSection() {
  const data = await getConstellations();

  return (
    <section className="block py-12 border-b border-white/10 bg-[#060a17] min-h-full flex flex-col justify-center" id="const">
      <div className="wrap w-full">
        <SectionHeader title="Constelaciones" theme="dark" />

        <div className="grid grid-cols-2 gap-10 items-center max-[900px]:grid-cols-1">
          {/* Left: Interactive 2D sky map */}
          <div>
            <SkyMap2D />
          </div>

          {/* Right: Description + tags + CTA */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-3 font-[var(--font-montserrat)]">
              Exploración del Cielo Nocturno
            </h3>
            <p className="text-[14px] text-slate-200 leading-relaxed mb-4">
              {data.description}
            </p>
            <div className="flex flex-wrap gap-2.5 mt-[18px] mb-6">
              {data.resources.map((res) => (
                <Tag key={res.id} variant="dark">
                  {res.label}
                </Tag>
              ))}
            </div>
            <div className='text-[#FFC72C] hover:text-white'>
              <Button href="/constelaciones" variant="gold">
                Ver constelaciones completas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
