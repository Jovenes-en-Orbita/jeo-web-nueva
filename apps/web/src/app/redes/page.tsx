import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Redes Sociales & Comunidad — JEO',
  description: 'Conéctate con Jóvenes en Órbita en Instagram, YouTube, X, Discord y WhatsApp.',
};

export default function RedesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="block py-16 border-b border-[var(--color-line)]">
          <div className="wrap">
            <SectionHeader
              eyebrow="Comunidad"
              title="Redes Sociales & Canales"
              description="Sigue nuestros canales oficiales para no perderte directos, infografías espaciales y la conversación de la comunidad."
            />
            <div className="grid grid-cols-4 gap-4 mt-8 max-[900px]:grid-cols-2">
              {[
                { name: 'Instagram', handle: '@jovenesenorbita', desc: 'Infografías diarias e historias en vivo.' },
                { name: 'YouTube', handle: 'Jóvenes en Órbita TV', desc: 'Documentales cortos y explicativos.' },
                { name: 'X / Twitter', handle: '@JEO_espacio', desc: 'Alertas astronómicas y lanzamientos.' },
                { name: 'Discord', handle: 'Servidor Oficial JEO', desc: 'Debates, astrofotografía y eventos.' },
              ].map((net, i) => (
                <div key={i} className="border border-[var(--color-line)] p-5 bg-white rounded text-center">
                  <h3 className="font-[var(--font-montserrat)] font-bold text-base text-[var(--color-navy)] mb-1">
                    {net.name}
                  </h3>
                  <span className="text-xs text-[var(--color-red)] font-semibold block mb-3 font-[var(--font-montserrat)]">
                    {net.handle}
                  </span>
                  <p className="text-xs text-[var(--color-ink-2)] leading-normal">
                    {net.desc}
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
