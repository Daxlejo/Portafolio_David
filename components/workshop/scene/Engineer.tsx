"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { rt } from "@/lib/workshop/runtime";
import { SECTION_BY_ID } from "@/lib/workshop/sections";
import { CODE_LEN } from "@/lib/workshop/textures";
import { Box, C, Cyl, Sphere, Torus } from "./kit";

/** Posición del personaje en el cuarto (mirando hacia −z). */
export const ENGINEER_POS: [number, number, number] = [0.35, 0, -3.3];
const HEAD_WORLD = new THREE.Vector3(ENGINEER_POS[0], 3.72, ENGINEER_POS[2] - 0.02);
/** Ángulo para mirar la ventana (−3.6, −6.9). */
const WIN_YAW = Math.atan2(-(-3.6 - HEAD_WORLD.x), -(-6.9 - HEAD_WORLD.z));
const SKIN = 0xd9a77f;
const AXIS_X = new THREE.Vector3(1, 0, 0);
const SIDES = [-1, 1] as const;

function headTargetFor(): number {
  const id = rt.active;
  if (!id) return 0;
  if (id === "sobre") return -1.4; // mira hacia la cámara
  const [fx, , fz] = SECTION_BY_ID[id].focus;
  return Math.max(-1.4, Math.min(1.4, Math.atan2(-(fx - HEAD_WORLD.x), -(fz - HEAD_WORLD.z))));
}

function Arm({ side, register }: { side: -1 | 1; register: (g: THREE.Group, side: number) => void }) {
  const ref = useRef<THREE.Group>(null);
  const shoulder = new THREE.Vector3(side * 0.55, 3.05, 0);
  const hand = new THREE.Vector3(side * 0.32, 2.72, -1.5);
  const len = shoulder.distanceTo(hand);

  useLayoutEffect(() => {
    const g = ref.current;
    if (!g?.parent) return;
    g.parent.updateWorldMatrix(true, false);
    g.lookAt(g.parent.localToWorld(hand.clone()));
    register(g, side);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group ref={ref} position={shoulder}>
      <Cyl args={[0.13, 0.11, len - 0.1, 8]} p={[0, 0, (len - 0.1) / 2]} r={[Math.PI / 2, 0, 0]} color={C.hoodie} />
      <Sphere args={[0.1, 10, 8]} p={[0, 0, len - 0.02]} color={SKIN} flat={false} />
    </group>
  );
}

/** Ingeniero low-poly con audífonos y gafas, sentado frente al monitor. */
export default function Engineer() {
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const arms = useRef<{ g: THREE.Group; base: THREE.Quaternion; s: number }[]>([]);
  const yaw = useRef(0);
  const q = useRef(new THREE.Quaternion());

  const register = (g: THREE.Group, s: number) => {
    arms.current = arms.current.filter((a) => a.s !== s).concat({ g, base: g.quaternion.clone(), s });
  };

  useFrame(() => {
    const now = performance.now();
    const lookWin = now < rt.lookWindowUntil;
    const target = lookWin ? WIN_YAW : headTargetFor();
    yaw.current = rt.reduce ? target : yaw.current + (target - yaw.current) * 0.06;
    const typing = rt.typed < CODE_LEN && !rt.active && !rt.reduce;
    if (head.current) {
      head.current.rotation.y = yaw.current;
      head.current.rotation.x = rt.active === "proyectos" ? 0.05 : typing ? 0.12 : 0;
    }
    for (const a of arms.current) {
      q.current.setFromAxisAngle(AXIS_X, typing ? Math.sin(now / 90 + a.s * 1.7) * 0.035 : 0);
      a.g.quaternion.copy(a.base).multiply(q.current);
    }
    if (torso.current) torso.current.position.y = rt.reduce ? 0 : Math.sin(now / 900) * 0.012;
  });

  return (
    <group>
      {/* silla */}
      <Box args={[1.3, 0.18, 1.25]} p={[0, 1.55, 0]} color={C.metal} />
      <Box args={[1.3, 1.75, 0.16]} p={[0, 2.5, 0.62]} r={[0.08, 0, 0]} color={C.metal} />
      <Cyl args={[0.07, 0.07, 1.2, 8]} p={[0, 0.88, 0]} color={0x6b7280} />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i}>
            <Box args={[0.09, 0.07, 0.75]} p={[Math.sin(a) * 0.35, 0.2, Math.cos(a) * 0.35]} r={[0, a, 0]} color={0x6b7280} />
            <Sphere args={[0.07, 8, 6]} p={[Math.sin(a) * 0.7, 0.08, Math.cos(a) * 0.7]} color={C.dark} />
          </group>
        );
      })}

      {/* persona */}
      <Box args={[0.92, 0.36, 0.72]} p={[0, 1.84, 0]} color={C.jeans} />
      {SIDES.map((s) => (
        <group key={s}>
          <Box args={[0.34, 0.32, 1.0]} p={[s * 0.24, 1.8, -0.45]} color={C.jeans} />
          <Box args={[0.3, 1.55, 0.3]} p={[s * 0.24, 1.02, -0.95]} color={C.jeans} />
          <Box args={[0.34, 0.2, 0.56]} p={[s * 0.24, 0.1, -1.08]} color={0xe5e7eb} />
        </group>
      ))}
      <group ref={torso}>
        <Cyl args={[0.44, 0.47, 1.28, 10]} p={[0, 2.62, 0.04]} r={[-0.1, 0, 0]} color={C.hoodie} />
        <Cyl args={[0.36, 0.4, 0.18, 10]} p={[0, 3.28, 0]} color={C.hoodie} />
        <Cyl args={[0.14, 0.15, 0.2, 8]} p={[0, 3.38, 0]} color={SKIN} flat={false} />
        <group ref={head} position={[0, 3.72, -0.02]}>
          <Sphere args={[0.42, 20, 16]} color={SKIN} flat={false} />
          <Sphere args={[0.45, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.56]} p={[0, 0.04, 0.05]} r={[-0.35, 0, 0]} color={0x2a1c13} />
          {/* audífonos */}
          <Torus args={[0.47, 0.045, 8, 24, Math.PI]} p={[0, 0.02, 0.02]} r={[0, Math.PI / 2, 0]} color={C.dark} />
          {SIDES.map((s) => (
            <group key={s}>
              <Cyl args={[0.15, 0.15, 0.13, 14]} p={[s * 0.45, 0, 0]} r={[0, 0, Math.PI / 2]} color={C.dark} />
              <Cyl args={[0.1, 0.1, 0.135, 14]} p={[s * 0.455, 0, 0]} r={[0, 0, Math.PI / 2]} color={C.accent} emissive={C.teal} emissiveIntensity={0.4} keep />
              {/* gafas */}
              <Torus args={[0.1, 0.018, 6, 16]} p={[s * 0.15, 0.02, -0.4]} color={C.dark} shadow={false} />
            </group>
          ))}
          <Box args={[0.1, 0.018, 0.018]} p={[0, 0.02, -0.41]} color={C.dark} shadow={false} />
        </group>
        {SIDES.map((s) => (
          <Arm key={s} side={s} register={register} />
        ))}
      </group>
    </group>
  );
}
