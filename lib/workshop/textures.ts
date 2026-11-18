import * as THREE from "three";
import { WHITEBOARD } from "@/data/portfolio";

/* =========================================================
   Generadores de CanvasTexture del taller. Se crean una vez y
   se actualizan con `needsUpdate` cuando cambian.
   ========================================================= */

export type CanvasTex = { tex: THREE.CanvasTexture; g: CanvasRenderingContext2D; w: number; h: number };

export function canvasTex(w: number, h: number, draw?: (g: CanvasRenderingContext2D, w: number, h: number) => void): CanvasTex {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d") as CanvasRenderingContext2D;
  draw?.(g, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, g, w, h };
}

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Familia tipográfica real de una fuente de next/font (variable CSS). */
export function cssFont(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

export const monoFont = () => cssFont("--font-jetbrains", "ui-monospace, monospace");
export const handFont = () => cssFont("--font-caveat", "cursive");

/* ---------- utilidades de interpolación ---------- */
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
/** Interpola en tres fotogramas clave: noche (0), amanecer (0.5), día (1). */
export const kf = (p: number, a: number, b: number, c: number) => (p < 0.5 ? lerpN(a, b, p / 0.5) : lerpN(b, c, (p - 0.5) / 0.5));
const _ca = new THREE.Color();
const _cb = new THREE.Color();
export type Tri = [number, number, number];
export function mixC(p: number, [a, b, c]: Tri, out = new THREE.Color()) {
  if (p < 0.5) {
    _ca.set(a);
    _cb.set(b);
    return out.copy(_ca).lerp(_cb, p / 0.5);
  }
  _ca.set(b);
  _cb.set(c);
  return out.copy(_ca).lerp(_cb, (p - 0.5) / 0.5);
}

/* ---------- piso de tablones ---------- */
export function floorTexture() {
  const t = canvasTex(512, 512, (g, w) => {
    for (let i = 0; i < 8; i++) {
      const y = i * 64;
      g.fillStyle = ["#7a5537", "#73502f", "#7e5839", "#6f4c30"][i % 4];
      g.fillRect(0, y, w, 64);
      g.fillStyle = "rgba(0,0,0,.28)";
      g.fillRect(0, y, w, 2);
      const off = (i * 173) % w;
      g.fillRect(off, y, 2, 64);
      g.fillRect((off + 256) % w, y, 2, 64);
      g.fillStyle = "rgba(255,255,255,.035)";
      for (let k = 0; k < 6; k++) g.fillRect(((i * 97 + k * 131) % 460), y + 8 + ((k * 37) % 48), 60 + ((k * 53) % 90), 1.5);
    }
  });
  t.tex.wrapS = t.tex.wrapT = THREE.RepeatWrapping;
  t.tex.repeat.set(2.2, 2.2);
  return t;
}

/* ---------- cielo dinámico con el Galeras ---------- */
export const SKYC: Record<"top" | "bot" | "volc" | "town", Tri> = {
  top: [0x0b1430, 0x5a4a8a, 0x7cc3ff],
  bot: [0x26365e, 0xff9a6b, 0xd8efff],
  volc: [0x121b33, 0x3b2c49, 0x5f7f8f],
  town: [0x0b1124, 0x261f33, 0x3e5a4a],
};

export function skyTexture() {
  const t = canvasTex(400, 340);
  const stars = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random() * 0.62, a: 0.3 + Math.random() * 0.7 }));
  const town = Array.from({ length: 46 }, () => ({ x: Math.random(), y: 0.845 + Math.random() * 0.13, g: (190 + Math.random() * 50) | 0 }));
  const moon = document.createElement("canvas");
  moon.width = moon.height = 64;
  {
    const g = moon.getContext("2d") as CanvasRenderingContext2D;
    g.fillStyle = "#f4ecd0";
    g.beginPath();
    g.arc(32, 32, 24, 0, 7);
    g.fill();
    g.globalCompositeOperation = "destination-out";
    g.beginPath();
    g.arc(42, 25, 21, 0, 7);
    g.fill();
  }
  const c = new THREE.Color();
  const c2 = new THREE.Color();
  const style = (col: THREE.Color) => `#${col.getHexString()}`;

  const draw = (p: number) => {
    const { g, w, h } = t;
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, style(mixC(p, SKYC.top, c)));
    grd.addColorStop(1, style(mixC(p, SKYC.bot, c)));
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    // estrellas: se apagan antes de p = 0.42
    const sa = clamp01(1 - p / 0.42);
    if (sa > 0)
      stars.forEach((s) => {
        g.fillStyle = `rgba(255,255,255,${s.a * sa})`;
        g.fillRect(s.x * w, s.y * h, 1.6, 1.6);
      });
    // luna creciente: baja y se desvanece hasta p = 0.55
    const mp = clamp01(p / 0.55);
    if (mp < 1) {
      g.globalAlpha = 1 - mp;
      g.drawImage(moon, w * 0.74 - 32 - mp * 50, h * 0.24 - 32 + mp * h * 0.5);
      g.globalAlpha = 1;
    }
    // sol: sale detrás del Galeras desde p = 0.16
    const sp = clamp01((p - 0.16) / 0.84);
    if (sp > 0) {
      const sx = w * (0.56 + 0.2 * sp);
      const sy = h * (0.84 - 0.62 * sp);
      const glow = g.createRadialGradient(sx, sy, 6, sx, sy, 150 * (1.15 - sp * 0.5));
      glow.addColorStop(0, `rgba(255,${(150 + sp * 95) | 0},${(80 + sp * 130) | 0},${0.6 * (1 - sp) + 0.22})`);
      glow.addColorStop(1, "rgba(255,190,140,0)");
      g.fillStyle = glow;
      g.fillRect(0, 0, w, h);
      c.set(0xff7a3d).lerp(c2.set(0xfff6d5), sp);
      g.fillStyle = style(c);
      g.beginPath();
      g.arc(sx, sy, 21 + 7 * (1 - sp), 0, 7);
      g.fill();
    }
    // nubes desde p = 0.5
    const ca = clamp01((p - 0.5) / 0.4);
    if (ca > 0) {
      g.fillStyle = `rgba(255,255,255,${0.9 * ca})`;
      [
        [0.2, 0.25],
        [0.33, 0.19],
        [0.56, 0.3],
      ].forEach(([x, y]) => {
        g.beginPath();
        g.ellipse(w * x - (1 - ca) * 40, h * y, 34, 11, 0, 0, 7);
        g.fill();
      });
    }
    // volcán Galeras
    g.fillStyle = style(mixC(p, SKYC.volc, c));
    g.beginPath();
    g.moveTo(0, h * 0.78);
    g.lineTo(w * 0.18, h * 0.62);
    g.lineTo(w * 0.4, h * 0.4);
    g.lineTo(w * 0.46, h * 0.43);
    g.lineTo(w * 0.52, h * 0.39);
    g.lineTo(w * 0.75, h * 0.6);
    g.lineTo(w, h * 0.7);
    g.lineTo(w, h);
    g.lineTo(0, h);
    g.fill();
    g.fillStyle = "rgba(255,255,255,.16)";
    g.beginPath();
    g.ellipse(w * 0.47, h * 0.385, 11, 3, 0, 0, 7);
    g.fill();
    // pueblo: las luces se apagan hasta p = 0.62
    g.fillStyle = style(mixC(p, SKYC.town, c));
    g.fillRect(0, h * 0.86, w, h * 0.14);
    const la = clamp01(1 - p / 0.62);
    town.forEach((tw) => {
      g.fillStyle = la > 0 ? `rgba(255,${tw.g},120,${la})` : "rgba(255,255,255,.22)";
      g.fillRect(tw.x * w, tw.y * h, 2.2, 2.2);
    });
    t.tex.needsUpdate = true;
  };
  return { ...t, draw };
}

