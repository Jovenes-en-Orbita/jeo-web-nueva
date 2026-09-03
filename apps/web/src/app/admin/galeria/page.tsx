'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getGalleryCollections, adminAddGalleryImage, adminDeleteGalleryImage } from '@/lib/api';
import type { GalleryCollection } from '@jeo/shared';
import {
  FiImage,
  FiPlus,
  FiTrash2,
  FiX,
  FiCheck,
  FiLoader,
  FiAlertCircle,
  FiCamera,
} from 'react-icons/fi';

export default function AdminGaleriaPage() {
  const { token } = useAdminAuth();
  const [collections, setCollections] = useState<GalleryCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Image Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionId, setCollectionId] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('/assets/gallery-1.svg');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getGalleryCollections();
      setCollections(data);
      if (data.length > 0) {
        setCollectionId(data[0].id);
      }
    } catch (err) {
      console.error('Error loading gallery collections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = (colId: string) => {
    setCollectionId(colId);
    setAlt('');
    setCaption('');
    setUrl('/assets/gallery-1.svg');
    setFeatured(false);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !collectionId || !alt) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      await adminAddGalleryImage(
        {
          collectionId,
          alt,
          caption,
          url,
          featured,
        },
        token,
      );
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al agregar fotografía');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (imgId: string, imgAlt: string) => {
    if (!token) return;
    if (!confirm(`¿Eliminar la fotografía "${imgAlt}"?`)) return;

    try {
      await adminDeleteGalleryImage(imgId, token);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
            Gestión de Fragmentos de Memoria (Galería)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra los álbumes de astrofotografía y agrega nuevas tomas en alta resolución.
          </p>
        </div>

        {collections.length > 0 && (
          <button
            onClick={() => handleOpenAdd(collections[0].id)}
            className="flex items-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 cursor-pointer flex-shrink-0"
          >
            <FiPlus className="w-4 h-4" />
            <span>Añadir Fotografía</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-[#0d162a] border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No hay colecciones fotográficas registradas.
        </div>
      ) : (
        <div className="space-y-10">
          {collections.map((col) => (
            <div key={col.id} className="bg-[#0d162a] border border-white/10 p-6 md:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[var(--color-yellow)] font-bold block mb-1">
                    Colección Activa
                  </span>
                  <h2 className="text-xl font-bold text-white font-[var(--font-montserrat)]">
                    {col.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{col.description}</p>
                </div>

                <button
                  onClick={() => handleOpenAdd(col.id)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold px-4 py-2 rounded-xl text-slate-200"
                >
                  <FiPlus className="text-[var(--color-yellow)]" />
                  <span>Subir foto a este álbum</span>
                </button>
              </div>

              {/* Grid of Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {col.images.map((img, idx) => {
                  const imageSrc =
                    img.url && img.url.startsWith('/') ? img.url : `/assets/gallery-${(idx % 6) + 1}.svg`;

                  return (
                    <div
                      key={img.id || idx}
                      className="group relative h-48 rounded-2xl overflow-hidden bg-[#060a17] border border-white/10 flex flex-col justify-between p-3"
                    >
                      <Image src={imageSrc} alt={img.alt} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                      <div className="relative z-10 flex justify-between items-start">
                        {img.featured ? (
                          <span className="bg-[var(--color-yellow)] text-[#060a17] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                            Destacada
                          </span>
                        ) : <span />}

                        <button
                          onClick={() => handleDeleteImage(img.id, img.alt)}
                          className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                          title="Eliminar foto"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="relative z-10">
                        <span className="text-xs font-bold text-white block truncate">{img.alt}</span>
                        {img.caption && (
                          <span className="text-[10px] text-slate-300 block truncate">{img.caption}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-white/20 rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl animate-fade-in-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-[var(--font-montserrat)]">
              Añadir Fotografía
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Ingresa el enlace y la descripción de la captura astronómica.
            </p>

            {errorMsg && (
              <div className="mb-4 text-xs text-red-300 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveImage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título / Nombre *</label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Ej. Salida de la Tierra sobre el limbo lunar"
                  className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción / Pie de foto</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Capturada por el telescopio durante la misión..."
                  className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL de la imagen *</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/assets/gallery-1.svg o https://..."
                  className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded bg-[#060a17] border-white/20 text-[var(--color-yellow)] cursor-pointer"
                />
                <label htmlFor="feat" className="text-slate-300 font-semibold cursor-pointer">
                  Marcar como imagen destacada predominante
                </label>
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
                  disabled={saving}
                  className="flex items-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
                >
                  {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiCheck className="w-4 h-4" />}
                  <span>Guardar Foto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
