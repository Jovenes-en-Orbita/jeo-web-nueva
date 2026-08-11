import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Políticas & Privacidad — JEO (Jóvenes en Órbita)',
  description: 'Términos de uso, política de privacidad y protección de datos de la plataforma Jóvenes en Órbita.',
};

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--color-white)] text-[var(--color-ink)]">
        <section className="block py-16 border-b border-[var(--color-line)]">
          <div className="wrap">
            <SectionHeader
              eyebrow="Legal & Transparencia"
              title="Políticas & Privacidad"
              description="Transparencia y compromiso con la protección de datos personales de nuestra comunidad científica juvenil."
            />

            <div className="mt-10 max-w-4xl space-y-10 font-[var(--font-poppins)]">
              {/* Sección 1 */}
              <div className="bg-[#F7F8FA] p-8 rounded-lg border border-[var(--color-line)]">
                <h3 className="font-[var(--font-montserrat)] font-bold text-lg text-[var(--color-navy)] uppercase mb-3">
                  1. Compromiso de Privacidad
                </h3>
                <p className="text-sm text-[var(--color-ink-2)] leading-relaxed mb-4">
                  En <strong>Jóvenes en Órbita (JEO)</strong> respetamos y protegemos la privacidad de todos nuestros lectores, colaboradores y usuarios de la plataforma. Esta política describe qué datos recopilamos y cómo los utilizamos.
                </p>
                <p className="text-sm text-[var(--color-ink-2)] leading-relaxed">
                  Última actualización: <strong>agosto de {new Date().getFullYear()}</strong>.
                </p>
              </div>

              {/* Sección 2 */}
              <div className="bg-[#F7F8FA] p-8 rounded-lg border border-[var(--color-line)]">
                <h3 className="font-[var(--font-montserrat)] font-bold text-lg text-[var(--color-navy)] uppercase mb-3">
                  2. Recopilación de Datos
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-[var(--color-ink-2)] leading-relaxed">
                  <li><strong>Suscripción a Newsletter:</strong> Recopilamos tu dirección de correo electrónico únicamente para enviarte boletines informativos sobre misiones y noticias espaciales.</li>
                  <li><strong>Cookies Técnicas:</strong> Utilizamos cookies básicas para optimizar el rendimiento y medir estadísticas anónimas de navegación.</li>
                  <li><strong>Contacto Directo:</strong> La información enviada por correo es confidencial y utilizada exclusivamente para responder tus consultas.</li>
                </ul>
              </div>

              {/* Sección 3 */}
              <div className="bg-[#F7F8FA] p-8 rounded-lg border border-[var(--color-line)]">
                <h3 className="font-[var(--font-montserrat)] font-bold text-lg text-[var(--color-navy)] uppercase mb-3">
                  3. Derechos del Usuario
                </h3>
                <p className="text-sm text-[var(--color-ink-2)] leading-relaxed mb-4">
                  Tenés derecho en cualquier momento a cancelar tu suscripción al boletín, solicitar la rectificación o la eliminación completa de tus datos de nuestros registros.
                </p>
                <p className="text-sm text-[var(--color-ink-2)] leading-relaxed">
                  Para ejercer tus derechos, podés escribirnos a:{' '}
                  <a
                    href="mailto:jovenesenorbita@gmail.com"
                    className="text-[var(--color-navy)] font-semibold underline hover:text-[var(--color-red)] transition-colors"
                  >
                    jovenesenorbita@gmail.com
                  </a>
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
