import Image from "next/image";
import { PROJECTS } from "@/data/portfolio";
import { ProjectLinks } from "../../Projects";

export default function ProjectsPanel() {
  return (
    <div>
      {PROJECTS.map((p) => (
        <article key={p.id} className="card mb-3 rounded-[14px] px-4 py-3.5">
          <Image src={p.cover} alt="" width={420} height={236} className="mb-3 aspect-video w-full rounded-[10px] border border-line object-cover" />
          <h3 className="mb-1 flex justify-between gap-2 text-[15.5px] font-semibold">
            {p.title}
            <span className="text-xs font-normal text-muted">{p.kind}</span>
          </h3>
          <p className="mb-1.5 font-mono text-[11.5px] text-accent">{p.meta}</p>
          <p className="text-sm text-muted">{p.text}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {p.tech.map((t) => (
              <span key={t} className="pill text-[11.5px]">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3">
            <ProjectLinks p={p} />
          </div>
        </article>
      ))}
    </div>
  );
}
