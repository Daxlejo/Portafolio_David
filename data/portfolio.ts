/* =========================================================
   Datos tipados del portafolio (fuente única para la vista
   clásica y para los paneles del taller 3D)
   ========================================================= */

export type NavLink = { id: string; label: string };

export type ProjectLink = { kind: "github" | "download" | "demo"; label: string; href: string };

export type Project = {
  id: string;
  title: string;
  cover: string;
  kind: string;
  meta: string;
  featured?: boolean;
  text: string;
  solutions: string[];
  tech: string[];
  links: ProjectLink[];
  /** Etiquetas deshabilitadas ("próximamente") */
  soon: string[];
};

export type Testimonial = {
  name: string;
  role: string;
  /** Ruta de la foto; si es null se muestran las iniciales */
  photo: string | null;
  text: string;
  rating: number;
};

export type Experience = {
  type: "academica" | "laboral";
  period: string;
  title: string;
  place: string;
  text: string;
  points?: string[];
};

export type SkillGroup = { group: string; items: string[] };

export type AboutIcon = "server" | "layout" | "spark" | "lang";

export const PROFILE = {
  initials: "DC",
  firstName: "David Alejandro",
  lastName: "Cabezas Perez",
  fullName: "David Alejandro Cabezas Perez",
  shortName: "David Cabezas",
  role: "Estudiante de Ingeniería de Software · 5.º semestre",
  university: "Universidad Cooperativa de Colombia",
  tagline:
    "Desarrollador de software enfocado en la construcción de soluciones integrales en entornos web, mobile y de escritorio. Apasionado por la Clean Architecture, las buenas prácticas y el desarrollo de sistemas robustos, escalables y verdaderamente efectivos.",
  email: "davo03011@gmail.com",
  location: "Pasto, Nariño, Colombia",
  github: "https://github.com/Daxlejo",
  githubUser: "Daxlejo",
  linkedin: "https://www.linkedin.com/in/david-cabezas-5b087944a/",
  linkedinLabel: "David Cabezas",
  photo: "/images/perfil.jpg",
  cv: "/cv.pdf",
};

/** Orden del profesor; Contacto siempre es la última sección. */
export const NAV_LINKS: NavLink[] = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "proyectos", label: "Proyectos" },
  { id: "testimonios", label: "Testimonios" },
  { id: "experiencia", label: "Experiencia" },
  { id: "habilidades", label: "Habilidades" },
  { id: "playground", label: "Terminal" },
  { id: "contacto", label: "Contacto" },
];

export const ABOUT = {
  paragraphs: [
    "Soy estudiante de quinto semestre de Ingeniería de Software en la Universidad Cooperativa de Colombia, en Pasto. Me enfoco en el backend y la arquitectura: modelar bien el dominio, separar responsabilidades y dejar sistemas que otros puedan entender, mantener y escalar.",
    "He construido en equipo SafeCity AI (Java + Spring Boot con IA), SmartSwap (app Android con NestJS e IA), un videojuego en Unity con IA y ExplorIA, una guía turística para smartwatch. También desarrollo soluciones pequeñas para negocios reales, como la app de precios de domicilios de un restaurante.",
  ],
  facts: [
    { icon: "📍", label: "Pasto, Nariño, Colombia" },
    { icon: "🎓", label: "Ing. de Software · 5.º semestre" },
    { icon: "🏛️", label: "Universidad Cooperativa de Colombia" },
    { icon: "🌐", label: "Español nativo · Inglés B1–B2" },
  ],
  cards: [
    { icon: "server", title: "Backend y arquitectura", text: "Java + Spring Boot, NestJS, Django REST, APIs REST y Clean Architecture." },
    { icon: "layout", title: "Web, móvil y escritorio", text: "React, Next.js, Capacitor (Android), Wear OS y apps locales." },
    { icon: "spark", title: "Inteligencia artificial", text: "Gemini, OpenAI API y Claude, integrados para resolver algo real." },
    { icon: "lang", title: "Idiomas", text: "Español: nativo. Inglés: B1–B2 certificado (Centro de Idiomas, Universidad de Nariño)." },
  ] satisfies { icon: AboutIcon; title: string; text: string }[],
  interests: ["Clean Architecture", "Buenas prácticas", "Backend", "IA aplicada", "Apps de escritorio", "Videojuegos"],
  stats: [
    { value: 8, suffix: "+", label: "Proyectos de software" },
    { value: 2, suffix: "", label: "Años programando" },
    { value: 15, suffix: "+", label: "Tecnologías usadas" },
    { value: 999, suffix: "", label: "Tazas de café" },
  ],
  barber: {
    photo: "/images/barberia.jpg",
    video: "/videos/corte.mp4",
    poster: "/images/corte-poster.jpg",
    title: "También soy barbero",
    award: "Primer puesto",
    text: "Gané el primer puesto en «Mi primera Batalla de Barbería» de Don Juan Academia. La barbería me enseñó precisión, paciencia y a trabajar pensando en el cliente: lo mismo que busco en cada línea de código.",
  },
};

