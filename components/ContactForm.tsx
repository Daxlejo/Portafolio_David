"use client";

import { useId, useState, type FormEvent } from "react";
import { PROFILE } from "@/data/portfolio";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; text: string } | { kind: "error"; text: string };
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

/** ID del formulario de Formspree (variable de entorno en Vercel). */
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

function validate(data: FormData): Errors {
  const err: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  if (name.length < 2) err.name = "Escribe tu nombre (mínimo 2 caracteres).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Ese correo no parece válido. Revísalo.";
  if (message.length < 10) err.message = "El mensaje debe tener al menos 10 caracteres.";
  return err;
}

/**
 * Formulario de contacto validado. Envía con Formspree; si no hay ID configurado,
 * abre el cliente de correo del visitante con el mensaje ya escrito.
 * Lo usan la vista clásica y el panel del taller.
 */
export default function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const err = validate(data);
    setErrors(err);
    if (Object.keys(err).length) {
      const first = (["name", "email", "message"] as Field[]).find((k) => err[k]);
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Contacto desde el portafolio: ${String(data.get("name")).trim()}`);
      const body = encodeURIComponent(`${String(data.get("message")).trim()}\n\n— ${String(data.get("name")).trim()} <${String(data.get("email")).trim()}>`);
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      setStatus({ kind: "ok", text: `Se abrió tu aplicación de correo con el mensaje listo para enviar a ${PROFILE.email}.` });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ kind: "ok", text: "¡Mensaje enviado! Te responderé pronto." });
    } catch {
      setStatus({ kind: "error", text: `No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme a ${PROFILE.email}.` });
    }
  };

  const clear = (k: Field) => {
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
    if (status.kind === "ok" || status.kind === "error") setStatus({ kind: "idle" });
  };

  const input =
    "w-full rounded-[10px] border bg-transparent px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]";
  const border = (k: Field) => (errors[k] ? "border-[#f87171]" : "border-line");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3" aria-describedby={`${uid}-status`}>
      <div>
        <label htmlFor={`${uid}-name`} className="mb-1.5 block text-[13px]">Nombre</label>
        <input id={`${uid}-name`} name="name" autoComplete="name" placeholder="Laura Gómez" aria-invalid={!!errors.name} onInput={() => clear("name")} className={`${input} ${border("name")}`} />
        {errors.name && <p className="mt-1 text-xs text-[#f87171]">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className="mb-1.5 block text-[13px]">Correo</label>
        <input id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="laura@empresa.com" aria-invalid={!!errors.email} onInput={() => clear("email")} className={`${input} ${border("email")}`} />
        {errors.email && <p className="mt-1 text-xs text-[#f87171]">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor={`${uid}-message`} className="mb-1.5 block text-[13px]">Mensaje</label>
        <textarea id={`${uid}-message`} name="message" rows={4} maxLength={2000} placeholder="Hola David, vimos tu perfil y…" aria-invalid={!!errors.message} onInput={() => clear("message")} className={`${input} ${border("message")} resize-y`} />
        {errors.message && <p className="mt-1 text-xs text-[#f87171]">{errors.message}</p>}
      </div>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button type="submit" disabled={status.kind === "sending"} className="btn btn-solid w-full disabled:opacity-70">
        {status.kind === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
      <p id={`${uid}-status`} role="status" className={`min-h-4 text-[13px] ${status.kind === "error" ? "text-[#f87171]" : "text-accent"}`}>
        {status.kind === "ok" || status.kind === "error" ? status.text : ""}
      </p>
    </form>
  );
}
