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
import { ConstellationBg, CursorGlow, FxTracker, KonamiMatrix, ScrollProgress } from "@/components/Effects";

export default function Home() {
  return (
    <>
      {/* Extras */}
      <BootLoader />
      <ScrollProgress />
      <ConstellationBg />
      <CursorGlow />
      <FxTracker />
      <CommandPalette />
      <KonamiMatrix />

      {/* Secciones en el orden requerido */}
      <Navbar />                     {/* 1. Menú */}
      <main className="relative z-10">
        <Hero />                     {/* 2. Hero + CV */}
        <About />                    {/* 3. Acerca de mí */}
        <Projects />                 {/* 4. Proyectos */}
        <Testimonials />             {/* 5. Testimonios */}
        <Experience />               {/* 6. Experiencia académica y laboral */}
        <Skills />                   {/* ⭐ Adicional */}
        <TerminalPlayground />       {/* ⭐ Adicional */}
        <Contact />                  {/* 7. Contactos: siempre la última sección antes del footer */}
      </main>
      <Footer />                     {/* 8. Pie de página */}
    </>
  );
}
