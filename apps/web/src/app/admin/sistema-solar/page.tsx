'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getSolarSystem, adminUpdatePlanet, adminUpdateMoon } from '@/lib/api';
import type { Planet, Moon } from '@jeo/shared';
import { FiSun, FiEdit2, FiX, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi';

export default function AdminSistemaSolarPage() {
  const { token } = useAdminAuth();
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [moons, setMoons] = useState<Moon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [selectedMoon, setSelectedMoon] = useState<Moon | null>(null);
  const [desc, setDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getSolarSystem();
      setPlanets(data.planets);
      setMoons(data.moons);
    } catch (err) {
      console.error('Error loading solar system:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEditPlanet = (p: Planet) => {
    setSelectedPlanet(p);
    setSelectedMoon(null);
    setDesc(p.description || '');
    setFeedback('');
  };

  const handleOpenEditMoon = (m: Moon) => {
    setSelectedMoon(m);
    setSelectedPlanet(null);
    setDesc(m.description || '');
    setFeedback('');
  };

  const handleSavePlanet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedPlanet) return;
    setSaving(true);
    try {
      await adminUpdatePlanet(selectedPlanet.id, { description: desc }, token);
      setSelectedPlanet(null);
      await loadData();
    } catch (err: any) {
      setFeedback(err.message || 'Error al actualizar planeta');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMoon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedMoon) return;
    setSaving(true);
    try {
      await adminUpdateMoon(selectedMoon.id, { description: desc }, token);
      setSelectedMoon(null);
      await loadData();
    } catch (err: any) {
      setFeedback(err.message || 'Error al actualizar luna');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
          Gestión del Sistema Solar
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Edita la información astronómica, descripción y orden de los 8 planetas y las 5 lunas principales.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Planets Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-yellow)] mb-4 font-[var(--font-montserrat)]">
              Planetas ({planets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {planets.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#0d162a] border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-[var(--color-yellow)]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Orden #{p.order}
                      </span>
                      <button
                        onClick={() => handleOpenEditPlanet(p)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[var(--color-yellow)] hover:text-[#060a17] text-slate-300 transition-colors"
                        title="Editar descripción"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">{p.name}</h3>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {p.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moons Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-[var(--font-montserrat)]">
              Lunas Principales ({moons.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {moons.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#0d162a] border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-[var(--color-yellow)]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-[var(--color-yellow)]">
                        Luna notable #{m.order}
                      </span>
                      <button
                        onClick={() => handleOpenEditMoon(m)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[var(--color-yellow)] hover:text-[#060a17] text-slate-300 transition-colors"
                        title="Editar descripción"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">{m.name}</h3>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {m.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {(selectedPlanet || selectedMoon) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-white/20 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl animate-fade-in-up">
            <button
              onClick={() => {
                setSelectedPlanet(null);
                setSelectedMoon(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-[var(--font-montserrat)]">
              Editar {selectedPlanet ? selectedPlanet.name : selectedMoon?.name}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Actualiza la descripción astronómica del objeto.
            </p>

            {feedback && (
              <div className="mb-4 text-xs text-red-300 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {feedback}
              </div>
            )}

            <form onSubmit={selectedPlanet ? handleSavePlanet : handleSaveMoon} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Descripción astronómica
                </label>
                <textarea
                  rows={5}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-[#060a17] border border-white/15 p-3.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  required
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanet(null);
                    setSelectedMoon(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
                >
                  {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiCheck className="w-4 h-4" />}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
