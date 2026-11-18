import { academic, laboral, Timeline } from "../../Experience";

export default function ExperiencePanel() {
  return (
    <div>
      <h3 className="mb-3 text-xs font-medium tracking-[0.06em] text-muted uppercase">🎓 Académica</h3>
      <Timeline items={academic()} />
      <h3 className="mt-6 mb-3 text-xs font-medium tracking-[0.06em] text-muted uppercase">💼 Laboral</h3>
      <Timeline items={laboral()} />
    </div>
  );
}
