"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  getGalleryCollections,
  adminCreateGalleryCollection,
  adminUpdateGalleryCollection,
  adminDeleteGalleryCollection,
  adminGetPendingGalleryImages,
  adminAddGalleryImage,
  adminUpdateGalleryImage,
  adminAssignGalleryImage,
  adminDeleteGalleryImage,
  adminSyncGallerySiteAssets,
} from "@/lib/api";
import { FreeImagePicker } from "@/components/ui/FreeImagePicker";
import type { GalleryCollection, GalleryImage } from "@jeo/shared";
import {
  FiImage,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiLoader,
  FiAlertCircle,
  FiCamera,
  FiFolderPlus,
  FiLink,
  FiRefreshCw,
  FiInbox,
  FiStar,
} from "react-icons/fi";

const SOURCE_LABELS: Record<string, string> = {
  NEWS: "Noticias",
  MANUAL: "Manual",
  SOLAR_SYSTEM: "Sistema Solar",
  UNIVERSE: "El Universo",
  CONSTELLATION: "Constelaciones",
  SITE_ASSET: "Sitio",
};

export default function AdminGaleriaPage() {
  const { token } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"collections" | "pending">(
    "collections",
  );
  const [collections, setCollections] = useState<GalleryCollection[]>([]);
  const [pendingImages, setPendingImages] = useState<GalleryImage[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  // Selección de colección por imagen pendiente
  const [assignTargets, setAssignTargets] = useState<Record<string, string>>(
    {},
  );
  const [assigningId, setAssigningId] = useState<string | null>(null);

  // Free Image Picker
  const [isFreePickerOpen, setIsFreePickerOpen] = useState(false);

  // Modal de Colección (Crear / Editar)
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
    null,
  );
  const [colTitle, setColTitle] = useState("");
  const [colDesc, setColDesc] = useState("");
  const [colCategory, setColCategory] = useState("");
  const [colTagsStr, setColTagsStr] = useState("");
  const [colFeatured, setColFeatured] = useState(false);
  const [colSaving, setColSaving] = useState(false);
  const [colError, setColError] = useState("");

  // Modal de Imagen (Crear / Editar con metadatos astrofotográficos)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [collectionId, setCollectionId] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [photographer, setPhotographer] = useState("");
  const [telescope, setTelescope] = useState("");
  const [camera, setCamera] = useState("");
  const [exposureTime, setExposureTime] = useState("");
  const [location, setLocation] = useState("");
  const [creditUrl, setCreditUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cols, pendingRes] = await Promise.all([
        getGalleryCollections(),
        token
          ? adminGetPendingGalleryImages(token, 1, 50).catch(() => ({
              data: [],
              items: [],
              total: 0,
              page: 1,
              limit: 50,
              totalPages: 1,
            }))
          : Promise.resolve({
              data: [],
              items: [],
              total: 0,
              page: 1,
              limit: 50,
              totalPages: 1,
            }),
      ]);

      setCollections(cols);
      setPendingImages(pendingRes.data);
      setPendingTotal(pendingRes.total);

      if (cols.length > 0) {
        setCollectionId((prev) => prev || cols[0].id);
        setAssignTargets((prev) => {
          const next = { ...prev };
          for (const img of pendingRes.data) {
            if (!next[img.id]) {
              next[img.id] = cols[0].id;
            }
          }
          return next;
        });
      }
    } catch (err) {
      console.error("Error loading gallery data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Acciones de Sincronización ──

  const handleSyncSiteAssets = async () => {
    if (!token) return;
    setIsSyncing(true);
    setSyncMessage("");
    try {
      const res = await adminSyncGallerySiteAssets(token);
      setSyncMessage(
        `Sincronización completada: ${res.linkedFromSite} imágenes del sitio vinculadas y ${res.pendingFromNews} imágenes de noticias añadidas a pendientes.`,
      );
      await loadData();
    } catch (err: any) {
      setSyncMessage(err.message || "Error al sincronizar activos");
    } finally {
      setIsSyncing(false);
    }
  };

  // ── Acciones de Colecciones ──

  const handleOpenCreateCollection = () => {
    setEditingCollectionId(null);
    setColTitle("");
    setColDesc("");
    setColCategory("");
    setColTagsStr("");
    setColFeatured(false);
    setColError("");
    setIsCollectionModalOpen(true);
  };

  const handleOpenEditCollection = (col: GalleryCollection) => {
    setEditingCollectionId(col.id);
    setColTitle(col.title);
    setColDesc(col.description);
    setColCategory(col.category || "");
    setColTagsStr((col.tags || []).join(", "));
    setColFeatured(Boolean(col.featured));
    setColError("");
    setIsCollectionModalOpen(true);
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !colTitle.trim() || !colDesc.trim()) {
      setColError("Título y descripción son obligatorios.");
      return;
    }

    setColSaving(true);
    setColError("");
    const parsedTags = colTagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingCollectionId) {
        await adminUpdateGalleryCollection(
          editingCollectionId,
          {
            title: colTitle,
            description: colDesc,
            category: colCategory || undefined,
            tags: parsedTags,
            featured: colFeatured,
          },
          token,
        );
      } else {
        await adminCreateGalleryCollection(
          {
            title: colTitle,
            description: colDesc,
            category: colCategory || undefined,
            tags: parsedTags,
            featured: colFeatured,
            rotationFrequency: "semanal",
          },
          token,
        );
      }
      setIsCollectionModalOpen(false);
      await loadData();
    } catch (err: any) {
      setColError(err.message || "Error al guardar la colección");
    } finally {
      setColSaving(false);
    }
  };

  const handleDeleteCollection = async (col: GalleryCollection) => {
    if (!token) return;
    if (
      !confirm(
        `¿Eliminar la colección "${col.title}"?\nSus fotografías no se borrarán: pasarán automáticamente a la bandeja de "Pendientes de vincular".`,
      )
    ) {
      return;
    }

    try {
      await adminDeleteGalleryCollection(col.id, token);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Error al eliminar la colección");
    }
  };

  // ── Acciones de Imágenes ──

  const handleOpenAddImage = (colId: string) => {
    setEditingImageId(null);
    setCollectionId(colId);
    setAlt("");
    setCaption("");
    setUrl("");
    setFeatured(false);
    setPhotographer("");
    setTelescope("");
    setCamera("");
    setExposureTime("");
    setLocation("");
    setCreditUrl("");
    setErrorMsg("");
    setIsImageModalOpen(true);
  };

  const handleOpenEditImage = (img: GalleryImage) => {
    setEditingImageId(img.id);
    setCollectionId(img.collectionId || "");
    setAlt(img.alt || "");
    setCaption(img.caption || "");
    setUrl(img.url || "");
    setFeatured(Boolean(img.featured));
    setPhotographer(img.photographer || "");
    setTelescope(img.telescope || "");
    setCamera(img.camera || "");
    setExposureTime(img.exposureTime || "");
    setLocation(img.location || "");
    setCreditUrl(img.creditUrl || "");
    setErrorMsg("");
    setIsImageModalOpen(true);
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !alt.trim()) {
      setErrorMsg("Por favor completa el título/alt de la fotografía.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    const payload = {
      collectionId: collectionId || null,
      alt: alt.trim(),
      caption: caption.trim() || undefined,
      url: url.trim() || "/assets/gallery-1.svg",
      featured,
      photographer: photographer.trim() || undefined,
      telescope: telescope.trim() || undefined,
      camera: camera.trim() || undefined,
      exposureTime: exposureTime.trim() || undefined,
      location: location.trim() || undefined,
      creditUrl: creditUrl.trim() || undefined,
    };

    try {
      if (editingImageId) {
        await adminUpdateGalleryImage(editingImageId, payload, token);
      } else {
        await adminAddGalleryImage(payload, token);
      }
      setIsImageModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || "Error al guardar fotografía");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignPending = async (imgId: string) => {
    if (!token) return;
    const targetColId = assignTargets[imgId];
    if (!targetColId) {
      alert("Selecciona una colección destino antes de vincular.");
      return;
    }

    setAssigningId(imgId);
    try {
      await adminAssignGalleryImage(imgId, targetColId, token);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Error al vincular la fotografía");
    } finally {
      setAssigningId(null);
    }
  };

  const handleIgnorePending = async (imgId: string) => {
    if (!token) return;
    setAssigningId(imgId);
    try {
      await adminUpdateGalleryImage(imgId, { status: "IGNORED" }, token);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Error al descartar la fotografía");
    } finally {
      setAssigningId(null);
    }
  };

  const handleDeleteImage = async (imgId: string, imgAlt: string) => {
    if (!token) return;
    if (!confirm(`¿Eliminar permanentemente la fotografía "${imgAlt}"?`))
      return;

    try {
      await adminDeleteGalleryImage(imgId, token);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
            Gestión de Galería de Fotos Astronómicas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra colecciones, metadatos astrofotográficos y vincula
            imágenes pendientes provenientes de Noticias o del sitio.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleSyncSiteAssets}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-[var(--font-montserrat)] font-bold text-xs uppercase px-4 py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw
              className={`w-4 h-4 text-[#e8c648] ${isSyncing ? "animate-spin" : ""}`}
            />
            <span>Sincronizar sitio</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateCollection}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-4 py-3 rounded-xl transition-all cursor-pointer"
          >
            <FiFolderPlus className="w-4 h-4 text-[#e8c648]" />
            <span>Nueva Colección</span>
          </button>

          {collections.length > 0 && (
            <button
              type="button"
              onClick={() => handleOpenAddImage(collections[0].id)}
              className="flex items-center gap-2 bg-[var(--color-red)] hover:bg-red-700 text-white font-[var(--font-montserrat)] font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 cursor-pointer flex-shrink-0"
            >
              <FiPlus className="w-4 h-4" />
              <span>Añadir Fotografía</span>
            </button>
          )}
        </div>
      </div>

      {syncMessage && (
        <div className="bg-[#0d162a] border border-[#e8c648]/40 text-slate-200 px-4 py-3 rounded-2xl text-xs flex items-center justify-between gap-3">
          <span>{syncMessage}</span>
          <button
            type="button"
            onClick={() => setSyncMessage("")}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pestañas: Colecciones vs Imágenes Pendientes de Vincular */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("collections")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "collections"
              ? "bg-[#e8c648] text-[#050811]"
              : "bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          <FiImage className="w-4 h-4" />
          <span>Colecciones ({collections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "pending"
              ? "bg-[#e8c648] text-[#050811]"
              : "bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          <FiInbox className="w-4 h-4" />
          <span>Pendientes de vincular</span>
          {pendingTotal > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === "pending"
                  ? "bg-[#050811] text-[#e8c648]"
                  : "bg-[#d83933] text-white"
              }`}
            >
              {pendingTotal}
            </span>
          )}
        </button>
      </div>

      {/* Contenido Principal */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[#e8c648] animate-spin" />
        </div>
      ) : activeTab === "pending" ? (
        /* ── BANDEJA DE IMÁGENES PENDIENTES DE VINCULAR ── */
        <div className="space-y-4">
          {pendingImages.length === 0 ? (
            <div className="bg-[#0d162a] border border-white/10 rounded-3xl p-12 text-center text-slate-300 space-y-2">
              <FiCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">
                No hay imágenes pendientes de vincular
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Cuando publiques nuevas noticias con imagen o elimines una
                colección, sus fotografías aparecerán aquí para asignarlas a un
                álbum.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-[#0d162a] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="relative h-44 bg-[#060a17]">
                    <Image
                      src={img.url || "/assets/gallery-1.svg"}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#050811]/85 border border-[#e8c648]/50 text-[#e8c648] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      Origen:{" "}
                      {SOURCE_LABELS[img.sourceType || "MANUAL"] ||
                        img.sourceType}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-2">
                        {img.alt}
                      </h4>
                      {img.caption && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {img.caption}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        Colección destino
                      </label>
                      <select
                        value={assignTargets[img.id] || ""}
                        onChange={(e) =>
                          setAssignTargets((prev) => ({
                            ...prev,
                            [img.id]: e.target.value,
                          }))
                        }
                        className="w-full bg-[#060a17] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                      >
                        {collections.length === 0 ? (
                          <option value="">Crea una colección primero</option>
                        ) : (
                          collections.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))
                        )}
                      </select>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={
                            collections.length === 0 || assigningId === img.id
                          }
                          onClick={() => handleAssignPending(img.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#e8c648] hover:bg-[#f5db76] text-[#050811] font-bold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <FiLink className="w-3.5 h-3.5" />
                          <span>Vincular</span>
                        </button>

                        <button
                          type="button"
                          disabled={assigningId === img.id}
                          onClick={() => handleIgnorePending(img.id)}
                          title="Descartar de pendientes"
                          className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                        >
                          Ignorar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id, img.alt)}
                          title="Eliminar imagen"
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-[#0d162a] border border-white/10 rounded-3xl p-12 text-center text-slate-300 space-y-4">
          <FiCamera className="w-12 h-12 text-[#e8c648] mx-auto opacity-80" />
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              No hay colecciones fotográficas registradas
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Crea tu primera colección o sincroniza las imágenes existentes del
              sitio para empezar.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreateCollection}
              className="inline-flex items-center gap-2 bg-[#e8c648] text-[#050811] font-bold text-xs uppercase px-5 py-3 rounded-xl cursor-pointer"
            >
              <FiFolderPlus className="w-4 h-4" />
              <span>Crear Colección</span>
            </button>
          </div>
        </div>
      ) : (
        /* ── LISTADO DE COLECCIONES Y SUS FOTOS ── */
        <div className="space-y-8">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-[#0d162a] border border-white/10 rounded-3xl p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-white font-[var(--font-montserrat)]">
                      {col.title}
                    </h2>
                    {col.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e8c648]/15 border border-[#e8c648]/40 text-[#e8c648] text-[10px] font-bold uppercase">
                        <FiStar className="w-3 h-3" /> Destacada
                      </span>
                    )}
                    {col.category && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px] font-semibold uppercase">
                        {col.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {col.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleOpenAddImage(col.id)}
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Agregar foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditCollection(col)}
                    className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCollection(col)}
                    className="inline-flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>

              {col.images.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  Esta colección aún no tiene fotografías.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {col.images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative bg-[#060a17] border border-white/10 rounded-xl overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={img.url || "/assets/gallery-1.svg"}
                          alt={img.alt}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {img.alt}
                          </p>
                          {(img.photographer || img.telescope) && (
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {[img.photographer, img.telescope]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditImage(img)}
                            title="Editar fotografía y metadatos"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.id, img.alt)}
                            title="Eliminar fotografía"
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Crear / Editar Colección */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d162a] border border-white/15 rounded-3xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingCollectionId ? "Editar Colección" : "Nueva Colección"}
              </h2>
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {colError && (
              <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{colError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCollection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={colTitle}
                  onChange={(e) => setColTitle(e.target.value)}
                  placeholder="Ej. Grandes Exploradores: El Apollo 11"
                  className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e8c648]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Descripción *
                </label>
                <textarea
                  rows={3}
                  required
                  value={colDesc}
                  onChange={(e) => setColDesc(e.target.value)}
                  placeholder="Descripción breve del álbum fotográfico..."
                  className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e8c648]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={colCategory}
                    onChange={(e) => setColCategory(e.target.value)}
                    placeholder="Misiones Espaciales"
                    className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e8c648]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tags (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={colTagsStr}
                    onChange={(e) => setColTagsStr(e.target.value)}
                    placeholder="Apollo, Luna, NASA"
                    className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e8c648]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colFeatured}
                  onChange={(e) => setColFeatured(e.target.checked)}
                  className="accent-[#e8c648]"
                />
                <span>Destacar esta colección en la página principal</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={colSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#e8c648] text-[#050811] text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                >
                  {colSaving ? "Guardando..." : "Guardar Colección"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar / Editar Fotografía con Metadatos Astrofotográficos */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d162a] border border-white/15 rounded-3xl w-full max-w-xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingImageId ? "Editar Fotografía" : "Añadir Fotografía"}
              </h2>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveImage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Colección (dejar vacío para bandeja de pendientes)
                </label>
                <select
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e8c648]"
                >
                  <option value="">
                    — Sin colección (Pendiente de vincular) —
                  </option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Título / Nombre de la foto *
                </label>
                <input
                  type="text"
                  required
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Ej. Nebulosa de Carina"
                  className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e8c648]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    URL de la imagen
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsFreePickerOpen(true)}
                    className="text-[11px] font-bold text-[#e8c648] hover:underline cursor-pointer"
                  >
                    Buscar en NASA / Unsplash
                  </button>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e8c648]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Descripción / Pie de foto
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e8c648]"
                />
              </div>

              {/* Metadatos astrofotográficos */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#e8c648]">
                  Metadatos Astrofotográficos (Opcionales)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                    placeholder="Fotógrafo / Agencia"
                    className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                  />
                  <input
                    type="text"
                    value={telescope}
                    onChange={(e) => setTelescope(e.target.value)}
                    placeholder="Telescopio / Instrumento"
                    className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                  />
                  <input
                    type="text"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    placeholder="Cámara / Sensor"
                    className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                  />
                  <input
                    type="text"
                    value={exposureTime}
                    onChange={(e) => setExposureTime(e.target.value)}
                    placeholder="Exposición (ej. 120s x 30)"
                    className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ubicación / Órbita"
                    className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                  />
                  <input
                    type="url"
                    value={creditUrl}
                    onChange={(e) => setCreditUrl(e.target.value)}
                    placeholder="URL de crédito (https://...)"
                    className="w-full bg-[#060a17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#e8c648] text-[#050811] text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar Fotografía"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFreePickerOpen && token && (
        <FreeImagePicker
          isOpen={isFreePickerOpen}
          token={token}
          onClose={() => setIsFreePickerOpen(false)}
          onSelectImage={(selectedUrl, selectedCaption) => {
            setUrl(selectedUrl);
            if (!alt && selectedCaption) setAlt(selectedCaption);
            setIsFreePickerOpen(false);
          }}
        />
      )}
    </div>
  );
}
