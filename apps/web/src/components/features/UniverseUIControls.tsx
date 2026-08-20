'use client';

import React from 'react';
import { SpaceObject, UNIVERSE_OBJECTS } from '@/lib/universeData';
import { FiGlobe, FiSun, FiRotateCw, FiMaximize, FiMinimize, FiEye, FiZap } from 'react-icons/fi';

interface UniverseUIControlsProps {
  currentCategory: 'all' | 'galaxy' | 'solar';
  onCategoryChange: (category: 'all' | 'galaxy' | 'solar') => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onResetCamera: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSelectObject: (obj: SpaceObject) => void;
}

export function UniverseUIControls({
  currentCategory,
  onCategoryChange,
  speed,
  onSpeedChange,
  onResetCamera,
  isFullscreen,
  onToggleFullscreen,
  onSelectObject
}: UniverseUIControlsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Left Group: Category Selector */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl pointer-events-auto">
        <button
          onClick={() => onCategoryChange('all')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            currentCategory === 'all'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <FiGlobe className="w-3.5 h-3.5" /> Todo el Cosmos
        </button>
        <button
          onClick={() => onCategoryChange('galaxy')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            currentCategory === 'galaxy'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <FiEye className="w-3.5 h-3.5" /> Estructuras Profundas
        </button>
        <button
          onClick={() => onCategoryChange('solar')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            currentCategory === 'solar'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <FiSun className="w-3.5 h-3.5" /> Sistema Solar
        </button>
      </div>

      {/* Right Group: Simulation Controls & Quick Jump */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Quick Jump Selector */}
        <select
          onChange={(e) => {
            const obj = UNIVERSE_OBJECTS.find((o) => o.id === e.target.value);
            if (obj) onSelectObject(obj);
          }}
          defaultValue=""
          className="px-3 py-2 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-xs text-white shadow-xl outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="" disabled>
            🔍 Saltar a objeto...
          </option>
          <optgroup label="Estructuras Profundas">
            {UNIVERSE_OBJECTS.filter((o) => o.viewCategory === 'galaxy').map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Sistema Solar">
            {UNIVERSE_OBJECTS.filter((o) => o.viewCategory === 'solar').map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </optgroup>
        </select>

        {/* Speed button toggle */}
        <button
          onClick={() => onSpeedChange(speed === 1 ? 3 : speed === 3 ? 0 : 1)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 shadow-xl transition-colors"
          title="Velocidad de órbitas"
        >
          <FiZap className="w-3.5 h-3.5 text-amber-400" />
          <span>{speed === 0 ? 'Pausado' : `${speed}x`}</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          className="p-2.5 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 shadow-xl transition-colors"
          title="Restablecer cámara"
        >
          <FiRotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="p-2.5 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 shadow-xl transition-colors"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? <FiMinimize className="w-3.5 h-3.5" /> : <FiMaximize className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
