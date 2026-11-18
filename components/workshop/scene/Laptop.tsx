"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { rt } from "@/lib/workshop/runtime";
import { termTexture } from "@/lib/workshop/textures";
import { Box, Screen } from "./kit";

/** Laptop con una terminal de despliegue y cursor parpadeante. */
export default function Laptop() {
  const term = useMemo(() => termTexture(), []);
  const last = useRef(-1);

  useEffect(() => {
    document.fonts?.ready.then(() => (last.current = -1));
    return () => term.tex.dispose();
  }, [term]);

  useFrame(() => {
    const now = performance.now();
    const blink = rt.reduce ? 0 : ((now / 530) | 0) % 2;
    if (blink === last.current) return;
    last.current = blink;
    term.draw(blink === 0 ? 0 : 530);
  });

  return (
    <group>
      <Box args={[1.55, 0.06, 1.05]} p={[0, 0.03, 0]} color={0x9aa4b2} metalness={0.3} />
      <Box args={[1.3, 0.01, 0.5]} p={[0, 0.065, -0.12]} color={0x6b7280} shadow={false} />
      <group position={[0, 0.06, -0.5]} rotation={[-0.22, 0, 0]}>
        <Box args={[1.55, 1.02, 0.05]} p={[0, 0.51, 0]} color={0x9aa4b2} metalness={0.3} />
        <Screen map={term.tex} args={[1.4, 0.88]} p={[0, 0.52, 0.027]} />
      </group>
    </group>
  );
}
