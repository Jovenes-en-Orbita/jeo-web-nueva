import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Newsletter — JEO (Jóvenes en Órbita)',
  description: 'Suscríbete a nuestro boletín espacial semanal con las noticias más destacadas.',
};

export default function NewsletterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="block py-16 border-b border-[var(--color-line)]">
          <div className="wrap">
            <SectionHeader
              eyebrow="Multimedia"
              title="Boletín Espacial (Newsletter)"
              description="Recibe semanalmente en tu correo un resumen con los principales descubrimientos, imágenes destacadas y eventos astronómicos."
            />
            <div className="bg-[var(--color-navy)] text-white p-8 rounded-md max-w-[600px] mt-6">
              <h3 className="font-[var(--font-montserrat)] font-bold text-xl uppercase mb-3 text-[var(--color-yellow)]">
                Suscríbete a Órbita Semanal
              </h3>
              <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                Sin spam. Solo divulgación científica espacial de calidad hecha por jóvenes para jóvenes.
              </p>
              <form action="#" className="flex gap-2 max-[600px]:flex-col">
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  className="bg-white/10 border border-white/20 px-4 py-2.5 rounded text-sm text-white placeholder:text-gray-400 outline-none flex-1 focus:border-[var(--color-yellow)] transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-[var(--color-red)] text-white font-[var(--font-montserrat)] font-bold text-sm uppercase px-6 py-2.5 rounded hover:bg-red-700 transition-colors"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
