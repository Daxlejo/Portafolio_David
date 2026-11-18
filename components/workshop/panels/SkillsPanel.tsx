import { LANGUAGES, SKILLS } from "@/data/portfolio";

export default function SkillsPanel() {
  return (
    <div>
      {SKILLS.map((g) => (
        <section key={g.group} className="mb-4">
          <h3 className="mb-2 text-xs font-medium tracking-[0.06em] text-muted uppercase">{g.group}</h3>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((s) => (
              <span key={s} className="pill">
                {s}
              </span>
            ))}
          </div>
        </section>
      ))}
      <section>
        <h3 className="mb-2 text-xs font-medium tracking-[0.06em] text-muted uppercase">Idiomas</h3>
        {LANGUAGES.map((l) => (
          <div key={l.name} className="flex justify-between border-b border-line py-1.5 text-sm last:border-0">
            <span>{l.name}</span>
            <span className="text-muted">{l.level}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
