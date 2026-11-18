"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { rt } from "@/lib/workshop/runtime";
import { CODE_LEN, codeTexture } from "@/lib/workshop/textures";
import { Box, C, Screen } from "./kit";

/** Monitor con el código de `taller.ts` que se escribe solo (1 carácter cada 32 ms). */
export default function Monitor() {
  const code = useMemo(() => codeTexture(), []);
  const st = useRef({ acc: 0, hold: 0, lastKey: "" });

  useEffect(() => {
    // las fuentes de next/font pueden llegar después del primer dibujo
    document.fonts?.ready.then(() => (st.current.lastKey = ""));
    return () => code.tex.dispose();
  }, [code]);

  useFrame((_, dt) => {
    const now = performance.now();
    const s = st.current;
    if (rt.reduce) rt.typed = CODE_LEN;
    else {
      s.acc += Math.min(dt, 0.05);
      while (s.acc > 0.032) {
        s.acc -= 0.032;
        if (rt.typed < CODE_LEN) rt.typed += 1;
        else if ((s.hold += 1) > 90) {
          rt.typed = 0;
          s.hold = 0;
        }
      }
    }
    const blink = rt.reduce ? 0 : ((now / 500) | 0) % 2;
    const key = `${rt.typed}-${blink}`;
    if (key === s.lastKey) return;
    s.lastKey = key;
    code.draw(rt.typed, rt.reduce ? 0 : now);
  });

  return (
    <group position={[0.3, 2.59, -6.15]}>
      <Box args={[1.1, 0.06, 0.6]} p={[0, 0.03, 0]} color={C.dark} />
      <Box args={[0.16, 1.0, 0.12]} p={[0, 0.55, -0.1]} color={C.dark} />
      <Box args={[3.5, 2.05, 0.14]} p={[0, 1.62, 0]} color={C.dark} />
      <Screen map={code.tex} args={[3.3, 1.9]} p={[0, 1.62, 0.075]} />
    </group>
  );
}