export const PROJECTS: Project[] = [
  {
    id: "safecity",
    featured: true,
    title: "SafeCity AI",
    cover: "/images/proyectos/safecity-ai.jpg",
    kind: "Backend · IA",
    meta: "Proyecto en equipo · 4.º semestre · 2 meses",
    text: "Sistema de reportes ciudadanos en tiempo real que usa IA para clasificar incidentes. Backend monolítico en Java con Spring Boot y arquitectura en capas (controladores, DTOs, servicios, repositorios y seguridad).",
    solutions: [
      "Clasificación automática de reportes y fotos con la API de OpenAI",
      "Módulo OSINT que recolecta y analiza noticias de incidentes",
      "Geocodificación, zonas peligrosas y mapas de calor",
      "Reportes en vivo con WebSockets, autenticación JWT y auditoría de administradores",
    ],
    tech: ["Java", "Spring Boot", "Spring Security + JWT", "WebSockets", "OpenAI API", "H2", "Docker", "JUnit + Mockito", "Swagger"],
    links: [{ kind: "github", label: "Repositorio", href: "https://github.com/Daxlejo/SafeCity_AI" }],
    soon: [],
  },
  {
    id: "smartswap",
    title: "SmartSwap",
    cover: "/images/proyectos/smartswap.jpg",
    kind: "Android · IA",
    meta: "Diseño de Software · 5.º semestre",
    text: "App Android de intercambio de objetos que encuentra anillos de trueque de 2 a 4 personas con un algoritmo de grafos e IA, para resolver el problema de que casi nunca dos personas quieren justo lo que la otra ofrece.",
    solutions: [
      "Detección de ciclos A→B→C→A con BFS sobre el grafo de artículos",
      "Precio estimado en COP por IA, con validación de la respuesta y límites por categoría",
      "214 pruebas de API, 248 de mobile y 40 end-to-end en verde",
      "Accesible: textos de 14 px o más, áreas táctiles de 44–48 px, modo claro y oscuro",
    ],
    tech: ["React", "Vite", "Tailwind CSS", "Capacitor", "NestJS", "OpenAI API", "Render", "Playwright"],
    links: [
      { kind: "github", label: "Repositorio", href: "https://github.com/Daxlejo/SmartSwap-AI" },
      { kind: "download", label: "Descargar v1.0.0", href: "https://github.com/Daxlejo/SmartSwap-AI/releases/tag/v1.0.0" },
    ],
    soon: [],
  },
  {
    id: "estudy",
    title: "Estudy-AI",
    cover: "/images/proyectos/estudy-ai.jpg",
    kind: "IA · Escritorio",
    meta: "Aplicación de escritorio · v1.0.0",
    text: "Plataforma impulsada por IA para estudiar mejor: genera resúmenes estructurados, tarjetas de estudio y rutas de estudio a partir de tus documentos.",
    solutions: [
      "Resúmenes contextuales y tarjetas de estudio interactivas",
      "Asistente conversacional sobre documentos académicos",
      "Diseño con Clean Architecture",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI / Gemini API", "Clean Architecture"],
    links: [
      { kind: "github", label: "Repositorio", href: "https://github.com/Daxlejo/Estudy_AI" },
      { kind: "download", label: "Descargar v1.0.0", href: "https://github.com/Daxlejo/Estudy_AI/releases/tag/v1.0.0" },
    ],
    soon: [],
  },
  {
    id: "plomo",
    title: "Plomo y Paja",
    cover: "/images/proyectos/plomo-y-paja.jpg",
    kind: "Videojuego · IA",
    meta: "Equipo de 3 · Mi rol: programación · 2026",
    text: "FPS narrativo en Unity que reinterpreta Los Tres Cerditos como una historia de mafia. Una IA conectada a la API de OpenAI es la voz interior del protagonista y reacciona a lo que haces: pistas, interrogatorios y tres finales.",
    solutions: [
      "Manos en primera persona dibujadas a mano y animadas por código",
      "IA como voz interior, con respaldo si falla la conexión",
      "Interrogatorios con árbol de diálogo y lip-sync",
      "Niveles generados por código desde menús de editor",
    ],
    tech: ["Unity 2022.3", "C#", "URP", "NavMesh", "OpenAI API", "Python"],
    links: [{ kind: "download", label: "Descargar y jugar", href: "https://github.com/EdedArt/Plomo_Y_Paja/releases/tag/v1.0" }],
    soon: [],
  },
  {
    id: "exploria",
    title: "ExplorIA",
    cover: "/images/proyectos/exploria.jpg",
    kind: "Wear OS · IA",
    meta: "Guía turística con IA para smartwatch · Diseño de Software · 5.º semestre",
    text: "Guía turística con IA en tu muñeca: según tu ubicación, el reloj te cuenta un dato breve (histórico, curioso o cómico) del lugar emblemático más cercano. Funciona en cualquier ciudad, sin base de datos fija.",
    solutions: [
      "Datos solo de lugares emblemáticos, 1 o 2 por hora para no saturar",
      "Tipo de dato e intensidad configurables, con historial",
      "Arquitectura por capas y uso eficiente de la IA",
    ],
    tech: ["Wear OS", "OpenAI API", "Geolocalización", "Arquitectura por capas"],
    links: [
      { kind: "github", label: "Repositorio", href: "https://github.com/Daxlejo/ExplorIA" },
      { kind: "demo", label: "Demo en vivo", href: "https://exploria-web-ebon.vercel.app/" },
    ],
    soon: [],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Yeison Daniel Cabezas",
    role: "Laboratorio IoT · hermano",
    photo: "/images/testimonios/yeison-cabezas.jpg",
    text: "En el laboratorio IoT David se encargó de todo el software: organizó el código, conectó los sensores con la aplicación y no paró hasta que todo funcionó y quedó documentado.",
    rating: 5,
  },
  {
    name: "Victor Armero",
    role: "Jefe · Panga BBQ",
    photo: "/images/testimonios/victor-armero.jpg",
    text: "Teníamos los precios de los domicilios anotados en un libro y había que buscarlos a mano. David nos hizo una app para el computador: buscamos el barrio, sale el precio y nosotros mismos lo podemos cambiar.",
    rating: 5,
  },
  {
    name: "David López",
    role: "Estudiante · Universidad de Nariño",
    photo: null,
    text: "Necesitábamos una landing page para presentar nuestro proyecto en la universidad y David nos ayudó a construirla rápido, clara y lista para mostrar.",
    rating: 5,
  },
];

export const EXPERIENCES: Experience[] = [
  {
    type: "academica",
    period: "2024 – actualidad",
    title: "Ingeniería de Software",
    place: "Universidad Cooperativa de Colombia · Pasto",
    text: "Cursando 5.º semestre. Arquitectura de software, Clean Architecture, patrones de diseño, bases de datos y metodologías ágiles.",
  },
  {
    type: "academica",
    period: "2022 – 2024",
    title: "Inglés · 5 semestres",
    place: "Centro de Idiomas, Universidad de Nariño (VIPRI)",
    text: "Curso de idiomas desde grado 10 hasta mediados de 2024. Certificado de nivel B1–B2.",
  },
  {
    type: "academica",
    period: "2011 – 2023",
    title: "Bachiller",
    place: "Institución Educativa Municipal Libertad · Pasto, Nariño",
    text: "Educación básica y media.",
  },
  {
    type: "laboral",
    period: "2026 – actualidad",
    title: "Desarrollador de software · Freelance",
    place: "Proyectos en equipo y para clientes",
    text: "Desarrollo de software en equipo y para clientes.",
    points: [
      "Proyectos de 2 meses en equipo: SafeCity AI, SmartSwap (app Android), ExplorIA (smartwatch) y Plomo y Paja (videojuego)",
      "Landing page para un proyecto de la Universidad de Nariño",
    ],
  },
  {
    type: "laboral",
    period: "Ene 2026 – jun 2026",
    title: "Asesor de call center",
    place: "Panga BBQ · Pasto",
    text: "Atención telefónica de pedidos y domicilios. Creé una app de escritorio para consultar el precio del domicilio por barrio, con panel de administrador, que reemplazó la búsqueda manual en un libro.",
  },
  {
    type: "laboral",
    period: "Feb 2023 – nov 2023",
    title: "Técnico en impresoras y computadores",
    place: "Digital Akio S.A.S.",
    text: "Soluciones de hardware: diagnóstico, mantenimiento y reparación de impresoras y computadores.",
  },
];

export const SKILLS: SkillGroup[] = [
  { group: "Backend", items: ["Java", "Spring Boot", "Spring Security + JWT", "NestJS", "Node.js", "Python", "Django REST", "APIs REST", "WebSockets"] },
  { group: "Frontend y móvil", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Capacitor (Android)", "Wear OS"] },
  { group: "Datos", items: ["PostgreSQL", "MongoDB", "H2"] },
  { group: "Inteligencia artificial", items: ["Google Gemini", "OpenAI API", "Claude"] },
  { group: "DevOps y calidad", items: ["Docker", "Git / GitHub", "JUnit + Mockito", "Playwright", "Locust", "Swagger", "Render", "Vercel"] },
  { group: "Videojuegos", items: ["Unity", "C#"] },
];

export const LANGUAGES = [
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "B1–B2 · certificado" },
];

/** Hitos que se dibujan en la pizarra del taller. */
export const WHITEBOARD = {
  timeline: [
    { year: "2023", label: "Técnico · Digital Akio" },
    { year: "2024", label: "Ing. de Software" },
    { year: "2026", label: "SafeCity AI + freelance" },
  ],
  diagram: ["Reporte", "IA", "Mapa de calor"],
  diagramNote: "en tiempo real ⚡",
};
