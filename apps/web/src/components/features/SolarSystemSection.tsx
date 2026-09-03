import { SectionHeader } from '@/components/ui/SectionHeader';
import { getSolarSystem } from '@/lib/api';
import { SolarSystem3DContainer } from './SolarSystem3DContainer';
import { SolarSystemInteractiveGrid } from './SolarSystemInteractiveGrid';

/**
 * Section 02: Sistema Solar
 * Interactive 3D Solar System Experience + 8 interactive planets overview + 5 moons.
 */
export async function SolarSystemSection() {
  const data = await getSolarSystem();

  return (
    <section className="block py-16 border-b border-white/10 bg-[#060a17]" id="ss">
      <div className="wrap">
        <SectionHeader
          title="Sistema Solar"
          theme="dark"
          eyebrow="Nuestro Vecindario Cósmico"
          description="Exploración tridimensional de los planetas, órbitas, asteroides y lunas principales en movimiento dinámico."
        />

        {/* 3D Solar System Simulation */}
        <div className="mb-8">
          <SolarSystem3DContainer />
        </div>

        {/* Interactive Planets and Moons Grid */}
        <SolarSystemInteractiveGrid planets={data.planets} moons={data.moons} />
      </div>
    </section>
  );
}
