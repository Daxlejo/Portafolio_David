"use client";

import { LANGUAGES, SKILLS } from "@/data/portfolio";
import Reveal, { SectionTitle } from "./Reveal";

const GROUPS = ["Frontend", "Backend", "Datos", "DevOps & Arquitectura"];

function SkillItem({ name, icon, delay }: { name: string; icon?: string; delay: number }) {
  return (
    <div
      className="group flex items-center gap-3.5 rounded-xl border border-line bg-surface-2/40 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/80 hover:bg-surface-2 hover:shadow-[0_0_20px_var(--accent-soft)]"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface text-xl transition group-hover:scale-110 group-hover:border-accent">
        {icon}
      </span>
      <span className="font-medium text-sm text-fg transition group-hover:text-accent">{name}</span>
    </div>
  );
}

/** Sección adicional: habilidades técnicas, marquesina e idiomas (sin porcentajes arbitrarios). */
export default function Skills() {
  const marquee = [...SKILLS, ...SKILLS];

  return (
    <section id="habilidades" className="relative overflow-hidden bg-bg-2/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          kicker="06. extra"
          title="Tech Stack y Habilidades"
          subtitle="Conjunto de herramientas, lenguajes y metodologías aplicadas en soluciones mobile, web y de escritorio."
        />
      </div>

      {/* Marquesina infinita */}
      <div className="marquee mb-16 overflow-hidden py-2">
        <div className="marquee-track flex w-max gap-4">
          {marquee.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-4 transition hover:border-accent hover:text-accent"
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="whitespace-nowrap font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de habilidades por categoría */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {GROUPS.map((g, gi) => (
          <Reveal key={g} delay={gi * 100} className="rounded-2xl border border-line bg-surface p-6 transition hover:border-accent/60">
            <h3 className="mb-5 flex items-center gap-2 font-semibold text-fg">
              <span className="font-mono text-accent">0{gi + 1}.</span> {g}
            </h3>
            <div className="space-y-3">
              {SKILLS.filter((s) => s.group === g).map((s, i) => (
                <SkillItem key={s.name} name={s.name} icon={s.icon} delay={i * 80} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Idiomas */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-6 rounded-2xl border border-line bg-surface p-6 md:grid-cols-[auto_1fr] md:items-center">
          <h3 className="font-semibold text-fg">🌐 Idiomas</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {LANGUAGES.map((l) => (
              <div
                key={l.name}
                className="flex items-center justify-between rounded-xl border border-line bg-surface-2/40 px-4 py-3"
              >
                <span className="text-sm font-medium">{l.name}</span>
                <span className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 font-mono text-xs text-accent">
                  {l.level}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
