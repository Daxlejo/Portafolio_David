"use client";

import { useEffect, useRef } from "react";
import { PROFILE } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon, MailIcon } from "./Icons";

/** Red de partículas interactiva que reacciona al cursor. */
function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999 };
    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.floor((w * h) / 14000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));
    };

    const color = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#00ff41";
    let c = color();
    const onTheme = () => setTimeout(() => (c = color()), 50);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          p.x += (dx / d) * 1.5;
          p.y += (dy / d) * 1.5;
        }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.globalAlpha = (1 - d / 130) * 0.35;
            ctx.strokeStyle = c;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = c;
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -999; };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("themechange", onTheme);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("themechange", onTheme);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

export default function Hero() {
  return (
    <section id="inicio" className="relative -mt-16 flex min-h-screen items-center overflow-hidden pt-16">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <ParticleField />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent-2/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div className="text-center lg:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-1.5 font-mono text-xs text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Disponible para nuevos retos
          </p>
          <p className="mb-2 text-lg text-muted">👋 Hola que tal, soy</p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
            {PROFILE.firstName}
            <br />
            <span className="text-gradient">{PROFILE.lastName}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted lg:mx-0 sm:text-lg">
            {PROFILE.tagline}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <a
              href="/cv.pdf"
              download
              className="group relative overflow-hidden rounded-xl bg-accent px-7 py-3.5 font-semibold text-black transition hover:scale-105 hover:shadow-[0_0_30px_var(--glow)]"
            >
              <span className="relative z-10">⬇ Descargar CV</span>
              <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-500 group-hover:translate-x-full" />
            </a>
            <a
              href="#proyectos"
              className="rounded-xl border border-accent/60 px-7 py-3.5 font-semibold text-accent transition hover:bg-accent-soft"
            >
              Ver proyectos →
            </a>
          </div>

          <div className="mt-8 flex justify-center gap-3 lg:justify-start">
            {[
              { href: PROFILE.github, icon: <GithubIcon />, label: "GitHub" },
              { href: PROFILE.linkedin, icon: <LinkedinIcon />, label: "LinkedIn" },
              { href: `mailto:${PROFILE.email}`, icon: <MailIcon />, label: "Correo" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-xl border border-line text-muted transition hover:-translate-y-1 hover:border-accent hover:text-accent"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Avatar */}
        <div className="relative mx-auto w-64 sm:w-80">
          <div className="animate-float">
            <div className="border-spin rounded-full p-1">
              <div className="grid aspect-square place-items-center rounded-full bg-gradient-to-br from-surface-2 to-surface text-[7rem] sm:text-[9rem]">
                👨‍💻
              </div>
            </div>
          </div>
          <span className="glass absolute -left-6 top-8 animate-float rounded-xl border border-line px-3 py-2 font-mono text-xs text-accent [animation-delay:-2s]">
            {"<CleanArchitecture />"}
          </span>
          <span className="glass absolute -right-4 top-1/2 animate-float rounded-xl border border-line px-3 py-2 font-mono text-xs [animation-delay:-4s]">
            ⚡ mobile & web
          </span>
          <span className="glass absolute bottom-4 left-0 animate-float rounded-xl border border-line px-3 py-2 font-mono text-xs [animation-delay:-1s]">
            🚀 desktop: <span className="text-accent">ready</span>
          </span>
        </div>
      </div>

      <a href="#sobre-mi" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted md:flex" aria-label="Bajar">
        scroll
        <span className="flex h-9 w-5 justify-center rounded-full border-2 border-muted pt-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-accent" />
        </span>
      </a>
    </section>
  );
}
