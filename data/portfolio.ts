/* =========================================================
   Datos tipados del portafolio
   ========================================================= */

export type NavLink = { id: string; label: string };

export type Project = {
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  category: "Web" | "Móvil" | "IA" | "Escritorio";
  solutions: string[];
  tech: string[];
  github: string;
  demo: string;
};

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
};

export type Experience = {
  type: "academica" | "laboral";
  period: string;
  title: string;
  place: string;
  points: string[];
  tags: string[];
};

export type Skill = { name: string; group: string; icon: string };

export const PROFILE = {
  initials: "DC",
  firstName: "David Alejandro",
  lastName: "Cabezas Perez",
  fullName: "David Alejandro Cabezas Perez",
  tagline:
    "Desarrollador de software enfocado en la construcción de soluciones integrales en entornos web, mobile y de escritorio. Apasionado por la Clean Architecture, las buenas prácticas y el desarrollo de sistemas robustos, escalables y verdaderamente efectivos.",
  email: "david.cabezas@correo.com",
  emailAlt: "david.dev@lorem.com",
  phone: "+57 300 000 0000",
  location: "Pasto, Nariño, Colombia",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
  whatsapp: "https://wa.me/573000000000",
};

export const NAV_LINKS: NavLink[] = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "proyectos", label: "Proyectos" },
  { id: "testimonios", label: "Testimonios" },
  { id: "experiencia", label: "Experiencia" },
  { id: "contacto", label: "Contacto" },
  { id: "habilidades", label: "Habilidades" },
  { id: "playground", label: "Terminal" },
];

export const ABOUT = {
  paragraphs: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Me enfoco en desarrollar software con bases sólidas, código mantenible y arquitectura limpia.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Apasionado por resolver problemas técnicos complejos y generar soluciones prácticas que aporten valor real.",
  ],
  facts: [
    { icon: "📍", label: "Pasto, Nariño, Colombia" },
    { icon: "🎓", label: "Ingeniería de Software" },
    { icon: "☕", label: "Café & Clean Code" },
    { icon: "💻", label: "Web · Mobile · Desktop" },
  ],
  interests: ["Clean Architecture", "Buenas Prácticas", "Mobile Dev", "Web Dev", "Sistemas de Escritorio", "Soluciones Efectivas", "UI/UX"],
  stats: [
    { value: 10, suffix: "+", label: "Soluciones creadas" },
    { value: 3, suffix: "", label: "Años creando código" },
    { value: 12, suffix: "+", label: "Tecnologías dominadas" },
    { value: 999, suffix: "", label: "Tazas de café" },
  ],
};

export const PROJECTS: Project[] = [
  {
    title: "Estudy-AI",
    description:
      "Plataforma inteligente impulsada por IA diseñada para optimizar los métodos de estudio, generación adaptativa de resúmenes estructurados y asistencia académica contextualizada.",
    emoji: "🧠",
    gradient: "from-emerald-500/30 to-cyan-500/20",
    category: "IA",
    solutions: [
      "Generación inteligente de resúmenes contextuales y tarjetas de estudio interactivas",
      "Asistente conversacional adaptativo con procesamiento de documentos académicos",
      "Diseño fundamentado en Clean Architecture, alta escalabilidad y experiencia fluida",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI / Gemini API", "Clean Architecture"],
    github: "https://github.com/",
    demo: "https://vercel.com/",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Lorem Ipsum",
    role: "Profesor · Universidad",
    avatar: "👨‍🏫",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gran capacidad para estructurar proyectos con Clean Architecture y buenas prácticas de desarrollo.",
    rating: 5,
  },
  {
    name: "Dolor Sit",
    role: "Compañera de equipo",
    avatar: "👩‍🎓",
    text: "Ut enim ad minim veniam, trabajar en equipo en soluciones web y mobile fue una experiencia excelente por su enfoque en código limpio.",
    rating: 5,
  },
  {
    name: "Amet Consectetur",
    role: "Cliente · Soluciones Tech",
    avatar: "🧑‍💼",
    text: "Duis aute irure dolor in reprehenderit. Entregó una solución de software altamente efectiva, rápida y con una interfaz muy bien cuidada.",
    rating: 5,
  },
  {
    name: "Adipiscing Elit",
    role: "Líder técnico",
    avatar: "👩‍💻",
    text: "Excepteur sint occaecat cupidatat non proident. Destaca por su compromiso con los estándares de calidad y resolución efectiva de problemas.",
    rating: 5,
  },
];

export const EXPERIENCES: Experience[] = [
  {
    type: "academica",
    period: "2023 – Actualidad",
    title: "Ingeniería de Software",
    place: "Universidad · Pasto, Colombia",
    points: [
      "Formación en ingeniería de software, arquitectura de sistemas y metodologías ágiles",
      "Aplicación de Clean Architecture, patrones de diseño y estándares de calidad",
    ],
    tags: ["Clean Architecture", "Buenas Prácticas", "Full-Stack"],
  },
  {
    type: "academica",
    period: "2022",
    title: "Cursos y Certificaciones Especializadas",
    place: "Plataformas de Desarrollo y Tecnología",
    points: [
      "Desarrollo de aplicaciones móviles y soluciones web escalables",
      "Estructuras de datos avanzadas y diseño de APIs robustas",
    ],
    tags: ["Mobile", "Web", "APIs"],
  },
  {
    type: "laboral",
    period: "2025 – Actualidad",
    title: "Desarrollador de Software",
    place: "Proyectos y Soluciones Digitales",
    points: [
      "Diseño y construcción de soluciones web, móviles y de escritorio orientadas a resultados",
      "Implementación de arquitecturas limpias, modulares y de alto rendimiento",
    ],
    tags: ["Next.js", "TypeScript", "Mobile", "Desktop"],
  },
  {
    type: "laboral",
    period: "2024",
    title: "Desarrollador Independiente",
    place: "Soluciones de Software",
    points: [
      "Creación de aplicativos funcionales y efectivos para diversos requerimientos",
      "Optimización de flujos de trabajo e interfaces intuitivas para usuarios finales",
    ],
    tags: ["React", "Tailwind", "Clean Code"],
  },
];

export const SKILLS: Skill[] = [
  { name: "Next.js", group: "Frontend", icon: "▲" },
  { name: "React", group: "Frontend", icon: "⚛️" },
  { name: "TypeScript", group: "Frontend", icon: "🟦" },
  { name: "Tailwind CSS", group: "Frontend", icon: "🌊" },
  { name: "Node.js", group: "Backend", icon: "🟩" },
  { name: "Python", group: "Backend", icon: "🐍" },
  { name: "APIs REST", group: "Backend", icon: "⚡" },
  { name: "PostgreSQL", group: "Datos", icon: "🐘" },
  { name: "MongoDB", group: "Datos", icon: "🍃" },
  { name: "Git / GitHub", group: "DevOps & Arquitectura", icon: "🐙" },
  { name: "Clean Architecture", group: "DevOps & Arquitectura", icon: "📐" },
  { name: "Vercel", group: "DevOps & Arquitectura", icon: "▲" },
];

export const LANGUAGES = [
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "Técnico / B2" },
  { name: "Lorem", level: "Fluido" },
];
