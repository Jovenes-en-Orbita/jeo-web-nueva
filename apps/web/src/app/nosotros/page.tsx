import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Conoce a JEO — Quiénes Somos',
  description: 'Jóvenes en Órbita es una plataforma de divulgación científica espacial hecha por y para jóvenes.',
};

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="block py-16 border-b border-[var(--color-line)]">
          <div className="wrap">
            <SectionHeader
              eyebrow="Quiénes somos"
              title="Acerca de Jóvenes en Órbita"
              description="Nuestra misión es inspirar a las nuevas generaciones conectándolas con las ciencias espaciales, la tecnología satelital y el ecosistema aeroespacial argentino."
            />
            <div className="grid grid-cols-2 gap-10 mt-8 max-[900px]:grid-cols-1">
              <div className="bg-[#F7F8FA] p-8 rounded border border-[var(--color-line)]">
                <h3 className="font-[var(--font-montserrat)] font-bold text-xl text-[var(--color-navy)] mb-3 uppercase">
                  Nuestra Misión
                </h3>
                <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                  Democratizar el acceso al conocimiento astronómico y espacial con rigor técnico, cercanía y un enfoque multidisciplinario adaptado al público joven.
                </p>
              </div>
              <div className="bg-[#F7F8FA] p-8 rounded border border-[var(--color-line)]">
                <h3 className="font-[var(--font-montserrat)] font-bold text-xl text-[var(--color-navy)] mb-3 uppercase">
                  Nuestra Visión
                </h3>
                <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                  Ser la comunidad de referencia en divulgación espacial juvenil de Latinoamérica, conectando estudiantes, investigadores y la industria aeroespacial.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
