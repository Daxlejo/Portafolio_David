"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ABOUT, type AboutIcon } from "@/data/portfolio";
import { LangIcon, LayoutIcon, PauseIcon, PlayIcon, ServerIcon, SparkIcon, TrophyIcon } from "./Icons";
import Reveal, { SectionTitle } from "./Reveal";

const ICONS: Record<AboutIcon, (p: { className?: string }) => React.ReactElement> = {
  server: ServerIcon,
  layout: LayoutIcon,
  spark: SparkIcon,
  lang: LangIcon,
};

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Número que cuenta hasta su valor cuando entra en pantalla. */
export function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reducedMotion()) {
        setN(value);
        return;
      }
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1200);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

/** Clip vertical del corte: sin sonido, en bucle cuando es visible y con botón play/pausa. */
export function BarberClip({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    const w = wrap.current;
    if (!v || !w || reducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(w);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div ref={wrap} className={`group/clip relative overflow-hidden rounded-[14px] border-2 border-line bg-black ${className}`}>
      <video
        ref={video}
        src={ABOUT.barber.video}
        poster={ABOUT.barber.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Video de un corte de cabello hecho por David"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar video del corte" : "Reproducir video del corte"}
        className={`absolute inset-0 grid place-items-center text-white transition ${
          playing ? "bg-transparent opacity-0 group-hover/clip:bg-black/20 group-hover/clip:opacity-100 focus-visible:opacity-100" : "bg-black/20"
        }`}
      >
        {playing ? <PauseIcon className="h-6 w-6 drop-shadow" /> : <PlayIcon className="h-6 w-6 drop-shadow" />}
      </button>
    </div>
  );
}

export default function About() {
  const B = ABOUT.barber;
  return (
    <section id="sobre-mi" className="relative border-t border-line py-[72px] lg:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionTitle kicker="sobre-mi" title="Sobre mí" subtitle="Quién soy, cómo trabajo y qué hago fuera del código." />

        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            {ABOUT.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mb-3.5 leading-[1.8]">
                {p}
              </p>
            ))}

            <h3 className="kicker mt-6 mb-2.5">{"// datos rápidos"}</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {ABOUT.facts.map((f) => (
                <li key={f.label} className="flex items-center gap-2 text-sm text-muted">
                  <span aria-hidden>{f.icon}</span> {f.label}
                </li>
              ))}
            </ul>

            <h3 className="kicker mt-6 mb-2.5">{"// intereses"}</h3>
            <div className="flex flex-wrap gap-1.5">
              {ABOUT.interests.map((t) => (
                <span key={t} className="pill">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {ABOUT.cards.map((c, i) => {
              const Ico = ICONS[c.icon];
              return (
                <Reveal key={c.title} delay={i * 70} className="fx card rounded-2xl p-4">
                  <span className="icard-ic mb-2.5 grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-accent-soft text-accent">
                    <Ico className="h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-[15px] font-semibold">{c.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-muted">{c.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Estadísticas */}
        <Reveal className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {ABOUT.stats.map((s) => (
            <div key={s.label} className="fx card group rounded-[14px] px-4 py-3.5">
              <b className="block text-[26px] leading-tight font-semibold transition-colors group-hover:text-accent">
                <Counter value={s.value} suffix={s.suffix} />
              </b>
              <span className="text-[12.5px] text-muted">{s.label}</span>
            </div>
          ))}
        </Reveal>

        {/* Franja compacta: fuera del código */}
        <Reveal as="figure" className="fx card mt-7 grid items-center gap-[22px] rounded-[20px] p-4 md:min-h-[165px] md:grid-cols-[auto_1fr] md:pr-[22px]">
          <div className="flex gap-2.5">
            <Image
              src={B.photo}
              alt="Diploma y medalla de primer puesto en Mi primera Batalla de Barbería, Don Juan Academia"
              width={132}
              height={132}
              className="aspect-square w-full flex-1 rounded-[14px] object-cover transition-transform duration-500 md:h-[132px] md:w-[132px] md:flex-none"
            />
            <BarberClip className="aspect-[9/16] w-[38%] md:h-[132px] md:w-[76px]" />
          </div>
          <figcaption>
            <p className="kicker text-xs">{"// fuera del código"}</p>
            <h3 className="mt-1 mb-1.5 flex flex-wrap items-center gap-2.5 text-[17px] font-semibold">
              ✂️ {B.title}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5b04c] px-2.5 py-1 text-[11.5px] font-semibold text-[#3b2304]">
                <TrophyIcon className="h-[13px] w-[13px]" /> {B.award}
              </span>
            </h3>
            <p className="max-w-[720px] text-sm leading-[1.65] text-muted">{B.text}</p>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
