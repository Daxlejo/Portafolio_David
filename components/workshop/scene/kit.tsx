"use client";

import type { ReactNode } from "react";
import type * as THREE from "three";

export type V3 = [number, number, number];

type Common = {
  p?: V3;
  r?: V3;
  s?: V3 | number;
  color?: THREE.ColorRepresentation;
  /** Proyecta sombra (todas reciben) */
  shadow?: boolean;
  flat?: boolean;
  roughness?: number;
  metalness?: number;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  side?: THREE.Side;
  map?: THREE.Texture;
  /** No se ilumina al pasar el cursor (pantallas, LEDs…) */
  keep?: boolean;
};

/** Malla low-poly con material estándar (flatShading, rugosidad 0.82). */
function M({ p, r, s, color = 0xffffff, shadow = true, flat = true, roughness = 0.82, metalness = 0, emissive, emissiveIntensity, side, map, keep, children }: Common & { children: ReactNode }) {
  return (
    <mesh position={p} rotation={r} scale={s} castShadow={shadow} receiveShadow userData={keep ? { keep: true } : undefined}>
      {children}
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        flatShading={flat}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        side={side}
        map={map}
      />
    </mesh>
  );
}

export const Box = ({ args, ...m }: Common & { args: V3 }) => (
  <M {...m}>
    <boxGeometry args={args} />
  </M>
);

export const Cyl = ({ args, ...m }: Common & { args: [number, number, number, number?, number?, boolean?] }) => (
  <M {...m}>
    <cylinderGeometry args={args} />
  </M>
);

export const Sphere = ({ args, ...m }: Common & { args: [number, number?, number?, number?, number?, number?, number?] }) => (
  <M {...m}>
    <sphereGeometry args={args} />
  </M>
);

export const Torus = ({ args, ...m }: Common & { args: [number, number, number?, number?, number?] }) => (
  <M {...m}>
    <torusGeometry args={args} />
  </M>
);

export const Cone = ({ args, ...m }: Common & { args: [number, number, number?] }) => (
  <M {...m}>
    <coneGeometry args={args} />
  </M>
);

/** Plano con textura sin iluminación (pantallas, ventana). */
export function Screen({ map, args, p, r }: { map: THREE.Texture; args: [number, number]; p?: V3; r?: V3 }) {
  return (
    <mesh position={p} rotation={r} userData={{ keep: true }}>
      <planeGeometry args={args} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

export const C = {
  wood: 0xa8774e,
  metal: 0x1f2937,
  dark: 0x111827,
  hoodie: 0x115e59,
  teal: 0x0f766e,
  jeans: 0x22324d,
  accent: 0x2dd4bf,
  lamp: 0xffb15e,
};

export const DESK_Y = 2.5;
export const TOP = DESK_Y + 0.09;
