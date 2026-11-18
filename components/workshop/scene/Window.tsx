"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { rt } from "@/lib/workshop/runtime";
import { skyTexture } from "@/lib/workshop/textures";
import { Box, Screen } from "./kit";

/** Ventana con el volcán Galeras y cielo dinámico (noche → amanecer → día). */
export default function Window() {
  const sky = useMemo(() => skyTexture(), []);
  const last = useRef(-1);

  useEffect(() => () => sky.tex.dispose(), [sky]);

  // El cielo solo se redibuja cuando cambia el progreso día/noche
  useFrame(() => {
    if (last.current === rt.dayP) return;
    last.current = rt.dayP;
    sky.draw(rt.dayP);
  });

  return (
    <group position={[-3.6, 4.9, -6.98]}>
      <Box args={[3.1, 2.7, 0.16]} color={0x3b2a1f} shadow={false} />
      <Screen map={sky.tex} args={[2.75, 2.35]} p={[0, 0, 0.09]} />
      <Box args={[0.08, 2.35, 0.06]} p={[0, 0, 0.12]} color={0x3b2a1f} shadow={false} />
      <Box args={[2.75, 0.08, 0.06]} p={[0, 0.1, 0.12]} color={0x3b2a1f} shadow={false} />
      <Box args={[3.4, 0.12, 0.4]} p={[0, -1.38, 0.18]} color={0x4a3526} />
    </group>
  );
}
