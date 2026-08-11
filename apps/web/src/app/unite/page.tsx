import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Unite a Nosotros — JEO (Jóvenes en Órbita)',
  description: 'Sé parte del equipo de Jóvenes en Órbita como redactor, diseñador, desarrollador o divulgador.',
};

export default function UnitePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="block py-16 border-b border-[var(--color-line)]">
          <div className="wrap">
            <SectionHeader
              eyebrow="Convocatoria Abierta"
              title="Unite a Jóvenes en Órbita"
              description="¿Te apasiona el espacio, la ciencia, el diseño o la programación? Sumate como voluntario o colaborador al equipo de JEO."
            />
            <div className="grid grid-cols-3 gap-6 mt-8 max-[900px]:grid-cols-1">
              {[
                { role: 'Redacción & Divulgación', area: 'Contenido', desc: 'Escribe artículos, notas de noticias espaciales e historias del cosmos.' },
                { role: 'Diseño & Multimedia', area: 'Visual', desc: 'Crea infografías astronómicas, piezas de redes y edición de video.' },
                { role: 'Desarrollo & Web', area: 'Tech', desc: 'Contribuye al desarrollo de nuestra plataforma web e iniciativas digitales.' },
              ].map((team, i) => (
                <div key={i} className="border border-[var(--color-line)] p-6 bg-white rounded flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--color-red)] uppercase block mb-1 font-[var(--font-montserrat)]">
                      {team.area}
                    </span>
                    <h3 className="font-[var(--font-montserrat)] font-bold text-lg text-[var(--color-navy)] mb-2">
                      {team.role}
                    </h3>
                    <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                      {team.desc}
                    </p>
                  </div>
                  <button className="mt-6 bg-[var(--color-navy)] text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-4 py-2.5 rounded hover:bg-[var(--color-navy-2)] transition-colors w-fit">
                    Postularme →
                  </button>
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
