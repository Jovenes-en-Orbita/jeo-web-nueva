'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getNews, adminCreateNews, adminUpdateNews, adminDeleteNews } from '@/lib/api';
import type { NewsArticle } from '@jeo/shared';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiEye,
} from 'react-icons/fi';

export default function AdminNoticiasPage() {
  const { token } = useAdminAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('Equipo JEO');
  const [tagsStr, setTagsStr] = useState('Misiones Espaciales, NASA');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [imageUrl, setImageUrl] = useState('/assets/artemis.svg');
  const [coverImageCaption, setCoverImageCaption] = useState('');
  const [content, setContent] = useState('');
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write');

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await getNews();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setAuthor('Equipo JEO');
    setTagsStr('Misiones Espaciales, Cosmos');
    setReadTimeMinutes(4);
    setImageUrl('/assets/artemis.svg');
    setCoverImageCaption('');
    setContent('# Título de la noticia\n\nEscribe aquí el contenido...');
    setFormError('');
    setPreviewTab('write');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: NewsArticle) => {
    setIsEditing(true);
    setCurrentId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setSummary(article.summary);
    setAuthor(article.author || 'Equipo JEO');
    setTagsStr(article.tags?.join(', ') || '');
    setReadTimeMinutes(article.readTimeMinutes);
    setImageUrl(article.imageUrl || '/assets/artemis.svg');
    setCoverImageCaption(article.coverImageCaption || '');
    setContent(article.content || '');
    setFormError('');
    setPreviewTab('write');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      // Generate slug automatically from title
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

    if (!title || !slug || !summary) {
      setFormError('Por favor completa todos los campos requeridos (Título, Slug, Resumen).');
      return;
    }

    setFormLoading(true);
    setFormError('');

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      slug,
      summary,
      author,
      tags,
      readTimeMinutes: Number(readTimeMinutes),
      imageUrl,
      coverImageCaption,
      content,
    };

    try {
      if (isEditing && currentId) {
        await adminUpdateNews(currentId, payload, token);
      } else {
        await adminCreateNews(payload, token);
      }
      setIsModalOpen(false);
      await loadArticles();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar la noticia');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, articleTitle: string) => {
    if (!token) return;
    if (!confirm(`¿Estás seguro de eliminar la noticia "${articleTitle}"?`)) return;

    try {
      await adminDeleteNews(id, token);
      await loadArticles();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la noticia');
    }
  };

  const filtered = articles.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      (a.author?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
            Gestión de Noticias
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Crea, edita o elimina artículos de actualidad astronómica publicados en el portal.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 cursor-pointer flex-shrink-0"
        >
          <FiPlus className="w-4 h-4" />
          <span>Nueva Noticia</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, autor o contenido..."
          className="w-full bg-[#0d162a] border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-[var(--color-yellow)] transition-colors"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0d162a] border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No se encontraron noticias. Haz clic en "Nueva Noticia" para crear la primera.
        </div>
      ) : (
        <div className="bg-[#0d162a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Título</th>
                  <th className="p-4">Autor</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Lectura</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-semibold text-white max-w-xs truncate">
                      {article.title}
                    </td>
                    <td className="p-4 text-slate-300">{article.author || 'Equipo JEO'}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {article.tags?.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="bg-[var(--color-yellow)]/10 text-[var(--color-yellow)] px-2 py-0.5 rounded text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{article.readTimeMinutes} min</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(article)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[var(--color-yellow)] hover:text-[#060a17] text-slate-300 transition-colors"
                          title="Editar"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-white/20 rounded-3xl max-w-3xl w-full p-6 md:p-8 relative shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-[var(--font-montserrat)]">
              {isEditing ? 'Editar Noticia' : 'Redactar Nueva Noticia'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Completa los datos editoriales y el contenido en Markdown.
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
                  <label className="block text-slate-300 font-semibold mb-1">Título *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ej. Avance en la misión Artemis..."
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slug URL *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ej-avance-mision-artemis"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resumen (Lead) *</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Breve introducción que resume los puntos clave de la noticia..."
                  className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Autor</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Equipo JEO"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tags (separados por coma)</label>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="Misiones, Luna, NASA"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tiempo de lectura (minutos)</label>
                  <input
                    type="number"
                    min={1}
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">URL de Imagen Principal</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/assets/artemis.svg"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pie de foto</label>
                  <input
                    type="text"
                    value={coverImageCaption}
                    onChange={(e) => setCoverImageCaption(e.target.value)}
                    placeholder="Recreación artística del módulo..."
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>
              </div>

              {/* Content Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 font-semibold">Cuerpo del artículo (Markdown)</label>
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('write')}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        previewTab === 'write' ? 'bg-[var(--color-yellow)] text-[#060a17]' : 'text-slate-300'
                      }`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('preview')}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        previewTab === 'preview' ? 'bg-[var(--color-yellow)] text-[#060a17]' : 'text-slate-300'
                      }`}
                    >
                      Vista Previa
                    </button>
                  </div>
                </div>

                {previewTab === 'write' ? (
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Título de sección&#10;&#10;Párrafo explicativo..."
                    className="w-full bg-[#060a17] border border-white/15 p-3.5 rounded-xl text-white font-mono text-xs outline-none focus:border-[var(--color-yellow)]"
                  />
                ) : (
                  <div className="bg-[#060a17] border border-white/15 p-4 rounded-xl max-h-60 overflow-y-auto prose prose-invert text-xs space-y-2">
                    {content.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
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
                      <span>{isEditing ? 'Actualizar Noticia' : 'Publicar Noticia'}</span>
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
