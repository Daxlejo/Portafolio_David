"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article" | "figure" };

/** Revela su contenido (fade + translateY 18 px) cuando entra en pantalla. */
export default function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  return (
    <Tag ref={setRef} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}

/** Encabezado de sección: kicker en mono (~/id), título grande y subtítulo en muted. */
export function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mb-9 max-w-[660px]">
      <p className="kicker kicker-line">{`~/${kicker}`}</p>
      <h2 className="mt-1.5 mb-2 text-[28px] font-semibold tracking-tight sm:text-[34px] lg:text-[38px]">{title}</h2>
      {subtitle && <p className="leading-relaxed text-muted">{subtitle}</p>}
    </Reveal>
  );
}
