import Image from "next/image";
import { ABOUT, PROFILE } from "@/data/portfolio";

export default function AboutPanel() {
  const B = ABOUT.barber;
  return (
    <div>
      <div className="mb-3.5 flex items-center gap-4">
        <Image src={PROFILE.photo} alt={PROFILE.fullName} width={76} height={76} className="h-[76px] w-[76px] shrink-0 rounded-[18px] border border-line object-cover" />
        <div>
          <b>{PROFILE.fullName}</b>
          <p className="text-[13px] text-muted">{PROFILE.role}</p>
          <p className="text-[13px] text-muted">{PROFILE.location}</p>
        </div>
      </div>
      {ABOUT.paragraphs.map((p) => (
        <p key={p.slice(0, 20)} className="mb-3">
          {p}
        </p>
      ))}
      <div className="my-4 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
        {ABOUT.cards.map((c) => (
          <div key={c.title} className="rounded-xl border border-line px-3 py-2.5 text-[13px]">
            <b className="block text-[11.5px] font-medium text-muted">{c.title}</b>
            {c.text}
          </div>
        ))}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2.5">
        {ABOUT.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line px-3 py-2">
            <b className="block text-lg leading-tight font-semibold text-accent">
              {s.value}
              {s.suffix}
            </b>
            <span className="text-xs text-muted">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="card flex items-center gap-3.5 rounded-[14px] p-3">
        <Image src={B.photo} alt="Diploma y medalla de primer puesto en batalla de barbería" width={84} height={84} className="h-[84px] w-[84px] shrink-0 rounded-xl object-cover" />
        <div>
          <b className="text-sm">✂️ {B.title}</b>
          <p className="mt-1 text-[13px] leading-normal text-muted">Primer puesto en «Mi primera Batalla de Barbería» de Don Juan Academia.</p>
        </div>
      </div>
    </div>
  );
}
