"use client";

import { useRef, type PointerEvent } from "react";
import { PROJECTS, type Project } from "@/data/portfolio";
import { GithubIcon } from "./Icons";
import Reveal, { SectionTitle } from "./Reveal";

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
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[transform,border-color,box-shadow] duration-200 ease-out hover:border-accent/60 hover:shadow-[0_10px_40px_-10px_var(--glow)]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(500px circle at var(--mx) var(--my), var(--accent-soft), transparent 40%)" }}
      />
      {/* Imagen / miniatura */}
      <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${p.gradient}`}>
        <div className="flex items-center gap-1.5 bg-black/30 px-4 py-2.5 backdrop-blur-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-2 truncate rounded bg-black/25 px-2.5 py-0.5 font-mono text-xs text-white/90">
            estudy-ai.vercel.app
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-0.5 font-mono text-[11px] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            Proyecto Destacado
          </span>
        </div>
        <div className="grid h-full place-items-center pb-10 text-8xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
          {p.emoji}
        </div>
        <span className="absolute right-4 top-14 rounded-full bg-black/50 px-3 py-1 font-mono text-xs font-semibold text-white backdrop-blur">
          {p.category}
        </span>
      </div>

      <div className="relative z-20 flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-bold transition group-hover:text-accent sm:text-3xl">{p.title}</h3>
          <span className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 font-mono text-xs text-accent">
            IA & Educación
          </span>
        </div>
        <p className="mt-3 text-base text-muted">{p.description}</p>

        <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          // Soluciones y Características Clave
        </p>
        <ul className="mt-3 space-y-2">
          {p.solutions.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="text-accent mt-0.5">▹</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span key={t} className="rounded-lg bg-accent-soft px-3 py-1.5 font-mono text-xs text-accent">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 flex gap-4 pt-4 border-t border-line">
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            <GithubIcon className="h-4 w-4" /> Código en GitHub
          </a>
          <a
            href={p.demo}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-black transition hover:brightness-110 hover:shadow-[0_0_20px_var(--glow)]"
          >
            ▲ Ver Demo en Vivo
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const project = PROJECTS[0];

  return (
    <section id="proyectos" className="relative bg-bg-2/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          kicker="02. proyectos"
          title="Mis proyectos"
          subtitle="Soluciones de software innovadoras, efectivas y fundamentadas en Clean Architecture."
        />

        <div className="mx-auto max-w-2xl">
          <Reveal>
            <ProjectCard p={project} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
