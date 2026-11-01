"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import {
  UNIVERSE_STRUCTURES,
  type UniverseStructure,
} from "@/lib/universeStructures";
import { StructureModal } from "@/components/features/StructureModal";
import { ActionButton } from "@/components/ui/ActionButton";
import { TooltipCursor } from "@/components/ui/TooltipCursor";

const TIMELINE_EVENTS = [
  {
    time: "13.800 M años",
    name: "Big Bang",
    desc: "Origen del espacio, el tiempo y toda la energía conocida en una gran expansión.",
  },
  {
    time: "13.400 M años",
    name: "Primeras estrellas",
    desc: "Colapso gravitacional de nubes primordiales que dio luz a las estrellas de Población III.",
  },
  {
    time: "13.000 M años",
    name: "Primeras galaxias",
    desc: "Agrupación de proto-galaxias y primeros agujeros negros supermasivos.",
  },
  {
    time: "4.600 M años",
    name: "Sistema Solar",
    desc: "Formación del Sol y los discos protoplanetarios a partir de una nebulosa solar.",
  },
  {
    time: "Hoy",
    name: "El universo actual",
    desc: "Expansión acelerada gobernada por la energía oscura y observación de la red cósmica.",
  },
];

const FUN_FACTS = [
  { number: "13.800 M", label: "Años de edad estimada del universo" },
  { number: "2 billones", label: "De galaxias en el cosmos observable" },
  { number: "93.000 M", label: "Años luz de diámetro observable" },
  { number: "5 %", label: "De materia común (el 95% es oscura)" },
];

export default function UniversoPage() {
  const [selectedStructure, setSelectedStructure] =
    useState<UniverseStructure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{
    x: number;
    y: number;
    isNearRight?: boolean;
  } | null>(null);

  const handleOpenModal = (struct: UniverseStructure) => {
    setSelectedStructure(struct);
    setIsModalOpen(true);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    structId: string,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isNearRight = x > rect.width - 140;

    setHoveredId(structId);
    setMousePos({ x, y, isNearRight });
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setMousePos(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-white">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs uppercase tracking-wider text-slate-400 font-inter">
            <Link href="/" className="hover:text-[#e5a912] transition-colors">
              Inicio
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-[#e5a912] font-semibold">El Universo</span>
          </nav>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white font-chakra leading-tight">
                EL UNIVERSO HACE 13.800 MILLONES DE AÑOS
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-inter">
                Desde la gran inflación primordial hasta la formación de cúmulos
                de galaxias y sistemas estelares, el cosmos ha evolucionado a lo
                largo de eones. Descubre los hitos más trascendentes de su
                cronología y las estructuras colosales que componen la
                inmensidad observable.
              </p>
            </div>

            <div className="lg:col-span-6 relative aspect-[16/10] w-full bg-black overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src="/assets/hero-cosmos.svg"
                alt="Campo profundo del cosmos"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Línea de tiempo del universo */}
          <section className="space-y-6 pt-4 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-white font-chakra">
              LÍNEA DE TIEMPO DEL UNIVERSO
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {TIMELINE_EVENTS.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b1024] border border-white/10 p-5 flex flex-col justify-between hover:border-[#e5a912]/50 transition-colors"
                >
                  <div>
                    <span className="block text-sm sm:text-base font-extrabold text-[#e5a912] font-chakra mb-1">
                      {event.time}
                    </span>
                    <h3 className="text-base font-bold text-white font-chakra mb-2">
                      {event.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 font-inter leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Grilla de Estructuras en el universo (4 cols x 2 rows) */}
          <section className="space-y-6 pt-4 border-t border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-white font-chakra">
                ESTRUCTURAS EN EL UNIVERSO
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-inter mt-1">
                Hacé click en cada estructura para ver más información
                detallada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {UNIVERSE_STRUCTURES.map((struct) => {
                const isHover = hoveredId === struct.id && mousePos !== null;

                return (
                  <div
                    key={struct.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpenModal(struct)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenModal(struct);
                      }
                    }}
                    onMouseMove={(e) => handleMouseMove(e, struct.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative aspect-16/10 bg-[#0c1022] rounded-none overflow-visible cursor-none group border border-white/20 hover:border-[#e5a912] transition-all duration-300 hover:z-30"
                  >
                    {/* Floating Tooltip following the cursor */}
                    {isHover && mousePos && (
                      <TooltipCursor
                        x={mousePos.x}
                        y={mousePos.y}
                        isNearRight={mousePos.isNearRight}
                      />
                    )}

                    {/* Background Image */}
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={struct.image}
                        alt={struct.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    </div>

                    {/* Name */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                      <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-chakra drop-shadow-md">
                        {struct.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Datos Curiosos */}
          <section className="space-y-6 pt-4 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-white font-chakra">
              DATOS CURIOSOS DEL COSMOS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FUN_FACTS.map((fact, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b1024] border border-white/10 p-6 flex flex-col justify-between hover:border-[#e5a912]/50 transition-colors"
                >
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#e5a912] font-chakra mb-2 block">
                    {fact.number}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 font-inter font-medium">
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Volver al inicio */}
          <div className="pt-8 pb-12 border-t border-white/10 flex justify-between items-center">
            <ActionButton href="/">← VOLVER AL INICIO</ActionButton>
          </div>
        </div>
      </main>

      <Footer />

      {/* Structure Modal */}
      <StructureModal
        structure={selectedStructure}
        structures={UNIVERSE_STRUCTURES}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectStructure={setSelectedStructure}
      />
    </div>
  );
}
