'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  getConstellationsCatalog,
  adminCreateConstellation,
  adminUpdateConstellation,
  adminDeleteConstellation,
} from '@/lib/api';
import type { Constellation } from '@jeo/shared';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiStar,
} from 'react-icons/fi';

export default function AdminConstelacionesPage() {
  const { token } = useAdminAuth();
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [latinName, setLatinName] = useState('');
  const [season, setSeason] = useState('Invierno');
  const [hemisphere, setHemisphere] = useState('Ambos');
  const [brightestStar, setBrightestStar] = useState('');
  const [funFact, setFunFact] = useState('');
  const [starsCount, setStarsCount] = useState<number>(7);
  const [bestMonth, setBestMonth] = useState('Enero');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await getConstellationsCatalog();
      setConstellations(list);
    } catch (err) {
      console.error('Error loading constellations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setLatinName('');
    setSeason('Invierno');
    setHemisphere('Ambos');
    setBrightestStar('');
    setFunFact('');
    setStarsCount(7);
    setBestMonth('Enero');
    setSlug('');
    setDescription('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Constellation) => {
    setIsEditing(true);
    setCurrentId(c.id);
    setName(c.name);
    setLatinName(c.latinName || '');
    setSeason(c.season || 'Invierno');
    setHemisphere(c.hemisphere || 'Ambos');
    setBrightestStar(c.brightestStar || '');
    setFunFact(c.funFact || '');
    setStarsCount(c.starsCount || 7);
    setBestMonth(c.bestMonth || 'Enero');
    setSlug(c.slug);
    setDescription(c.description || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const autoSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!name || !slug) {
      setFormError('Nombre y Slug son requeridos.');
      return;
    }

    setFormLoading(true);
    setFormError('');

    const payload = {
      name,
      latinName,
      season,
      hemisphere,
      brightestStar,
      funFact,
      starsCount: Number(starsCount),
      bestMonth,
      slug,
      description,
    };

    try {
      if (isEditing && currentId) {
        await adminUpdateConstellation(currentId, payload, token);
      } else {
        await adminCreateConstellation(payload, token);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar constelación');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, constName: string) => {
    if (!token) return;
    if (!confirm(`¿Eliminar la constelación "${constName}"?`)) return;

    try {
      await adminDeleteConstellation(id, token);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    }
  };

  const filtered = constellations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.latinName?.toLowerCase().includes(q) ?? false) ||
      (c.brightestStar?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
            Catálogo de Constelaciones
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra las constelaciones, estrellas principales, mitología y datos de visibilidad.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 cursor-pointer flex-shrink-0"
        >
          <FiPlus className="w-4 h-4" />
          <span>Nueva Constelación</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar constelación o estrella..."
          className="w-full bg-[#0d162a] border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-[var(--color-yellow)] transition-colors"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
        </div>
      ) : (
        <div className="bg-[#0d162a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Hemisferio</th>
                  <th className="p-4">Estación</th>
                  <th className="p-4">Estrella Alfa</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block">{c.name}</span>
                      <span className="text-slate-400 text-[11px] italic">{c.latinName}</span>
                    </td>
                    <td className="p-4 text-slate-300">{c.hemisphere || 'Ambos'}</td>
                    <td className="p-4 text-slate-300">{c.season}</td>
                    <td className="p-4 text-[var(--color-yellow)] font-semibold flex items-center gap-1.5 mt-2 sm:mt-0">
                      <FiStar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{c.brightestStar || 'No especificada'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[var(--color-yellow)] hover:text-[#060a17] text-slate-300 transition-colors"
                          title="Editar"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-white/20 rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-[var(--font-montserrat)]">
              {isEditing ? 'Editar Constelación' : 'Registrar Constelación'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Ingresa los datos astronómicos y de observación para el catálogo celeste.
            </p>

            {formError && (
              <div className="mb-4 flex items-center gap-2 text-xs text-[var(--color-red)] bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre Común *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej. Orión"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slug *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="orion"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre en Latín</label>
                  <input
                    type="text"
                    value={latinName}
                    onChange={(e) => setLatinName(e.target.value)}
                    placeholder="Orion (El Cazador)"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hemisferio</label>
                  <select
                    value={hemisphere}
                    onChange={(e) => setHemisphere(e.target.value)}
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  >
                    <option value="Ambos">Ambos</option>
                    <option value="Norte">Norte</option>
                    <option value="Sur">Sur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estación</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  >
                    <option value="Primavera">Primavera</option>
                    <option value="Verano">Verano</option>
                    <option value="Otoño">Otoño</option>
                    <option value="Invierno">Invierno</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estrella Alfa</label>
                  <input
                    type="text"
                    value={brightestStar}
                    onChange={(e) => setBrightestStar(e.target.value)}
                    placeholder="Rigel"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estrellas principales</label>
                  <input
                    type="number"
                    value={starsCount}
                    onChange={(e) => setStarsCount(Number(e.target.value))}
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mejor mes</label>
                  <input
                    type="text"
                    value={bestMonth}
                    onChange={(e) => setBestMonth(e.target.value)}
                    placeholder="Enero"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción astronómica</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Historia mitológica y características observacionales..."
                  className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dato curioso (Fun Fact)</label>
                <input
                  type="text"
                  value={funFact}
                  onChange={(e) => setFunFact(e.target.value)}
                  placeholder="Betelgeuse es tan colosal que si reemplazara al Sol..."
                  className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      <span>{isEditing ? 'Actualizar' : 'Crear Constelación'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
