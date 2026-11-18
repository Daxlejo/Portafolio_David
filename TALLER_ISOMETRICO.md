# Taller isométrico + vista clásica: plan de implementación para Claude Code

El portafolio tendrá dos formas de verse en **la misma página** (`app/page.tsx`):

1. **Taller 3D (portada por defecto):** un cuarto isométrico de noche donde un ingeniero (David) trabaja en su escritorio. Cada objeto abre una sección en un panel lateral.
2. **Vista clásica:** la página con scroll que ya existe, con **la misma estructura y el mismo orden de secciones que exige el profesor**, rediseñada para que se vea igual que el taller (colores, vidrio, tipografía, kickers en mono).

> **Referencia visual obligatoria:** `docs/demo-taller.html`. Ábrela en el navegador antes de empezar. Es un prototipo funcional en un solo archivo (Three.js r128). Hay que **replicar su comportamiento y su aspecto** en Next.js con React Three Fiber y Tailwind. No copies el código tal cual: tradúcelo a componentes.
> - Botón **"Vista clásica"** (arriba a la derecha) muestra la vista clásica. `docs/demo-taller.html#clasica` la abre directamente.
> - Botón sol/luna: transición noche ↔ día.

---

## 0. Reglas para el agente

1. Lee `AGENTS.md`. Esta versión de Next.js (16.x) tiene cambios: consulta `node_modules/next/dist/docs/` antes de escribir rutas, layouts o `dynamic()`.
2. **La estructura del profesor es intocable** (sección 3): mismo orden de secciones, mismos `id`, todos los elementos obligatorios. Si algo de este plan choca con esa estructura, gana la estructura del profesor.
3. **No borres componentes existentes.** Se rediseñan (estilos), no se reescriben desde cero ni se reordenan.
4. **El contenido real está en la sección 3.1.** Reemplaza con él los textos de ejemplo (Lorem, testimonios vacíos, correo y teléfono falsos) de `data/portfolio.ts`. Puedes agregar campos y tipos. No inventes datos que no estén ahí.
5. **No hay sección "Lab IoT", ni protoboard, ni proyecto "Tendedero inteligente"** (es de su hermano). El hermano solo aparece como autor de un testimonio.
6. Todo el contenido de los paneles del taller y de la vista clásica sale de `data/portfolio.ts`. Nada de textos duplicados dentro de los componentes 3D.
7. TypeScript estricto, sin `any`. `"use client"` solo donde haga falta.
8. Trabaja por fases (sección 11). Al terminar cada fase: `npm run lint` y `npm run build` sin errores y un commit con mensaje en español (`feat(taller): …`).

---

## 1. Concepto

| Idea | Detalle |
|---|---|
| Metáfora | El taller nocturno de un ingeniero de software en Pasto. Por la ventana se ve el volcán Galeras. |
| Protagonista | Personaje low-poly (David) sentado frente al monitor, tecleando, con audífonos y gafas. Gira la cabeza hacia el objeto que el visitante abre, y hacia la ventana cuando amanece o anochece. |
| Tono | Profesional y cálido: la escena es el gancho, pero la información siempre está a un clic y se lee en un panel limpio o en la vista clásica. |
| Estilo | Low-poly con `flatShading`, luz cálida de lámpara, glow teal del monitor, haz de luz por la ventana. Sin texturas externas: todo con geometría y `CanvasTexture`. |

---

## 2. Arquitectura: una sola página con dos vistas

**Por qué una sola página:** el profesor pide que `app/page.tsx` una todas las secciones en orden. Así se cumple literalmente, el contenido queda en el HTML (SEO y lectores de pantalla) y el taller va encima como una capa.

```tsx
// app/page.tsx: se conserva la composición actual, se mueve <Contact /> al final y se agrega el taller encima
export default function Home() {
  return (
    <>
      <WorkshopOverlay />            {/* NUEVO: capa fija a pantalla completa, visible por defecto */}
      <BootLoader /> <ScrollProgress /> <CursorGlow /> <CommandPalette /> <KonamiMatrix />
      <Navbar />                     {/* 1. Menú */}
      <main className="relative z-10">
        <Hero />                     {/* 2. Hero + CV */}
        <About />                    {/* 3. Acerca de mí */}
        <Projects />                 {/* 4. Proyectos */}
        <Testimonials />             {/* 5. Testimonios */}
        <Experience />               {/* 6. Experiencia académica y laboral */}
        <Skills />                   {/* ⭐ Adicional */}
        <TerminalPlayground />       {/* ⭐ Adicional */}
        <Contact />                  {/* 7. Contactos: SIEMPRE la última sección antes del footer */}
      </main>
      <Footer />                     {/* 8. Pie de página */}
    </>
  );
}
```

