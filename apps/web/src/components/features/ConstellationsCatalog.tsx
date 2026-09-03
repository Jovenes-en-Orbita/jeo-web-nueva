'use client';

import React, { useState, useMemo } from 'react';
import type { Constellation } from '@jeo/shared';
import { SkyMap2D } from './SkyMap2D';
import { Tag } from '@/components/ui/Tag';
import { FiSearch, FiStar, FiCompass, FiCalendar, FiX, FiDownload, FiExternalLink } from 'react-icons/fi';

interface ConstellationsCatalogProps {
  constellations: Constellation[];
}

export function ConstellationsCatalog({ constellations }: ConstellationsCatalogProps) {
  const [selectedHemisphere, setSelectedHemisphere] = useState('Todos');
  const [selectedSeason, setSelectedSeason] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null);

  const filtered = useMemo(() => {
    return constellations.filter((c) => {
      let matchesHemi = true;
      if (selectedHemisphere !== 'Todos') {
        matchesHemi = c.hemisphere === selectedHemisphere || c.hemisphere === 'Ambos';
      }

      let matchesSeason = true;
      if (selectedSeason !== 'Todas') {
        matchesSeason = c.season === selectedSeason;
      }

      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          c.name.toLowerCase().includes(q) ||
          (c.latinName?.toLowerCase().includes(q) ?? false) ||
          (c.brightestStar?.toLowerCase().includes(q) ?? false);
      }

      return matchesHemi && matchesSeason && matchesSearch;
    });
  }, [constellations, selectedHemisphere, selectedSeason, searchQuery]);

  return (
    <div className="wrap max-w-6xl mx-auto px-4 py-8">
      {/* 2D Interactive Sky Map Section */}
      <div className="mb-12 bg-[#0d162a] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <SkyMap2D />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold">
              Observación Celeste
            </span>
            <h2 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
              Mapa del Cielo Interactivo
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-[var(--font-poppins)]">
              Interactúa con las principales constelaciones directamente sobre la bóveda celeste. Pasa el cursor para iluminar las figuras mitológicas y haz clic para ver sus datos astronómicos.
            </p>

            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Recursos para astrónomos aficionados:
              </p>
              <div className="flex flex-col gap-2 text-xs">
                <a
                  href="/downloads/guia-astrofotografia.pdf"
                  download
                  className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FiDownload className="text-[var(--color-yellow)]" />
                    <span>Guía de Astrofotografía Urbana (PDF)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Descargar ↓</span>
                </a>
                <a
                  href="https://stellarium.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FiExternalLink className="text-[var(--color-yellow)]" />
                    <span>Stellarium Planetario Web / Desktop</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Abrir ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Filters Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d162a] p-4 rounded-2xl border border-white/10">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, latín o estrella..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060a17] border border-white/10 pl-10 pr-4 py-2 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--color-yellow)] transition-colors"
            />
          </div>

          {/* Hemisphere Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs text-slate-400 font-semibold uppercase mr-1 flex items-center gap-1">
              <FiCompass /> Hemisferio:
            </span>
            {['Todos', 'Norte', 'Sur', 'Ambos'].map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHemisphere(h)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedHemisphere === h
                    ? 'bg-[var(--color-yellow)] text-[#060a17]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Constellations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((constellation) => (
          <div
            key={constellation.id}
            onClick={() => setSelectedConstellation(constellation)}
            className="bg-[#0d162a] border border-white/10 hover:border-[var(--color-yellow)]/60 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Tag variant="dark">{constellation.hemisphere || 'Ambos'}</Tag>
                {constellation.season && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {constellation.season}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--color-yellow)] transition-colors font-[var(--font-montserrat)]">
                {constellation.name}
              </h3>
              <p className="text-xs text-slate-400 italic mb-3">
                {constellation.latinName || constellation.name}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {constellation.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px]">
              {constellation.brightestStar && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1">
                    <FiStar className="text-[var(--color-yellow)]" /> Estrella alfa:
                  </span>
                  <span className="font-semibold">{constellation.brightestStar}</span>
                </div>
              )}
              {constellation.funFact && (
                <span className="text-[10px] text-[var(--color-yellow)] font-semibold block group-hover:underline">
                  Ver ficha astronómica completa →
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal / Drawer */}
      {selectedConstellation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-white/20 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedConstellation(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold">
                Constelación Oficial
              </span>
              <Tag variant="dark">{selectedConstellation.hemisphere || 'Ambos'}</Tag>
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-1 font-[var(--font-montserrat)]">
              {selectedConstellation.name}
            </h2>
            <p className="text-sm text-slate-400 italic mb-6">
              {selectedConstellation.latinName || selectedConstellation.name}
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-2 text-xs">
              {selectedConstellation.brightestStar && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Estrella más brillante:</span>
                  <span className="font-bold text-white">{selectedConstellation.brightestStar}</span>
                </div>
              )}
              {selectedConstellation.season && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Mejor estación:</span>
                  <span className="font-semibold text-white">{selectedConstellation.season}</span>
                </div>
              )}
              {selectedConstellation.bestMonth && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Mes de mejor visibilidad:</span>
                  <span className="font-semibold text-white">{selectedConstellation.bestMonth}</span>
                </div>
              )}
              {selectedConstellation.starsCount && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Estrellas principales:</span>
                  <span className="font-semibold text-white">{selectedConstellation.starsCount}</span>
                </div>
              )}
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
              Descripción Astronómica
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-[var(--font-poppins)]">
              {selectedConstellation.description}
            </p>

            {selectedConstellation.funFact && (
              <div className="bg-[#0d162a] border-l-4 border-[var(--color-yellow)] p-4 rounded-r-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-yellow)] mb-1">
                  ¿Sabías que...?
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  {selectedConstellation.funFact}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
