"use client";

import { openWorkshop, useWorkshop } from "@/lib/workshop/store";
import { CubeIcon } from "../Icons";

/** Ventana estilo editor con una captura del taller y el botón para entrar. */
export default function WorkshopPreview() {
  const preview = useWorkshop((s) => s.preview);
  const src = preview ?? "/taller-preview.jpg";

  return (
    <button
      type="button"
      onClick={openWorkshop}
      className="fx group mt-7 flex w-full max-w-[420px] items-stretch overflow-hidden rounded-[18px] border border-line bg-surface/70 text-left shadow-[var(--shadow)]"
      aria-label="Entrar al taller 3D"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- puede ser una data URL generada en el navegador */}
      <img src={src} alt="" width={168} height={126} className="aspect-[4/3] w-[148px] shrink-0 object-cover sm:w-[168px]" />
      <span className="flex min-w-0 flex-1 flex-col justify-between border-l border-line">
        <span className="flex items-center gap-1.5 border-b border-line px-3 py-2 font-mono text-xs text-muted">
          <i className="h-[9px] w-[9px] rounded-full bg-[#f87171]" />
          <i className="h-[9px] w-[9px] rounded-full bg-[#fbbf24]" />
          <i className="h-[9px] w-[9px] rounded-full bg-[#34d399]" />
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
