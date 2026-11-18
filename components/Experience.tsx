"use client";

import { useState } from "react";
import { EXPERIENCES } from "@/data/portfolio";
import Reveal, { SectionTitle } from "./Reveal";

const TABS = [
  { key: "academica", label: "Académica", icon: "🎓" },
  { key: "laboral", label: "Laboral", icon: "💼" },
] as const;

export default function Experience() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("academica");
  const items = EXPERIENCES.filter((e) => e.type === tab);

  return (
    <section id="experiencia" className="relative bg-bg-2/60 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionTitle kicker="04. experiencia" title="Experiencia" subtitle="Mi trayectoria académica y profesional · lorem ipsum dolor." />

        <Reveal className="mb-12 flex justify-center">
          <div className="relative grid grid-cols-2 rounded-full border border-line bg-surface p-1">
            <span
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent transition-transform duration-300"
              style={{ transform: tab === "laboral" ? "translateX(100%)" : "none" }}
            />
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative z-10 rounded-full px-6 py-2.5 text-sm font-medium transition sm:px-10 ${tab === t.key ? "text-black" : "text-muted hover:text-fg"}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <ol key={tab} className="relative ml-3 border-l-2 border-line sm:ml-6">
          {items.map((e, i) => (
            <li key={e.title} className="animate-pop relative mb-10 pl-8 last:mb-0 sm:pl-12" style={{ animationDelay: `${i * 120}ms` }}>
              <span className="absolute -left-[9px] top-1.5 flex h-4 w-4">
                {i === 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />}
                <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-bg bg-accent" />
              </span>
              <div className="group rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/60">
                <span className="inline-block rounded-full bg-accent-soft px-3 py-1 font-mono text-xs text-accent">{e.period}</span>
                <h3 className="mt-3 text-xl font-semibold transition group-hover:text-accent">{e.title}</h3>
                <p className="text-sm text-muted">{e.place}</p>
                <ul className="mt-4 space-y-1.5">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted">
                      <span className="text-accent">▹</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
