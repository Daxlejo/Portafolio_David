"use client";

import { useCallback, useEffect, useState } from "react";
import { TESTIMONIALS } from "@/data/portfolio";
import Reveal, { SectionTitle } from "./Reveal";

/** Carrusel de testimonios con autoplay, flechas, puntos y gesto de deslizar. */
export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  const n = TESTIMONIALS.length;

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 5000);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <section id="testimonios" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle kicker="03. testimonios" title="Testimonios" subtitle="Lorem ipsum: lo que dicen quienes han trabajado conmigo." />

        <Reveal>
          <div
            className="relative mx-auto max-w-3xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX === null) return;
              const dx = e.changedTouches[0].clientX - touchX;
              if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
              setTouchX(null);
            }}
          >
            <div className="overflow-hidden rounded-3xl">
              <div className="flex transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ transform: `translateX(-${i * 100}%)` }}>
                {TESTIMONIALS.map((t, k) => (
                  <figure key={t.name} className="w-full shrink-0 px-1" aria-hidden={k !== i}>
                    <div className="relative rounded-3xl border border-line bg-surface p-8 sm:p-12">
                      <span className="absolute right-8 top-4 font-serif text-8xl leading-none text-accent/20">”</span>
                      <div className="mb-4 text-lg tracking-widest text-yellow-400" aria-label={`${t.rating} de 5 estrellas`}>
                        {"★".repeat(t.rating)}
                        <span className="text-muted/40">{"★".repeat(5 - t.rating)}</span>
                      </div>
                      <blockquote className="text-lg leading-relaxed sm:text-xl">“{t.text}”</blockquote>
                      <figcaption className="mt-8 flex items-center gap-4">
                        <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-accent bg-surface-2 text-3xl">{t.avatar}</span>
                        <span>
                          <span className="block font-semibold">{t.name}</span>
                          <span className="text-sm text-muted">{t.role}</span>
                        </span>
                        <span className="ml-auto font-mono text-xs text-muted">
                          {k + 1} / {n}
                        </span>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>

            <button onClick={() => go(i - 1)} aria-label="Anterior" className="absolute -left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface transition hover:border-accent hover:text-accent sm:grid md:-left-16">
              ←
            </button>
            <button onClick={() => go(i + 1)} aria-label="Siguiente" className="absolute -right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface transition hover:border-accent hover:text-accent sm:grid md:-right-16">
              →
            </button>

            <div className="mt-6 flex justify-center gap-2">
              {TESTIMONIALS.map((t, k) => (
                <button
                  key={t.name}
                  onClick={() => go(k)}
                  aria-label={`Ver testimonio ${k + 1}`}
                  className={`relative h-2 overflow-hidden rounded-full bg-line transition-all ${k === i ? "w-10" : "w-2"}`}
                >
                  {k === i && (
                    <span
                      key={`${i}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-accent"
                      style={{ animation: paused ? "none" : "grow-x 5s linear forwards", width: paused ? "100%" : undefined }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Mini-grid de avatares */}
        <Reveal className="mt-12 flex flex-wrap justify-center gap-3" delay={100}>
          {TESTIMONIALS.map((t, k) => (
            <button
              key={t.name}
              onClick={() => go(k)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${k === i ? "border-accent text-accent" : "border-line text-muted hover:border-accent"}`}
            >
              <span>{t.avatar}</span> {t.name}
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
