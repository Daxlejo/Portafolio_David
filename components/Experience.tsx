import { EXPERIENCES, type Experience as Exp } from "@/data/portfolio";
import Reveal, { SectionTitle } from "./Reveal";

/** Tarjeta de ejemplo si todavía no hay experiencia laboral registrada. */
const LABORAL_PLACEHOLDER: Exp = {
  type: "laboral",
  period: "Fecha de inicio – fin",
  title: "Cargo (prácticas, empleo o freelance)",
  place: "Empresa o cliente",
  text: "Responsabilidades y logros principales.",
};

export function Timeline({ items }: { items: Exp[] }) {
  return (
    <ol className="tl">
      {items.map((e) => (
        <li key={`${e.title}-${e.period}`} className="tl-item">
          <p className="font-mono text-xs text-muted">{e.period}</p>
          <h4 className="tl-title my-0.5 text-[15.5px] font-semibold transition-colors">{e.title}</h4>
          <p className="text-[13px] text-muted">{e.place}</p>
          {e.points?.length ? (
            <ul className="mt-1.5 list-disc space-y-1 pl-[18px] text-sm leading-relaxed marker:text-accent">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-sm leading-relaxed">{e.text}</p>
          )}
        </li>
      ))}
    </ol>
  );
}

export const academic = () => EXPERIENCES.filter((e) => e.type === "academica");
export const laboral = () => {
  const l = EXPERIENCES.filter((e) => e.type === "laboral");
  return l.length ? l : [LABORAL_PLACEHOLDER];
};

export default function Experience() {
  return (
    <section id="experiencia" className="relative border-t border-line py-[72px] lg:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionTitle kicker="experiencia" title="Experiencia académica y laboral" subtitle="Mi formación y mi recorrido profesional." />
        <div className="grid gap-7 md:grid-cols-2">
          <Reveal className="fx card p-6">
            <h3 className="mb-[18px] flex items-center gap-2.5 text-[17px] font-semibold">
              <span aria-hidden>🎓</span> Académica
            </h3>
            <Timeline items={academic()} />
          </Reveal>
          <Reveal delay={100} className="fx card p-6">
            <h3 className="mb-[18px] flex items-center gap-2.5 text-[17px] font-semibold">
              <span aria-hidden>💼</span> Laboral
            </h3>
            <Timeline items={laboral()} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
