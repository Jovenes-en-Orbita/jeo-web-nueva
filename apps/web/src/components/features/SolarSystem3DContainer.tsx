'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const SolarSystem3DScene = dynamic(
  () => import('./SolarSystem3DScene').then((mod) => mod.SolarSystem3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[550px] bg-[#060811] flex flex-col items-center justify-center gap-4 text-white/70 rounded-2xl border border-white/10">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest font-semibold text-white/50">Cargando Sistema Solar 3D...</p>
      </div>
    )
  }
);

export function SolarSystem3DContainer() {
  return <SolarSystem3DScene />;
}
