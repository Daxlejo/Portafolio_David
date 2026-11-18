"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DAY_DUR, easeSine, rt } from "@/lib/workshop/runtime";
import { say, useWorkshop } from "@/lib/workshop/store";
import { clamp01, kf, lerpN, mixC, type Tri } from "@/lib/workshop/textures";
import { setTheme } from "@/lib/theme";

const HEMI: Tri = [0x9fb6d8, 0xffc9a6, 0xdfe8f5];
const KEY: Tri = [0xbcd0ff, 0xff9a5c, 0xfff6ea];
const CLEAR: Tri = [0x0a111d, 0x2a2033, 0xd9e3ec];
const L = Math.PI; // escala de intensidades al modelo de luces físico de three ≥ r155

/** Pide un cambio de modo sin animación (p. ej. el tema cambió desde la vista clásica). */
export const instantDay = { next: false };

/**
 * Luces del taller y transición noche ↔ día de 3 s (amanecer / atardecer).
 * El tema de la interfaz cambia a la mitad de la transición.
 */
export default function DayCycle() {
  const hemi = useRef<THREE.HemisphereLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const screen = useRef<THREE.PointLight>(null);
  const gl = useThree((s) => s.gl);
  const mode = useWorkshop((s) => s.mode);
  const prev = useRef(mode);
  const clear = useRef(new THREE.Color());

  useEffect(() => {
    if (prev.current === mode) return;
    prev.current = mode;
    const to = mode === "day" ? 1 : 0;
    if (instantDay.next || rt.reduce) {
      const wasInstant = instantDay.next;
      instantDay.next = false;
      rt.dayAnim = null;
      rt.dayP = to;
      if (!wasInstant) {
        say(mode === "day" ? "sudo sunrise --ciudad pasto" : "sudo sunset --ciudad pasto");
        setTheme(mode === "day" ? "light" : "dark");
      }
      return;
    }
    const now = performance.now();
    rt.dayAnim = { from: rt.dayP, to, t0: now };
    rt.lookWindowUntil = now + DAY_DUR * 0.8;
    say(mode === "day" ? "sudo sunrise --ciudad pasto" : "sudo sunset --ciudad pasto");
    const anim = rt.dayAnim;
    // la UI cambia de tema a mitad de la transición (si no la interrumpieron)
    setTimeout(() => {
      if (rt.dayAnim === anim || rt.dayAnim === null) setTheme(mode === "day" ? "light" : "dark");
    }, DAY_DUR * 0.5);
  }, [mode]);

  useFrame(() => {
    const now = performance.now();
    const a = rt.dayAnim;
    if (a) {
      const k = clamp01((now - a.t0) / DAY_DUR);
      rt.dayP = lerpN(a.from, a.to, easeSine(k));
      if (k >= 1) rt.dayAnim = null;
    }
    const p = rt.dayP;
    if (hemi.current) {
      hemi.current.intensity = kf(p, 0.55, 0.72, 1.0) * L;
      mixC(p, HEMI, hemi.current.color);
    }
    if (key.current) {
      key.current.intensity = kf(p, 0.5, 0.9, 0.85) * L;
      mixC(p, KEY, key.current.color);
      key.current.position.set(kf(p, 9, 15, 6), kf(p, 15, 5, 16), kf(p, 7, 1, 9));
    }
    gl.setClearColor(mixC(p, CLEAR, clear.current));
    if (screen.current) screen.current.intensity = kf(p, 0.8, 0.55, 0.3) * (rt.reduce ? 1 : 0.9 + 0.1 * Math.sin(now / 300)) * L * 1.6;
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={[0x9fb6d8, 0x2a1d14, 0.55 * L]} />
      <directionalLight
        ref={key}
        color={0xbcd0ff}
        intensity={0.5 * L}
        position={[9, 15, 7]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0006}
      />
      <pointLight ref={screen} color={0x2dd4bf} intensity={0.8 * L * 1.6} distance={6} decay={2} position={[0.3, 4.1, -5.2]} />
    </>
  );
}
