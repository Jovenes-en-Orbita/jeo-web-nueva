'use client';

import React, { useState, useEffect } from 'react';
import { adminSearchFreeImages } from '@/lib/api';

interface FreeImageItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  authorUrl: string;
  source: 'Unsplash' | 'NASA';
}

interface FreeImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, caption?: string) => void;
  token: string;
  defaultQuery?: string;
}

export const FreeImagePicker: React.FC<FreeImagePickerProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  token,
  defaultQuery = 'nebulosa',
}) => {
  const [query, setQuery] = useState(defaultQuery);
  const [images, setImages] = useState<FreeImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const results = await adminSearchFreeImages(query, token);
      setImages(results);
      if (results.length === 0) {
        setError('No se encontraron imágenes astronómicas para este término. Intenta en inglés (ej: "mars", "nebula").');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con la API de imágenes libres.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && images.length === 0) {
      handleSearch();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🚀</span> Buscador de Imágenes Gratuitas Libres de Derechos
            </h3>
            <p className="text-sm text-slate-400">
              Imágenes astronómicas de alta calidad vía NASA y Unsplash (Libre uso comercial).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: galaxia, marte, telescope, nebula, apollo..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
          
          {/* Tag suggestions */}
          <div className="flex gap-2 mt-3 flex-wrap text-xs text-slate-400 items-center">
            <span>Sugerencias:</span>
            {['nebulosa', 'mars', 'galaxy', 'hubble', 'apollo', 'telescope'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  adminSearchFreeImages(tag, token).then(setImages).catch(() => {});
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Content / Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm mb-4">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Conectando con la NASA y Unsplash...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => {
                    const caption = `Foto por ${img.author} (${img.source})`;
                    onSelectImage(img.url, caption);
                    onClose();
                  }}
                  className="group relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-md hover:shadow-cyan-500/10"
                >
                  <div className="aspect-video relative bg-slate-900 overflow-hidden">
                    <img
                      src={img.thumbnailUrl}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold bg-black/60 backdrop-blur-md rounded-md text-cyan-300 border border-cyan-500/30">
                      {img.source}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {img.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      📷 {img.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
