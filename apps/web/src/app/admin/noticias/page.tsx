"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  searchNews,
  getNewsCategories,
  adminCreateNews,
  adminUpdateNews,
  adminDeleteNews,
  adminCreateNewsCategory,
} from "@/lib/api";
import { FreeImagePicker } from "@/components/ui/FreeImagePicker";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import type {
  ArticleStatus,
  CreateArticleReferenceDto,
  NewsArticle,
  NewsCategory,
} from "@jeo/shared";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiBookOpen,
} from "react-icons/fi";

interface ReferenceFormItem {
  title: string;
  author: string;
  publisher: string;
  url: string;
  publishedAt: string;
}

const EMPTY_REFERENCE: ReferenceFormItem = {
  title: "",
  author: "",
  publisher: "",
  url: "",
  publishedAt: "",
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PUBLISHED: {
    label: "Publicado",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  DRAFT: {
    label: "Borrador",
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  ARCHIVED: {
    label: "Archivado",
    className: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  },
};

export default function AdminNoticiasPage() {
  const { token } = useAdminAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isFreePickerOpen, setIsFreePickerOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("Equipo JEO");
  const [tagsStr, setTagsStr] = useState("Misiones Espaciales, NASA");
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [status, setStatus] = useState<ArticleStatus>("PUBLISHED");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [imageUrl, setImageUrl] = useState("/assets/artemis.svg");
  const [coverImageCaption, setCoverImageCaption] = useState("");
  const [content, setContent] = useState("");
  const [references, setReferences] = useState<ReferenceFormItem[]>([]);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [newsRes, cats] = await Promise.all([
        searchNews({
          page: 1,
          limit: 100,
          include: "all",
          sortBy: "date",
          sortOrder: "desc",
        }),
        getNewsCategories(),
      ]);
      setArticles(newsRes.data);
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setAuthor("Equipo JEO");
    setTagsStr("Misiones Espaciales, Cosmos");
    setReadTimeMinutes(4);
    setStatus("PUBLISHED");
    setSelectedCategoryIds([]);
    setImageUrl("");
    setCoverImageCaption("");
    setContent("");
    setReferences([]);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: NewsArticle) => {
    setIsEditing(true);
    setCurrentId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setSummary(article.summary);
    setAuthor(article.author || "Equipo JEO");
    setTagsStr(article.tags?.join(", ") || "");
    setReadTimeMinutes(article.readTimeMinutes);
    setStatus((article.status as ArticleStatus) || "PUBLISHED");
    setSelectedCategoryIds((article.categories ?? []).map((c) => c.id));
    setImageUrl(article.imageUrl || "/assets/artemis.svg");
    setCoverImageCaption(article.coverImageCaption || "");
    setContent(article.content || "");
    setReferences(
      (article.references ?? []).map((r) => ({
        title: r.title || "",
        author: r.author || "",
        publisher: r.publisher || "",
        url: r.url || "",
        publishedAt: r.publishedAt ? r.publishedAt.slice(0, 10) : "",
      })),
    );
    setFormError("");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      const autoSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(autoSlug);
    }
  };

  const handleToggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  const handleCreateCategory = async () => {
    if (!token || !newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const created = await adminCreateNewsCategory(
        { name: newCategoryName.trim() },
        token,
      );
      setCategories((prev) => [...prev, created]);
      setSelectedCategoryIds((prev) => [...prev, created.id]);
      setNewCategoryName("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al crear la categoría";
      setFormError(message);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleAddReference = () => {
    setReferences((prev) => [...prev, { ...EMPTY_REFERENCE }]);
  };

  const handleUpdateReference = (
    index: number,
    field: keyof ReferenceFormItem,
    value: string,
  ) => {
    setReferences((prev) =>
      prev.map((ref, idx) =>
        idx === index ? { ...ref, [field]: value } : ref,
      ),
    );
  };

  const handleRemoveReference = (index: number) => {
    setReferences((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!title || !slug || !summary) {
      setFormError(
        "Por favor completa todos los campos requeridos (Título, Slug, Resumen).",
      );
      return;
    }

    setFormLoading(true);
    setFormError("");

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const preparedReferences: CreateArticleReferenceDto[] = references
      .filter((r) => r.title.trim() !== "")
      .map((r) => ({
        title: r.title.trim(),
        ...(r.author.trim() && { author: r.author.trim() }),
        ...(r.publisher.trim() && { publisher: r.publisher.trim() }),
        ...(r.url.trim() && { url: r.url.trim() }),
        ...(r.publishedAt.trim() && {
          publishedAt: new Date(
            `${r.publishedAt.trim()}T00:00:00.000Z`,
          ).toISOString(),
        }),
      }));

    const payload = {
      title,
      slug,
      summary,
      author,
      tags,
      readTimeMinutes: Number(readTimeMinutes),
      status,
      categoryIds: selectedCategoryIds,
      imageUrl,
      coverImageCaption,
      content,
      references: preparedReferences,
    };

    try {
      if (isEditing && currentId) {
        await adminUpdateNews(currentId, payload, token);
      } else {
        await adminCreateNews(payload, token);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al guardar la noticia";
      setFormError(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, articleTitle: string) => {
    if (!token) return;
    if (!confirm(`¿Estás seguro de eliminar la noticia "${articleTitle}"?`))
      return;

    try {
      await adminDeleteNews(id, token);
      await loadData();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar la noticia";
      alert(message);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author?.toLowerCase().includes(search.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      a.categories?.some((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d162a] p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">
            Gestión de Noticias y Artículos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Redacta, edita con formato enriquecido, clasifica por categorías y
            agrega bibliografía a los artículos de JEO.
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

      {/* Filter Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar artículos por título, autor, categoría o tag..."
          className="w-full bg-[#0d162a] border border-white/10 pl-11 pr-4 py-3 rounded-2xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--color-yellow)] transition-colors"
        />
      </div>

      {/* Articles Table */}
      <div className="bg-[#0d162a] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="w-8 h-8 text-[var(--color-yellow)] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No se encontraron noticias registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Artículo</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4">Autor</th>
                  <th className="py-4 px-4">Categorías / Tags</th>
                  <th className="py-4 px-4">Fecha</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filtered.map((article) => {
                  const statusInfo =
                    STATUS_LABELS[article.status || "PUBLISHED"] ||
                    STATUS_LABELS.PUBLISHED;
                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6 max-w-xs">
                        <div className="font-bold text-white line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          /{article.slug}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-medium">
                        {article.author || "Equipo JEO"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {article.categories?.map((cat) => (
                            <span
                              key={cat.id}
                              className="bg-[#e8c648]/15 border border-[#e8c648]/40 text-[#e8c648] text-[10px] px-2 py-0.5 font-semibold"
                            >
                              {cat.name}
                            </span>
                          ))}
                          {article.tags?.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="bg-white/5 border border-white/10 text-slate-300 text-[10px] px-2 py-0.5"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {new Date(article.date).toLocaleDateString("es-AR")}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(article)}
                            title="Editar"
                            className="p-2 bg-white/5 hover:bg-[var(--color-yellow)] hover:text-[#060a17] text-slate-300 rounded-lg transition-colors cursor-pointer"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(article.id, article.title)
                            }
                            title="Eliminar"
                            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d162a] border border-white/15 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-[var(--font-montserrat)]">
              {isEditing ? "Editar Noticia" : "Redactar Nueva Noticia"}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Escribe o pega contenido con formato automático (TipTap), o cambia
              a modo manual para editar HTML/Markdown.
            </p>

            {formError && (
              <div className="mb-4 flex items-center gap-2 text-xs text-[var(--color-red)] bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Título y Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Título *
                  </label>
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
                  <label className="block text-slate-300 font-semibold mb-1">
                    Slug URL *
                  </label>
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

              {/* Bajada / Resumen */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Resumen / Bajada (Subtítulo) *
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Breve introducción que resume los puntos clave de la noticia..."
                  className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)] resize-none"
                  required
                />
              </div>

              {/* Autor, Tags, Tiempo de lectura y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Equipo JEO"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tags (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="Misiones, Luna, NASA"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tiempo lectura (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Estado
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  >
                    <option value="PUBLISHED">Publicado</option>
                    <option value="DRAFT">Borrador</option>
                    <option value="ARCHIVED">Archivado</option>
                  </select>
                </div>
              </div>

              {/* Categorías */}
              <div className="bg-[#081022] border border-white/10 p-4 space-y-3">
                <label className="block text-slate-300 font-semibold">
                  Categorías de la noticia
                </label>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const selected = selectedCategoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleToggleCategory(cat.id)}
                        className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                          selected
                            ? "bg-[#e8c648] text-[#060a17] border-[#e8c648]"
                            : "bg-[#060a17] text-slate-300 border-white/15 hover:border-[#e8c648]/60"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}
                        {cat.name}
                      </button>
                    );
                  })}
                  {categories.length === 0 && (
                    <span className="text-slate-500 text-[11px]">
                      Aún no hay categorías creadas. Crea la primera abajo.
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nueva categoría (ej. Ciencia, Astronomía, Misiones)..."
                    className="flex-1 bg-[#060a17] border border-white/15 px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="px-4 py-2 bg-white/10 hover:bg-[#e8c648] hover:text-[#060a17] text-white font-bold text-[11px] uppercase transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {creatingCategory ? "Creando..." : "+ Crear categoría"}
                  </button>
                </div>
              </div>

              {/* Imagen Principal y Créditos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">
                      URL de Imagen Principal
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsFreePickerOpen(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1 cursor-pointer"
                    >
                      Buscar Foto Gratis (NASA/Unsplash)
                    </button>
                  </div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/assets/artemis.svg"
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pie de foto / Créditos
                  </label>
                  <input
                    type="text"
                    value={coverImageCaption}
                    onChange={(e) => setCoverImageCaption(e.target.value)}
                    placeholder="Foto por NASA / Recreación artística..."
                    className="w-full bg-[#060a17] border border-white/15 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-[var(--color-yellow)]"
                  />
                </div>
              </div>

              {/* Editor Enriquecido TipTap (Visual + Manual) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Cuerpo del artículo (Editor Visual TipTap / Manual
                  HTML-Markdown)
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Escribe o pega el texto del artículo aquí. El formato se aplica instantáneamente..."
                />
              </div>

              {/* Bibliografía / Referencias */}
              <div className="bg-[#081022] border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center gap-2">
                    <FiBookOpen className="w-4 h-4 text-[#e8c648]" />
                    <span>
                      Bibliografía / Referencias ({references.length})
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddReference}
                    className="px-3 py-1.5 bg-white/10 hover:bg-[#e8c648] hover:text-[#060a17] text-white font-bold text-[11px] uppercase transition-colors cursor-pointer"
                  >
                    + Agregar referencia
                  </button>
                </div>

                {references.length === 0 ? (
                  <p className="text-[11px] text-slate-500">
                    Opcional: agrega fuentes bibliográficas que aparecerán al
                    pie del artículo en formato editorial.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {references.map((ref, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#060a17] border border-white/10 space-y-2.5 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveReference(idx)}
                          title="Quitar referencia"
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-400 cursor-pointer"
                        >
                          <FiX className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pr-6">
                          <input
                            type="text"
                            value={ref.title}
                            onChange={(e) =>
                              handleUpdateReference(
                                idx,
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder="Título de la fuente *"
                            className="bg-[#0b1224] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                          />
                          <input
                            type="text"
                            value={ref.author}
                            onChange={(e) =>
                              handleUpdateReference(
                                idx,
                                "author",
                                e.target.value,
                              )
                            }
                            placeholder="Autor (ej. Low, L. / NASA)"
                            className="bg-[#0b1224] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          <input
                            type="text"
                            value={ref.publisher}
                            onChange={(e) =>
                              handleUpdateReference(
                                idx,
                                "publisher",
                                e.target.value,
                              )
                            }
                            placeholder="Fuente / Editorial (ej. NASA, Space.com)"
                            className="bg-[#0b1224] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                          />
                          <input
                            type="url"
                            value={ref.url}
                            onChange={(e) =>
                              handleUpdateReference(idx, "url", e.target.value)
                            }
                            placeholder="https://..."
                            className="bg-[#0b1224] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                          />
                          <input
                            type="date"
                            value={ref.publishedAt}
                            onChange={(e) =>
                              handleUpdateReference(
                                idx,
                                "publishedAt",
                                e.target.value,
                              )
                            }
                            className="bg-[#0b1224] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#e8c648]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold cursor-pointer"
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
                      <span>
                        {isEditing ? "Actualizar Noticia" : "Publicar Noticia"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Free Image Picker Modal */}
      {token && (
        <FreeImagePicker
          isOpen={isFreePickerOpen}
          onClose={() => setIsFreePickerOpen(false)}
          token={token}
          defaultQuery="nebulosa"
          onSelectImage={(url, caption) => {
            setImageUrl(url);
            if (caption) setCoverImageCaption(caption);
          }}
        />
      )}
    </div>
  );
}