/* ---------- monitor: código que se escribe solo ---------- */
const P = "#64748b", K = "#c084fc", V = "#7dd3fc", S = "#86efac", F = "#fbbf24", T = "#e2e8f0";
const CODE: [string, string][][] = [
  [[P, "// taller.ts"]],
  [[K, "import"], [T, " { Arquitectura } "], [K, "from"], [S, " '@/limpia'"], [T, ";"]],
  [],
  [[K, "const"], [V, " david"], [T, " = {"]],
  [[T, "  rol: "], [S, "'Ingeniero de software'"], [T, ","]],
  [[T, "  enfoque: ["], [S, "'backend'"], [T, ", "], [S, "'arquitectura'"], [T, "],"]],
  [[T, "  base: "], [S, "'Pasto, Colombia'"], [T, ","]],
  [[T, "  disponible: "], [K, "true"], [T, ","]],
  [[T, "};"]],
  [],
  [[K, "export async function"], [F, " construir"], [T, "(idea) {"]],
  [[K, "  return"], [T, " david."], [F, "resolver"], [T, "(idea);"]],
  [[T, "}"]],
];
export const CODE_LEN = CODE.reduce((a, l) => a + l.reduce((b, t) => b + t[1].length, 0) + 1, 0);

export function codeTexture() {
  const t = canvasTex(640, 368);
  const font = monoFont();
  const draw = (typed: number, now: number) => {
    const { g, w, h } = t;
    g.fillStyle = "#101a2e";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#18233a";
    g.fillRect(0, 0, w, 30);
    ["#f87171", "#fbbf24", "#34d399"].forEach((c, i) => {
      g.fillStyle = c;
      g.beginPath();
      g.arc(18 + i * 16, 15, 5, 0, 7);
      g.fill();
    });
    g.fillStyle = "#0d1424";
    g.fillRect(70, 6, 120, 24);
    g.fillStyle = "#cbd5e1";
    g.font = `13px ${font}`;
    g.fillText("taller.ts", 86, 23);
    g.font = `17px ${font}`;
    let left = typed;
    let y = 60;
    let cx = 50;
    let cy = 60;
    CODE.forEach((line, i) => {
      g.fillStyle = "#334155";
      g.fillText(String(i + 1).padStart(2, " "), 12, y);
      let x = 50;
      for (const [c, s0] of line) {
        if (left <= 0) break;
        const s = s0.slice(0, Math.max(0, left));
        g.fillStyle = c;
        g.fillText(s, x, y);
        x += g.measureText(s).width;
        left -= s0.length;
        if (left < 0) {
          cx = x;
          cy = y;
        }
      }
      if (left >= 0) {
        cx = x;
        cy = y;
      }
      left -= 1;
      y += 23.5;
    });
    if (((now / 500) | 0) % 2 === 0) {
      g.fillStyle = "#2dd4bf";
      g.fillRect(cx + 1, cy - 14, 8, 18);
    }
    t.tex.needsUpdate = true;
  };
  return { ...t, draw };
}

