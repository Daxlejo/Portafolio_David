"use client";

import Terminal, { QUICK_COMMANDS } from "./Terminal";
import Reveal, { SectionTitle } from "./Reveal";

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/** Sección adicional: terminal interactiva para explorar el portafolio con comandos. */
export default function TerminalPlayground() {
  return (
    <section id="playground" className="relative border-t border-line py-[72px] lg:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionTitle kicker="terminal" title="Terminal interactiva" subtitle="Sección adicional: explora el portafolio con comandos." />
        <Reveal className="max-w-[860px]">
          <Terminal onGoto={scrollTo} quick={QUICK_COMMANDS} />
        </Reveal>
      </div>
    </section>
  );
}
