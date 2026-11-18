"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";
import { SocialLinks } from "./Hero";
import { ArrowUpIcon } from "./Icons";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    // El año se calcula en el navegador para que siempre sea el actual
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer id="footer" className="relative z-10 mt-10 border-t border-line">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-4 pt-[52px] pb-9 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <a href="#inicio" className="flex items-center gap-3 self-start">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent font-mono text-[15px] font-semibold text-accent-ink">
            {PROFILE.initials}
          </span>
          <span>
            <span className="block font-semibold">{PROFILE.fullName}</span>
            <span className="text-[12.5px] text-muted">Ingeniero de software · {PROFILE.location}</span>
          </span>
        </a>

        <nav aria-label="Enlaces del pie de página">
          <h2 className="kicker mb-3.5">{"// enlaces"}</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="text-muted transition-colors hover:text-accent">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="kicker mb-3.5">{"// sígueme"}</h2>
          <SocialLinks />
          <p className="mt-5 text-xs text-muted">
            Prueba <kbd className="rounded border border-line px-1">Ctrl</kbd> + <kbd className="rounded border border-line px-1">K</kbd> o el código Konami 🎮
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-[1180px] px-4 py-[18px] text-[12.5px] text-muted sm:px-6">
          <p>
            © <span suppressHydrationWarning>{year ?? ""}</span> {PROFILE.fullName}. Todos los derechos reservados.
          </p>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
        tabIndex={showTop ? 0 : -1}
        className={`btn btn-icon fixed right-5 bottom-5 z-40 transition-opacity ${showTop ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ArrowUpIcon />
      </button>
    </footer>
  );
}
