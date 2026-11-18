"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ABOUT, NAV_LINKS, PROFILE, PROJECTS, SKILLS } from "@/data/portfolio";
import { toggleTheme } from "@/lib/theme";
import Reveal, { SectionTitle } from "./Reveal";

type Line = { kind: "in" | "out"; content: ReactNode };

const COMMANDS: Record<string, string> = {
  help: "Muestra esta ayuda",
  whoami: "¿Quién soy?",
  about: "Un poco sobre mí",
  projects: "Lista de proyectos",
  skills: "Mis tecnologías",
  contact: "Cómo contactarme",
  goto: "Navega a una sección: goto proyectos",
  cv: "Descarga mi hoja de vida",
  theme: "Alterna tema claro / oscuro",
  matrix: "🕶️ ...",
  date: "Fecha y hora actual",
  clear: "Limpia la terminal",
};

const Prompt = () => (
  <span className="shrink-0">
    <span className="text-accent">visitante@lorem</span>
    <span className="text-muted">:</span>
    <span className="text-sky-400">~</span>
    <span className="text-muted">$ </span>
  </span>
);

/** Sección adicional: terminal interactiva para explorar el portafolio con comandos. */
export default function TerminalPlayground() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", content: <span className="text-accent">Bienvenido a lorem-shell v1.0.0 🚀</span> },
    { kind: "out", content: <span className="text-muted">Escribe <b className="text-fg">help</b> para ver los comandos disponibles. Usa Tab para autocompletar y ↑↓ para el historial.</span> },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const run = (raw: string): ReactNode | null => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    switch (cmd?.toLowerCase()) {
      case "":
        return null;
      case "help":
        return (
          <div className="grid gap-x-6 sm:grid-cols-[110px_1fr]">
            {Object.entries(COMMANDS).map(([k, v]) => (
              <div key={k} className="contents">
                <span className="text-accent">{k}</span>
                <span className="text-muted">{v}</span>
              </div>
            ))}
          </div>
        );
      case "whoami":
        return `${PROFILE.firstName} ${PROFILE.lastName} — ${PROFILE.roles[0]}`;
      case "about":
        return ABOUT.paragraphs[0];
      case "projects":
        return (
          <ul>
            {PROJECTS.map((p, i) => (
              <li key={p.title}>
                <span className="text-muted">[{i + 1}]</span> {p.emoji} <span className="text-accent">{p.title}</span>{" "}
                <span className="text-muted">— {p.tech.join(", ")}</span>
              </li>
            ))}
          </ul>
        );
      case "skills":
        return (
          <div className="space-y-0.5">
            {SKILLS.map((s) => (
              <div key={s.name} className="flex gap-3">
                <span className="w-28 shrink-0">{s.name}</span>
                <span className="text-accent">{"█".repeat(Math.round(s.level / 10))}</span>
                <span className="text-line">{"░".repeat(10 - Math.round(s.level / 10))}</span>
                <span className="text-muted">{s.level}%</span>
              </div>
            ))}
          </div>
        );
      case "contact":
        return (
          <div>
            <div>✉️ {PROFILE.email}</div>
            <div>📱 {PROFILE.phone}</div>
            <div>🐙 {PROFILE.github}</div>
          </div>
        );
      case "goto": {
        const target = NAV_LINKS.find((l) => l.id.startsWith((args[0] || "").toLowerCase()) || l.label.toLowerCase().startsWith((args[0] || "").toLowerCase()));
        if (!args[0] || !target) return <span className="text-red-400">Uso: goto [{NAV_LINKS.map((l) => l.id).join(" | ")}]</span>;
        setTimeout(() => document.getElementById(target.id)?.scrollIntoView({ behavior: "smooth" }), 300);
        return `Navegando a #${target.id} ...`;
      }
      case "cv":
        window.open("/cv.pdf", "_blank");
        return "📄 Abriendo cv.pdf ...";
      case "theme":
        toggleTheme();
        return "🌓 Tema cambiado.";
      case "matrix":
        window.dispatchEvent(new Event("matrix"));
        return "Follow the white rabbit 🐇";
      case "date":
        return new Date().toLocaleString("es-CO");
      case "sudo":
        return <span className="text-red-400">Lorem ipsum: permiso denegado. Buen intento 😏</span>;
      case "clear":
        setLines([]);
        return null;
      default:
        return (
          <span className="text-red-400">
            comando no encontrado: {cmd}. Escribe <b>help</b>.
          </span>
        );
    }
  };

  const submit = () => {
    const raw = value;
    setValue("");
    setHIdx(-1);
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30));
    if (raw.trim().toLowerCase() === "clear") {
      setLines([]);
      return;
    }
    const out = run(raw);
    setLines((ls) => [...ls, { kind: "in", content: raw }, ...(out ? [{ kind: "out" as const, content: out }] : [])]);
  };

  const quick = ["help", "whoami", "projects", "skills", "matrix"];

  return (
    <section id="playground" className="relative py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionTitle kicker="07. playground" title="Terminal interactiva" subtitle="Explora mi portafolio como un desarrollador: escribe comandos. Lorem ipsum dolor sit amet." />

        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-[#0b1116] font-mono text-sm text-[#d6e2dc] shadow-2xl glow" onClick={() => inputRef.current?.focus()}>
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-3 text-xs text-white/50">lorem-shell — bash — 80×24</span>
            </div>
            <div ref={bodyRef} className="h-80 space-y-1.5 overflow-y-auto p-5 [--fg:#e8f1ec] [--border:#24323c] [--muted:#8a9ba5] [--accent:#00ff41]">
              {lines.map((l, i) => (
                <div key={i} className="flex gap-1 break-words">
                  {l.kind === "in" && <Prompt />}
                  <div className="min-w-0 flex-1">{l.content}</div>
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
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      const n = Math.min(hIdx + 1, history.length - 1);
                      if (history[n] !== undefined) { setHIdx(n); setValue(history[n]); }
                    }
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      const n = hIdx - 1;
                      setHIdx(Math.max(n, -1));
                      setValue(n >= 0 ? history[n] : "");
                    }
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const m = Object.keys(COMMANDS).find((c) => c.startsWith(value.toLowerCase()));
                      if (m && value) setValue(m);
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent text-[#e8f1ec] caret-[#00ff41] outline-none"
                  aria-label="Comando de terminal"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => {
                  const out = run(q);
                  setLines((ls) => [...ls, { kind: "in", content: q }, ...(out ? [{ kind: "out" as const, content: out }] : [])]);
                }}
                className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-muted transition hover:border-accent hover:text-accent"
              >
                $ {q}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
