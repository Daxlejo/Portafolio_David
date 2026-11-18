"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getTheme, type Theme } from "@/lib/theme";
import { closeSection, openSection } from "@/lib/workshop/actions";
import { rt } from "@/lib/workshop/runtime";
import { sectionFromHash } from "@/lib/workshop/sections";
import { getWorkshop, setWorkshop, useWorkshop } from "@/lib/workshop/store";
import { instantDay } from "./DayCycle";
import Tags from "./Tags";
import SectionDock from "./ui/SectionDock";
import SectionPanel from "./ui/SectionPanel";
import StatusToast from "./ui/StatusToast";
import TopBar from "./ui/TopBar";

// three / R3F solo se cargan en el navegador y solo si el taller se usa
const WorkshopCanvas = dynamic(() => import("./WorkshopCanvas"), { ssr: false });

const BOOT = ["iniciando taller…", "✓ encendiendo lámpara", "✓ conectando servidores", "✓ abriendo editor", "✓ listo"];

/** Pantalla de arranque mientras se descarga la escena. */
function Boot({ done }: { done: boolean }) {
  const [n, setN] = useState(1);
  useEffect(() => {
    if (n >= BOOT.length) return;
    const t = setTimeout(() => setN((x) => x + 1), 190);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div
      aria-hidden
      className={`absolute inset-0 z-[30] grid place-items-center bg-[#060a12] text-[#cbd5e1] transition-opacity duration-700 ${done && n >= BOOT.length ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <pre className="min-w-[280px] font-mono text-[13px] leading-[1.8]">
        {BOOT.slice(0, n).map((l) => (
          <span key={l} className="block">
            {l.startsWith("✓") ? (
              <>
                <span className="text-[#2dd4bf]">✓</span>
                {l.slice(1)}
              </>
            ) : (
              l
            )}
          </span>
        ))}
      </pre>
    </div>
  );
}

/**
 * Capa fija a pantalla completa con el taller 3D. La vista clásica sigue en el DOM
 * debajo (SSR, SEO, lectores de pantalla). Visibilidad controlada por `html[data-workshop]`.
 */
export default function WorkshopOverlay() {
  const open = useWorkshop((s) => s.open);
  const active = useWorkshop((s) => s.active);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  // arranque: el script de <head> ya decidió si se abre
  useEffect(() => {
    const d = document.documentElement;
    rt.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (getTheme() === "light") {
      rt.dayP = 1;
      setWorkshop({ mode: "day" });
    }
    const available = d.dataset.webgl === "1";
    const startOpen = available && d.dataset.workshop === "open";
    setWorkshop({ available, open: startOpen });
    const sec = sectionFromHash(location.hash);
    if (startOpen && sec) {
      const t = setTimeout(() => openSection(sec), rt.reduce ? 0 : 1500);
      return () => clearTimeout(t);
    }
  }, []);

  // sincroniza el atributo del <html>, el scroll y el canvas
  useEffect(() => {
    const d = document.documentElement;
    if (getWorkshop().available) d.dataset.workshop = open ? "open" : "closed";
    window.dispatchEvent(new Event("workshopchange"));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setMounted(true);
  }, [open]);

  // pausa el render con la pestaña oculta
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // tema compartido con la vista clásica
  useEffect(() => {
    const toMode = (t: Theme) => (t === "light" ? "day" : "night");
    const onRequest = (e: Event) => setWorkshop({ mode: toMode((e as CustomEvent<Theme>).detail) });
    const onChange = (e: Event) => {
      const m = toMode((e as CustomEvent<Theme>).detail);
      if (getWorkshop().mode === m) return;
      instantDay.next = true; // cambió desde la vista clásica: sin transición
      setWorkshop({ mode: m });
    };
    window.addEventListener("themerequest", onRequest);
    window.addEventListener("themechange", onChange);
    return () => {
      window.removeEventListener("themerequest", onRequest);
      window.removeEventListener("themechange", onChange);
    };
  }, []);

  // Esc cierra la sección abierta
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && getWorkshop().active) closeSection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="ws-root" role="region" aria-label="Taller 3D interactivo" aria-hidden={!open} inert={!open} data-panel={active ? "open" : "closed"}>
      <h2 className="sr-only">
        Portafolio interactivo de David Alejandro Cabezas Perez: un taller isométrico con un ingeniero trabajando en su escritorio. Cada objeto abre una sección.
      </h2>
      {mounted && <WorkshopCanvas running={open && visible} onReady={() => setReady(true)} />}
      <Tags />
      <TopBar />
      <SectionDock />
      <SectionPanel />
      <StatusToast />
      <Boot done={ready} />
    </div>
  );
}
