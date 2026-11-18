"use client";

import { useState, type FormEvent, type MouseEvent } from "react";
import { PROFILE } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from "./Icons";
import Reveal, { SectionTitle } from "./Reveal";

type Status = "idle" | "sending" | "ok" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const CHANNELS = [
  { label: "Correo formal", value: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: <MailIcon />, color: "bg-emerald-500" },
  { label: "LinkedIn", value: "in/lorem-ipsum", href: PROFILE.linkedin, icon: <LinkedinIcon />, color: "bg-[#0a66c2]" },
  { label: "GitHub", value: "@lorem-ipsum", href: PROFILE.github, icon: <GithubIcon />, color: "bg-neutral-800" },
  { label: "WhatsApp", value: PROFILE.phone, href: PROFILE.whatsapp, icon: <WhatsappIcon />, color: "bg-[#25d366]" },
];

// Si defines NEXT_PUBLIC_FORMSPREE_ID en Vercel, el formulario enviará correos reales.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [msgLen, setMsgLen] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2200);
  };

  const copy = (e: MouseEvent, value: string) => {
    e.preventDefault();
    navigator.clipboard?.writeText(value);
    showToast(`📋 Copiado: ${value}`);
  };

  const validate = (data: FormData): Errors => {
    const err: Errors = {};
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (name.length < 2) err.name = "Escribe tu nombre (mín. 2 caracteres).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Ingresa un correo válido.";
    if (message.length < 10) err.message = "El mensaje debe tener al menos 10 caracteres.";
    return err;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const err = validate(data);
    setErrors(err);
    if (Object.keys(err).length) return;

    setStatus("sending");
    try {
      if (FORMSPREE_ID) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error();
      } else {
        await new Promise((r) => setTimeout(r, 1200)); // simulación
      }
      setStatus("ok");
      form.reset();
      setMsgLen(0);
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const inputCls = (bad?: string) =>
    `peer w-full rounded-xl border bg-bg px-4 pb-2.5 pt-6 text-fg outline-none transition focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-soft)] ${
      bad ? "border-red-500" : "border-line"
    }`;
  const labelCls =
    "pointer-events-none absolute left-4 top-4 text-sm text-muted transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs";

  return (
    <section id="contacto" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle kicker="05. contacto" title="Contáctame" subtitle="Lorem ipsum dolor sit amet. Puedes escribirme por correo o seguirme en redes." />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <p className="mb-6 rounded-xl border border-dashed border-accent/40 bg-accent-soft px-4 py-3 font-mono text-xs text-accent">
              💡 Tip: haz clic derecho sobre un contacto para copiarlo.
            </p>
            <div className="space-y-4">
              {CHANNELS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  onContextMenu={(e) => copy(e, c.value)}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:translate-x-2 hover:border-accent"
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-xl text-white ${c.color}`}>{c.icon}</span>
                  <span className="flex-1">
                    <span className="block text-xs text-muted">{c.label}</span>
                    <span className="font-medium">{c.value}</span>
                  </span>
                  <span className="text-muted transition group-hover:translate-x-1 group-hover:text-accent">→</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form onSubmit={onSubmit} noValidate className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="relative">
                    <input id="name" name="name" required minLength={2} placeholder=" " className={inputCls(errors.name)} />
                    <label htmlFor="name" className={labelCls}>Nombre</label>
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <div className="relative">
                    <input id="email" name="email" type="email" required placeholder=" " className={inputCls(errors.email)} />
                    <label htmlFor="email" className={labelCls}>Correo electrónico</label>
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>
              <div className="mt-5">
                <div className="relative">
                  <input id="subject" name="subject" placeholder=" " className={inputCls()} />
                  <label htmlFor="subject" className={labelCls}>Asunto (opcional)</label>
                </div>
              </div>
              <div className="mt-5">
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={500}
                    rows={5}
                    placeholder=" "
                    onChange={(e) => setMsgLen(e.target.value.length)}
                    className={`${inputCls(errors.message)} resize-none`}
                  />
                  <label htmlFor="message" className={labelCls}>Mensaje</label>
                  <span className="absolute bottom-3 right-4 font-mono text-[11px] text-muted">{msgLen}/500</span>
                </div>
                {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-semibold text-black transition hover:shadow-[0_0_30px_var(--glow)] disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" /> Enviando…
                  </>
                ) : (
                  <>
                    Enviar mensaje <span className="transition group-hover:translate-x-1 group-hover:-translate-y-1">✈️</span>
                  </>
                )}
              </button>

              {/* Confirmación */}
              {(status === "ok" || status === "error") && (
                <div className="animate-pop absolute inset-0 grid place-items-center bg-surface/95 text-center backdrop-blur" role="status">
                  <div>
                    <div className={`mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full text-4xl ${status === "ok" ? "bg-accent text-black" : "bg-red-500 text-white"}`}>
                      {status === "ok" ? "✓" : "✕"}
                    </div>
                    <p className="text-xl font-semibold">{status === "ok" ? "¡Mensaje enviado!" : "Algo salió mal"}</p>
                    <p className="mt-1 text-sm text-muted">
                      {status === "ok" ? "Lorem ipsum, te responderé pronto." : "Inténtalo de nuevo en un momento."}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>

      {toast && (
        <div className="animate-pop fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-accent bg-surface px-5 py-2.5 text-sm shadow-xl">
          {toast}
        </div>
      )}
    </section>
  );
}
