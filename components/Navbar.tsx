"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";
import { toggleTheme, useTheme } from "@/lib/theme";
import { openWorkshop, useWorkshop } from "@/lib/workshop/store";
import { CubeIcon, MenuIcon, MoonIcon, SunIcon, CloseIcon } from "./Icons";

export default function Navbar() {
  const [active, setActive] = useState("inicio");
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const canOpenWorkshop = useWorkshop((s) => s.available);

  useEffect(() => {
    const onScroll = () => {
      let cur = "inicio";
      for (const l of NAV_LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top < 160) cur = l.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="glass sticky top-0 z-50 border-b border-line">
      <nav className="relative mx-auto flex h-[62px] max-w-[1180px] items-center gap-4 px-4 sm:px-6" aria-label="Secciones">
        <a href="#inicio" className="flex shrink-0 items-center gap-3 whitespace-nowrap" aria-label={`${PROFILE.fullName}, ir al inicio`}>
          <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-accent font-mono text-[13px] font-semibold text-accent-ink">
            {PROFILE.initials}
          </span>
          <span className="text-[15px] font-semibold">{PROFILE.shortName}</span>
        </a>

        {/* Enlaces escritorio */}
        <ul className="ml-auto hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={`rounded-lg px-2.5 py-[7px] text-[13.5px] whitespace-nowrap transition-colors ${
                  active === l.id ? "bg-accent-soft text-accent" : "text-muted hover:text-fg"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
          <button
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            className="btn hidden font-mono text-xs whitespace-nowrap text-muted md:inline-flex xl:hidden 2xl:inline-flex"
            aria-label="Abrir paleta de comandos"
          >
            <kbd>Ctrl K</kbd>
          </button>
          <button
            onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            className="btn btn-icon"
            aria-label={theme === "dark" ? "Cambiar a modo día" : "Cambiar a modo noche"}
            title="Día / noche"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          {canOpenWorkshop && (
            <button onClick={openWorkshop} className="btn whitespace-nowrap" title="Volver al taller 3D">
              <CubeIcon />
              <span className="hidden sm:inline">Taller 3D</span>
            </button>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="btn btn-icon xl:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-movil"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        className={`overflow-hidden border-line bg-bg transition-[max-height] duration-300 xl:hidden ${open ? "max-h-[520px] border-b" : "max-h-0"}`}
      >
        <ul className="flex flex-col px-4 pt-2 pb-4">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className={`block rounded-lg px-3 py-2.5 text-[15px] ${active === l.id ? "bg-accent-soft text-accent" : "text-fg"}`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={PROFILE.cv} download tabIndex={open ? 0 : -1} className="btn btn-accent mt-2 w-full">
              Descargar CV
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
