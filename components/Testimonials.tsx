import Image from "next/image";
import { TESTIMONIALS, type Testimonial } from "@/data/portfolio";
import Reveal, { SectionTitle } from "./Reveal";

const initials = (n: string) =>
  n
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Avatar con foto o, si no hay, iniciales. */
export function Avatar({ t, size = 42 }: { t: Testimonial; size?: number }) {
  return (
    <span
      className="tc-av grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft text-sm font-semibold text-accent transition-transform duration-300"
      style={{ width: size, height: size }}
    >
      {t.photo ? (
        <Image src={t.photo} alt={`Foto de ${t.name}`} width={size} height={size} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden>{initials(t.name)}</span>
      )}
    </span>
  );
}

export const Stars = ({ n }: { n: number }) => (
  <div className="text-sm tracking-[2px] text-warm" role="img" aria-label={`${n} de 5 estrellas`}>
    {"★".repeat(n)}
    <span className="opacity-30">{"★".repeat(5 - n)}</span>
  </div>
);

export default function Testimonials() {
  return (
    <section id="testimonios" className="relative border-t border-line py-[72px] lg:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionTitle kicker="testimonios" title="Testimonios" subtitle="Lo que dicen quienes han trabajado conmigo." />
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} as="figure" delay={i * 80} className="fx card group flex flex-col gap-3.5 p-[22px] [&:hover_.tc-av]:scale-[1.08]">
              <Stars n={t.rating} />
              <blockquote className="leading-[1.7]">“{t.text}”</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <Avatar t={t} />
                <span>
                  <b className="block font-medium">{t.name}</b>
                  <span className="text-[13px] text-muted">{t.role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
