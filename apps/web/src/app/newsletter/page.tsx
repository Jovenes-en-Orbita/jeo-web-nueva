'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { subscribeNewsletter } from '@/lib/api';
import { FiMail, FiCheckCircle, FiAlertCircle, FiLoader, FiSend } from 'react-icons/fi';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedbackMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setStatus('loading');
    setFeedbackMsg('');

    try {
      const response = await subscribeNewsletter({ email });
      setStatus('success');
      setFeedbackMsg(response.message || '¡Te has suscrito con éxito a Órbita Semanal!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(err.message || 'Ocurrió un error al procesar tu suscripción. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060a17] text-white">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="wrap max-w-4xl mx-auto px-4">
          <SectionHeader
            eyebrow="Multimedia & Difusión"
            title="Boletín Espacial: Órbita Semanal"
            theme="dark"
            description="Recibe cada sábado en tu correo un resumen con los principales descubrimientos astronómicos, imágenes en alta resolución y eventos celestes."
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Subscription Card */}
            <div className="md:col-span-7 bg-[#0d162a] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-yellow)]/10 border border-[var(--color-yellow)]/20 flex items-center justify-center text-[var(--color-yellow)] mb-6">
                <FiMail className="w-6 h-6" />
              </div>

              <h3 className="font-[var(--font-montserrat)] font-bold text-2xl text-white uppercase mb-3">
                Suscríbete Gratis
              </h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed font-[var(--font-poppins)]">
                Divulgación espacial independiente, rigurosa y sin tecnicismos aburridos. Sin spam, puedes cancelar en cualquier momento con un solo clic.
              </p>

              {status === 'success' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl animate-fade-in-up">
                  <div className="flex items-center gap-3 text-emerald-400 font-bold mb-2">
                    <FiCheckCircle className="w-6 h-6" />
                    <span>¡Suscripción Confirmada!</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {feedbackMsg}
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-xs font-semibold text-[var(--color-yellow)] underline hover:text-white"
                  >
                    Suscribir otro correo
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Tu Correo Electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      disabled={status === 'loading'}
                      className="w-full bg-[#060a17] border border-white/15 px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--color-yellow)] transition-colors"
                      required
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-xs text-[var(--color-red)] bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                      <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{feedbackMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-sm uppercase px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        <span>Suscribirme a Órbita Semanal</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Benefits Sidebar */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-[#0d162a] border border-white/10 p-6 rounded-3xl">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-yellow)] mb-4 font-[var(--font-montserrat)]">
                  ¿Qué incluye cada entrega?
                </h4>
                <ul className="space-y-3.5 text-xs text-slate-300 font-[var(--font-poppins)]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[var(--color-yellow)]">✦</span>
                    <span><strong>Lanzamientos y misiones:</strong> Lo más relevante de Artemis, SpaceX, James Webb y agencias internacionales.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[var(--color-yellow)]">✦</span>
                    <span><strong>Sector Espacial Argentino:</strong> Avances de CONAE, satélites de INVAP y desarrollo de lanzadores.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[var(--color-yellow)]">✦</span>
                    <span><strong>Calendario astronómico:</strong> Eclipses, lluvias de meteoros y conjunciones planetarias del mes.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[var(--color-yellow)]">✦</span>
                    <span><strong>Astrofotografía destacada:</strong> La imagen de la semana con ficha técnica y coordenadas.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
