'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  adminGetSubscribers,
  adminDeleteSubscriber,
  adminSendNewsletterBroadcast,
} from '@/lib/api';
import {
  FiMail,
  FiSend,
  FiTrash2,
  FiDownload,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiUsers,
} from 'react-icons/fi';

export default function AdminNewsletterPage() {
  const { token } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'subscribers' | 'broadcast'>('subscribers');

  // Subscribers State
  const [subscribers, setSubscribers] = useState<Array<{ id: string; email: string; active: boolean; createdAt: string }>>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Broadcast Form State
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{ success: boolean; msg: string } | null>(null);

  const loadSubscribers = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await adminGetSubscribers(token);
      setSubscribers(data);
    } catch (err) {
      console.error('Error loading subscribers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, [token]);

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!token) return;
    if (!confirm(`¿Eliminar al suscriptor ${email}?`)) return;

    try {
      await adminDeleteSubscriber(id, token);
      await loadSubscribers();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar suscriptor');
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const header = 'ID,Email,Activo,Fecha_Suscripcion\n';
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.active}","${s.createdAt}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jeo_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!subject || !title || !content) {
      setBroadcastResult({ success: false, msg: 'Por favor completa todos los campos del boletín.' });
      return;
    }

    if (!confirm(`¿Estás seguro de enviar esta campaña a los ${subscribers.filter(s => s.active).length} suscriptores activos?`)) {
      return;
    }

    setSending(true);
    setBroadcastResult(null);

    try {
      const res = await adminSendNewsletterBroadcast({ subject, title, content }, token);
      setBroadcastResult({
        success: true,
        msg: `¡Campaña emitida con éxito! Se enviaron ${res.sentCount} correos con ${res.errors} errores.`,
      });
      setSubject('');
      setTitle('');
      setContent('');
    } catch (err: any) {
      setBroadcastResult({
        success: false,
        msg: err.message || 'Error al emitir la campaña de newsletter.',
      });
    } finally {
      setSending(false);
    }
  };

  const filtered = subscribers.filter((s) => {
    if (!search.trim()) return true;
    return s.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
            Gestión de Newsletter & Campañas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra la base de datos de suscriptores y redacta envíos masivos con Resend.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subscribers'
                ? 'bg-[var(--color-yellow)] text-[#060a17] shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FiUsers className="w-4 h-4" />
            <span>Suscriptores ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'broadcast'
                ? 'bg-[var(--color-red)] text-white shadow-lg shadow-red-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FiSend className="w-4 h-4" />
            <span>Redactar Campaña</span>
          </button>
        </div>
      </div>

      {activeTab === 'subscribers' ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por correo..."
                className="w-full bg-[#0d162a] border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-[var(--color-yellow)] transition-colors"
              />
            </div>

            <button
              onClick={handleExportCSV}
              disabled={subscribers.length === 0}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold px-4 py-2.5 rounded-xl text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FiDownload className="w-4 h-4 text-[var(--color-yellow)]" />
              <span>Exportar CSV</span>
            </button>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-[#0d162a] border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-xs">
              No se encontraron suscriptores.
            </div>
          ) : (
            <div className="bg-[#0d162a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Correo Electrónico</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Fecha de Suscripción</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-semibold text-white flex items-center gap-2">
                          <FiMail className="text-slate-500 w-3.5 h-3.5" />
                          <span>{sub.email}</span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              sub.active
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {sub.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">
                          {new Date(sub.createdAt).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-colors"
                            title="Eliminar suscriptor"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Broadcast Composer */
        <div className="bg-[#0d162a] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[var(--color-red)]">
              <FiSend className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-[var(--font-montserrat)]">
                Emisión de Boletín Masivo (Órbita Semanal)
              </h2>
              <p className="text-xs text-slate-400">
                Se enviará este correo a los {subscribers.filter(s => s.active).length} suscriptores activos mediante la API de Resend.
              </p>
            </div>
          </div>

          {broadcastResult && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs animate-fade-in-up ${
                broadcastResult.success
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}
            >
              {broadcastResult.success ? (
                <FiCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              ) : (
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-[var(--color-red)]" />
              )}
              <span>{broadcastResult.msg}</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Asunto del Correo (Subject) *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej. 🚀 Órbita Semanal #42: Nuevos hallazgos en el Polo Sur Lunar"
                disabled={sending}
                className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Título del Boletín (Encabezado) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Novedades del Cosmos y Avances Espaciales"
                disabled={sending}
                className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Cuerpo del Boletín *
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Estimada comunidad de exploradores, esta semana destacamos los siguientes acontecimientos..."
                disabled={sending}
                className="w-full bg-[#060a17] border border-white/15 p-3.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] transition-colors font-mono"
                required
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end">
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50 cursor-pointer"
              >
                {sending ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    <span>Enviando campaña a suscriptores...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>Emitir Boletín a Todos ({subscribers.filter(s => s.active).length})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
