"use client";

import { useEffect, useMemo } from "react";
import { corkTexture } from "@/lib/workshop/textures";
import { Box } from "./kit";

/** Corcho con notas de colores (testimonios). */
export default function Corkboard() {
  const cork = useMemo(() => corkTexture(), []);
  useEffect(() => () => cork.tex.dispose(), [cork]);

  return (
    <group>
      <Box args={[3.1, 2.1, 0.1]} color={0x5b3b25} shadow={false} />
      <mesh position={[0, 0, 0.06]} userData={{ keep: true }}>
        <planeGeometry args={[2.9, 1.9]} />
        <meshStandardMaterial map={cork.tex} roughness={0.9} />
      </mesh>
    </group>
  );
}
