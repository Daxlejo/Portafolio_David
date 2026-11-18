"use client";

import { Box, C, Sphere } from "./kit";

const BOOKS = [0x0f766e, 0xb45309, 0x1e3a8a, 0x7c2d12, 0x334155, 0x15803d, 0xa16207];

/** Repisa decorativa en la pared izquierda. */
export default function Shelf() {
  return (
    <group position={[-6.8, 4.0, 2.6]}>
      <Box args={[0.5, 0.08, 2.8]} color={C.wood} />
      {BOOKS.map((c, i) => {
        const h = 0.5 + ((i * 37) % 5) * 0.06;
        return <Box key={c} args={[0.38, h, 0.16]} p={[0, 0.04 + h / 2, -1.2 + i * 0.2]} color={c} />;
      })}
      <Sphere args={[0.18, 10, 8]} p={[0, 0.22, 0.9]} color={0x94a3b8} />
    </group>
  );
}
