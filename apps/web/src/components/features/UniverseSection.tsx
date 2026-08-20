import { Universe3DContainer } from './Universe3DContainer';

/**
 * Section 01: El Universo
 * Full-screen interactive 3D WebGL Canvas experience.
 */
export function UniverseSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#060811]" id="u">
      <Universe3DContainer />
    </section>
  );
}
