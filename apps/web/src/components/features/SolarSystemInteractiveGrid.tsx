'use client';

import React, { useState } from 'react';
import type { Planet, Moon } from '@jeo/shared';
import { UNIVERSE_OBJECTS, SpaceObject } from '@/lib/universeData';
import { UniverseDrawer } from './UniverseDrawer';
import { FiEye, FiInfo } from 'react-icons/fi';

interface SolarSystemInteractiveGridProps {
  planets: Planet[];
  moons: Moon[];
}

const PLANET_COLORS: Record<string, string> = {
  mercurio: '#94a3b8',
  venus: '#fb923c',
  tierra: '#38bdf8',
  marte: '#ef4444',
  jupiter: '#eab308',
  saturno: '#fde047',
  urano: '#2dd4bf',
  neptuno: '#2563eb',
};

export function SolarSystemInteractiveGrid({ planets, moons }: SolarSystemInteractiveGridProps) {
  const [selectedObject, setSelectedObject] = useState<SpaceObject | null>(null);

  const handleSelectPlanet = (planet: Planet) => {
    const matched = UNIVERSE_OBJECTS.find((o) => o.id === planet.slug);
    if (matched) {
      setSelectedObject(matched);
    } else {
      setSelectedObject({
        id: planet.slug,
        name: planet.name,
        subtitle: `Planeta ${planet.order} del Sistema Solar`,
        category: 'Planeta',
        type: 'planet',
        description: planet.description || 'Planeta del sistema solar.',
        details: [
          { label: 'Orden', value: `${planet.order}° desde el Sol` },
        ],
        color: PLANET_COLORS[planet.slug] || '#facc15',
        position: [planet.order * 30, 0, 0],
        size: 10,
        viewCategory: 'solar',
        tag: 'Planeta',
      });
    }
  };

  const handleSelectMoon = (moon: Moon) => {
    const matched = UNIVERSE_OBJECTS.find((o) => o.id === moon.slug);
    if (matched) {
      setSelectedObject(matched);
    } else {
      setSelectedObject({
        id: moon.slug,
        name: moon.name,
        subtitle: 'Satélite natural notable',
        category: 'Cuerpo Menor',
        type: 'planet',
        description: moon.description || 'Luna notable del sistema solar.',
        details: [
          { label: 'Tipo', value: 'Satélite natural' },
        ],
        color: '#cbd5e1',
        position: [50, 0, 0],
        size: 5,
        viewCategory: 'solar',
        tag: 'Luna',
      });
    }
  };

  return (
    <div>
      {/* Planets Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        {planets.map((planet) => {
          const color = PLANET_COLORS[planet.slug] || '#facc15';
          return (
            <button
              key={planet.id}
              onClick={() => handleSelectPlanet(planet)}
              className="text-center group p-3 rounded-2xl bg-[#090d1a]/50 hover:bg-[#090d1a] border border-white/5 hover:border-[var(--color-yellow)]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-between"
              title={`Ver ficha de ${planet.name}`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg relative"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${color}, #0f172a)`,
                  border: `2px solid ${color}40`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full absolute top-2.5 left-3 bg-white/60 blur-[0.5px]"
                />
              </div>

              <span className="block mt-2.5 text-xs font-bold text-slate-300 group-hover:text-[var(--color-yellow)] transition-colors font-[var(--font-montserrat)]">
                {planet.name}
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors flex items-center gap-1 mt-0.5">
                <FiInfo className="w-2.5 h-2.5" /> Ficha
              </span>
            </button>
          );
        })}
      </div>

      {/* Moons Strip */}
      <div className="mt-8">
        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3.5 flex items-center gap-2">
          <span>Las 5 lunas más grandes del Sistema Solar</span>
          <span className="text-[10px] lowercase text-[var(--color-yellow)] font-normal">(haz clic para explorar)</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {moons.map((moon) => (
            <button
              key={moon.id}
              onClick={() => handleSelectMoon(moon)}
              className="p-3.5 bg-[#090d1a]/60 hover:bg-[#090d1a] border border-white/10 hover:border-[var(--color-yellow)]/60 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-slate-600 border border-white/20 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white group-hover:text-[var(--color-yellow)] transition-colors block truncate">
                  {moon.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {moon.description || 'Luna notable'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <UniverseDrawer
        selectedObject={selectedObject}
        onClose={() => setSelectedObject(null)}
        onFocus={() => {}}
      />
    </div>
  );
}