- `WorkshopOverlay` (`"use client"`): `position: fixed; inset: 0; z-index` por encima de todo. Carga el canvas con `dynamic(() => import("./WorkshopCanvas"), { ssr: false })`.
- Mientras el taller está abierto: `document.body.style.overflow = "hidden"`. Al cerrarlo ("Vista clásica"): animación de salida (fade + translateY 28 px, 0.5 s) y se restaura el scroll.
- En la vista clásica, el Navbar tiene un botón **"Taller 3D"** (ícono de cubo) que vuelve a abrir el overlay.
- En el Hero clásico, la columna derecha muestra una **captura del taller** dentro de una ventana estilo editor (`~/taller-de-david`) con el botón "Entrar al taller 3D". Genera la captura renderizando la escena a una imagen al abrir la vista clásica (ver `snapshot()` en la demo) o guarda una imagen estática en `public/taller-preview.jpg`.
- **Enlaces:** `/#clasica` abre directamente la vista clásica. `/#proyectos`, `/#contacto`, etc. abren el taller con esa sección enfocada. Si el usuario está en la vista clásica, los enlaces del menú hacen scroll a los `id` de siempre.
- **Sin WebGL** o con `prefers-reduced-motion: reduce` y conexión lenta: no muestres el overlay y deja la vista clásica (con un botón para entrar al taller si WebGL existe).

### Estructura de archivos nueva

```
components/
  workshop/
    WorkshopOverlay.tsx      → "use client". Estado (abierto/cerrado, sección activa), TopBar, Dock, Panel, Toast
    WorkshopCanvas.tsx       → <Canvas orthographic shadows dpr={[1, 2]}> + luces + escena + CameraRig
    scene/  Room.tsx, Window.tsx (cielo dinámico), WallClock.tsx, Desk.tsx, Monitor.tsx, Laptop.tsx,
            Notebook.tsx, Mug.tsx, Lamp.tsx, Engineer.tsx, Whiteboard.tsx, ServerRack.tsx,
            Corkboard.tsx, Shelf.tsx, Plant.tsx, LightBeam.tsx (haz + polvo)
    Interactive.tsx          → hover (emissive), cursor, click, etiqueta <Html>
    CameraRig.tsx            → cámara isométrica, tween de foco, parallax, arrastre
    DayCycle.tsx             → transición noche/día (sección 6)
    ui/  TopBar.tsx, SectionDock.tsx, SectionPanel.tsx, StatusToast.tsx
    panels/  AboutPanel.tsx, ProjectsPanel.tsx, TestimonialsPanel.tsx, ExperiencePanel.tsx,
             ContactPanel.tsx, SkillsPanel.tsx, TerminalPanel.tsx
lib/
  workshop/sections.ts       → configuración de secciones (sección 5)
  workshop/textures.ts       → generadores de CanvasTexture (código, terminal, pizarra, corcho, cielo, piso)
  workshop/store.ts          → estado compartido (abierto, sección activa, hover, progreso día/noche)
  terminal-commands.ts       → lógica de comandos extraída de TerminalPlayground (la usan ambas vistas)
```

### Dependencias

```bash
npm i three @react-three/fiber @react-three/drei
npm i -D @types/three
```

Usa versiones compatibles con React 19 (R3F v9 o superior, drei v10 o superior). Verifica en npm antes de instalar. Sin GSAP: las interpolaciones se hacen en `useFrame`.

---

## 3. Vista clásica: estructura del profesor (obligatoria, tal cual)

Orden y contenido **exactos**. Ya existen como componentes; solo se rediseñan. **Decisión del dueño: Contacto siempre es la última sección** (después de las adicionales y justo antes del footer). Mueve `<Contact />` en `app/page.tsx` y `contacto` al final de `NAV_LINKS` en `data/portfolio.ts`.

