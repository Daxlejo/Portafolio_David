"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { closeSection } from "@/lib/workshop/actions";
import { SECTION_BY_ID, type SectionId } from "@/lib/workshop/sections";
import { useWorkshop } from "@/lib/workshop/store";
import { CloseIcon } from "../../Icons";
import AboutPanel from "../panels/AboutPanel";
import ContactPanel from "../panels/ContactPanel";
import ExperiencePanel from "../panels/ExperiencePanel";
import ProjectsPanel from "../panels/ProjectsPanel";
import SkillsPanel from "../panels/SkillsPanel";
import TerminalPanel from "../panels/TerminalPanel";
import TestimonialsPanel from "../panels/TestimonialsPanel";

const PANELS: Record<SectionId, ComponentType> = {
  sobre: AboutPanel,
  proyectos: ProjectsPanel,
  testimonios: TestimonialsPanel,
  experiencia: ExperiencePanel,
  habilidades: SkillsPanel,
  terminal: TerminalPanel,
  contacto: ContactPanel,
};

/** Panel de vidrio a la derecha (bottom sheet del 60 % en móvil). */
export default function SectionPanel() {
  const active = useWorkshop((s) => s.active);
  const [shown, setShown] = useState<SectionId | null>(active);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  // conserva el contenido durante la animación de salida
  if (active && active !== shown) setShown(active);

  useEffect(() => {
    if (active) {
      if (!trigger.current) trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      bodyRef.current?.scrollTo({ top: 0 });
      if (active !== "terminal") closeRef.current?.focus({ preventScroll: true });
    } else if (trigger.current) {
      // el foco vuelve al chip o etiqueta que abrió la sección
      const t = trigger.current;
      trigger.current = null;
      if (t.isConnected && t !== document.body) t.focus({ preventScroll: true });
    }
  }, [active]);

  const s = shown ? SECTION_BY_ID[shown] : null;
  const Body = shown ? PANELS[shown] : null;
  const titleId = "ws-panel-title";

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      data-open={!!active}
      inert={!active}
      className="ws-panel glass absolute top-0 right-0 bottom-0 z-[8] flex w-[min(470px,100%)] flex-col border-l border-line shadow-[var(--shadow)] backdrop-blur-[18px] max-[760px]:top-auto max-[760px]:left-0 max-[760px]:h-[60vh] max-[760px]:w-full max-[760px]:rounded-t-[20px] max-[760px]:border-t max-[760px]:border-l-0"
    >
      <header className="flex items-start justify-between gap-3 border-b border-line px-6 pt-[22px] pb-3.5">
        <div>
          <p className="kicker text-xs">{s?.kicker}</p>
          <h2 id={titleId} className="mt-1 text-2xl font-semibold">
            {s?.label}
          </h2>
        </div>
        <button ref={closeRef} type="button" onClick={closeSection} className="btn btn-icon" aria-label="Cerrar sección (Esc)">
          <CloseIcon />
        </button>
      </header>
      <div ref={bodyRef} className="flex-1 overflow-auto px-6 pt-5 pb-7 text-[14.5px] leading-[1.65]">
        {Body && <Body key={shown} />}
      </div>
    </aside>
  );
}
