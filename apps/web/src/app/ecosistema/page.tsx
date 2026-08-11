import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Ecosistema Espacial Argentino — JEO',
  description: 'Instituciones, empresas e iniciativas del desarrollo aeroespacial en Argentina (CONAE, INVAP, VENSAT, etc.).',
};

export default function EcosistemaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="block py-16 border-b border-[var(--color-line)]">
          <div className="wrap">
            <SectionHeader
              eyebrow="Sector Espacial Nacional"
              title="Ecosistema Espacial Argentino"
              description="Argentina cuenta con una destacada trayectoria satelital y espacial. Conocé los organismos e iniciativas que lideran la exploración e industria nacional."
            />
            <div className="grid grid-cols-3 gap-6 mt-8 max-[900px]:grid-cols-1">
              {[
                { name: 'CONAE', type: 'Agencia Espacial Nacional', desc: 'Comisión Nacional de Actividades Espaciales. Ejecutora del Plan Espacial Nacional.' },
                { name: 'INVAP', type: 'Desarrollo Tecnológico', desc: 'Diseño y construcción de satélites como ARSAT-1, ARSAT-2 y la constelación SAOCOM.' },
                { name: 'VENSAT', type: 'Acceso al Espacio', desc: 'Desarrollo del lanzador nacional de satélites Tronador.' },
              ].map((org, i) => (
                <div key={i} className="border border-[var(--color-line)] p-6 bg-white rounded">
                  <span className="text-[11px] font-semibold text-[var(--color-red)] uppercase block mb-1 font-[var(--font-montserrat)]">
                    {org.type}
                  </span>
                  <h3 className="font-[var(--font-montserrat)] font-bold text-xl text-[var(--color-navy)] mb-2">
                    {org.name}
                  </h3>
                  <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                    {org.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
