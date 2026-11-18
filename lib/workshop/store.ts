"use client";

import { useSyncExternalStore } from "react";
import type { SectionId } from "./sections";

export type WorkshopState = {
  /** El navegador soporta WebGL y el taller se puede abrir. */
  available: boolean;
  /** El overlay del taller está visible. */
  open: boolean;
  /** Sección abierta en el panel lateral. */
  active: SectionId | null;
  /** Objeto bajo el cursor. */
  hovered: SectionId | null;
  /** Captura del taller (data URL) para el Hero clásico. */
  preview: string | null;
};

let state: WorkshopState = { available: false, open: false, active: null, hovered: null, preview: null };
const listeners = new Set<() => void>();

export function getWorkshop(): WorkshopState {
  return state;
}

export function setWorkshop(patch: Partial<WorkshopState>) {
  let changed = false;
  for (const k of Object.keys(patch) as (keyof WorkshopState)[]) {
    if (state[k] !== patch[k]) changed = true;
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const SERVER_STATE = state;

export function useWorkshop<T>(select: (s: WorkshopState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(SERVER_STATE)
  );
}

export const openWorkshop = () => setWorkshop({ open: true });
export const closeWorkshop = () => setWorkshop({ open: false, active: null, hovered: null });
