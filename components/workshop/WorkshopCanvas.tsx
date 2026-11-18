"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { closeSection } from "@/lib/workshop/actions";
import { rt } from "@/lib/workshop/runtime";
import { setWorkshop, useWorkshop } from "@/lib/workshop/store";
import CameraRig, { ISO } from "./CameraRig";
import DayCycle from "./DayCycle";
import Interactive from "./Interactive";
import { TagProjector } from "./Tags";
import Corkboard from "./scene/Corkboard";
import Desk from "./scene/Desk";
import Engineer, { ENGINEER_POS } from "./scene/Engineer";
import { TOP } from "./scene/kit";
import Lamp from "./scene/Lamp";
import Laptop from "./scene/Laptop";
import LightBeam from "./scene/LightBeam";
import Monitor from "./scene/Monitor";
import Mug from "./scene/Mug";
import Notebook from "./scene/Notebook";
import Plant from "./scene/Plant";
import Room from "./scene/Room";
import ServerRack from "./scene/ServerRack";
import Shelf from "./scene/Shelf";
import WallClock from "./scene/WallClock";
import Whiteboard from "./scene/Whiteboard";
import Window from "./scene/Window";

/** Captura el taller (encuadre del escritorio) para el Hero de la vista clásica. */
function Snapshot() {
  const { gl, scene, camera } = useThree();
  const open = useWorkshop((s) => s.open);
  const prev = useRef(open);

  useEffect(() => {
    const was = prev.current;
    prev.current = open;
    const take = () => {
      const cam = camera as THREE.OrthographicCamera;
      const saved = { p: cam.position.clone(), q: cam.quaternion.clone(), zoom: cam.zoom };
      const t = new THREE.Vector3(0.3, 3.4, -4.6);
      cam.position.copy(t).addScaledVector(ISO, 60);
      cam.lookAt(t);
      cam.zoom = 2.1;
      cam.updateProjectionMatrix();
      gl.render(scene, cam);
      try {
        setWorkshop({ preview: gl.domElement.toDataURL("image/jpeg", 0.85) });
      } catch {
        /* lienzo no disponible */
      }
      cam.position.copy(saved.p);
      cam.quaternion.copy(saved.q);
      cam.zoom = saved.zoom;
      cam.updateProjectionMatrix();
    };
    // al cerrar el taller, cuando el lienzo ya no se ve (evita un fotograma con otro encuadre)
    if (was && !open) {
      const id = setTimeout(take, 600);
      return () => clearTimeout(id);
    }
  }, [open, gl, scene, camera]);

  return null;
}

export default function WorkshopCanvas({ running, onReady }: { running: boolean; onReady: () => void }) {
  return (
    <Canvas
      aria-hidden
      className="!absolute inset-0 touch-none"
      shadows="percentage"
      flat
      dpr={[1, 2]}
      frameloop={running ? "always" : "never"}
      gl={{ antialias: true }}
      onCreated={() => requestAnimationFrame(onReady)}
      onPointerMissed={() => {
        if (rt.dragged) {
          rt.dragged = false;
          return;
        }
        closeSection();
      }}
    >
      <CameraRig />
      <DayCycle />

      <Room />
      <Window />
      <WallClock />
      <Desk />
      <Notebook />
      <Lamp />
      <Plant />
      <Shelf />
      <LightBeam />

      <Interactive id="sobre" position={ENGINEER_POS}>
        <Engineer />
      </Interactive>
      <Interactive id="proyectos">
        <Monitor />
      </Interactive>
      <Interactive id="testimonios" position={[4.7, 4.6, -6.97]}>
        <Corkboard />
      </Interactive>
      <Interactive id="experiencia" position={[-6.97, 4.55, -1.4]} rotation={[0, Math.PI / 2, 0]}>
        <Whiteboard />
      </Interactive>
      <Interactive id="habilidades" position={[-5.75, 0, -5.55]}>
        <ServerRack />
      </Interactive>
      <Interactive id="terminal" position={[2.65, TOP, -5.55]} rotation={[0, -0.45, 0]}>
        <Laptop />
      </Interactive>
      <Interactive id="contacto" position={[-1.05, TOP, -4.45]}>
        <Mug />
      </Interactive>

      <TagProjector />
      <Snapshot />
    </Canvas>
  );
}
