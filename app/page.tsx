import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Skills from "@/components/Skills";
import TerminalPlayground from "@/components/TerminalPlayground";
import Footer from "@/components/Footer";
import BootLoader from "@/components/BootLoader";
import CommandPalette from "@/components/CommandPalette";
import { CursorGlow, KonamiMatrix, ScrollProgress } from "@/components/Effects";

export default function Home() {
  return (
    <>
      {/* Extras innovadores */}
      <BootLoader />
      <ScrollProgress />
      <CursorGlow />
      <CommandPalette />
      <KonamiMatrix />

      {/* Secciones en el orden requerido */}
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Testimonials />
        <Experience />
        <Contact />
        {/* Secciones adicionales (antes del pie de página) */}
        <Skills />
        <TerminalPlayground />
      </main>
      <Footer />
    </>
  );
}
