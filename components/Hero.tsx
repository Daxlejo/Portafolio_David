"use client";

import Image from "next/image";
import { PROFILE } from "@/data/portfolio";
import { openWorkshop, useWorkshop } from "@/lib/workshop/store";
import { CubeIcon, DownloadIcon, GithubIcon, LinkedinIcon, MailIcon } from "./Icons";
import Reveal from "./Reveal";
import WorkshopPreview from "./workshop/WorkshopPreview";

export const SOCIALS = [
  { href: PROFILE.github, icon: <GithubIcon />, label: "GitHub", external: true },
  { href: PROFILE.linkedin, icon: <LinkedinIcon />, label: "LinkedIn", external: true },
  { href: `mailto:${PROFILE.email}`, icon: <MailIcon />, label: "Correo", external: false },
];

export function SocialLinks() {
  return (
    <div className="flex gap-2">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          {...(s.external ? { target: "_blank", rel: "noreferrer" } : {})}
          aria-label={s.label}
          title={s.label}
          className="btn btn-icon hover:-translate-y-[3px] hover:text-accent"
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

export default function Hero() {
  const canOpenWorkshop = useWorkshop((s) => s.available);

  return (
    <section id="inicio" className="relative">
      <div className="mx-auto grid min-h-[calc(100svh-62px)] max-w-[1180px] items-center gap-14 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-14 lg:pb-[72px]">
        <Reveal>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent-soft px-3 py-1.5 font-mono text-[12.5px] font-medium text-accent">
            <i className="ping-dot" aria-hidden />
            Disponible para nuevos retos
          </span>
          <p className="mt-6 mb-1.5 text-lg text-muted">👋 Hola que tal, soy</p>
          <h1 className="text-[clamp(38px,6vw,66px)] leading-[1.04] font-semibold tracking-[-0.025em]">
            {PROFILE.firstName}
            <br />
            <span className="text-gradient">{PROFILE.lastName}</span>
          </h1>
          <p className="mt-5 mb-7 max-w-[580px] text-[16.5px] leading-[1.75] text-muted">{PROFILE.tagline}</p>

          <div className="flex flex-wrap gap-2.5">
            <a href={PROFILE.cv} download className="btn btn-lg btn-accent">
              <DownloadIcon /> Descargar CV
            </a>
            <a href="#proyectos" className="btn btn-lg">
              Ver proyectos →
            </a>
            {canOpenWorkshop && (
              <button type="button" onClick={openWorkshop} className="btn btn-lg" title="Entrar al taller 3D">
                <CubeIcon /> Taller 3D
              </button>
            )}
          </div>

          <div className="mt-[22px]">
            <SocialLinks />
          </div>

          {canOpenWorkshop && <WorkshopPreview />}
        </Reveal>

        {/* Foto */}
        <Reveal delay={120} className="w-full">
          <div className="portrait relative mx-auto w-[min(400px,calc(100%-24px))] lg:mr-0 lg:ml-auto">
            <div className="pframe relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-surface shadow-[var(--shadow)]">
              <Image
                src={PROFILE.photo}
                alt={`Foto de ${PROFILE.fullName}`}
                fill
                preload
                sizes="(min-width: 1024px) 400px, 90vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-60% to-[rgba(5,10,20,0.35)]" />
            </div>
            <div className="glass absolute bottom-4 left-3 z-[2] rounded-2xl border border-line px-4 py-3 shadow-[var(--shadow)] lg:-left-[30px] lg:bottom-[34px]">
              <b className="block text-[19px] font-semibold text-accent">2 años programando</b>
              <span className="text-[12.5px] text-muted">5.º semestre · UCC Pasto</span>
            </div>
            <span className="badge-float -top-4 -right-[26px] hidden lg:block">{"<CleanArchitecture />"}</span>
            <span className="badge-float top-[58%] -right-[34px] hidden [animation-delay:-2s] lg:block">☕ Java · Spring Boot</span>
            <span className="badge-float right-2.5 -bottom-3.5 hidden [animation-delay:-4s] lg:block">
              🤖 IA: <b className="font-medium text-accent">integrada</b>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
