"use client";

import { useEffect, useRef, useState } from "react";

/** Barra de progreso de lectura (teal → ámbar) en la parte superior. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-accent to-warm"
    />
  );
}

/** Halo de luz que sigue al cursor (solo en dispositivos con puntero fino). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "1";
    const move = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0 h-[500px] w-[500px] rounded-full opacity-0 transition-opacity duration-500"
      style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 65%)" }}
    />
  );
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Easter egg: código Konami → lluvia estilo Matrix durante unos segundos. */
export function KonamiMatrix() {
  const [on, setOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      pos = e.key === KONAMI[pos] ? pos + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        setOn(true);
      }
    };
    const onEvt = () => setOn(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("matrix", onEvt);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("matrix", onEvt);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2dd4bf";
    const size = 16;
    const cols = Math.floor(c.width / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const chars = "アイウエオカキクケコ01DAVIDTALLER{}<>/=";
    const id = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = accent;
      ctx.font = `${size}px monospace`;
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
        drops[i] = y * size > c.height && Math.random() > 0.97 ? 0 : y + 1;
      });
    }, 40);
    const t = setTimeout(() => setOn(false), 6000);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div className="fixed inset-0 z-[90] cursor-pointer" onClick={() => setOn(false)}>
      <canvas ref={canvasRef} className="h-full w-full bg-black/80" />
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-5 py-2 font-mono text-sm text-[#2dd4bf]">
        🕶️ Despierta, visitante… (clic para salir)
      </p>
    </div>
  );
}

/** Actualiza --mx/--my en la tarjeta .fx bajo el cursor (foco radial que sigue al mouse). */
export function FxTracker() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const el = target?.closest<HTMLElement>(".fx");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return null;
}

/**
 * Fondo de constelación de la vista clásica: nodos teal (y algunos ámbar) que se
 * mueven despacio, unidos por líneas cercanas y al cursor. Estático con reduced motion.
 */
export function ConstellationBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type N = { x: number; y: number; vx: number; vy: number; w: boolean };
    let nodes: N[] = [];
    let raf = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999 };
    let acc = "#2dd4bf";
    let warm = "#f5b04c";
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      acc = cs.getPropertyValue("--accent").trim() || acc;
      warm = cs.getPropertyValue("--warm").trim() || warm;
    };

    const draw = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);
      if (!reduce) {
        for (const p of nodes) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
      }
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 150) {
            ctx.strokeStyle = acc;
            ctx.globalAlpha = (1 - d / 150) * 0.28;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 200) {
          ctx.strokeStyle = warm;
          ctx.globalAlpha = (1 - dm / 200) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = a.w ? warm : acc;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.w ? 1.8 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const d = Math.min(window.devicePixelRatio, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W * d;
      canvas.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(90, (W * H) / 16000));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        w: Math.random() < 0.18,
      }));
      draw();
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };
    // Se pausa cuando la pestaña está oculta o el taller 3D cubre la página
    const sync = () => {
      const shouldRun = !reduce && !document.hidden && document.documentElement.dataset.workshop !== "open";
      if (shouldRun && !running) {
        running = true;
        loop();
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (reduce) draw();
    };
    const onLeave = () => {
      mouse.x = -9999;
    };
    const onTheme = () =>
      setTimeout(() => {
        readColors();
        if (!running) draw();
      }, 30);

    readColors();
    resize();
    sync();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("themechange", onTheme);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("workshopchange", sync);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("themechange", onTheme);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("workshopchange", sync);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-55" />
      <div aria-hidden className="halos" />
    </>
  );
}