/* ---------- laptop: terminal con cursor ---------- */
export function termTexture() {
  const t = canvasTex(320, 200);
  const font = monoFont();
  const draw = (now: number) => {
    const g = t.g;
    g.fillStyle = "#070b12";
    g.fillRect(0, 0, 320, 200);
    g.font = `13px ${font}`;
    g.fillStyle = "#2dd4bf";
    g.fillText("$ npm run build", 12, 26);
    g.fillStyle = "#86efac";
    g.fillText("✓ compilado en 3.2 s", 12, 48);
    g.fillStyle = "#2dd4bf";
    g.fillText("$ git push origin main", 12, 74);
    g.fillStyle = "#94a3b8";
    g.fillText("→ desplegando…", 12, 96);
    g.fillStyle = "#86efac";
    g.fillText("✓ listo en producción", 12, 118);
    g.fillStyle = "#2dd4bf";
    g.fillText("$ ", 12, 144);
    if (((now / 530) | 0) % 2 === 0) {
      g.fillStyle = "#e2e8f0";
      g.fillRect(30, 132, 8, 15);
    }
    t.tex.needsUpdate = true;
  };
  return { ...t, draw };
}

/* ---------- pizarra: línea de tiempo y diagrama ---------- */
export function whiteboardTexture() {
  const t = canvasTex(1000, 560);
  const draw = () => {
    const { g, w, h } = t;
    const font = handFont();
    g.fillStyle = "#f8fafc";
    g.fillRect(0, 0, w, h);
    const hand = (s: string, x: number, y: number, c = "#1e293b", sz = 40) => {
      g.fillStyle = c;
      g.font = `600 ${sz}px ${font}`;
      g.fillText(s, x, y);
    };
    hand("Experiencia", 40, 64, "#0f766e", 52);
    g.strokeStyle = "#1e293b";
    g.lineWidth = 4;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(60, 200);
    g.bezierCurveTo(300, 195, 600, 206, 940, 198);
    g.stroke();
    WHITEBOARD.timeline.forEach((m, i) => {
      const x = [110, 440, 770][i] ?? 110 + i * 330;
      g.fillStyle = "#0f766e";
      g.beginPath();
      g.arc(x, 200, 12, 0, 7);
      g.fill();
      hand(m.year, x - 28, 165, "#1e293b", 38);
      hand(m.label, x - 70, 250, "#334155", 32);
    });
    const box = (x: number, y: number, w2: number, label: string, c: string) => {
      g.strokeStyle = c;
      g.lineWidth = 3.5;
      rr(g, x, y, w2, 62, 10);
      g.stroke();
      hand(label, x + 18, y + 42, c, 34);
    };
    const [a, b, c] = WHITEBOARD.diagram;
    box(60, 340, 200, a, "#1e293b");
    box(390, 340, 130, b, "#b45309");
    box(650, 340, 270, c, "#0f766e");
    g.strokeStyle = "#1e293b";
    g.lineWidth = 3;
    [
      [260, 371, 390],
      [520, 371, 650],
    ].forEach(([x1, y, x2]) => {
      g.beginPath();
      g.moveTo(x1 + 8, y);
      g.lineTo(x2 - 10, y);
      g.stroke();
      g.beginPath();
      g.moveTo(x2 - 22, y - 10);
      g.lineTo(x2 - 8, y);
      g.lineTo(x2 - 22, y + 10);
      g.stroke();
    });
    hand(WHITEBOARD.diagramNote, 360, 470, "#b91c1c", 32);
    t.tex.needsUpdate = true;
  };
  draw();
  return { ...t, draw };
}

