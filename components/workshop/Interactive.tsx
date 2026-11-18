"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { openSection } from "@/lib/workshop/actions";
import { rt } from "@/lib/workshop/runtime";
import type { SectionId } from "@/lib/workshop/sections";
import { getWorkshop, setWorkshop, useWorkshop } from "@/lib/workshop/store";
import type { V3 } from "./scene/kit";

const HOVER = new THREE.Color(0x2dd4bf);
const NONE = new THREE.Color(0x000000);

/**
 * Envuelve un objeto del taller que abre una sección: brillo emisivo al pasar
 * el cursor, cursor de mano y clic → abrir sección (salvo si se estaba arrastrando).
 */
export default function Interactive({ id, children, position, rotation }: { id: SectionId; children: ReactNode; position?: V3; rotation?: V3 }) {
  const ref = useRef<THREE.Group>(null);
  const hot = useWorkshop((s) => s.hovered === id);

  useEffect(() => {
    ref.current?.traverse((o) => {
      if (!(o instanceof THREE.Mesh) || o.userData.keep) return;
      const m = o.material;
      if (m instanceof THREE.MeshStandardMaterial) {
        m.emissive.copy(hot ? HOVER : NONE);
        m.emissiveIntensity = hot ? 0.22 : 0;
      }
    });
  }, [hot]);

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.pointerType !== "mouse") return;
    setWorkshop({ hovered: id });
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    if (getWorkshop().hovered === id) setWorkshop({ hovered: null });
    document.body.style.cursor = "";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (rt.dragged) {
      rt.dragged = false;
      return;
    }
    openSection(id);
  };

  return (
    <group ref={ref} position={position} rotation={rotation} onPointerOver={over} onPointerOut={out} onClick={click}>
      {children}
    </group>
  );
}
