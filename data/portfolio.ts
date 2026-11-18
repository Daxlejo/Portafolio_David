/* =========================================================
   Datos tipados del portafolio (todo el texto es Lorem ipsum)
   ========================================================= */

export type NavLink = { id: string; label: string };

export type Project = {
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  category: "Web" | "Móvil" | "IA" | "Juegos";
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

export type Skill = { name: string; level: number; group: string; icon: string };

export const PROFILE = {
  initials: "LI",
  firstName: "Lorem Ipsum",
  lastName: "Dolor Sit",
  roles: ["Lorem Developer", "Ipsum Engineer", "Dolor Designer", "Sit Amet Creator"],
  tagline:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  email: "lorem@ipsum.com",
  emailAlt: "dolor.sit@amet.com",
  phone: "+57 300 000 0000",
  location: "Lorem, Ipsum",
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero, sed cursus ante dapibus diam. Sed nisi nulla quis sem at nibh elementum imperdiet.",
    "Duis sagittis ipsum praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent.",
  ],
  facts: [
    { icon: "📍", label: "Lorem, Ipsum" },
    { icon: "🎓", label: "Lorem semestre" },
    { icon: "☕", label: "Dolor sit amet" },
    { icon: "🎮", label: "Consectetur" },
  ],
  interests: ["Lorem", "Ipsum", "Dolor", "Sit amet", "Consectetur", "Adipiscing", "Elit"],
  stats: [
    { value: 12, suffix: "+", label: "Lorem proyectos" },
    { value: 3, suffix: "", label: "Ipsum años" },
    { value: 15, suffix: "+", label: "Dolor tecnologías" },
    { value: 999, suffix: "", label: "Tazas de café" },
  ],
};

export const PROJECTS: Project[] = [
  {
    title: "Lorem Calculator",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
    emoji: "🧮",
    gradient: "from-emerald-500/30 to-cyan-500/20",
    category: "Web",
    solutions: ["Lorem ipsum dolor sit", "Consectetur adipiscing elit", "Sed do eiusmod tempor"],
    tech: ["Next.js", "TypeScript", "Three.js"],
    github: "https://github.com/",
    demo: "https://vercel.com/",
  },
  {
    title: "Ipsum Mobile",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    emoji: "📱",
    gradient: "from-lime-500/30 to-emerald-500/20",
    category: "Móvil",
    solutions: ["Nisi ut aliquip ex ea", "Commodo consequat duis", "Aute irure dolor"],
    tech: ["Flutter", "Firebase", "IoT"],
    github: "https://github.com/",
    demo: "https://vercel.com/",
  },
  {
    title: "Dolor Player",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    emoji: "🎧",
    gradient: "from-teal-500/30 to-green-500/20",
    category: "Web",
    solutions: ["Velit esse cillum dolore", "Eu fugiat nulla pariatur", "Excepteur sint occaecat"],
    tech: ["React", "API REST", "Tailwind"],
    github: "https://github.com/",
    demo: "https://vercel.com/",
  },
  {
    title: "Sit Amet AI",
    description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    emoji: "🤖",
    gradient: "from-green-500/30 to-sky-500/20",
    category: "IA",
    solutions: ["Cupidatat non proident", "Sunt in culpa qui", "Officia deserunt mollit"],
    tech: ["Python", "Flask", "NLP"],
    github: "https://github.com/",
    demo: "https://vercel.com/",
  },
  {
    title: "Consectetur Quest",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    emoji: "👾",
    gradient: "from-emerald-500/30 to-fuchsia-500/20",
    category: "Juegos",
    solutions: ["Perspiciatis unde omnis", "Iste natus error sit", "Voluptatem accusantium"],
    tech: ["Unity", "C#", "Pixel Art"],
    github: "https://github.com/",
    demo: "https://vercel.com/",
  },
  {
    title: "Adipiscing Market",
    description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    emoji: "🛒",
    gradient: "from-cyan-500/30 to-emerald-500/20",
    category: "Web",
    solutions: ["Nemo enim ipsam", "Quia voluptas sit", "Aspernatur aut odit"],
    tech: ["Spring Boot", "PostgreSQL", "AWS"],
    github: "https://github.com/",
    demo: "https://vercel.com/",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Lorem Ipsum",
    role: "Profesor · Lorem University",
    avatar: "👨‍🏫",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 5,
  },
  {
    name: "Dolor Sit",
    role: "Compañera · Proyecto Ipsum",
    avatar: "👩‍🎓",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rating: 5,
  },
  {
    name: "Amet Consectetur",
    role: "Cliente · Dolor S.A.S.",
    avatar: "🧑‍💼",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    rating: 4,
  },
  {
    name: "Adipiscing Elit",
    role: "Líder técnico · Sit Amet Labs",
    avatar: "👩‍💻",
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    rating: 5,
  },
];

export const EXPERIENCES: Experience[] = [
  {
    type: "academica",
    period: "2023 – Actualidad",
    title: "Lorem Ipsum Engineering",
    place: "Universidad Lorem Ipsum",
    points: ["Lorem ipsum dolor sit amet consectetur", "Adipiscing elit sed do eiusmod tempor"],
    tags: ["Lorem", "Ipsum", "Dolor"],
  },
  {
    type: "academica",
    period: "2022",
    title: "Curso de Dolor Sit",
    place: "Instituto Amet Consectetur",
    points: ["Ut enim ad minim veniam quis nostrud", "Exercitation ullamco laboris nisi"],
    tags: ["Sit", "Amet"],
  },
  {
    type: "academica",
    period: "2021",
    title: "Bachiller Lorem",
    place: "Colegio Ipsum Dolor",
    points: ["Duis aute irure dolor in reprehenderit"],
    tags: ["Consectetur"],
  },
  {
    type: "laboral",
    period: "2025 – Actualidad",
    title: "Lorem Developer Jr.",
    place: "Ipsum Tech S.A.S.",
    points: ["Lorem ipsum dolor sit amet elit", "Sed do eiusmod tempor incididunt ut labore"],
    tags: ["Next.js", "TypeScript"],
  },
  {
    type: "laboral",
    period: "2024",
    title: "Freelance Dolor",
    place: "Sit Amet Studio",
    points: ["Ut enim ad minim veniam", "Quis nostrud exercitation ullamco"],
    tags: ["React", "Tailwind"],
  },
];

export const SKILLS: Skill[] = [
  { name: "Next.js", level: 85, group: "Frontend", icon: "▲" },
  { name: "React", level: 88, group: "Frontend", icon: "⚛️" },
  { name: "TypeScript", level: 80, group: "Frontend", icon: "🟦" },
  { name: "Tailwind", level: 90, group: "Frontend", icon: "🌊" },
  { name: "Node.js", level: 75, group: "Backend", icon: "🟩" },
  { name: "Python", level: 78, group: "Backend", icon: "🐍" },
  { name: "Spring Boot", level: 65, group: "Backend", icon: "🍃" },
  { name: "PostgreSQL", level: 70, group: "Datos", icon: "🐘" },
  { name: "MongoDB", level: 72, group: "Datos", icon: "🍃" },
  { name: "Docker", level: 60, group: "DevOps", icon: "🐳" },
  { name: "Git / GitHub", level: 88, group: "DevOps", icon: "🐙" },
  { name: "Vercel", level: 85, group: "DevOps", icon: "▲" },
];

export const LANGUAGES = [
  { name: "Lorem (nativo)", level: 100 },
  { name: "Ipsum", level: 70 },
  { name: "Dolor", level: 35 },
];
