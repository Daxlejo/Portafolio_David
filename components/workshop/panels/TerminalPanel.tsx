"use client";

import { closeSection, openSection } from "@/lib/workshop/actions";
import { sectionFromHash } from "@/lib/workshop/sections";
import Terminal, { QUICK_COMMANDS } from "../../Terminal";

/** La misma terminal de la vista clásica; `ir <sección>` mueve la cámara. */
export default function TerminalPanel() {
  const go = (id: string) => {
    const s = sectionFromHash(id);
    if (s) openSection(s);
    else closeSection();
  };
  return <Terminal onGoto={go} autoFocus height="h-[min(46vh,360px)]" quick={QUICK_COMMANDS} />;
}
