import { TESTIMONIALS } from "@/data/portfolio";
import { Avatar, Stars } from "../../Testimonials";

export default function TestimonialsPanel() {
  return (
    <div>
      {TESTIMONIALS.map((t) => (
        <figure key={t.name} className="card mb-3 rounded-[14px] px-4 py-3.5">
          <Stars n={t.rating} />
          <blockquote className="my-2.5">“{t.text}”</blockquote>
          <figcaption className="flex items-center gap-2.5">
            <Avatar t={t} />
            <span className="text-xs text-muted">
              <b className="block text-sm font-medium text-fg">{t.name}</b>
              {t.role}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
