"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

type Props = { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article" };

/** Revela su contenido con una animación cuando entra en pantalla. */
export default function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}

export function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mb-14 text-center">
      <p className="mb-3 font-mono text-sm text-accent">{`// ${kicker}`}</p>
      <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
        {title}
        <span className="text-accent">.</span>
      </h2>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>}
      <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-accent to-accent-2" />
    </Reveal>
  );
}
