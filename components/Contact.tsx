"use client";

import { useState } from "react";
import { PROFILE } from "@/data/portfolio";
import ContactForm from "./ContactForm";
import { GithubIcon, LinkedinIcon, MailIcon, PinIcon } from "./Icons";
import Reveal, { SectionTitle } from "./Reveal";

const rowCls = "fx card flex items-center gap-3 rounded-[14px] px-4 py-3.5";
const iconCls = "icard-ic grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent";

/** Botón "Copiar" del correo. */
export function CopyEmail() {
  const [label, setLabel] = useState("Copiar");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setLabel("Copiado");
    } catch {
      setLabel("Cópialo a mano");
    }
    setTimeout(() => setLabel("Copiar"), 1600);
  };
  return (
    <button type="button" onClick={copy} className="btn ml-auto h-8 text-xs" aria-label={`Copiar el correo ${PROFILE.email}`}>
      <span aria-live="polite">{label}</span>
    </button>
  );
}

/** Filas de contacto: correo, GitHub, LinkedIn y ubicación (sin teléfono). */
export function ContactRows() {
  return (
    <div className="space-y-2.5">
      <div className={rowCls}>
        <span className={iconCls}><MailIcon className="h-[18px] w-[18px]" /></span>
        <span className="min-w-0">
          <b className="block text-xs font-medium text-muted">Correo</b>
          <a href={`mailto:${PROFILE.email}`} className="break-all hover:text-accent">{PROFILE.email}</a>
        </span>
        <CopyEmail />
      </div>
      <a href={PROFILE.github} target="_blank" rel="noreferrer" className={rowCls}>
        <span className={iconCls}><GithubIcon className="h-[18px] w-[18px]" /></span>
        <span>
          <b className="block text-xs font-medium text-muted">GitHub</b>
          github.com/{PROFILE.githubUser}
        </span>
        <span className="ml-auto text-muted" aria-hidden>↗</span>
      </a>
      <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className={rowCls}>
        <span className={iconCls}><LinkedinIcon className="h-[18px] w-[18px]" /></span>
        <span>
          <b className="block text-xs font-medium text-muted">LinkedIn</b>
          {PROFILE.linkedinLabel}
        </span>
        <span className="ml-auto text-muted" aria-hidden>↗</span>
      </a>
      <div className={rowCls}>
        <span className={iconCls}><PinIcon className="h-[18px] w-[18px]" /></span>
        <span>
          <b className="block text-xs font-medium text-muted">Ubicación</b>
          {PROFILE.location}
        </span>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contacto" className="relative border-t border-line py-[72px] lg:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionTitle kicker="contacto" title="Contacto" subtitle="¿Tienes una vacante, un proyecto o una idea? Escríbeme." />
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <ContactRows />
          </Reveal>
          <Reveal delay={100} className="fx card rounded-[18px] p-[22px]">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
