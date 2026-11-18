"use client";

import { Cyl, Sphere } from "./kit";

const LEAVES = [0x166534, 0x15803d, 0x14532d];

/** Planta grande en la esquina derecha. */
export default function Plant() {
  return (
    <group position={[5.6, 0, -5.7]}>
      <Cyl args={[0.5, 0.38, 0.9, 14]} p={[0, 0.45, 0]} color={0xd6d3d1} />
      {Array.from({ length: 9 }, (_, i) => (
        <Sphere
          key={i}
          args={[0.38, 7, 5]}
          p={[Math.cos(i * 0.7) * 0.35, 1.3 + (i % 3) * 0.35, Math.sin(i * 0.7) * 0.35]}
          s={[0.6, 1.4, 0.6]}
          r={[0, 0, Math.cos(i) * 0.5]}
          color={LEAVES[i % 3]}
        />
      ))}
    </group>
  );
}
