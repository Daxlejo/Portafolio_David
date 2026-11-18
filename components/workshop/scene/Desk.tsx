"use client";

import { Box, C, Cone, Cyl, DESK_Y, TOP } from "./kit";

const KEYS = Array.from({ length: 4 * 13 }, (_, i) => [i % 13, Math.floor(i / 13)] as const);
const BOOKS: [number, number][] = [
  [0x1e40af, 0],
  [0xb45309, 1],
  [0x334155, 2],
];

/** Escritorio con cajonera, teclado, mouse, libros y maceta. */
export default function Desk() {
  return (
    <group>
      <Box args={[6.6, 0.18, 2.6]} p={[0.3, DESK_Y, -5.45]} color={C.wood} />
      {[
        [-2.85, -6.6],
        [3.45, -6.6],
        [-2.85, -4.3],
        [3.45, -4.3],
      ].map(([x, z]) => (
        <Box key={`${x}${z}`} args={[0.16, DESK_Y, 0.16]} p={[x, DESK_Y / 2, z]} color={C.metal} />
      ))}
      <Box args={[1.3, 1.5, 2.2]} p={[-2.1, 1.55, -5.5]} color={0x8c6142} />
      <Box args={[1.1, 0.04, 0.02]} p={[-2.1, 1.7, -4.39]} color={0xcbd5e1} />
      <Box args={[1.1, 0.04, 0.02]} p={[-2.1, 1.15, -4.39]} color={0xcbd5e1} />

      {/* teclado y mouse */}
      <group position={[0.3, TOP, -4.85]}>
        <Box args={[2.0, 0.07, 0.62]} p={[0, 0.035, 0]} color={C.dark} />
        {KEYS.map(([c, r]) => (
          <Box key={`${c}-${r}`} args={[0.12, 0.04, 0.11]} p={[-0.86 + c * 0.143, 0.08, -0.22 + r * 0.145]} color={0x2b3546} shadow={false} />
        ))}
      </group>
      <Box args={[0.24, 0.08, 0.36]} p={[1.55, TOP + 0.04, -4.8]} color={C.dark} />

      {/* libros */}
      {BOOKS.map(([c, i]) => (
        <Box key={i} args={[0.62, 0.12, 0.44]} p={[-2.4, TOP + 0.06 + i * 0.12, -4.75]} r={[0, i * 0.12, 0]} color={c} />
      ))}

      {/* maceta pequeña */}
      <group position={[-1.35, TOP, -6.35]}>
        <Cyl args={[0.2, 0.16, 0.32, 12]} p={[0, 0.16, 0]} color={0xc2410c} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Cone key={i} args={[0.08, 0.5, 5]} p={[Math.cos(i * 1.3) * 0.06, 0.5, Math.sin(i * 1.3) * 0.06]} r={[0, 0, (i - 2) * 0.25]} color={0x15803d} />
        ))}
      </group>
    </group>
  );
}
