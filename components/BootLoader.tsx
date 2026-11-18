"use client";

import { useEffect, useState } from "react";

const LINES = [
  "> iniciando taller…",
  "> ✓ encendiendo lámpara",
  "> ✓ conectando servidores",
  "> ✓ abriendo editor",
  "> ✓ cargando proyectos",
  "> listo. ¡Bienvenido!",
];

/** Pantalla de arranque estilo terminal (solo la primera visita de la sesión). */
export default function BootLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("booted")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const DUR = 2200;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(100, ((now - start) / DUR) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(step);
      else {
        sessionStorage.setItem("booted", "1");
        setTimeout(() => setHiding(true), 250);
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
        }, 900);
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  const skip = () => {
    sessionStorage.setItem("booted", "1");
    setVisible(false);
    document.body.style.overflow = "";
  };

  if (!visible) return null;

  const shown = Math.floor((progress / 100) * LINES.length);
  const blocks = Math.round((progress / 100) * 24);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg-2 px-4 transition-all duration-700 ${
        hiding ? "pointer-events-none scale-110 opacity-0 blur-sm" : ""
      }`}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface font-mono text-sm shadow-[var(--shadow)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#f87171]" />
          <span className="h-3 w-3 rounded-full bg-[#fbbf24]" />
          <span className="h-3 w-3 rounded-full bg-[#34d399]" />
          <span className="ml-3 text-xs text-muted">david@taller — arranque</span>
          <button onClick={skip} className="ml-auto text-xs text-muted hover:text-accent">
            saltar ⏭
          </button>
        </div>
        <div className="min-h-56 space-y-1.5 p-5">
          {LINES.slice(0, shown + 1).map((l, i) => (
            <p key={i} className={i === LINES.length - 1 ? "text-accent" : "text-fg/80"}>
              {l}
            </p>
          ))}
          <p className="pt-3 text-accent">
            [{"█".repeat(blocks)}
            {".".repeat(24 - blocks)}] {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}
