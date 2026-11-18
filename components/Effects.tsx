"use client";

import { useEffect, useRef, useState } from "react";

/** Barra de progreso de lectura en la parte superior. */
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
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-accent-2 to-accent"
      style={{ boxShadow: "0 0 10px var(--glow)" }}
    />
  );
}

/** Halo de luz que sigue al cursor (solo en dispositivos con puntero fino). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current!;
    el.style.opacity = "1";
    const move = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full opacity-0 transition-opacity duration-500"
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
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const size = 16;
    const cols = Math.floor(c.width / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const chars = "アイウエオカキクケコ01LOREMIPSUM{}<>/=";
    const id = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#00ff41";
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
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-5 py-2 font-mono text-sm text-[#00ff41]">
        🕶️ Wake up, Lorem… (clic para salir)
      </p>
    </div>
  );
}
