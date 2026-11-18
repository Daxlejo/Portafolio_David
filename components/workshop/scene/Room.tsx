"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { rt } from "@/lib/workshop/runtime";
import { floorTexture, mixC, type Tri } from "@/lib/workshop/textures";
import { Box, Cyl } from "./kit";

const WALL: Tri = [0x263248, 0x4d3f55, 0x9fb1c8];

/** Piso de tablones, paredes con zócalo y moldura, alfombra redonda. */
export default function Room() {
  const floor = useMemo(() => floorTexture(), []);
  const wallMat = useRef<THREE.MeshStandardMaterial>(null);
  const wallMat2 = useRef<THREE.MeshStandardMaterial>(null);
  const last = useRef(-1);

  useFrame(() => {
    if (last.current === rt.dayP || !wallMat.current || !wallMat2.current) return;
    last.current = rt.dayP;
    mixC(rt.dayP, WALL, wallMat.current.color);
    wallMat2.current.color.copy(wallMat.current.color);
  });

  return (
    <group>
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[14, 0.5, 14]} />
        <meshStandardMaterial map={floor.tex} roughness={0.82} />
      </mesh>
      <mesh position={[-0.15, 4.1, -7.15]} receiveShadow>
        <boxGeometry args={[14.3, 8.2, 0.3]} />
        <meshStandardMaterial ref={wallMat} color={0x263248} roughness={0.82} />
      </mesh>
      <mesh position={[-7.15, 4.1, 0]} receiveShadow>
        <boxGeometry args={[0.3, 8.2, 14]} />
        <meshStandardMaterial ref={wallMat2} color={0x263248} roughness={0.82} />
      </mesh>
      {/* zócalo y moldura */}
      <Box args={[14, 0.35, 0.06]} p={[0, 0.18, -6.98]} color={0x1a2233} shadow={false} />
      <Box args={[0.06, 0.35, 14]} p={[-6.98, 0.18, 0]} color={0x1a2233} shadow={false} />
      <Box args={[14.3, 0.18, 0.42]} p={[-0.15, 8.2, -7.1]} color={0x1c2536} shadow={false} />
      <Box args={[0.42, 0.18, 14]} p={[-7.1, 8.2, 0]} color={0x1c2536} shadow={false} />
      {/* alfombra */}
      <Cyl args={[2.9, 2.9, 0.04, 40]} p={[0.4, 0.02, -3.1]} color={0x2b3a52} flat={false} shadow={false} />
      <Cyl args={[2.45, 2.45, 0.05, 40]} p={[0.4, 0.03, -3.1]} color={0x1d283b} flat={false} shadow={false} />
    </group>
  );
}
