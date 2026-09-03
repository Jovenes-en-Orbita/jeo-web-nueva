'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminGetDashboardStats } from '@/lib/api';
import type { AdminDashboardStats } from '@jeo/shared';
import {
  FiFileText,
  FiMail,
  FiUsers,
  FiCompass,
  FiImage,
  FiActivity,
  FiPlus,
  FiSend,
  FiLoader,
  FiArrowRight,
} from 'react-icons/fi';

export default function AdminDashboardPage() {
  const { token, user } = useAdminAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    adminGetDashboardStats(token)
      .then((data) => setStats(data))
      .catch((err) => console.error('Error loading dashboard stats:', err))
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#0d162a] border border-white/10 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold block mb-1">
            Panel de Control Central
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-[var(--font-montserrat)] mb-2">
            ¡Hola, {user?.name || 'Administrador'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Bienvenido a la intranet de Jóvenes en Órbita. Desde aquí puedes redactar y publicar noticias, gestionar el catálogo astronómico, emitir campañas de newsletter y revisar las postulaciones de voluntarios.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#0d162a] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">
                Noticias Publicadas
              </span>
              <span className="text-3xl font-extrabold text-white font-[var(--font-montserrat)]">
                {stats?.totalArticles ?? 0}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[var(--color-yellow)]">
              <FiFileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0d162a] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">
                Suscriptores Newsletter
              </span>
              <span className="text-3xl font-extrabold text-white font-[var(--font-montserrat)]">
                {stats?.totalSubscribers ?? 0}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FiMail className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0d162a] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">
                Postulaciones Pendientes
              </span>
              <span className="text-3xl font-extrabold text-[var(--color-red)] font-[var(--font-montserrat)]">
                {stats?.pendingApplications ?? 0}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[var(--color-red)]">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0d162a] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">
                Constelaciones
              </span>
              <span className="text-3xl font-extrabold text-white font-[var(--font-montserrat)]">
                {stats?.totalConstellations ?? 0}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FiCompass className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-[var(--font-montserrat)]">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/admin/noticias"
            className="bg-[#0d162a] hover:bg-[#111c35] border border-white/10 hover:border-[var(--color-yellow)]/60 p-6 rounded-2xl transition-all duration-200 group block"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-yellow)] mb-4 group-hover:scale-110 transition-transform">
              <FiPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-[var(--color-yellow)] transition-colors mb-1 font-[var(--font-montserrat)]">
              Redactar Noticia
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Crea un artículo con formato editorial en Markdown, autor, tags y fotos.
            </p>
            <span className="text-xs font-semibold text-[var(--color-yellow)] flex items-center gap-1">
              <span>Ir a noticias</span>
              <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/admin/newsletter"
            className="bg-[#0d162a] hover:bg-[#111c35] border border-white/10 hover:border-[var(--color-yellow)]/60 p-6 rounded-2xl transition-all duration-200 group block"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <FiSend className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-[var(--color-yellow)] transition-colors mb-1 font-[var(--font-montserrat)]">
              Campaña de Newsletter
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Redacta el boletín semanal y envíalo masivamente a los suscriptores vía Resend.
            </p>
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
              <span>Ir a newsletter</span>
              <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/admin/postulaciones"
            className="bg-[#0d162a] hover:bg-[#111c35] border border-white/10 hover:border-[var(--color-yellow)]/60 p-6 rounded-2xl transition-all duration-200 group block"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-red)] mb-4 group-hover:scale-110 transition-transform">
              <FiUsers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-[var(--color-yellow)] transition-colors mb-1 font-[var(--font-montserrat)]">
              Bandeja de Voluntarios
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Revisa aspirantes por área (Redacción, Diseño, Tech) y cambia sus estados.
            </p>
            <span className="text-xs font-semibold text-[var(--color-red)] flex items-center gap-1">
              <span>Ver postulaciones</span>
              <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
