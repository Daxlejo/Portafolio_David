"use client";

import Image from "next/image";
import { openWorkshop } from "@/lib/workshop/store";
import { CubeIcon } from "../Icons";

/** Ventana estilo editor con una captura estática del taller y el botón para entrar. */
export default function WorkshopPreview() {
  return (
    <button
      type="button"
      onClick={openWorkshop}
      className="fx group mt-7 flex w-full max-w-[420px] items-stretch overflow-hidden rounded-[18px] border border-line bg-surface/70 text-left shadow-[var(--shadow)]"
      aria-label="Entrar al taller 3D"
    >
      {/* Tamaño fijo: la miniatura nunca se comprime dentro del flex. El degradado y el cubo quedan de respaldo si la imagen no carga. */}
      <span className="relative block aspect-[4/3] w-[148px] shrink-0 overflow-hidden bg-[linear-gradient(135deg,#0f766e_0%,#134e4a_45%,#b45309_100%)] sm:w-[168px]">
        <CubeIcon className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-white/70" />
        <Image
          src="/taller-preview.jpg"
          alt="Vista previa del taller 3D de David"
          fill
          sizes="220px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-between border-l border-line">
        <span className="flex items-center gap-1.5 border-b border-line px-3 py-2 font-mono text-xs text-muted">
          <i className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#f87171]" />
          <i className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#fbbf24]" />
          <i className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#34d399]" />
          <span className="ml-1.5 truncate">~/taller-de-david</span>
        </span>
        <span className="px-3 py-3">
          <span className="block text-sm font-medium">El taller de David</span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-accent">
            <CubeIcon className="h-4 w-4" /> Entrar al taller 3D →
          </span>
        </span>
      </span>
    </button>
  );
}
