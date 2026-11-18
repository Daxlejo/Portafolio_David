"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";
import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from "./Icons";

export default function Footer() {
  const [year, setYear] = useState(2026);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    // El año se actualiza solo
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const socials = [
    { href: PROFILE.github, icon: <GithubIcon />, label: "GitHub" },
    { href: PROFILE.linkedin, icon: <LinkedinIcon />, label: "LinkedIn" },
    { href: PROFILE.instagram, icon: <InstagramIcon />, label: "Instagram" },
    { href: `mailto:${PROFILE.email}`, icon: <MailIcon />, label: "Correo" },
  ];

  return (
    <footer id="footer" className="relative border-t border-line bg-bg-2">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <a href="#inicio" className="flex items-center gap-2 font-mono text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-accent/50 bg-accent-soft text-accent">{PROFILE.initials}</span>
            {PROFILE.firstName}
          </a>
          <p className="mt-4 max-w-xs text-sm text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.</p>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-sm text-accent">{"// enlaces"}</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="text-muted transition hover:pl-1 hover:text-accent">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-sm text-accent">{"// sígueme"}</h4>
          <div className="flex gap-3">
            {socials.map((s) => (
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
          <p className="mt-6 text-xs text-muted">
            Prueba <kbd className="rounded border border-line px-1">Ctrl</kbd> + <kbd className="rounded border border-line px-1">K</kbd> o el código Konami 🎮
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {PROFILE.firstName}. Todos los derechos reservados.
          </p>
          <p>
            Hecho con <span className="text-fg">Next.js</span> + <span className="text-fg">TypeScript</span> + <span className="text-fg">Tailwind CSS</span> · Desplegado en{" "}
            <span className="text-fg">Vercel</span> 💚
          </p>
        </div>
      </div>

      {/* Botón volver arriba */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
        className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-accent text-xl font-bold text-black shadow-[0_0_20px_var(--glow)] transition-all hover:-translate-y-1 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        ↑
      </button>
    </footer>
  );
}
