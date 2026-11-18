export type SectionId = "sobre" | "proyectos" | "testimonios" | "experiencia" | "habilidades" | "terminal" | "contacto";

export type Vec3 = [number, number, number];

export type WorkshopSection = {
  id: SectionId;
  label: string;
  /** Comando que aparece en el toast */
  status: string;
  /** Kicker del panel */
  kicker: string;
  /** Posición de la etiqueta flotante */
  anchor: Vec3;
  /** Punto al que mira la cámara */
  focus: Vec3;
  zoom: number;
  /** id de la sección equivalente en la vista clásica */
  classicId: string;
};

/** Orden de los chips = orden de la vista clásica (Contacto al final). */
export const SECTIONS: WorkshopSection[] = [
  { id: "sobre", label: "Sobre mí", status: "whoami", kicker: "~/sobre-mi", anchor: [0.35, 2.3, -2.45], focus: [0.35, 3.0, -3.6], zoom: 2.1, classicId: "sobre-mi" },
  { id: "proyectos", label: "Proyectos", status: "cd ~/proyectos", kicker: "~/proyectos", anchor: [0.3, 5.0, -6.1], focus: [0.3, 4.1, -6.0], zoom: 2.4, classicId: "proyectos" },
  { id: "testimonios", label: "Testimonios", status: "cat testimonios.txt", kicker: "~/testimonios", anchor: [4.7, 5.85, -6.9], focus: [4.7, 4.6, -6.9], zoom: 2.5, classicId: "testimonios" },
  { id: "experiencia", label: "Experiencia", status: "cat experiencia.md", kicker: "~/experiencia", anchor: [-6.95, 6.15, -1.4], focus: [-6.9, 4.5, -1.4], zoom: 2.0, classicId: "experiencia" },
  { id: "habilidades", label: "Habilidades", status: "ls ~/stack", kicker: "~/stack", anchor: [-5.75, 3.55, -5.5], focus: [-5.7, 1.7, -5.4], zoom: 2.1, classicId: "habilidades" },
  { id: "terminal", label: "Terminal", status: "ssh taller", kicker: "~/terminal", anchor: [2.65, 3.85, -5.6], focus: [2.6, 3.0, -5.4], zoom: 3.0, classicId: "playground" },
  { id: "contacto", label: "Contacto", status: "mail david", kicker: "~/contacto", anchor: [-1.05, 3.3, -4.45], focus: [-1.05, 2.9, -4.45], zoom: 3.3, classicId: "contacto" },
];

export const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<SectionId, WorkshopSection>;

/** Traduce un hash de la URL (`#proyectos`, `#sobre-mi`, `#playground`…) a una sección del taller. */
export function sectionFromHash(hash: string): SectionId | null {
  const h = hash.replace(/^#/, "");
  const s = SECTIONS.find((x) => x.id === h || x.classicId === h);
  return s ? s.id : null;
}
