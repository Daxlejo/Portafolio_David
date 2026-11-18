"use client";

import { Canvas } from "@react-three/fiber";
import { closeSection } from "@/lib/workshop/actions";
import { rt } from "@/lib/workshop/runtime";
import CameraRig from "./CameraRig";
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
    </Canvas>
  );
}
