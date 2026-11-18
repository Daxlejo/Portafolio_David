"use client";

import { useRef, useState, type PointerEvent } from "react";
import { PROJECTS, type Project } from "@/data/portfolio";
import { GithubIcon } from "./Icons";
import Reveal, { SectionTitle } from "./Reveal";

const FILTERS = ["Todos", "Web", "Móvil", "IA", "Juegos"] as const;

/** Tarjeta con inclinación 3D y foco de luz que sigue al cursor. */
function ProjectCard({ p }: { p: Project }) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: PointerEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,border-color,box-shadow] duration-200 ease-out hover:border-accent/60 hover:shadow-[0_10px_40px_-10px_var(--glow)]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(400px circle at var(--mx) var(--my), var(--accent-soft), transparent 40%)" }}
      />
      {/* Imagen / miniatura */}
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${p.gradient}`}>
        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-yellow-300" />
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="ml-2 truncate rounded bg-black/20 px-2 py-0.5 font-mono text-[10px] text-white/80">
            {p.title.toLowerCase().replace(/\s+/g, "-")}.vercel.app
          </span>
        </div>
        <div className="grid h-full place-items-center pb-8 text-7xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
          {p.emoji}
        </div>
        <span className="absolute right-3 top-10 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
          {p.category}
        </span>
      </div>

      <div className="relative z-20 flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold transition group-hover:text-accent">{p.title}</h3>
        <p className="mt-2 text-sm text-muted">{p.description}</p>

        <p className="mt-4 font-mono text-xs text-accent">Soluciones</p>
        <ul className="mt-2 space-y-1">
          {p.solutions.map((s) => (
            <li key={s} className="flex gap-2 text-sm text-muted">
              <span className="text-accent">▹</span>
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span key={t} className="rounded-md bg-accent-soft px-2 py-1 font-mono text-[11px] text-accent">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-3 pt-6">
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-line py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent"
          >
            <GithubIcon className="h-4 w-4" /> GitHub
          </a>
          <a
            href={p.demo}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
          >
            ▲ Demo
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const list = filter === "Todos" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="proyectos" className="relative bg-bg-2/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle kicker="02. proyectos" title="Mis proyectos" subtitle="Lorem ipsum dolor sit amet, algunos de mis proyectos recientes." />

        <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => {
            const count = f === "Todos" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  filter === f ? "border-accent bg-accent text-black" : "border-line text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {f} <span className="ml-1 font-mono text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <div key={`${filter}-${p.title}`} className="animate-pop" style={{ animationDelay: `${i * 70}ms` }}>
              <ProjectCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
