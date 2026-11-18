import type { SectionId } from "./sections";

/**
 * Valores que cambian en cada fotograma. Viven fuera de React para que
 * `useFrame` los lea sin provocar renders.
 */
export const rt = {
  /** 0 = noche, 0.5 = amanecer, 1 = día */
  dayP: 0,
  /** Transición día/noche en curso */
  dayAnim: null as null | { from: number; to: number; t0: number },
  /** Momento (ms) desde el que el personaje mira a la ventana */
  lookWindowUntil: 0,
  /** Sección activa (copia de la del store para el bucle) */
  active: null as SectionId | null,
  /** Caracteres escritos en el monitor */
  typed: 60,
  reduce: false,
  /** Arrastre horizontal para mirar */
  pan: 0,
  dragged: false,
  /** Posición normalizada del mouse (-0.5…0.5) */
  mouse: { x: 0, y: 0 },
};

/** Lámpara, cielo, paredes… leen esta duración. */
export const DAY_DUR = 3000;

export const easeSine = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
