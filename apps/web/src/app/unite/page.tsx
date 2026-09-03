'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { submitApplication } from '@/lib/api';
import { FiUsers, FiCheckCircle, FiAlertCircle, FiLoader, FiSend, FiX } from 'react-icons/fi';

const AREAS = [
  {
    id: 'redaccion',
    role: 'Redacción & Divulgación',
    area: 'Contenido',
    desc: 'Escribe artículos, notas de actualidad astronómica e historias del cosmos.',
  },
  {
    id: 'diseno',
    role: 'Diseño & Multimedia',
    area: 'Visual',
    desc: 'Crea infografías astronómicas, piezas visuales de redes y edición audiovisual.',
  },
  {
    id: 'tech',
    role: 'Desarrollo & Web',
    area: 'Tech',
    desc: 'Contribuye al desarrollo de nuestra plataforma web y herramientas interactivas.',
  },
];

export default function UnitePage() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleOpenModal = (areaId: string) => {
    setSelectedArea(areaId);
    setStatus('idle');
    setFeedbackMsg('');
  };

  const handleCloseModal = () => {
    setSelectedArea(null);
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !fullName || !email || !message) {
      setStatus('error');
      setFeedbackMsg('Por favor completa todos los campos obligatorios.');
      return;
    }

    setStatus('loading');
    try {
      const res = await submitApplication({
        fullName,
        email,
        area: selectedArea,
        message,
        portfolioUrl: portfolioUrl || undefined,
      });

      setStatus('success');
      setFeedbackMsg(res.message);
      setFullName('');
      setEmail('');
      setMessage('');
      setPortfolioUrl('');
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(err.message || 'Error al enviar la postulación. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060a17] text-white">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="wrap max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="Convocatoria Abierta"
            title="Unite al Equipo de Jóvenes en Órbita"
            theme="dark"
            description="¿Te apasiona el espacio, la ciencia, el diseño visual o la programación? Sumate como voluntario o colaborador a nuestra misión de divulgación."
          />

          {/* Cards of Areas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {AREAS.map((item) => (
              <div
                key={item.id}
                className="bg-[#0d162a] border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:border-[var(--color-yellow)]/60 transition-all duration-300 hover:-translate-y-1 shadow-2xl"
              >
                <div>
                  <span className="text-[11px] font-bold text-[var(--color-red)] uppercase tracking-wider block mb-2 font-[var(--font-montserrat)]">
                    {item.area}
                  </span>
                  <h3 className="font-[var(--font-montserrat)] font-bold text-xl text-white mb-3">
                    {item.role}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-[var(--font-poppins)]">
                    {item.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenModal(item.id)}
                  className="mt-8 bg-[var(--color-navy)] hover:bg-[var(--color-navy-2)] border border-[var(--color-yellow)]/30 text-[var(--color-yellow)] hover:text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-5 py-3 rounded-xl transition-colors w-full text-center cursor-pointer"
                >
                  Postularme a {item.area} →
                </button>
              </div>
            ))}
          </div>

          {/* Application Modal */}
          {selectedArea && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0b1120] border border-white/20 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold">
                    Formulario de Postulación
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1 font-[var(--font-montserrat)]">
                  Sumate a {AREAS.find((a) => a.id === selectedArea)?.role}
                </h2>
                <p className="text-xs text-slate-400 mb-6">
                  Completa tus datos y nos pondremos en contacto contigo a la brevedad.
                </p>

                {status === 'success' ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl animate-fade-in-up">
                    <div className="flex items-center gap-3 text-emerald-400 font-bold mb-2">
                      <FiCheckCircle className="w-6 h-6" />
                      <span>¡Postulación Enviada con Éxito!</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed mb-4">
                      {feedbackMsg}
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-[var(--color-yellow)] text-[#060a17] font-bold text-xs uppercase rounded-xl"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-[var(--font-poppins)]">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Sofía Rossi"
                        disabled={status === 'loading'}
                        className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sofia@ejemplo.com"
                        disabled={status === 'loading'}
                        className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Área de interés
                      </label>
                      <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        disabled={status === 'loading'}
                        className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] transition-colors cursor-pointer"
                      >
                        {AREAS.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.role} ({a.area})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        ¿Por qué te gustaría colaborar en JEO? *
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="Cuéntanos un poco sobre ti, tu experiencia o tus ganas de aprender..."
                        disabled={status === 'loading'}
                        className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] transition-colors resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Enlace a Portfolio, GitHub o LinkedIn (Opcional)
                      </label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/tu-perfil"
                        disabled={status === 'loading'}
                        className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] transition-colors"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-[var(--color-red)] bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{feedbackMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50 cursor-pointer mt-4"
                    >
                      {status === 'loading' ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          <span>Enviando postulación...</span>
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4" />
                          <span>Enviar Postulación</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
