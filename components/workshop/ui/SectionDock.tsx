"use client";

import { openSection } from "@/lib/workshop/actions";
import { SECTIONS } from "@/lib/workshop/sections";
import { useWorkshop } from "@/lib/workshop/store";

/** Dock inferior: pista y chips de secciones (mismo orden que la vista clásica). */
export default function SectionDock() {
  const active = useWorkshop((s) => s.active);

  return (
    <nav
      aria-label="Secciones del taller"
      className={`absolute bottom-5 left-1/2 z-[6] flex w-[min(980px,calc(100%-24px))] -translate-x-1/2 flex-col items-center gap-2.5 transition-opacity duration-300 ${
        active ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      inert={!!active}
    >
      <p className="glass flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[12.5px] text-muted">
        <span aria-hidden>✦</span>
        <span className="max-[760px]:hidden">Pasa el cursor por los objetos del taller o elige una sección</span>
        <span className="hidden max-[760px]:inline">Toca los objetos, desliza para mirar o elige una sección</span>
      </p>
      <div className="no-scrollbar flex w-full justify-center gap-2 max-[760px]:justify-start max-[760px]:overflow-x-auto max-[760px]:pb-1 min-[761px]:flex-wrap">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => openSection(s.id)}
            data-section={s.id}
            className={`glass h-[38px] shrink-0 cursor-pointer rounded-full border px-[15px] text-[13.5px] transition-colors hover:border-accent hover:text-accent ${
              active === s.id ? "border-accent text-accent" : "border-line"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
