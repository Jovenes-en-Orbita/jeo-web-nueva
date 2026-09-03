import type { Metadata } from 'next';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FiDownload, FiBookOpen } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Libros Electrónicos & Guías — JEO (Jóvenes en Órbita)',
  description: 'Biblioteca digital de ebooks, manuales y guías gratuitas de astronomía y ciencias espaciales en PDF.',
};

const BOOKS = [
  {
    title: 'Guía de Astrofotografía Urbana',
    level: 'Principiante',
    desc: 'Cómo fotografiar la Luna, planetas y constelaciones desde la ciudad con cámaras réflex, smartphones o telescopios de iniciación.',
    file: '/downloads/guia-astrofotografia.pdf',
    pages: '24 páginas',
  },
  {
    title: 'Manual del Sistema Solar para Jóvenes',
    level: 'Educativo',
    desc: 'Fichas astronómicas ilustradas de cada planeta, sus principales satélites naturales, asteroides y misiones de exploración.',
    file: '/downloads/manual-sistema-solar.pdf',
    pages: '38 páginas',
  },
  {
    title: 'Satélites Argentinos: Historia y Futuro',
    level: 'Divulgación',
    desc: 'De la serie ARSAT a la constelación de radar SAOCOM, la historia de CONAE, INVAP y el lanzador soberano Tronador.',
    file: '/downloads/satelites-argentinos.pdf',
    pages: '32 páginas',
  },
];

export default function LibrosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#060a17] text-white">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="wrap max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="Multimedia & Recursos"
            title="Libros Electrónicos & Guías Educativas"
            theme="dark"
            description="Material educativo en PDF elaborado por el equipo de Jóvenes en Órbita para estudiantes, educadores y entusiastas del espacio."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {BOOKS.map((book, i) => (
              <div
                key={i}
                className="bg-[#0d162a] border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:border-[var(--color-yellow)]/60 transition-all duration-300 hover:-translate-y-1 shadow-2xl group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase text-[var(--color-yellow)] tracking-wider block font-[var(--font-montserrat)]">
                      {book.level}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {book.pages}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-yellow)] mb-5 group-hover:scale-110 transition-transform">
                    <FiBookOpen className="w-6 h-6" />
                  </div>

                  <h3 className="font-[var(--font-montserrat)] font-bold text-xl text-white mb-3 group-hover:text-[var(--color-yellow)] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-[var(--font-poppins)]">
                    {book.desc}
                  </p>
                </div>

                <a
                  href={book.file}
                  download
                  className="mt-8 flex items-center justify-center gap-2 bg-[var(--color-navy)] hover:bg-[var(--color-navy-2)] border border-[var(--color-yellow)]/40 text-[var(--color-yellow)] hover:text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-5 py-3 rounded-xl transition-colors w-full text-center"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Descargar PDF Gratis</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
