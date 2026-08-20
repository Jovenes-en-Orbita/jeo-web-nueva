'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Universe3DScene = dynamic(
  () => import('./Universe3DScene').then((mod) => mod.Universe3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-79px)] bg-[#060811] flex flex-col items-center justify-center gap-4 text-white/70">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest font-semibold text-white/50">Cargando Mapa 3D del Universo...</p>
      </div>
    )
  }
);

export function Universe3DContainer() {
  return <Universe3DScene />;
}