| # | Sección | `id` | Componente | Debe incluir |
|---|---|---|---|---|
| 1 | Menú de navegación | — | `Navbar.tsx` | Logo, nombre o iniciales · enlaces a todas las secciones (anclas `#id`) · fijo arriba al hacer scroll (sticky) · menú hamburguesa en celular · scroll suave · indicador de sección activa |
| 2 | Bienvenida / Hero con CV | `inicio` | `Hero.tsx` | Saludo, nombre, rol/tagline · botón **«Descargar CV»** (`/cv.pdf` con `download`) · botón "Ver proyectos" · redes sociales |
| 3 | Acerca de mí | `sobre-mi` | `About.tsx` | Párrafo de presentación personal · datos rápidos · intereses · estadísticas |
| 4 | Mis proyectos | `proyectos` | `Projects.tsx` | Por cada proyecto: título, descripción, tecnologías, **link a GitHub (repositorio)** y **link a Vercel / demo en vivo** |
| 5 | Testimonios | `testimonios` | `Testimonials.tsx` | **Mínimo 3 testimonios** (nombre, rol, texto) |
| 6 | Experiencia académica y laboral | `experiencia` | `Experience.tsx` | **Académica 🎓** (universidad, cursos) y **laboral 💼** (empleos, prácticas, freelance), en dos columnas o pestañas |
| ⭐ | Sección adicional | `habilidades` | `Skills.tsx` | Tecnologías agrupadas e idiomas |
| ⭐ | Sección adicional | `playground` | `TerminalPlayground.tsx` | Terminal interactiva |
| 7 | Contactos | `contacto` | `Contact.tsx` | **Correo electrónico** visible · GitHub · LinkedIn · ubicación · formulario validado |
| 8 | Pie de página | `footer` | `Footer.tsx` | **Tu nombre y © año** (año automático): solo "© {año} David Alejandro Cabezas Perez. Todos los derechos reservados." Quita la línea "Hecho con Next.js… Desplegado en Vercel" del `Footer.tsx` · enlaces · redes · volver arriba |

Si `EXPERIENCES` no tiene ninguna entrada `type: "laboral"`, la columna laboral muestra una tarjeta de ejemplo ("Cargo (prácticas, empleo o freelance)") para que el requisito sea visible. El dueño la reemplazará.

### 3.1 Contenido real (fuente: `docs/demo-taller.html`, constantes al inicio del `<script>`)

Las imágenes y el video ya están en `public/`:

| Archivo | Uso |
|---|---|
| `public/images/perfil.jpg` (800×1000) | Foto del Hero (y miniatura en el panel "Sobre mí" del taller) |
| `public/images/barberia.jpg` (1000×1000) | Tarjeta "Fuera del código: también soy barbero" en Sobre mí |
| `public/videos/corte.mp4` (540×960, sin audio, 12 s) + `public/images/corte-poster.jpg` | Clip vertical sobre la foto de barbería |
| `public/images/proyectos/{safecity-ai,estudy-ai,cambiaya,plomo-y-paja,exploria}.jpg` (1200×675) | Portadas de los proyectos |
| `public/images/proyectos/safecity-logo.svg` | Logo nuevo de SafeCity AI |
| `public/images/testimonios/{yeison-cabezas,victor-armero}.jpg` (240×240) | Avatares de testimonios (David López va con iniciales) |

**Hoja de vida:** `public/cv.pdf` ya está actualizada (una página, mismo contenido que este plan). El botón "Descargar CV" apunta a `/cv.pdf` con `download`.

**Perfil y contacto** (sin teléfono, sin Instagram):
- Nombre: David Alejandro Cabezas Perez · Estudiante de Ingeniería de Software, 5.º semestre · Universidad Cooperativa de Colombia · Pasto, Nariño, Colombia
- Correo: `davo03011@gmail.com`
- GitHub: `https://github.com/Daxlejo`
- LinkedIn: `https://www.linkedin.com/in/david-cabezas-5b087944a/`
- Tagline: se conserva la actual.

**Sobre mí:**
- Los dos párrafos de `ABOUT.paragraphs` a la izquierda.
- A la derecha, cuatro tarjetas con ícono en 2×2:
  - Backend y arquitectura
  - Web, móvil y escritorio
  - Inteligencia artificial: Gemini, OpenAI API y Claude
  - Idiomas
- Debajo va una **franja compacta** a todo el ancho (unos 165 px de alto, sin protagonismo) con:
  - La foto del diploma y la medalla (132×132)
  - El clip vertical del corte (76×132), sin sonido y en bucle cuando es visible, con botón play/pausa
  - El texto "// fuera del código · ✂️ También soy barbero" con la insignia "Primer puesto" y una línea sobre «Mi primera Batalla de Barbería» de Don Juan Academia
- Con reduced motion el clip no hace autoplay.

**Estadísticas:**
- 8+ proyectos de software
- 2 años programando
- 15+ tecnologías usadas
- 999 tazas de café

**Proyectos** (en este orden; SafeCity AI va como tarjeta destacada a todo el ancho, con la imagen a la izquierda). Cada proyecto tiene `links` (botones reales) y `soon` (etiquetas deshabilitadas "próximamente"):

