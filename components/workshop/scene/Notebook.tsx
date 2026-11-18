"use client";

import { Box, C, Cyl, TOP } from "./kit";

/** Cuaderno de notas con lápiz (decorativo, no abre ninguna sección). */
export default function Notebook() {
  return (
    <group position={[2.85, TOP, -4.55]} rotation={[0, 0.18, 0]}>
      <Box args={[0.95, 0.05, 0.7]} p={[0, 0.025, 0]} color={C.teal} />
      <Box args={[0.9, 0.04, 0.66]} p={[0.02, 0.065, 0]} color={0xf1f5f9} />
      <Box args={[0.95, 0.052, 0.71]} p={[0, 0.1, 0]} color={C.teal} />
      <Box args={[0.03, 0.01, 0.72]} p={[0.36, 0.13, 0]} color={C.dark} shadow={false} />
      <Cyl args={[0.025, 0.025, 0.75, 6]} p={[0.05, 0.15, 0.22]} r={[0, 0.35, Math.PI / 2]} color={0xf59e0b} shadow={false} />
    </group>
  );
}
