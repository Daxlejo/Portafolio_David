import Image from "next/image";
import { PROJECTS, type Project } from "@/data/portfolio";
import { DownloadIcon, ExternalIcon, GithubIcon } from "./Icons";
import Reveal, { SectionTitle } from "./Reveal";

/** Botones del proyecto: descargas en sólido, repositorios con borde e ícono de GitHub, "próximamente" deshabilitado. */
export function ProjectLinks({ p }: { p: Project }) {
  const size = "h-9 text-[13px]";
  return (
    <div className="flex flex-wrap gap-2">
      {p.links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className={`btn ${size} ${l.kind === "download" ? "btn-solid" : l.kind === "demo" ? "btn-accent" : ""}`}
          aria-label={`${l.label}: ${p.title}`}
        >
          {l.kind === "github" ? <GithubIcon className="h-4 w-4" /> : l.kind === "demo" ? <ExternalIcon className="h-4 w-4" /> : <DownloadIcon className="h-4 w-4" />}
          {l.label}
        </a>
      ))}
      {p.soon.map((t) => (
        <span key={t} className={`btn btn-off ${size}`} title="Disponible pronto" aria-disabled="true">
          {t}
        </span>
      ))}
      {!p.links.some((l) => l.kind === "demo") && p.soon.length === 0 && (
        <span className={`btn btn-off ${size}`} title="Este proyecto no tiene demo web">
          sin demo
        </span>
      )}
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const feat = !!p.featured;
  return (
    <Reveal
      as="article"
      className={`fx card flex flex-col overflow-hidden ${feat ? "md:col-span-2 md:flex-row" : ""}`}
    >
      <div
        className={`cover relative aspect-video overflow-hidden border-line bg-bg ${
          feat ? "border-b md:aspect-auto md:min-h-[320px] md:flex-[0_0_52%] md:border-r md:border-b-0" : "border-b"
        }`}
      >
        <Image
          src={p.cover}
          alt={`Portada del proyecto ${p.title}`}
          fill
          sizes={feat ? "(min-width: 768px) 600px, 100vw" : "(min-width: 768px) 560px, 100vw"}
          className="object-cover"
        />
        <span className="glass absolute top-3 right-3 z-[1] rounded-full border border-line px-2.5 py-1 font-mono text-[11.5px] font-medium">
          {p.kind}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-5 pt-[18px] pb-5">
        <p className="font-mono text-xs font-medium text-accent">{p.meta}</p>
        <h3 className={`font-semibold ${feat ? "text-[22px]" : "text-lg"}`}>{p.title}</h3>
        <p className="text-sm leading-[1.65] text-muted">{p.text}</p>
        {p.solutions.length > 0 && (
          <ul className="mt-1.5 list-disc pl-[18px] text-[13.5px] leading-relaxed marker:text-accent">
            {p.solutions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-3.5">
          <ProjectLinks p={p} />
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  const ordered = [...PROJECTS.filter((p) => p.featured), ...PROJECTS.filter((p) => !p.featured)];
  return (
    <section id="proyectos" className="relative border-t border-line py-[72px] lg:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionTitle
          kicker="proyectos"
          title="Mis proyectos"
          subtitle="Proyectos reales, la mayoría en equipo, con su repositorio o su descarga."
        />
        <div className="grid gap-[18px] md:grid-cols-2">
          {ordered.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
