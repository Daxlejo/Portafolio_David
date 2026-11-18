"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Aplica el tema sin animación y avisa al resto de la página (evento `themechange`). */
export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* almacenamiento bloqueado: el tema solo dura esta visita */
  }
  window.dispatchEvent(new CustomEvent<Theme>("themechange", { detail: next }));
}

/**
 * Pide un cambio de tema. Si el taller 3D está abierto, él se encarga de la
 * transición noche/día (evento `themerequest`); si no, se usa la transición circular.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  if (document.documentElement.dataset.workshop === "open") {
    window.dispatchEvent(new CustomEvent<Theme>("themerequest", { detail: next }));
    return;
  }
  const apply = () => setTheme(next);

  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const t = doc.startViewTransition(apply);
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 600, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
    );
  });
}

function subscribe(cb: () => void) {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
}

/** Tema actual, sincronizado con el evento `themechange`. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "dark");
}
