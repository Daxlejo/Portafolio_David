import { ABOUT, NAV_LINKS, PROFILE, PROJECTS, SKILLS } from "@/data/portfolio";

/** Salida de un comando: datos puros, cada vista decide cómo pintarlos. */
export type TermOutput =
  | { kind: "text"; text: string; tone?: "accent" | "muted" | "error" }
  | { kind: "table"; rows: { key: string; value: string }[] };

export type TermEffect = "clear" | "theme" | "cv" | "matrix" | { goto: string };

export type TermResult = { output: TermOutput[]; effect?: TermEffect };

export const TERM_HELP: Record<string, string> = {
  help: "Muestra esta ayuda",
  whoami: "¿Quién soy?",
  about: "Un poco sobre mí",
  proyectos: "Lista de proyectos",
  stack: "Mis tecnologías",
  contacto: "Cómo contactarme",
  ir: "Navega a una sección: ir proyectos",
  cv: "Descarga mi hoja de vida",
  tema: "Alterna modo día / noche",
  matrix: "🕶️ …",
  fecha: "Fecha y hora actual",
  clear: "Limpia la terminal",
};

/** Alias en inglés para quien llegue escribiendo los comandos clásicos. */
const ALIAS: Record<string, string> = {
  projects: "proyectos",
  skills: "stack",
  contact: "contacto",
  goto: "ir",
  theme: "tema",
  date: "fecha",
};

export const TERM_COMMANDS = Object.keys(TERM_HELP);

const text = (t: string, tone?: "accent" | "muted" | "error"): TermOutput => ({ kind: "text", text: t, tone });

/** Ejecuta un comando y devuelve su salida y el efecto que la vista debe aplicar. */
export function runCommand(raw: string): TermResult {
  const [first = "", ...args] = raw.trim().split(/\s+/);
  const cmd = ALIAS[first.toLowerCase()] ?? first.toLowerCase();
  const arg = (args[0] ?? "").toLowerCase();

  switch (cmd) {
    case "":
      return { output: [] };
    case "help":
      return { output: [{ kind: "table", rows: Object.entries(TERM_HELP).map(([key, value]) => ({ key, value })) }] };
    case "whoami":
      return { output: [text(`${PROFILE.fullName} — ${PROFILE.role} · ${PROFILE.location}`)] };
    case "about":
      return { output: [text(ABOUT.paragraphs[0])] };
    case "proyectos":
      return { output: [{ kind: "table", rows: PROJECTS.map((p) => ({ key: p.title, value: p.kind })) }] };
    case "stack":
      return { output: SKILLS.map((g) => text(`${g.group}: ${g.items.join(", ")}`)) };
    case "contacto":
      return {
        output: [
          {
            kind: "table",
            rows: [
              { key: "correo", value: PROFILE.email },
              { key: "github", value: PROFILE.github },
              { key: "linkedin", value: PROFILE.linkedin },
            ],
          },
        ],
      };
    case "ir": {
      const target = NAV_LINKS.find((l) => arg && (l.id.startsWith(arg) || l.label.toLowerCase().startsWith(arg)));
      if (!target) return { output: [text(`Uso: ir [${NAV_LINKS.map((l) => l.id).join(" | ")}]`, "error")] };
      return { output: [text(`→ yendo a ${target.label}…`, "muted")], effect: { goto: target.id } };
    }
    case "cv":
      return { output: [text("📄 Abriendo cv.pdf …", "muted")], effect: "cv" };
    case "tema":
      return { output: [text("🌓 Cambiando de modo…", "muted")], effect: "theme" };
    case "matrix":
      return { output: [text("Sigue al conejo blanco 🐇", "accent")], effect: "matrix" };
    case "fecha":
      return { output: [text(new Date().toLocaleString("es-CO"))] };
    case "sudo":
      return { output: [text("Permiso denegado. Buen intento 😏", "error")] };
    case "clear":
      return { output: [], effect: "clear" };
    default:
      return { output: [text(`comando no encontrado: ${first}. Escribe help.`, "error")] };
  }
}

/** Autocompletado con Tab. */
export function completeCommand(partial: string): string | null {
  const p = partial.toLowerCase();
  if (!p) return null;
  return TERM_COMMANDS.find((c) => c.startsWith(p)) ?? null;
}