| Proyecto | Categoría · meta | Botones |
|---|---|---|
| SafeCity AI | Backend · IA · Proyecto en equipo, 4.º semestre, 2 meses | Repositorio `https://github.com/Daxlejo/SafeCity_AI` (solo eso) |
| CambiaYA (antes SmartSwap AI) | Android · IA · Diseño de Software, 5.º semestre | Repositorio `https://github.com/Daxlejo/SmartSwap-AI` + "APK · próximamente" (se cambia por el enlace al release cuando exista) |
| Estudy-AI | IA · Escritorio · v1.0.0 | Repositorio `https://github.com/Daxlejo/Estudy_AI` + **Descargar v1.0.0** `https://github.com/Daxlejo/Estudy_AI/releases/tag/v1.0.0` |
| Plomo y Paja | Videojuego · IA · Equipo de 3, rol: programación | **Descargar y jugar** `https://github.com/EdedArt/Plomo_Y_Paja/releases/tag/v1.0` |
| ExplorIA (guía turística con IA para smartwatch) | Wear OS · IA · Diseño de Software, 5.º semestre | Repositorio `https://github.com/Daxlejo/ExplorIA` + "Demo en Vercel · próximamente" |

Descripciones, viñetas y tecnologías: copia `PROJECTS` de la demo. Tipo sugerido:

```ts
type ProjectLink = { kind: "github" | "download" | "demo"; label: string; href: string };
type Project = { id: string; title: string; cover: string; kind: string; meta: string; featured?: boolean;
  text: string; solutions: string[]; tech: string[]; links: ProjectLink[]; soon: string[] };
```

Los enlaces de descarga van con el estilo sólido; los de repositorio, con borde y el ícono de GitHub.

**Testimonios** (con foto, nombre y rol). Textos exactos en `TESTIMONIALS` de la demo:
1. Yeison Daniel Cabezas: Laboratorio IoT (hermano). Software del laboratorio IoT.
2. Victor Armero: jefe en Panga BBQ. App de escritorio para consultar el precio del domicilio por barrio, con administrador que cambia los precios.
3. David López: estudiante de la Universidad de Nariño. Landing page para un proyecto universitario.

**Experiencia académica:**
- 2024 – actualidad · Ingeniería de Software · Universidad Cooperativa de Colombia, Pasto (5.º semestre)
- 2022 – 2024 · Inglés, 5 semestres · Centro de Idiomas, Universidad de Nariño (VIPRI) · certificado B1–B2
- 2011 – 2023 · Bachiller · Institución Educativa Municipal Libertad, Pasto, Nariño

**Experiencia laboral:**
- 2026 – actualidad · Desarrollador de software, freelance:
  - Proyectos de 2 meses en equipo: SafeCity AI, CambiaYA (app Android), ExplorIA (smartwatch) y Plomo y Paja (videojuego)
  - Landing page para un proyecto de la Universidad de Nariño
- Ene 2026 – jun 2026 · Asesor de call center · Panga BBQ, Pasto · Atención telefónica de pedidos y domicilios. Creó una app de escritorio para consultar el precio del domicilio por barrio, con panel de administrador, que reemplazó la búsqueda manual en un libro.
- Feb 2023 – nov 2023 · Técnico en impresoras y computadores · Digital Akio S.A.S. · Soluciones de hardware (diagnóstico, mantenimiento y reparación)

**Habilidades:**
- Backend: Java, Spring Boot, Spring Security + JWT, NestJS, Node.js, Python, Django REST, APIs REST, WebSockets
- Frontend y móvil: React, Next.js, TypeScript, Tailwind CSS, Vite, Capacitor (Android), Wear OS
- Datos: PostgreSQL, MongoDB, H2
- Inteligencia artificial: Google Gemini, OpenAI API, Claude
- DevOps y calidad: Docker, Git / GitHub, JUnit + Mockito, Playwright, Locust, Swagger, Render, Vercel
- Videojuegos: Unity, C#
- Idiomas: español (nativo) e inglés (B1–B2, certificado)

**En el taller:**
- La pizarra muestra "2023 Técnico · Digital Akio", "2024 Ing. de Software" y "2026 SafeCity AI + freelance".
- El diagrama de la pizarra es "Reporte → IA → Mapa de calor · en tiempo real".
- Los paneles usan las mismas portadas, fotos y avatares.

### Rediseño visual (igual que la demo)

