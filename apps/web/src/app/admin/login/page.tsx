'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { FiLock, FiMail, FiLoader, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030611] text-white flex flex-col justify-between relative overflow-hidden font-[var(--font-poppins)]">
      {/* Background ambient cosmic glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--color-navy)]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[var(--color-red)]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[var(--color-yellow)] transition-colors">
          <FiArrowLeft className="w-4 h-4" />
          <span>Volver al portal público</span>
        </Link>
        <div className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold">
          Intranet JEO
        </div>
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="bg-[#0b1120] border border-white/15 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl animate-fade-in-up">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <Logo size={56} showText={false} />
            </div>
            <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)] uppercase tracking-wider">
              Acceso a la Intranet
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Panel de Administración y Control Editorial de JEO
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-2.5 text-xs text-red-300 bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl animate-fade-in-up">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 text-[var(--color-red)]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jovenesenorbita.com"
                  disabled={isSubmitting}
                  className="w-full bg-[#060a17] border border-white/15 pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-[var(--color-yellow)] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full bg-[#060a17] border border-white/15 pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-[var(--color-yellow)] transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Ingresar al Panel →</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-slate-500">
              Credenciales por defecto en base de datos: <br />
              <code className="text-slate-300 bg-white/5 px-2 py-0.5 rounded">admin@jovenesenorbita.com</code> / <code className="text-slate-300 bg-white/5 px-2 py-0.5 rounded">admin1234</code>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-600 z-10">
        © {new Date().getFullYear()} Jóvenes en Órbita (JEO) — Plataforma Segura
      </footer>
    </div>
  );
}
