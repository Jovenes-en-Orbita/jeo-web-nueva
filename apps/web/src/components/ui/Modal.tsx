"use client";

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

/**
 * Modal reutilizable del Design System de JEO (Panel Admin y diálogos interactivos).
 * Incluye cierre por tecla Escape, backdrop blur y desplazamiento interno seguro.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidthClass = "max-w-3xl",
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className={`bg-[#0d162a] border border-white/15 ${maxWidthClass} w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="pr-10 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-[var(--font-montserrat)]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-inter">{subtitle}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