- **Paleta global** (sección 9): teal + ámbar sobre azul noche; tema claro = "día".
- **Navbar:** vidrio esmerilado (`backdrop-blur`), logo `DC` en cuadro teal, enlace activo con fondo teal suave, botones de tema y "Taller 3D".
- **Encabezados de sección:** kicker en mono (`~/proyectos`), título grande (28–38 px, `font-semibold`), subtítulo en `text-muted`.
- **Hero:**
  - Izquierda: píldora "Disponible para nuevos retos" con punto que late, "👋 Hola que tal, soy", nombre con el apellido en color acento y tagline.
  - Botones: "Descargar CV" (sólido teal), "Ver proyectos →" (con borde) y "Taller 3D" (con borde).
  - Redes: GitHub, LinkedIn y correo.
  - Derecha: la **foto** (`/images/perfil.jpg`) en un marco 4:5 redondeado (28 px) con un contorno teal desplazado detrás. Lleva la tarjeta de vidrio "2 años programando · 5.º semestre · UCC Pasto" sobre la esquina inferior izquierda y las insignias flotantes `<CleanArchitecture />`, `☕ Java · Spring Boot` y `🤖 IA: integrada`.
  - Debajo: estadísticas con contador animado.
  - Usa `next/image` con `priority` para la foto.
- **Tarjetas:** borde 1 px `--border`, radio 18 px, fondo `--surface` translúcido; hover: sube 4 px y borde acento.
- **Proyectos:** portada 16:9 con zoom suave al pasar el cursor y etiqueta de categoría. Debajo van la meta en mono teal, el título, la descripción, las viñetas, las tecnologías y los botones.
- **Grilla de proyectos:** 2 columnas; SafeCity destacada a todo el ancho.
- **Testimonios:** estrellas ámbar, avatar con foto (o iniciales si no hay), nombre y rol.
- **Experiencia:** línea de tiempo con puntos de borde teal.
- **Contacto:**
  - Filas: correo con botón "Copiar", GitHub (enlace), LinkedIn (enlace) y ubicación.
  - Sin teléfono ni Instagram.
  - Formulario en tarjeta.
- **Efectos al pasar el mouse** (inspirados en el portafolio de referencia; ver `.fx` en la demo). Se aplican a las tarjetas de Sobre mí, proyectos, testimonios, estadísticas, habilidades, filas de contacto, formulario y franja de barbería:
  - La tarjeta sube 4 px, el borde se vuelve acento y aparece un resplandor suave.
  - Un foco radial teal sigue al cursor (variables CSS `--mx`/`--my` actualizadas en `pointermove`).
  - Un brillo diagonal cruza la tarjeta.
  - Otros elementos:
    - Ícono de la tarjeta: se rellena de acento y gira un poco.
    - Pills: borde y texto en acento.
    - Portadas de proyectos: zoom suave con degradado inferior.
    - Foto del Hero: zoom y el contorno teal se desplaza.
    - Línea de tiempo: el punto se rellena y el ítem se mueve 4 px a la derecha.
    - Botón "Descargar CV": brillo que cruza y sombra luminosa.
- **Fondo de constelación** en la vista clásica: un canvas fijo con nodos teal y algunos ámbar que se mueven despacio, unidos por líneas cuando están cerca. Las líneas también se conectan al cursor. Opacidad 0.55, sin eventos de puntero; con reduced motion queda estático. Encima van dos halos radiales suaves (teal arriba a la derecha, ámbar abajo a la izquierda).
- Los kickers de sección llevan una línea teal corta a la derecha, y el apellido del Hero va con un degradado teal.
- **Aparición al hacer scroll** (fade + translateY 18 px) y barra de progreso teal→ámbar arriba.
- Mantén los extras que ya tienes (paleta de comandos, Konami, cursor glow) con la nueva paleta.

---

## 4. Taller: cámara y escena

### 4.1 Cámara
- `OrthographicCamera`, dirección isométrica `ISO = normalize(1, 0.82, 1)`, posición `target + ISO * 60`, `lookAt(target)`.
- Vectores de pantalla: `RIGHT = normalize(1, 0, -1)` y `UP = normalize(-0.355, 0.865, -0.355)`.
- Altura visible (`viewSize`): escritorio `max(15.5, 23 / aspect)`; móvil (≤ 760 px) `max(15.5, 14.5 / aspect)`.
- Vista inicial: `target = (-0.2, 3.6, -0.6)`, `zoom = 1`. Entrada animada desde `zoom 0.62` en 1.6 s.
- **Foco en una sección:** interpola `target` y `zoom` en 1.1 s (easeInOutCubic). Desplaza el objetivo para que el objeto quede centrado en el área libre:
  - Escritorio (panel a la derecha, ancho `P = min(470, innerWidth)`): `target = focus + RIGHT * (P/2) / ppu`.
  - Móvil (bottom sheet del 60 %): `target = focus − UP * (0.6·innerHeight/2) / ppu · 0.95`.
  - `ppu = innerHeight * zoom / viewSize`.
