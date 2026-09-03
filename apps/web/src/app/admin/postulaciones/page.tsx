'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  adminGetApplications,
  adminUpdateApplicationStatus,
  adminDeleteApplication,
} from '@/lib/api';
import {
  FiUsers,
  FiSearch,
  FiX,
  FiMail,
  FiExternalLink,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiLoader,
  FiFilter,
} from 'react-icons/fi';

interface ApplicationItem {
  id: string;
  fullName: string;
  email: string;
  area: string;
  message: string;
  portfolioUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export default function AdminPostulacionesPage() {
  const { token } = useAdminAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal State
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadApplications = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await adminGetApplications(token);
      setApplications(data);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [token]);

  const handleUpdateStatus = async (id: string, newStatus: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED') => {
    if (!token) return;
    setUpdatingStatus(true);
    try {
      await adminUpdateApplicationStatus(id, newStatus, token);
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      await loadApplications();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar estado');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`¿Eliminar la postulación de ${name}?`)) return;

    try {
      await adminDeleteApplication(id, token);
      setSelectedApp(null);
      await loadApplications();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar postulación');
    }
  };

  const filtered = applications.filter((app) => {
    let matchArea = true;
    if (selectedArea !== 'Todas') {
      matchArea = app.area.toLowerCase() === selectedArea.toLowerCase();
    }

    let matchStatus = true;
    if (selectedStatus !== 'Todas') {
      matchStatus = app.status === selectedStatus;
    }

    let matchSearch = true;
    if (search.trim()) {
      const q = search.toLowerCase();
      matchSearch =
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.message.toLowerCase().includes(q);
    }

    return matchArea && matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">Aceptado</span>;
      case 'REVIEWED':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">Revisado</span>;
      case 'REJECTED':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">Rechazado</span>;
      default:
        return <span className="bg-amber-500/10 text-[var(--color-yellow)] border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">Pendiente</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
            Bandeja de Postulaciones (Voluntariado)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revisa las solicitudes de postulantes para Redacción, Diseño y Desarrollo.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl text-xs text-slate-300">
          <FiClock className="text-[var(--color-yellow)] w-4 h-4" />
          <span>{applications.filter((a) => a.status === 'PENDING').length} pendientes de revisión</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d162a] p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o texto..."
            className="w-full bg-[#060a17] border border-white/10 pl-10 pr-4 py-2 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-[var(--color-yellow)] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Area filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold mr-1">Área:</span>
            {['Todas', 'redaccion', 'diseno', 'tech'].map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-all ${
                  selectedArea === area
                    ? 'bg-[var(--color-yellow)] text-[#060a17]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {area === 'redaccion' ? 'Redacción' : area === 'diseno' ? 'Diseño' : area === 'tech' ? 'Tech' : 'Todas'}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold mr-1">Estado:</span>
            {['Todas', 'PENDING', 'REVIEWED', 'ACCEPTED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedStatus === st
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {st === 'PENDING' ? 'Pendientes' : st === 'REVIEWED' ? 'Revisados' : st === 'ACCEPTED' ? 'Aceptados' : 'Todos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0d162a] border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No se encontraron postulaciones con los filtros seleccionados.
        </div>
      ) : (
        <div className="bg-[#0d162a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Postulante</th>
                  <th className="p-4">Área</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <span className="font-bold text-white block">{app.fullName}</span>
                      <span className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <FiMail className="w-3 h-3" />
                        {app.email}
                      </span>
                    </td>
                    <td className="p-4 uppercase font-bold text-[11px] text-[var(--color-yellow)]">
                      {app.area}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(app.createdAt).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">{getStatusBadge(app.status)}</td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-semibold text-[var(--color-yellow)] hover:underline">
                        Ver ficha →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applicant Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-white/20 rounded-3xl max-w-xl w-full p-6 md:p-8 relative shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold">
                Detalle del Aspirante
              </span>
              {getStatusBadge(selectedApp.status)}
            </div>

            <h2 className="text-2xl font-bold text-white mb-1 font-[var(--font-montserrat)]">
              {selectedApp.fullName}
            </h2>
            <p className="text-xs text-slate-400 mb-6 flex items-center gap-2">
              <FiMail className="w-3.5 h-3.5 text-[var(--color-yellow)]" />
              <a href={`mailto:${selectedApp.email}`} className="hover:underline text-slate-200 font-semibold">
                {selectedApp.email}
              </a>
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Área de interés:</span>
                <span className="font-bold text-[var(--color-yellow)] uppercase">{selectedApp.area}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Fecha de postulación:</span>
                <span className="font-semibold text-white">
                  {new Date(selectedApp.createdAt).toLocaleString('es-AR')}
                </span>
              </div>
              {selectedApp.portfolioUrl && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Enlace Portfolio / LinkedIn:</span>
                  <a
                    href={selectedApp.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-yellow)] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Abrir enlace</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Carta de Motivación / Mensaje
            </h3>
            <div className="bg-[#060a17] border border-white/15 p-4 rounded-xl text-xs text-slate-200 leading-relaxed whitespace-pre-wrap mb-6">
              {selectedApp.message}
            </div>

            {/* Status actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Actualizar estado de la solicitud:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus(selectedApp.id, 'REVIEWED')}
                  className="py-2.5 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 transition-colors"
                >
                  Marcar Revisado
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus(selectedApp.id, 'ACCEPTED')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors"
                >
                  Aceptar Candidato
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}
                  className="py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 transition-colors"
                >
                  Rechazar
                </button>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button
                  onClick={() => handleDelete(selectedApp.id, selectedApp.fullName)}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  <span>Eliminar registro</span>
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
