'use client';

import React, { useState, useMemo } from 'react';
import { CONSTELLATIONS_DATA, ConstellationData } from '@/lib/constellationsData';
import { FiX, FiInfo, FiStar, FiEye, FiGlobe } from 'react-icons/fi';

export function SkyMap2D() {
  const [selectedConstellation, setSelectedConstellation] = useState<ConstellationData | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filterHemisphere, setFilterHemisphere] = useState<'Todos' | 'Norte' | 'Sur'>('Todos');

  // Generate deterministic random background stars for realistic night sky feel
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 140 }, (_, i) => ({
      id: i,
      x: (i * 37) % 100,
      y: (i * 53) % 100,
      size: (i % 3) + 1,
      opacity: 0.2 + ((i % 5) * 0.15),
    }));
  }, []);

  const filteredConstellations = CONSTELLATIONS_DATA.filter((c) => {
    if (filterHemisphere === 'Todos') return true;
    return c.hemisphere === filterHemisphere || c.hemisphere === 'Ambos';
  });

  return (
    <div className="relative w-full h-[460px] bg-[#04060f] rounded-2xl border border-white/10 overflow-hidden shadow-2xl group select-none">
      {/* Sky Canvas Container */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d1633] via-[#060a17] to-[#020308]">
        {/* Background Random Stars */}
        {backgroundStars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white transition-opacity duration-1000"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
            }}
          />
        ))}

        {/* SVG Overlay for Constellation Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {filteredConstellations.map((constellation) => {
            const isSelected = selectedConstellation?.id === constellation.id;
            const isHovered = hoveredId === constellation.id;

            return (
              <g key={constellation.id}>
                {constellation.lines.map(([fromIdx, toIdx], lineIdx) => {
                  const fromStar = constellation.stars[fromIdx];
                  const toStar = constellation.stars[toIdx];
                  if (!fromStar || !toStar) return null;

                  return (
                    <line
                      key={lineIdx}
                      x1={`${fromStar.x}%`}
                      y1={`${fromStar.y}%`}
                      x2={`${toStar.x}%`}
                      y2={`${toStar.y}%`}
                      stroke={isSelected ? constellation.color : isHovered ? '#ffffff' : 'rgba(255,255,255,0.25)'}
                      strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                      strokeDasharray={isSelected ? 'none' : '4 2'}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Interactive Constellation Nodes & Stars */}
        {filteredConstellations.map((constellation) => {
          const isSelected = selectedConstellation?.id === constellation.id;
          const isHovered = hoveredId === constellation.id;

          return (
            <div key={constellation.id}>
              {/* Star Nodes */}
              {constellation.stars.map((star, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedConstellation(constellation)}
                  onMouseEnter={() => setHoveredId(constellation.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer focus:outline-none transition-all duration-300 group/star"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${(star.size || 4) * (isHovered || isSelected ? 2.2 : 1.5)}px`,
                    height: `${(star.size || 4) * (isHovered || isSelected ? 2.2 : 1.5)}px`,
                    backgroundColor: isSelected ? constellation.color : isHovered ? '#ffffff' : '#f8fafc',
                    boxShadow: isHovered || isSelected ? `0 0 12px ${constellation.color}` : '0 0 4px rgba(255,255,255,0.5)',
                  }}
                />
              ))}

              {/* Constellation Name Tag Label */}
              <button
                onClick={() => setSelectedConstellation(constellation)}
                onMouseEnter={() => setHoveredId(constellation.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg shadow-amber-400/30'
                    : isHovered
                    ? 'bg-white text-slate-900 scale-105 shadow-md'
                    : 'bg-black/40 backdrop-blur-sm text-white/70 border border-white/10 hover:text-white'
                }`}
                style={{
                  left: `${constellation.center.x}%`,
                  top: `${constellation.center.y}%`,
                }}
              >
                {constellation.name}
              </button>
            </div>
          );
        })}
      </div>

      {/* Top Header & Filter Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0d1117]/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 text-xs font-semibold text-white pointer-events-auto">
          <FiStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Mapa Estelar Interactivo 2D</span>
        </div>

        {/* Hemisphere Filters */}
        <div className="flex items-center gap-1.5 bg-[#0d1117]/80 backdrop-blur-md p-1 rounded-2xl border border-white/10 pointer-events-auto text-xs">
          {(['Todos', 'Norte', 'Sur'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setFilterHemisphere(h)}
              className={`px-3 py-1 rounded-xl transition-colors ${
                filterHemisphere === h
                  ? 'bg-violet-600 text-white font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none text-[11px] text-white/50 bg-[#0d1117]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>Haz clic en cualquier estrella o nombre para explorar la constelación.</span>
      </div>

      {/* Modal Popup with Constellation Details */}
      {selectedConstellation && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0d1117] border border-white/15 rounded-2xl p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider mb-1"
                  style={{ backgroundColor: `${selectedConstellation.color}30`, color: selectedConstellation.color }}
                >
                  {selectedConstellation.season} • Hemisferio {selectedConstellation.hemisphere}
                </span>
                <h3 className="text-2xl font-bold">{selectedConstellation.name}</h3>
                <p className="text-xs text-white/60 italic">{selectedConstellation.latinName}</p>
              </div>
              <button
                onClick={() => setSelectedConstellation(null)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 text-xs text-white/90">
              <p className="leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                {selectedConstellation.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-white/60 flex items-center gap-1.5">
                    <FiEye className="w-3.5 h-3.5 text-amber-400" /> Estrella más brillante:
                  </span>
                  <span className="font-semibold text-white">{selectedConstellation.brightestStar}</span>
                </div>

                <div className="p-3 rounded-lg bg-violet-950/40 border border-violet-500/20 text-violet-200">
                  <span className="font-bold block mb-1 text-violet-300">💡 Dato Curioso:</span>
                  <p className="leading-relaxed">{selectedConstellation.funFact}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedConstellation(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
