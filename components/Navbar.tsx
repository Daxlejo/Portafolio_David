"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";
import { getTheme, toggleTheme, type Theme } from "@/lib/theme";

export default function Navbar() {
  const [active, setActive] = useState("inicio");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getTheme());
    const onTheme = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let cur = "inicio";
      for (const l of NAV_LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top < 160) cur = l.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("themechange", onTheme);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("themechange", onTheme);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-line shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="group flex items-center gap-2 font-mono text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-accent/50 bg-accent-soft text-accent transition group-hover:rotate-12">
            {PROFILE.initials}
          </span>
          <span className="hidden sm:inline">
            lorem<span className="text-accent">.dev</span>
          </span>
        </a>

        {/* Enlaces escritorio */}
        <ul className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`relative rounded-md px-3 py-2 text-sm transition hover:text-accent ${
                  active === l.id ? "text-accent" : "text-muted"
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent transition-transform duration-300 ${
                    active === l.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            className="hidden items-center gap-2 rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-muted transition hover:border-accent hover:text-accent md:flex"
            aria-label="Abrir paleta de comandos"
          >
            ⌘ <kbd>Ctrl K</kbd>
          </button>
          <button
            onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-lg transition hover:border-accent hover:rotate-45"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <a
            href="/cv.pdf"
            download
            className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 hover:shadow-[0_0_20px_var(--glow)] sm:inline-block"
          >
            CV ⬇
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line xl:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-fg transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-fg transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-fg transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        className={`glass overflow-hidden border-line transition-all duration-300 xl:hidden ${
          open ? "max-h-[500px] border-b" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col px-4 py-3">
          {NAV_LINKS.map((l, i) => (
            <li key={l.id} style={{ transitionDelay: `${i * 40}ms` }} className={`transition ${open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 ${active === l.id ? "bg-accent-soft text-accent" : "text-fg"}`}
              >
                <span className="mr-2 font-mono text-xs text-accent">0{i + 1}.</span>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/cv.pdf" download className="mt-2 block rounded-lg bg-accent px-3 py-2.5 text-center font-semibold text-black">
              Descargar CV ⬇
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
