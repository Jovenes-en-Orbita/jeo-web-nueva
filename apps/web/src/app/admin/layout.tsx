'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { Logo } from '@/components/ui/Logo';
import {
  FiGrid,
  FiFileText,
  FiCompass,
  FiSun,
  FiImage,
  FiMail,
  FiUsers,
  FiTrendingUp,
  FiLogOut,
  FiExternalLink,
  FiShield,
  FiLoader,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: FiGrid },
  { label: 'Noticias', href: '/admin/noticias', icon: FiFileText },
  { label: 'Constelaciones', href: '/admin/constelaciones', icon: FiCompass },
  { label: 'Sistema Solar', href: '/admin/sistema-solar', icon: FiSun },
  { label: 'Galería', href: '/admin/galeria', icon: FiImage },
  { label: 'Newsletter', href: '/admin/newsletter', icon: FiMail },
  { label: 'Postulaciones', href: '/admin/postulaciones', icon: FiUsers },
  { label: 'Estadísticas', href: '/admin/estadisticas', icon: FiTrendingUp },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAdminAuth();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030611] flex flex-col items-center justify-center text-white">
        <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Verificando sesión segura...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#060a17] text-white flex flex-col md:flex-row font-[var(--font-poppins)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#090e1c] border-r border-white/10 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size={36} showText={false} />
              <div>
                <span className="font-[var(--font-montserrat)] font-bold text-sm text-white tracking-wider block">
                  INTRANET JEO
                </span>
                <span className="text-[10px] text-[var(--color-yellow)] uppercase tracking-widest font-semibold">
                  Control Panel
                </span>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--color-yellow)] text-[#060a17] shadow-lg shadow-amber-500/20 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#060a17]' : 'text-[var(--color-yellow)]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 block truncate flex items-center gap-1">
                <FiShield className="text-[var(--color-yellow)] w-3 h-3" />
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-[11px] text-slate-300 font-semibold transition-colors"
            >
              <FiExternalLink className="w-3.5 h-3.5 text-[var(--color-yellow)]" />
              <span>Ver Web Pública</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer border border-red-500/20"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 bg-[#080d1a] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Intranet</span>
            <span>/</span>
            <span className="text-[var(--color-yellow)] font-semibold uppercase">
              {NAV_ITEMS.find((n) => n.href === pathname)?.label || 'Panel'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>API Conectada</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
