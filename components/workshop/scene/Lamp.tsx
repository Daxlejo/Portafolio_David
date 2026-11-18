"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { rt } from "@/lib/workshop/runtime";
import { C, Cyl, TOP } from "./kit";

const ON = new THREE.Color(0xffd9a0);
const OFF = new THREE.Color(0x6b6b6b);
const L = Math.PI; // escala a luces físicas (three ≥ r155)

/**
 * Lámpara de escritorio: encendida hasta p = 0.46; entre 0.46 y 0.66 parpadea
 * como un foco que se apaga y se atenúa; de día queda apagada con la bombilla gris.
 */
export default function Lamp() {
  const light = useRef<THREE.PointLight>(null);
  const bulb = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const p = rt.dayP;
    const now = performance.now();
    let lamp = 1;
    if (p > 0.66) lamp = 0;
    else if (p > 0.46) {
      const flick = rt.reduce ? 1 : Math.sin(now * 0.05) + Math.sin(now * 0.137) + Math.sin(now * 0.29) > 0.35 ? 1 : 0.1;
      lamp = flick * (1 - (p - 0.46) / 0.2);
    }
    if (light.current) light.current.intensity = 1.5 * L * 2.2 * lamp;
    bulb.current?.color.copy(OFF).lerp(ON, lamp);
  });

  return (
    <group>
      <group position={[-2.35, TOP, -6.25]}>
        <Cyl args={[0.3, 0.34, 0.08, 16]} p={[0, 0.04, 0]} color={C.dark} />
        <Cyl args={[0.04, 0.04, 1.4, 8]} p={[0.2, 0.75, 0.15]} r={[0.25, 0, -0.28]} color={C.dark} />
        <group position={[0.45, 1.45, 0.45]} rotation={[0.7, 0, 0]}>
          <Cyl args={[0.12, 0.3, 0.36, 16, 1, true]} color={C.teal} side={THREE.DoubleSide} />
          <mesh position={[0, -0.12, 0]} userData={{ keep: true }}>
            <sphereGeometry args={[0.1, 12, 8]} />
            <meshBasicMaterial ref={bulb} color={0xffd9a0} toneMapped={false} />
          </mesh>
        </group>
      </group>
      <pointLight ref={light} color={C.lamp} intensity={1.5 * L * 2.2} distance={9} decay={2} position={[-1.9, TOP + 1.3, -5.8]} />
    </group>
  );
}
