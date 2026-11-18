"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { rt } from "@/lib/workshop/runtime";
import { C, Cyl, Torus } from "./kit";

const STEAM = [0, 1, 2, 3, 4].map((i) => i / 5);

/** Taza de café con 5 partículas de vapor. */
export default function Mug() {
  const steam = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const now = performance.now();
    steam.current.forEach((s, i) => {
      if (!s) return;
      const o = STEAM[i];
      const k = rt.reduce ? 0.3 + o * 0.5 : (now / 2200 + o) % 1;
      s.position.set(Math.sin(k * 6 + o * 9) * 0.06, 0.45 + k * 0.75, 0);
      (s.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.35;
      s.scale.setScalar(0.6 + k * 1.2);
    });
  });

  return (
    <group>
      <Cyl args={[0.21, 0.19, 0.4, 18]} p={[0, 0.2, 0]} color={C.teal} flat={false} />
      <Cyl args={[0.18, 0.18, 0.02, 18]} p={[0, 0.38, 0]} color={0x3b2416} shadow={false} />
      <Torus args={[0.11, 0.035, 8, 16]} p={[0.22, 0.21, 0]} color={C.teal} />
      {STEAM.map((o, i) => (
        <mesh
          key={o}
          ref={(m) => {
            steam.current[i] = m;
          }}
          position={[0, 0.5, 0]}
          userData={{ keep: true }}
        >
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshBasicMaterial color={0xffffff} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
