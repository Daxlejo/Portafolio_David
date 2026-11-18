"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/data/portfolio";
import { completeCommand, runCommand, type TermOutput } from "@/lib/terminal-commands";
import { toggleTheme } from "@/lib/theme";

type Line = { id: number; input?: string; out?: TermOutput };

const Prompt = () => (
  <span className="shrink-0">
    <span className="text-[#2dd4bf]">visitante@taller</span>
    <span className="text-[#64748b]">:~$ </span>
  </span>
);

function Out({ o }: { o: TermOutput }) {
  if (o.kind === "table") {
    return (
      <div className="grid gap-x-5 sm:grid-cols-[minmax(110px,auto)_1fr]">
        {o.rows.map((r) => (
          <div key={r.key} className="contents">
            <span className="text-[#2dd4bf]">{r.key}</span>
            <span className="break-words text-[#94a3b8]">{r.value}</span>
          </div>
        ))}
      </div>
    );
  }
  const tone = o.tone === "error" ? "text-[#f87171]" : o.tone === "muted" ? "text-[#94a3b8]" : o.tone === "accent" ? "text-[#2dd4bf]" : "";
  return <span className={tone}>{o.text}</span>;
}

/**
 * Terminal interactiva compartida por la vista clásica y el panel del taller.
 * `onGoto` recibe el id de una sección de la vista clásica (`proyectos`, `sobre-mi`…).
 */
export default function Terminal({
  onGoto,
  autoFocus = false,
  height = "h-80",
  quick = [],
}: {
  onGoto: (id: string) => void;
  autoFocus?: boolean;
  height?: string;
  quick?: string[];
}) {
  const nextId = useRef(2);
  const [lines, setLines] = useState<Line[]>([
    { id: 0, out: { kind: "text", text: "taller-shell v1.0 🚀", tone: "accent" } },
    { id: 1, out: { kind: "text", text: "Escribe help para ver los comandos. Tab autocompleta y ↑↓ recorre el historial.", tone: "muted" } },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const exec = (raw: string) => {
    const { output, effect } = runCommand(raw);
    if (effect === "clear") {
      setLines([]);
      return;
    }
    const mk = (l: Omit<Line, "id">): Line => ({ ...l, id: nextId.current++ });
    setLines((ls) => [...ls, mk({ input: raw }), ...output.map((o) => mk({ out: o }))]);
    if (!effect) return;
    if (effect === "theme") toggleTheme();
    else if (effect === "cv") window.open(PROFILE.cv, "_blank");
    else if (effect === "matrix") window.dispatchEvent(new Event("matrix"));
    else setTimeout(() => onGoto(effect.goto), 300);
  };

  const submit = () => {
    const raw = value;
    setValue("");
    setHIdx(-1);
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30));
    exec(raw);
  };

  return (
    <>
    <div
      className="overflow-hidden rounded-xl border border-[rgba(148,163,184,0.2)] bg-[#070b12] font-mono text-[13px] text-[#d1e7dd] shadow-[var(--shadow)]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
        <span className="ml-3 text-xs text-white/50">taller-shell — bash</span>
      </div>
      <div ref={bodyRef} className={`${height} space-y-1.5 overflow-y-auto p-4`} role="log" aria-live="polite">
        {lines.map((l) => (
          <div key={l.id} className="flex gap-1 break-words">
            {l.input !== undefined && <Prompt />}
            <div className="min-w-0 flex-1">{l.input !== undefined ? l.input : l.out && <Out o={l.out} />}</div>
          </div>
        ))}
        <div className="flex gap-1">
          <Prompt />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              else if (e.key === "ArrowUp") {
                e.preventDefault();
                const n = Math.min(hIdx + 1, history.length - 1);
                if (history[n] !== undefined) {
                  setHIdx(n);
                  setValue(history[n]);
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = hIdx - 1;
                setHIdx(Math.max(n, -1));
                setValue(n >= 0 ? history[n] : "");
              } else if (e.key === "Tab" && value) {
                const m = completeCommand(value);
                if (m) {
                  e.preventDefault();
                  setValue(m);
                }
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-[#e2e8f0] caret-[#2dd4bf] outline-none"
            aria-label="Comando de terminal"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
    {quick.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2">
        {quick.map((q) => (
          <button key={q} type="button" onClick={() => exec(q)} className="btn h-8 font-mono text-xs text-muted hover:text-accent">
            $ {q}
          </button>
        ))}
      </div>
    )}
    </>
  );
}

/** Botones de comandos rápidos (útiles en celular). */
export const QUICK_COMMANDS = ["help", "whoami", "proyectos", "stack", "matrix"];
