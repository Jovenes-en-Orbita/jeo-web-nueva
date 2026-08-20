'use client';

import React from 'react';
import { SpaceObject } from '@/lib/universeData';
import { FiX, FiCompass, FiInfo, FiExternalLink, FiMaximize2 } from 'react-icons/fi';

interface UniverseDrawerProps {
  selectedObject: SpaceObject | null;
  onClose: () => void;
  onFocus: (obj: SpaceObject) => void;
}

export function UniverseDrawer({ selectedObject, onClose, onFocus }: UniverseDrawerProps) {
  if (!selectedObject) return null;

  return (
    <aside
      className="fixed right-6 top-24 bottom-6 w-[380px] max-w-[calc(100vw-3rem)] z-40 bg-[#0d1117]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden text-white animate-in slide-in-from-right duration-300"
      aria-label="Detalles astronómicos"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: selectedObject.color, color: selectedObject.color }}
            />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-white/60">
              {selectedObject.category} • {selectedObject.tag}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{selectedObject.name}</h2>
          <p className="text-xs text-white/70 mt-0.5">{selectedObject.subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Cerrar panel"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 custom-scrollbar">
        {/* Description */}
        <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-xs leading-relaxed text-white/90">
          <p>{selectedObject.description}</p>
        </div>

        {/* Fact Sheet */}
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-white/50 mb-3 flex items-center gap-1.5">
            <FiInfo className="w-3.5 h-3.5" /> Ficha Técnica
          </h3>
          <div className="space-y-2">
            {selectedObject.details.map((fact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs hover:bg-white/[0.06] transition-colors"
              >
                <span className="text-white/60">{fact.label}</span>
                <span className="font-medium text-white text-right ml-2">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-white/10 flex items-center gap-2">
        <button
          onClick={() => onFocus(selectedObject)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <FiCompass className="w-4 h-4" /> Centrar Cámara
        </button>
      </div>
    </aside>
  );
}
