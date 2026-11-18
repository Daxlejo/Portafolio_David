"use client";

import { PROFILE } from "@/data/portfolio";
import { showClassic } from "@/lib/workshop/actions";
import { say, setWorkshop, useWorkshop } from "@/lib/workshop/store";
import { BookIcon, DownloadIcon, MoonIcon, SunIcon } from "../../Icons";

/** Logo, "El taller de David", botón sol/luna, CV y "Vista clásica". */
export default function TopBar() {
  const mode = useWorkshop((s) => s.mode);
  const day = mode === "day";

  return (
    <div className="pointer-events-none absolute top-[18px] right-5 left-5 z-[6] flex items-start justify-between gap-3">
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent font-mono text-[15px] font-semibold text-accent-ink">
          {PROFILE.initials}
        </div>
        <div>
          <h1 className="text-[15px] font-semibold sm:text-lg">El taller de David</h1>
          <p className="mt-px hidden text-[12.5px] text-muted sm:block">Ingeniero de software · backend y arquitectura</p>
        </div>
      </div>
      <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
        {/* El cambio se dispara SOLO con este botón (onClick directo, sin delegación global) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setWorkshop({ mode: day ? "night" : "day" });
          }}
          className="btn btn-icon"
          aria-label={day ? "Cambiar a modo noche" : "Cambiar a modo día"}
          title="Día / noche"
        >
          {day ? <MoonIcon /> : <SunIcon />}
        </button>
        <a href={PROFILE.cv} download onClick={() => say("open cv.pdf")} className="btn max-[760px]:w-10 max-[760px]:px-0" aria-label="Descargar CV">
          <DownloadIcon />
          <span className="max-[760px]:hidden">CV</span>
        </a>
        <button type="button" onClick={showClassic} className="btn btn-solid max-[760px]:w-10 max-[760px]:px-0" aria-label="Abrir vista clásica">
          <BookIcon />
          <span className="max-[760px]:hidden">Vista clásica</span>
        </button>
      </div>
    </div>
  );
}
