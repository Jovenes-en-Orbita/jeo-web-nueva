import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Libros Electrónicos — JEO (Jóvenes en Órbita)',
  description: 'Biblioteca digital de ebooks y guías gratuitas de astronomía y ciencias espaciales.',
};

export default function LibrosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="block py-16 border-b border-[var(--color-line)]">
          <div className="wrap">
            <SectionHeader
              eyebrow="Multimedia & Recursos"
              title="Libros Electrónicos & Guías"
              description="Material educativo en PDF y ePub preparado por el equipo de JEO para estudiantes, educadores y entusiastas del espacio."
            />
            <div className="grid grid-cols-3 gap-6 mt-8 max-[900px]:grid-cols-1">
              {[
                { title: 'Guía de Astrofotografía Urbana', level: 'Principiante', desc: 'Cómo fotografiar la luna y constelaciones desde la ciudad.' },
                { title: 'Manual del Sistema Solar para Jóvenes', level: 'Educativo', desc: 'Fichas ilustradas de cada planeta y sus principales satélites.' },
                { title: 'Satélites Argentinos: Historia y Futuro', level: 'Divulgación', desc: 'De la serie ARSAT a la constelación SAOCOM y más allá.' },
              ].map((book, i) => (
                <div key={i} className="border border-[var(--color-line)] p-6 bg-white rounded flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase text-[var(--color-red)] tracking-wider block mb-2 font-[var(--font-montserrat)]">
                      {book.level}
                    </span>
                    <h3 className="font-[var(--font-montserrat)] font-bold text-lg text-[var(--color-navy)] mb-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                      {book.desc}
                    </p>
                  </div>
                  <button className="mt-6 text-xs font-[var(--font-montserrat)] font-bold uppercase text-[var(--color-navy)] border-b-2 border-[var(--color-red)] pb-1 w-fit hover:text-[var(--color-red)] transition-colors">
                    Descargar PDF ↓
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
