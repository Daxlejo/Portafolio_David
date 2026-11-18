import { LANGUAGES, SKILLS } from "@/data/portfolio";
import Reveal, { SectionTitle } from "./Reveal";

/** Sección adicional: tecnologías agrupadas e idiomas. */
export default function Skills() {
  return (
    <section id="habilidades" className="relative border-t border-line py-[72px] lg:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionTitle kicker="habilidades" title="Habilidades" subtitle="Sección adicional: tecnologías e idiomas." />
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((g, i) => (
            <Reveal key={g.group} delay={(i % 3) * 70} className="fx card p-4">
              <h3 className="kicker mb-2.5 text-[12.5px]">{`// ${g.group}`}</h3>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <span key={s} className="pill">
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
          <Reveal delay={70} className="fx card p-4">
            <h3 className="kicker mb-2.5 text-[12.5px]">{"// Idiomas"}</h3>
            <ul>
              {LANGUAGES.map((l) => (
                <li key={l.name} className="flex justify-between py-1 text-sm">
                  <span>{l.name}</span>
                  <span className="text-muted">{l.level}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
