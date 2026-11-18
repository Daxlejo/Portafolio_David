"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES, SKILLS } from "@/data/portfolio";
import Reveal, { SectionTitle } from "./Reveal";

const GROUPS = ["Frontend", "Backend", "Datos", "DevOps"];

function Bar({ name, level, icon, delay }: { name: string; level: number; icon?: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div className="mb-1.5 flex justify-between text-sm">
        <span>
          {icon && <span className="mr-1.5">{icon}</span>}
          {name}
        </span>
        <span className="font-mono text-xs text-accent">{level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-accent-2 to-accent transition-[width] duration-[1400ms] ease-out"
          style={{ width: on ? `${level}%` : "0%", transitionDelay: `${delay}ms` }}
        >
          <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--glow)]" />
        </div>
      </div>
    </div>
  );
}

/** Sección adicional: habilidades técnicas, marquesina e idiomas. */
export default function Skills() {
  const marquee = [...SKILLS, ...SKILLS];

  return (
    <section id="habilidades" className="relative overflow-hidden bg-bg-2/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle kicker="06. extra" title="Tech Stack y Habilidades" subtitle="Lorem ipsum dolor sit amet, mi conjunto de habilidades y tecnologías modernas." />
      </div>

      {/* Marquesina infinita */}
      <div className="marquee mb-16 overflow-hidden py-2">
        <div className="marquee-track flex w-max gap-4">
          {marquee.map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-4 transition hover:border-accent hover:text-accent">
              <span className="text-2xl">{s.icon}</span>
              <span className="whitespace-nowrap font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {GROUPS.map((g, gi) => (
          <Reveal key={g} delay={gi * 100} className="rounded-2xl border border-line bg-surface p-6 transition hover:border-accent/60">
            <h3 className="mb-5 flex items-center gap-2 font-semibold">
              <span className="font-mono text-accent">0{gi + 1}</span> {g}
            </h3>
            <div className="space-y-5">
              {SKILLS.filter((s) => s.group === g).map((s, i) => (
                <Bar key={s.name} name={s.name} level={s.level} icon={s.icon} delay={i * 150} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-6 rounded-2xl border border-line bg-surface p-6 md:grid-cols-[auto_1fr] md:items-center">
          <h3 className="font-semibold">🌐 Idiomas</h3>
          <div className="grid gap-5 sm:grid-cols-3">
            {LANGUAGES.map((l, i) => (
              <Bar key={l.name} name={l.name} level={l.level} delay={i * 150} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