- **Parallax** con el mouse sin sección abierta (RIGHT × 0.9, UP × 0.5, suavizado 0.05). **Arrastre horizontal** para mirar (límite ±6); si hubo arrastre, el clic siguiente no abre nada.

### 4.2 Objetos (copia posiciones, tamaños y colores de la demo)
- Piso 14×14 de madera (CanvasTexture de tablones). Paredes del fondo (z = −7) y la izquierda (x = −7), altura 8.2, con zócalo y moldura. Alfombra redonda bajo la silla.
- Escritorio 6.6×2.6 a y = 2.5 contra la pared del fondo: monitor centrado, teclado y mouse delante, laptop a la derecha, **cuaderno con lápiz** adelante a la derecha (decorativo, sin sección), taza y libros a la izquierda, lámpara y maceta atrás.
- Ventana a la izquierda del monitor (con Galeras), reloj de pared con la hora real encima del monitor, corcho a la derecha, rack de servidores en la esquina, pizarra y repisa en la pared izquierda, planta grande en la esquina derecha.
- Ingeniero en `(0.35, 0, -3.3)` mirando hacia −z; brazos orientados con `lookAt` hacia el teclado.

### 4.3 Paleta de la escena
| Uso | Color |
|---|---|
| Pared noche / amanecer / día | `#263248` / `#4d3f55` / `#9fb1c8` |
| Madera escritorio | `#a8774e` |
| Metal / oscuro | `#1f2937` / `#111827` |
| Buzo del personaje / cuaderno / taza | `#115e59` / `#0f766e` / `#0f766e` |
| Jeans | `#22324d` |
| Acento (glow, hover, LEDs) | `#2dd4bf` |
| Luz lámpara | `#ffb15e` |

### 4.4 Animaciones permanentes (en `useFrame`; desactivadas con `prefers-reduced-motion`)
- Monitor: el código de `taller.ts` se escribe solo (1 carácter cada 32 ms; empieza con 60 escritos, pausa al final y reinicia) con cursor teal.
- Laptop: terminal con cursor parpadeante.
- Personaje: brazos tecleando mientras se escribe el código, respiración leve, cabeza que gira hacia la sección abierta (`yaw = atan2(-dx, -dz)`, límite ±1.4; en "Sobre mí" gira hacia la cámara).
- Rack: LEDs aleatorios cada 120 ms. Taza: 5 partículas de vapor. Reloj con la hora real.
- Pausa el render cuando `document.hidden`.

---

## 5. Secciones del taller

Orden de los chips = orden de la vista clásica (Contacto al final).

| id | Etiqueta | Objeto | Panel | Toast | Zoom |
|---|---|---|---|---|---|
| `sobre` | Sobre mí | Ingeniero (personaje + silla) | AboutPanel | `whoami` | 2.1 |
| `proyectos` | Proyectos | Monitor | ProjectsPanel (con botones GitHub y Demo) | `cd ~/proyectos` | 2.4 |
| `testimonios` | Testimonios | Corcho | TestimonialsPanel | `cat testimonios.txt` | 2.5 |
| `experiencia` | Experiencia | Pizarra | ExperiencePanel (🎓 Académica + 💼 Laboral) | `cat experiencia.md` | 2.0 |
| `habilidades` | Habilidades | Rack de servidores | SkillsPanel (grupos + idiomas) | `ls ~/stack` | 2.1 |
| `terminal` | Terminal | Laptop | TerminalPanel | `ssh taller` | 3.0 |
| `contacto` | Contacto | Taza de café | ContactPanel (enlaces + formulario existente) | `mail david` | 3.3 |

```ts
export type SectionId = "sobre" | "proyectos" | "testimonios" | "experiencia" | "habilidades" | "terminal" | "contacto";
export type WorkshopSection = {
  id: SectionId; label: string; status: string;
  anchor: [number, number, number];   // posición de la etiqueta flotante
  focus: [number, number, number];    // punto al que mira la cámara
  zoom: number;
  classicId: string;                  // id de la sección equivalente en la vista clásica
};
```

Coordenadas exactas de `anchor` y `focus`: array `SECTIONS` de la demo.

**Interfaz del taller:** TopBar (logo, "El taller de David", sol/luna, CV, "Vista clásica"), etiquetas flotantes con drei `<Html>` (ocultas en móvil y con panel abierto), dock inferior con pista y chips, toast `david@taller:~$ <comando>` (2.2 s), panel de vidrio (`role="dialog"`, se cierra con Esc, botón o clic en vacío; el foco vuelve al disparador). En móvil el panel es un bottom sheet del 60 %.

---

## 6. Transición noche ↔ día (3 s, con amanecer y atardecer)