/* ---------- corcho con notas ---------- */
export function corkTexture() {
  return canvasTex(600, 400, (g, w, h) => {
    g.fillStyle = "#b8865a";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1600; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "90,55,30" : "230,190,140"},.35)`;
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
    const notes: [string, number, number, number][] = [
      ["#fde68a", 40, 40, -0.08],
      ["#a7f3d0", 220, 30, 0.05],
      ["#fbcfe8", 400, 55, -0.04],
      ["#fef3c7", 130, 210, 0.06],
      ["#bfdbfe", 320, 215, -0.06],
    ];
    notes.forEach(([c, x, y, r]) => {
      g.save();
      g.translate(x + 80, y + 75);
      g.rotate(r);
      g.fillStyle = "rgba(0,0,0,.18)";
      g.fillRect(-76, -68, 160, 150);
      g.fillStyle = c;
      g.fillRect(-80, -72, 160, 150);
      g.fillStyle = "rgba(30,41,59,.65)";
      g.font = "600 42px Georgia, serif";
      g.fillText("“", -66, -30);
      for (let k = 0; k < 4; k++) g.fillRect(-60, -22 + k * 22, 100 + Math.random() * 20, 4);
      g.fillStyle = "#dc2626";
      g.beginPath();
      g.arc(0, -64, 7, 0, 7);
      g.fill();
      g.restore();
    });
  });
}

/* ---------- haz de luz y mancha en el piso ---------- */
export function beamTexture() {
  const t = canvasTex(4, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(255,255,255,.5)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  return t;
}

export function paneTexture() {
  return canvasTex(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.shadowColor = "rgba(255,255,255,1)";
    g.shadowBlur = 18;
    g.fillStyle = "rgba(255,255,255,.85)";
    [
      [14, 14],
      [134, 14],
      [14, 140],
      [134, 140],
    ].forEach(([x, y]) => {
      rr(g, x, y, 108, 102, 6);
      g.fill();
    });
  });
}
