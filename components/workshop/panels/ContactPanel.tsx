import { ContactRows } from "../../Contact";
import ContactForm from "../../ContactForm";

export default function ContactPanel() {
  return (
    <div>
      <p className="mb-3">¿Tienes una vacante, un proyecto o una idea? Escríbeme.</p>
      <ContactRows />
      <div className="card mt-4 rounded-[14px] p-4">
        <ContactForm />
      </div>
    </div>
  );
}
