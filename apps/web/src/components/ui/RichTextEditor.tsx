"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiLink,
  FiCode,
  FiEye,
  FiRotateCcw,
  FiRotateCw,
  FiMinus,
} from "react-icons/fi";
import { renderArticleContentToHtml } from "@/lib/content-renderer";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Editor editorial enriquecido basado en TipTap (WYSIWYG) con modo dual:
 * - Visual: pegado instantáneo con formato (Word, Google Docs, web) + barra manual.
 * - Manual: edición directa en HTML o Markdown con conversión automática al volver a Visual.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe o pega el contenido del artículo aquí...",
}: RichTextEditorProps) {
  const [mode, setMode] = useState<"visual" | "manual">("visual");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: renderArticleContentToHtml(value),
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  // Sincronizar cuando cambia el artículo seleccionado (abrir modal crear/editar)
  useEffect(() => {
    if (!editor) return;
    const normalized = renderArticleContentToHtml(value);
    if (editor.getHTML() !== normalized && mode === "visual") {
      editor.commands.setContent(normalized, { emitUpdate: false });
    }
  }, [value, editor, mode]);

  const handleSwitchMode = (nextMode: "visual" | "manual") => {
    if (nextMode === mode) return;
    if (nextMode === "visual" && editor) {
      const html = renderArticleContentToHtml(value);
      editor.commands.setContent(html, { emitUpdate: false });
      onChange(html);
    }
    setMode(nextMode);
  };

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("URL del enlace:", previousUrl);
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  const btnClass = (active = false) =>
    `px-2 py-1.5 text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center justify-center gap-1 ${
      active
        ? "bg-[#e8c648] text-[#060a17]"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="border border-white/15 bg-[#060a17] overflow-hidden">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-white/10 bg-[#0a1022]">
        <div className="flex flex-wrap items-center gap-1">
          {mode === "visual" && editor && (
            <>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                title="Título 1"
                className={btnClass(editor.isActive("heading", { level: 1 }))}
              >
                H1
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                title="Título 2"
                className={btnClass(editor.isActive("heading", { level: 2 }))}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                title="Título 3"
                className={btnClass(editor.isActive("heading", { level: 3 }))}
              >
                H3
              </button>

              <span className="w-px h-4 bg-white/15 mx-1" />

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Negrita"
                className={btnClass(editor.isActive("bold"))}
              >
                <FiBold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Cursiva"
                className={btnClass(editor.isActive("italic"))}
              >
                <FiItalic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Subrayado"
                className={btnClass(editor.isActive("underline"))}
              >
                <FiUnderline className="w-3.5 h-3.5" />
              </button>

              <span className="w-px h-4 bg-white/15 mx-1" />

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Lista con viñetas"
                className={btnClass(editor.isActive("bulletList"))}
              >
                <FiList className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Lista numerada"
                className={btnClass(editor.isActive("orderedList"))}
              >
                1.
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Cita"
                className={btnClass(editor.isActive("blockquote"))}
              >
                “ ”
              </button>
              <button
                type="button"
                onClick={handleSetLink}
                title="Insertar enlace"
                className={btnClass(editor.isActive("link"))}
              >
                <FiLink className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Línea divisoria"
                className={btnClass(false)}
              >
                <FiMinus className="w-3.5 h-3.5" />
              </button>

              <span className="w-px h-4 bg-white/15 mx-1" />

              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Deshacer"
                className={`${btnClass(false)} disabled:opacity-30`}
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Rehacer"
                className={`${btnClass(false)} disabled:opacity-30`}
              >
                <FiRotateCw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {mode === "manual" && (
            <span className="text-[11px] text-slate-400 font-inter">
              Editando en modo manual (soporta HTML y Markdown)
            </span>
          )}
        </div>

        {/* Selector Visual vs Manual */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => handleSwitchMode("visual")}
            className={btnClass(mode === "visual")}
          >
            <FiEye className="w-3 h-3" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("manual")}
            className={btnClass(mode === "manual")}
          >
            <FiCode className="w-3 h-3" />
            <span>Manual</span>
          </button>
        </div>
      </div>

      {/* Área de edición */}
      {mode === "visual" ? (
        <div className="tiptap-editor-content p-4 max-h-[340px] overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      ) : (
        <textarea
          rows={11}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe o pega HTML o Markdown manualmente..."
          className="w-full bg-[#060a17] p-4 text-xs text-slate-200 font-mono leading-relaxed outline-none resize-y"
        />
      )}
    </div>
  );
}
