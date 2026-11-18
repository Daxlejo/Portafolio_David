"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { Box, Cyl, Torus } from "./kit";

/** Reloj de pared con la hora real, encima del monitor. */
export default function WallClock() {
  const hour = useRef<THREE.Group>(null);
  const min = useRef<THREE.Group>(null);

  useFrame(() => {
    const d = new Date();
    if (hour.current) hour.current.rotation.z = -(((d.getHours() % 12) + d.getMinutes() / 60) / 12) * Math.PI * 2;
    if (min.current) min.current.rotation.z = -(d.getMinutes() / 60) * Math.PI * 2;
  });

  return (
    <group position={[1.9, 6.5, -6.97]}>
      <Cyl args={[0.55, 0.55, 0.08, 32]} p={[0, 0, 0.04]} r={[Math.PI / 2, 0, 0]} color={0xe9edf2} flat={false} shadow={false} />
      <Torus args={[0.55, 0.05, 8, 32]} p={[0, 0, 0.06]} color={0x1f2937} shadow={false} />
      <group ref={hour} position={[0, 0, 0.1]}>
        <Box args={[0.05, 0.28, 0.02]} p={[0, 0.12, 0]} color={0x111827} shadow={false} />
      </group>
      <group ref={min} position={[0, 0, 0.11]}>
        <Box args={[0.035, 0.42, 0.02]} p={[0, 0.19, 0]} color={0x111827} shadow={false} />
      </group>
    </group>
  );
}
