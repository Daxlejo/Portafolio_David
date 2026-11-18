"use client";

import { SECTION_BY_ID, type SectionId } from "./sections";
import { getWorkshop, say, setWorkshop } from "./store";

const replaceHash = (hash: string) => {
  try {
    history.replaceState(null, "", hash ? `#${hash}` : location.pathname + location.search);
  } catch {
    /* sin historial (iframe, etc.) */
  }
};

/** Abre una sección del taller: la cámara la enfoca, aparece el panel y el toast. */
export function openSection(id: SectionId) {
  const s = SECTION_BY_ID[id];
  if (!s) return;
  setWorkshop({ open: true, active: id, hovered: null });
  say(s.status);
  replaceHash(id);
}

export function closeSection() {
  if (!getWorkshop().active) return;
  setWorkshop({ active: null });
  replaceHash("");
}

/** Cierra el taller y muestra la vista clásica. */
export function showClassic() {
  setWorkshop({ open: false, active: null, hovered: null });
  replaceHash("clasica");
}
