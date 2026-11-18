"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { rt } from "@/lib/workshop/runtime";
import { beamTexture, kf, lerpN, mixC, paneTexture, type Tri } from "@/lib/workshop/textures";

/* Vidrio de la ventana y dirección del haz (0.35, −0.75, 1) */
const WX0 = -4.975, WX1 = -2.225, WY0 = 3.73, WY1 = 6.08, WZ = -6.88;
const RDX = 0.35 / 0.75, RDZ = 1 / 0.75;
const Wp = (x: number, y: number) => new THREE.Vector3(x, y, WZ);
const Fp = (x: number, y: number) => new THREE.Vector3(x + RDX * y, 0.075, WZ + RDZ * y);
const BEAM: Tri = [0x6d8ccf, 0xffa860, 0xffdcaa];
const DUST = 80;

function quad(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3, uv = [0, 1, 1, 1, 1, 0, 0, 0]) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute([...a.toArray(), ...b.toArray(), ...c.toArray(), ...d.toArray()], 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex([0, 1, 2, 0, 2, 3]);
  return geo;
}

function createBeam() {
  const beamTex = beamTexture();
  const paneTex = paneTexture();
  const beamMat = new THREE.MeshBasicMaterial({ map: beamTex.tex, color: 0x6d8ccf, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  const patchMat = new THREE.MeshBasicMaterial({ map: paneTex.tex, color: 0x6d8ccf, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const faces = [
    quad(Wp(WX0, WY0), Wp(WX1, WY0), Fp(WX1, WY0), Fp(WX0, WY0)),
    quad(Wp(WX0, WY1), Wp(WX1, WY1), Fp(WX1, WY1), Fp(WX0, WY1)),
    quad(Wp(WX0, WY0), Wp(WX0, WY1), Fp(WX0, WY1), Fp(WX0, WY0)),
    quad(Wp(WX1, WY0), Wp(WX1, WY1), Fp(WX1, WY1), Fp(WX1, WY0)),
  ];
  const patch = quad(Fp(WX0, WY0), Fp(WX1, WY0), Fp(WX1, WY1), Fp(WX0, WY1), [0, 0, 1, 0, 1, 1, 0, 1]);
  const dustPos = new Float32Array(DUST * 3);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustP = Array.from({ length: DUST }, () => ({ s: Math.random(), u: Math.random(), t: Math.random(), v: 0.006 + Math.random() * 0.012, ph: Math.random() * 6.28 }));
  const dustMat = new THREE.PointsMaterial({ color: 0xffe7b8, size: 2.4, sizeAttenuation: false, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  return { beamTex, paneTex, beamMat, patchMat, faces, patch, dustPos, dustGeo, dustP, dustMat, v: new THREE.Vector3(), w: new THREE.Vector3() };
}

/** Haz de luz por la ventana (luna de noche, sol de día), mancha en el piso y polvo flotando. */
export default function LightBeam() {
  const r = useMemo(() => createBeam(), []);
  const live = useRef(r);

  useEffect(
    () => () => {
      r.faces.forEach((f) => f.dispose());
      r.patch.dispose();
      r.dustGeo.dispose();
      r.beamTex.tex.dispose();
      r.paneTex.tex.dispose();
    },
    [r]
  );

  useFrame(() => {
    const r = live.current;
    const p = rt.dayP;
    const now = rt.reduce ? 0 : performance.now();
    mixC(p, BEAM, r.beamMat.color);
    r.beamMat.opacity = kf(p, 0.2, 0.42, 0.22);
    r.patchMat.color.copy(r.beamMat.color);
    r.patchMat.opacity = kf(p, 0.25, 0.7, 0.6);
    r.dustMat.opacity = kf(p, 0.12, 0.55, 0.75);
    r.dustP.forEach((d, i) => {
      const x = lerpN(WX0, WX1, d.s);
      const y = lerpN(WY0, WY1, d.u);
      const t = (((d.t + (now / 1000) * d.v) % 1) * 0.85);
      r.v.copy(Wp(x, y)).lerp(r.w.copy(Fp(x, y)), t);
      r.dustPos[i * 3] = r.v.x + Math.sin(now / 1700 + d.ph) * 0.12;
      r.dustPos[i * 3 + 1] = r.v.y + Math.sin(now / 2300 + d.ph * 2) * 0.1;
      r.dustPos[i * 3 + 2] = r.v.z;
    });
    (r.dustGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <group>
      {r.faces.map((g, i) => (
        <mesh key={i} geometry={g} material={r.beamMat} renderOrder={2} />
      ))}
      <mesh geometry={r.patch} material={r.patchMat} renderOrder={1} />
      <points geometry={r.dustGeo} material={r.dustMat} renderOrder={3} frustumCulled={false} />
    </group>
  );
}
