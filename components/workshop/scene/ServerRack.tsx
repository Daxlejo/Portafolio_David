"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { rt } from "@/lib/workshop/runtime";
import { Box, C, Cyl } from "./kit";

const LED_COLORS = [0x2dd4bf, 0x22c55e, 0xfbbf24, 0x60a5fa];
const UNITS = [0, 1, 2, 3, 4];
const SLOTS = [0, 1, 2, 3];

function createLeds() {
  return UNITS.flatMap((u) =>
    SLOTS.map((k) => {
      const c = LED_COLORS[(u + k) % 4];
      return { u, k, mat: new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1 }) };
    })
  );
}

/** Cambia al azar ~30 % de los LEDs. */
function blink(leds: ReturnType<typeof createLeds>) {
  for (const l of leds) if (Math.random() < 0.3) l.mat.emissiveIntensity = Math.random() < 0.5 ? 0.15 : 1.2;
}

/** Rack de servidores con LEDs que parpadean al azar cada 120 ms. */
export default function ServerRack() {
  const leds = useMemo(() => createLeds(), []);
  const live = useRef(leds);
  const acc = useRef(0);

  useFrame((_, dt) => {
    if (rt.reduce) return;
    acc.current += dt;
    if (acc.current < 0.12) return;
    acc.current = 0;
    blink(live.current);
  });

  return (
    <group>
      <Box args={[1.35, 2.9, 1.3]} p={[0, 1.45, 0]} color={C.dark} />
      {UNITS.map((u) => (
        <group key={u}>
          <Box args={[1.15, 0.4, 0.05]} p={[0, 0.45 + u * 0.5, 0.66]} color={0x1f2a3c} shadow={false} />
          <Box args={[0.5, 0.05, 0.02]} p={[-0.22, 0.45 + u * 0.5, 0.7]} color={0x334155} shadow={false} />
        </group>
      ))}
      {leds.map((l) => (
        <mesh key={`${l.u}-${l.k}`} position={[0.38 + l.k * 0.06, 0.45 + l.u * 0.5, 0.7]} material={l.mat} userData={{ keep: true }}>
          <boxGeometry args={[0.07, 0.07, 0.02]} />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, v) => (
        <Box key={v} args={[0.02, 2.5, 0.06]} p={[0.69, 1.45, -0.5 + v * 0.12]} color={0x1f2a3c} shadow={false} />
      ))}
      <Box args={[0.8, 0.12, 0.5]} p={[0, 2.96, 0.1]} color={0xe5e7eb} />
      {[-0.3, 0.3].map((x) => (
        <Cyl key={x} args={[0.02, 0.02, 0.5, 6]} p={[x, 3.25, -0.05]} r={[0, 0, x * 0.6]} color={C.dark} shadow={false} />
      ))}
      <pointLight color={0x60a5fa} intensity={0.45 * Math.PI * 1.6} distance={3.5} decay={2} position={[0.35, 1.8, 0.95]} />
    </group>
  );
}