Un solo valor `dayP` (0 = noche, 0.5 = amanecer, 1 = día) que se anima con `easeInOutSine` durante **3000 ms** (instantáneo con reduced motion). Todo se interpola en tres fotogramas clave: `kf(p, noche, amanecer, día)`.

| Elemento | Noche | Amanecer (0.5) | Día |
|---|---|---|---|
| Cielo arriba / abajo | `#0b1430` / `#26365e` | `#5a4a8a` / `#ff9a6b` | `#7cc3ff` / `#d8efff` |
| Galeras / pueblo | `#121b33` / `#0b1124` | `#3b2c49` / `#261f33` | `#5f7f8f` / `#3e5a4a` |
| Pared | `#263248` | `#4d3f55` | `#9fb1c8` |
| Fondo del canvas | `#0a111d` | `#2a2033` | `#d9e3ec` |
| Hemisférica (intensidad, color) | 0.55, `#9fb6d8` | 0.72, `#ffc9a6` | 1.0, `#dfe8f5` |
| Direccional (intensidad, color) | 0.5, `#bcd0ff` | 0.9, `#ff9a5c` | 0.85, `#fff6ea` |
| Posición direccional (sombras) | (9, 15, 7) | (15, 5, 1): sol bajo, sombras largas | (6, 16, 9) |
| Haz de ventana (color, opacidad) | `#6d8ccf`, 0.20 (luz de luna) | `#ffa860`, 0.42 | `#ffdcaa`, 0.22 |
| Mancha de luz en el piso | 0.25 | 0.70 | 0.60 |
| Polvo flotando en el haz | 0.12 | 0.55 | 0.75 |
| Luz del monitor | 0.8 | 0.55 | 0.3 |

Detalles:
- **Cielo dinámico** en una sola `CanvasTexture` que se redibuja solo durante la transición:
  - Las estrellas se apagan antes de `p = 0.42`.
  - La luna creciente baja y se desvanece hasta `p = 0.55`.
  - El sol sale detrás del Galeras desde `p = 0.16`: pasa de `#ff7a3d` a `#fff6d5`, con un halo radial grande al amanecer.
  - Las nubes entran desde `p = 0.5`.
  - Las luces del pueblo se apagan hasta `p = 0.62`.
- **Haz de luz:** 4 caras que van de la ventana al piso, siguiendo la dirección `(0.35, −0.75, 1)`. Tienen textura degradada, `AdditiveBlending` y `depthWrite: false`. Se suma una mancha en el piso con la forma de los 4 vidrios y 80 partículas de polvo que flotan dentro del haz.
- **Lámpara:** encendida hasta `p = 0.46`; entre 0.46 y 0.66 **parpadea** como un foco que se apaga (suma de senos > umbral) y se atenúa; apagada de día con la bombilla gris. Al anochecer hace lo mismo al revés.
- **Personaje:** durante el 80 % de la transición gira la cabeza hacia la ventana y luego vuelve a lo que estaba mirando.
- **Toast:** `sudo sunrise --ciudad pasto` / `sudo sunset --ciudad pasto`.
- **Botón de tema:** el cambio solo se dispara con clic en el botón sol/luna. Pon el `onClick` directamente en el botón. No uses delegación global del tipo `closest('[data-theme]')`: `<html>` ya tiene `data-theme`, así que cualquier clic en la página cambiaría el modo (bug encontrado en la demo).
- **Interfaz:** el tema (`data-theme`) cambia a la mitad de la transición (1.5 s) para que la UI acompañe el cielo. Usa `lib/theme.ts` y el evento `themechange`, para que el taller y la vista clásica compartan el tema. En la vista clásica, el botón de tema reutiliza la transición circular que ya existe.

---

## 7. Accesibilidad
- `prefers-reduced-motion`: sin tweens, tecleo, parpadeos, parallax ni transición de 3 s (cambio directo).
- Chips y etiquetas son `<button>`; el canvas lleva `aria-hidden`. Navegación completa con teclado (Tab, Enter, Esc).
- El contenido de la vista clásica siempre está en el DOM (SSR), aunque el taller esté encima.
- Contraste AA en ambos temas.

## 8. Rendimiento y SEO
- three/R3F solo se carga dentro de `WorkshopOverlay` con `dynamic(..., { ssr: false })`.
- `dpr={[1, 2]}`; sombras solo de la luz direccional (mapa 2048); geometrías y materiales memorizados; CanvasTexture creadas una vez y actualizadas con `needsUpdate`.
- Objetivo Lighthouse móvil: Performance ≥ 80.
- `metadata` con título, descripción y Open Graph.

