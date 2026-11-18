"use client";

import { useEffect, useMemo } from "react";
import { handFont, whiteboardTexture } from "@/lib/workshop/textures";
import { Box, Cyl } from "./kit";

/** Pizarra con la línea de tiempo y el diagrama de SafeCity (letra a mano). */
export default function Whiteboard() {
  const wb = useMemo(() => whiteboardTexture(), []);

  useEffect(() => {
    // Caveat solo se usa en el canvas: se pide explícitamente y se redibuja
    const fam = handFont();
    Promise.resolve(document.fonts?.load(`600 40px ${fam}`))
      .catch(() => undefined)
      .then(() => wb.draw());
    return () => wb.tex.dispose();
  }, [wb]);

  return (
    <group>
      <Box args={[4.8, 2.85, 0.08]} color={0xcbd5e1} shadow={false} />
      <mesh position={[0, 0, 0.05]} userData={{ keep: true }}>
        <planeGeometry args={[4.6, 2.6]} />
        <meshStandardMaterial map={wb.tex} roughness={0.6} />
      </mesh>
      <Box args={[3.2, 0.07, 0.24]} p={[0, -1.48, 0.14]} color={0x94a3b8} />
      {[0x1e293b, 0xb45309, 0x0f766e].map((c, i) => (
        <Cyl key={c} args={[0.03, 0.03, 0.38, 8]} p={[-0.6 + i * 0.3, -1.42, 0.16]} r={[0, 0, Math.PI / 2]} color={c} shadow={false} />
      ))}
    </group>
  );
}
