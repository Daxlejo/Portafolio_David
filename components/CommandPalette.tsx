"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";
import { toggleTheme } from "@/lib/theme";

type Cmd = { id: string; label: string; hint: string; icon: string; run: () => void };

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/** Paleta de comandos (Ctrl/⌘ + K) para navegar y ejecutar acciones rápidas. */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Cmd[] = useMemo(
    () => [
      ...NAV_LINKS.map((l) => ({ id: l.id, label: `Ir a ${l.label}`, hint: "Navegación", icon: "↪", run: () => go(l.id) })),
      { id: "cv", label: "Descargar CV", hint: "Acción", icon: "📄", run: () => window.open("/cv.pdf", "_blank") },
      { id: "theme", label: "Cambiar tema claro / oscuro", hint: "Acción", icon: "🌓", run: () => toggleTheme() },
      { id: "mail", label: "Copiar correo", hint: "Acción", icon: "✉️", run: () => navigator.clipboard?.writeText(PROFILE.email) },
      { id: "gh", label: "Abrir GitHub", hint: "Enlace", icon: "🐙", run: () => window.open(PROFILE.github, "_blank") },
      { id: "matrix", label: "Entrar a la Matrix", hint: "Secreto", icon: "🕶️", run: () => window.dispatchEvent(new Event("matrix")) },
      { id: "top", label: "Volver arriba", hint: "Navegación", icon: "⬆", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    ],
    []
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  if (!open) return null;

  const exec = (c?: Cmd) => {
    if (!c) return;
    setOpen(false);
    setTimeout(c.run, 50);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="animate-pop w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Paleta de comandos"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="text-accent">⌘</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === "Enter") exec(filtered[sel]);
            }}
            placeholder="Escribe un comando o busca una sección…"
            className="w-full bg-transparent py-4 text-fg outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Sin resultados para “{q}”</li>}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                onMouseEnter={() => setSel(i)}
                onClick={() => exec(c)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  i === sel ? "bg-accent-soft text-accent" : "text-fg"
                }`}
              >
                <span className="w-5 text-center">{c.icon}</span>
                <span className="flex-1">{c.label}</span>
                <span className="text-xs text-muted">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 border-t border-line px-4 py-2 font-mono text-[11px] text-muted">
          <span>↑↓ navegar</span>
          <span>↵ ejecutar</span>
          <span>Ctrl + K abrir/cerrar</span>
        </div>
      </div>
    </div>
  );
}
