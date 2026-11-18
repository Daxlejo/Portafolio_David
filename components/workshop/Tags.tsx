"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { openSection } from "@/lib/workshop/actions";
import { SECTIONS, type SectionId } from "@/lib/workshop/sections";
import { getWorkshop, setWorkshop, useWorkshop } from "@/lib/workshop/store";

/** Botones de etiqueta registrados por id; el proyector (dentro del canvas) los mueve. */
const tagEls: Partial<Record<SectionId, HTMLButtonElement | null>> = {};

/** Dentro del <Canvas>: proyecta cada `anchor` a la pantalla en cada fotograma. */
export function TagProjector() {
  const v = useRef(new THREE.Vector3());
  useFrame(({ camera, size }) => {
    if (rtHidden()) return;
    for (const s of SECTIONS) {
      const el = tagEls[s.id];
      if (!el) continue;
      v.current.set(...s.anchor).project(camera);
      const x = ((v.current.x + 1) / 2) * size.width;
      const y = ((1 - v.current.y) / 2) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
    }
  });
  return null;
}

const rtHidden = () => !!getWorkshop().active;

/** Etiquetas flotantes sobre cada objeto (ocultas en móvil y con un panel abierto). */
export default function Tags() {
  const active = useWorkshop((s) => s.active);
  const hovered = useWorkshop((s) => s.hovered);
  const hidden = !!active;

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] max-[760px]:hidden" aria-hidden={hidden}>
      {SECTIONS.map((s) => {
        const hot = hovered === s.id;
        return (
          <button
            key={s.id}
            ref={(el) => {
              tagEls[s.id] = el;
            }}
            type="button"
            tabIndex={hidden ? -1 : 0}
            aria-label={`Abrir ${s.label}`}
            onClick={() => openSection(s.id)}
            onPointerEnter={() => setWorkshop({ hovered: s.id })}
            onPointerLeave={() => getWorkshop().hovered === s.id && setWorkshop({ hovered: null })}
            onFocus={() => setWorkshop({ hovered: s.id })}
            onBlur={() => getWorkshop().hovered === s.id && setWorkshop({ hovered: null })}
            style={{ transform: "translate(-200px,-200px)" }}
            className={`absolute top-0 left-0 cursor-pointer rounded-full whitespace-nowrap transition-opacity duration-300 ${
              hidden ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
            }`}
          >
            <span
              className={`glass flex items-center gap-[7px] rounded-full border py-[5px] pr-[11px] pl-[9px] text-[12.5px] font-medium text-fg shadow-[0_6px_18px_rgba(0,0,0,.25)] transition-[transform,border-color] duration-200 ${
                hot ? "-translate-y-[10%] scale-[1.06] border-accent" : "border-line"
              }`}
            >
              <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_0_3px_var(--accent-soft)]" />
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
