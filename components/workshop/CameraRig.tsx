"use client";

import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { easeInOutCubic, rt } from "@/lib/workshop/runtime";
import { SECTION_BY_ID, type SectionId } from "@/lib/workshop/sections";
import { useWorkshop } from "@/lib/workshop/store";

export const ISO = new THREE.Vector3(1, 0.82, 1).normalize();
export const RIGHT = new THREE.Vector3(1, 0, -1).normalize();
export const UP = (() => {
  const u = new THREE.Vector3().crossVectors(RIGHT, ISO).normalize().negate();
  return u.y < 0 ? u.negate() : u;
})();
export const HOME = { t: new THREE.Vector3(-0.2, 3.6, -0.6), zoom: 1 };
export const PANEL_W = 470;

export const isMobile = (w: number) => w <= 760;
export const viewSizeFor = (w: number, h: number) => (isMobile(w) ? Math.max(15.5, 14.5 / (w / h)) : Math.max(15.5, 23 / (w / h)));

/** Objetivo de la cámara para que el objeto quede centrado en el área libre (fuera del panel). */
function focusTarget(id: SectionId, w: number, h: number) {
  const s = SECTION_BY_ID[id];
  const p = new THREE.Vector3(...s.focus);
  const ppu = (h * s.zoom) / viewSizeFor(w, h);
  if (isMobile(w)) p.addScaledVector(UP, -((h * 0.6) / 2 / ppu) * 0.95);
  else p.addScaledVector(RIGHT, Math.min(PANEL_W, w) / 2 / ppu);
  return p;
}

type Tween = { from: { t: THREE.Vector3; zoom: number }; to: { t: THREE.Vector3; zoom: number }; t0: number; dur: number };

/**
 * Cámara ortográfica isométrica: entrada animada, tween de foco por sección,
 * parallax con el mouse y arrastre horizontal para mirar (±6).
 */
export default function CameraRig() {
  const cam = useRef<THREE.OrthographicCamera>(null);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const active = useWorkshop((s) => s.active);
  const st = useRef({
    t: HOME.t.clone(),
    zoom: rt.reduce ? 1 : 0.62,
    tween: null as Tween | null,
    sx: 0,
    sy: 0,
    tmp: new THREE.Vector3(),
  });

  const goTo = (t: THREE.Vector3, zoom: number, dur: number) => {
    const s = st.current;
    s.tween = { from: { t: s.t.clone(), zoom: s.zoom }, to: { t: t.clone(), zoom }, t0: performance.now(), dur: rt.reduce ? 1 : dur };
  };

  // entrada desde zoom 0.62 en 1.6 s
  useEffect(() => {
    goTo(HOME.t, HOME.zoom, 1600);
  }, []);

  // foco al abrir/cerrar una sección (y recálculo al cambiar el tamaño)
  const lastActive = useRef<SectionId | null>(null);
  useEffect(() => {
    const changed = lastActive.current !== active;
    lastActive.current = active;
    rt.active = active;
    if (active) goTo(focusTarget(active, size.width, size.height), SECTION_BY_ID[active].zoom, changed ? 1100 : 1);
    else if (changed) goTo(HOME.t, HOME.zoom, 900);
  }, [active, size.width, size.height]);

  // parallax y arrastre
  useEffect(() => {
    const el = gl.domElement;
    let drag: { x: number; pan: number } | null = null;
    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, pan: rt.pan };
      rt.dragged = false;
    };
    const up = () => {
      drag = null;
    };
    const move = (e: PointerEvent) => {
      rt.mouse.x = e.clientX / window.innerWidth - 0.5;
      rt.mouse.y = e.clientY / window.innerHeight - 0.5;
      if (!drag || rt.active) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 6) rt.dragged = true;
      if (rt.dragged) {
        const ppu = (window.innerHeight * st.current.zoom) / viewSizeFor(window.innerWidth, window.innerHeight);
        rt.pan = Math.max(-6, Math.min(6, drag.pan - dx / ppu));
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame(() => {
    const c = cam.current;
    if (!c) return;
    const s = st.current;
    if (s.tween) {
      const tw = s.tween;
      const k = Math.min(1, (performance.now() - tw.t0) / tw.dur);
      const e = easeInOutCubic(k);
      s.t.lerpVectors(tw.from.t, tw.to.t, e);
      s.zoom = tw.from.zoom + (tw.to.zoom - tw.from.zoom) * e;
      if (k >= 1) s.tween = null;
    }
    const par = rt.active || rt.reduce ? 0 : 1;
    s.sx += (rt.mouse.x - s.sx) * 0.05;
    s.sy += (rt.mouse.y - s.sy) * 0.05;
    if (rt.active) rt.pan *= 0.9;
    const t = s.tmp
      .copy(s.t)
      .addScaledVector(RIGHT, rt.pan + s.sx * 0.9 * par)
      .addScaledVector(UP, -s.sy * 0.5 * par);
    c.position.copy(t).addScaledVector(ISO, 60);
    c.lookAt(t);
    const vs = viewSizeFor(size.width, size.height);
    const a = size.width / size.height;
    c.left = (-vs * a) / 2;
    c.right = (vs * a) / 2;
    c.top = vs / 2;
    c.bottom = -vs / 2;
    c.zoom = s.zoom;
    c.updateProjectionMatrix();
  });

  return <OrthographicCamera ref={cam} makeDefault manual near={0.1} far={300} position={[60, 50, 60]} />;
}
