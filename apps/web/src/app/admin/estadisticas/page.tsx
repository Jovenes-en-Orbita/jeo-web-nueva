'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getStats, adminUpdateStat } from '@/lib/api';
import type { StatItem } from '@jeo/shared';
import {
  FiTrendingUp,
  FiEdit2,
  FiCheck,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';

export default function AdminEstadisticasPage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartEdit = (stat: StatItem) => {
    setEditingId(stat.id);
    setEditValue(stat.value);
    setEditLabel(stat.label);
    setSuccessMsg('');
  };

  const handleSave = async (id: string) => {
    if (!token) return;
    setSaving(true);
    try {
      await adminUpdateStat(id, { value: editValue, label: editLabel }, token);
      setEditingId(null);
      setSuccessMsg('¡Estadística actualizada exitosamente!');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar estadística');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
          Edición de Estadísticas de la Portada
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Modifica los 4 valores numéricos y descripciones que aparecen en la franja destacada de la página principal.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl animate-fade-in-up">
          <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stats.map((stat) => {
            const isBeingEdited = editingId === stat.id;

            return (
              <div
                key={stat.id}
                className="bg-[#0d162a] border border-white/10 p-6 rounded-3xl flex flex-col justify-between hover:border-[var(--color-yellow)]/50 transition-colors shadow-xl"
              >
                {isBeingEdited ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Valor destacado (ej. 93 %, 8, 88)
                      </label>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] font-bold text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Descripción
                      </label>
                      <textarea
                        rows={2}
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] resize-none"
                        required
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSave(stat.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[var(--color-red)] hover:bg-red-700 text-white font-bold"
                      >
                        {saving ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiCheck className="w-3.5 h-3.5" />}
                        <span>Guardar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] uppercase font-bold text-slate-500">
                        Indicador #{stat.order}
                      </span>
                      <button
                        onClick={() => handleStartEdit(stat)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[var(--color-yellow)] hover:text-[#060a17] text-slate-300 transition-colors cursor-pointer"
                        title="Editar valor"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-3xl sm:text-4xl font-extrabold text-[var(--color-yellow)] font-[var(--font-montserrat)] mb-2">
                      {stat.value}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {stat.label}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
