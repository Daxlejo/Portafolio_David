"use client";

import { useEffect, useRef, useState } from "react";
import { ABOUT, PROFILE, SKILLS } from "@/data/portfolio";
import Reveal, { SectionTitle } from "./Reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="sobre-mi" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle kicker="01. sobre_mi" title="Sobre mí" subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />

        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* Tarjeta tipo código */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-line bg-surface font-mono text-sm shadow-xl">
              <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-muted">sobre-mi.ts</span>
              </div>
              <pre className="overflow-x-auto p-6 leading-7">
                <code>
                  <span className="text-pink-400">const</span> <span className="text-sky-400">yo</span> = {"{"}
                  {"\n"}  nombre: <span className="text-amber-300">&quot;{PROFILE.firstName}&quot;</span>,
                  {"\n"}  rol: <span className="text-amber-300">&quot;{PROFILE.roles[0]}&quot;</span>,
                  {"\n"}  ubicacion: <span className="text-amber-300">&quot;{PROFILE.location}&quot;</span>,
                  {"\n"}  stack: [
                  {SKILLS.slice(0, 4).map((s, i) => (
                    <span key={s.name}>
                      <span className="text-amber-300">&quot;{s.name}&quot;</span>
                      {i < 3 ? ", " : ""}
                    </span>
                  ))}
                  ],
                  {"\n"}  cafe: <span className="text-accent">Infinity</span>,
                  {"\n"}  aprendiendo: <span className="text-accent">true</span>,
                  {"\n"}
                  {"};"}
                  {"\n\n"}
                  <span className="text-muted">{"// Lorem ipsum dolor sit amet ✨"}</span>
                </code>
              </pre>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ABOUT.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-surface p-4 text-center transition hover:-translate-y-1 hover:border-accent">
                  <p className="text-2xl font-bold text-accent">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="flex items-center gap-5">
              {/* Foto / ilustración: reemplázala por una imagen en public/images */}
              <div className="border-spin shrink-0 rounded-2xl p-[2px]">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-surface-2 text-5xl">🙋‍♂️</div>
              </div>
              <h3 className="text-2xl font-semibold">
                Buenos días, tardes o noches. Soy <span className="text-accent">{PROFILE.firstName}</span>
              </h3>
            </div>
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-muted">
                {p}
              </p>
            ))}

            <h4 className="mt-8 mb-3 font-mono text-sm text-accent">{"> datos_rapidos"}</h4>
            <div className="flex flex-wrap gap-3">
              {ABOUT.facts.map((f) => (
                <span key={f.label} className="rounded-full border border-line bg-surface px-4 py-2 text-sm">
                  {f.icon} {f.label}
                </span>
              ))}
            </div>

            <h4 className="mt-8 mb-3 font-mono text-sm text-accent">{"> intereses"}</h4>
            <div className="flex flex-wrap gap-2">
              {ABOUT.interests.map((t, i) => (
                <span
                  key={t}
                  className="cursor-default rounded-lg bg-accent-soft px-3 py-1.5 text-sm text-accent transition hover:-translate-y-0.5 hover:bg-accent hover:text-black"
                  style={{ transitionDelay: `${i * 10}ms` }}
                >
                  #{t}
                </span>
              ))}
            </div>

            <h4 className="mt-8 mb-3 font-mono text-sm text-accent">{"> tecnologias"}</h4>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <span key={s.name} className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted">
                  {s.icon} {s.name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