## 9. Paleta global (`app/globals.css`, afecta ambas vistas)

```css
:root {            /* noche */
  --bg: #0a111d; --bg-2: #070c16; --surface: #111a2a; --surface-2: #16223a; --border: #1f2c40;
  --fg: #e8eef6; --muted: #97a6ba; --accent: #2dd4bf; --accent-2: #0f766e;
  --accent-soft: rgba(45, 212, 191, 0.12); --glow: rgba(45, 212, 191, 0.3); --warm: #f5b04c;
}
:root[data-theme="light"] {   /* día */
  --bg: #d9e3ec; --bg-2: #cdd9e4; --surface: #ffffff; --surface-2: #f1f5f9; --border: #c9d5e1;
  --fg: #0f1a2a; --muted: #4c5d72; --accent: #0f8f84; --accent-2: #0f766e;
  --accent-soft: rgba(15, 143, 132, 0.12); --glow: rgba(15, 143, 132, 0.22); --warm: #b45309;
}
```

Agrega `--color-warm: var(--warm)` en `@theme inline`. Revisa que el ParticleField del Hero, la barra de progreso y el Matrix usen `--accent` y no el verde fijo.

---

## 10. Checklist del profesor (criterio de aceptación final)

- [ ] Proyecto en Next.js + TypeScript
- [ ] Estilos con Tailwind CSS (clases utilitarias y responsive)
- [ ] 1. Menú de navegación (logo, nombre o iniciales)
- [ ] 2. Bienvenida / Hero con CV (botón «Descargar CV»)
- [ ] 3. Acerca de mí (párrafo de presentación personal)
- [ ] 4. Mis proyectos (link a GitHub/repositorio · link a Vercel/demo en vivo)
- [ ] 5. Testimonios (mínimo 3)
- [ ] 6. Experiencia académica y laboral (académica 🎓: universidad, cursos · laboral 💼: empleos, prácticas, freelance)
- [ ] 7. Contactos (correo electrónico)
- [ ] 8. Pie de página (tu nombre y © año)
- [ ] Sección adicional (al menos 1 sección extra)
- [ ] Se ve bien en celular (diseño responsive)
- [ ] Código subido a GitHub (repositorio con commits)
- [ ] Publicado en Vercel (URL pública funcionando)

---

## 11. Fases

**Fase 1: paleta y vista clásica**
- [ ] Paleta global aplicada; todos los componentes rediseñados según la sección 3, sin cambiar `id` ni textos.
- [ ] Contacto movido al final (después de Habilidades y Terminal) en `page.tsx` y en `NAV_LINKS`.
- [ ] Contenido real de la sección 3.1 en `data/portfolio.ts`; fotos, video y portadas desde `public/`.
- [ ] Sin notas internas visibles en el sitio (nada de "demo", "borrador", "en el sitio real…"). El formulario usa Formspree y muestra un mensaje de éxito o error real.
- [ ] Botón GitHub en cada proyecto y etiqueta "sin demo" cuando no hay demo; año automático en el footer.
- [ ] Checklist de la sección 10 cumplido (salvo GitHub/Vercel, que hace el dueño).

**Fase 2: taller estático**
- [ ] `WorkshopOverlay` sobre la página, con el cuarto completo, luz de noche y sombras.
- [ ] "Vista clásica" cierra el overlay; "Taller 3D" lo reabre; `/#clasica` funciona.

**Fase 3: interacción**
- [ ] Hover, etiquetas, clic → tween de cámara, panel con datos reales y toast. Esc, botón y clic en vacío cierran.
- [ ] Terminal y formulario compartidos con la vista clásica.
- [ ] Enlaces profundos `/#proyectos`, etc.

**Fase 4: vida y pulido**
- [ ] Animaciones de 4.4 y transición día/noche completa de la sección 6.
- [ ] Captura del taller en el Hero clásico.
- [ ] Móvil (bottom sheet, sin etiquetas, chips con scroll), reduced motion y teclado.
- [ ] `npm run lint` y `npm run build` sin errores; README actualizado.

## 12. Fuera de alcance
- Corregir textos Lorem, testimonios o datos de contacto (lo hará el dueño).
- Modelos GLB de Blender, sonido ambiente, traducción ES/EN.

---

## Prompt sugerido para pegar en Claude Code

```
Lee TALLER_ISOMETRICO.md y abre docs/demo-taller.html (y docs/demo-taller.html#clasica)
como referencia visual. Implementa la Fase 1 siguiendo las reglas de la sección 0 y la
estructura del profesor de la sección 3. Cuando compile, muéstrame un resumen y espera
mi visto bueno antes de pasar a la Fase 2.
```
