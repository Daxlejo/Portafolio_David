# El taller de David · Portafolio

Portafolio de **David Alejandro Cabezas Perez**, estudiante de Ingeniería de Software
(Universidad Cooperativa de Colombia, Pasto). Hecho con **Next.js 16 + TypeScript +
Tailwind CSS 4** y **React Three Fiber**.

Repositorio: <https://github.com/Daxlejo/Portafolio_David>

La página tiene dos vistas en `app/page.tsx`:

1. **Taller 3D (portada):** un cuarto isométrico de noche donde un ingeniero trabaja en su
   escritorio. Cada objeto abre una sección en un panel lateral. Botón sol/luna para pasar
   de noche a día (3 s, con amanecer sobre el Galeras).
2. **Vista clásica:** la página con scroll y la estructura del curso. Siempre está en el
   HTML (SEO y lectores de pantalla); el taller va encima como una capa.

| Enlace | Qué abre |
|---|---|
| `/` | Taller 3D |
| `/#clasica` | Vista clásica directamente |
| `/#proyectos`, `/#sobre-mi`, `/#contacto`… | Taller con esa sección enfocada |

Sin WebGL, con `prefers-reduced-motion: reduce` o con conexión lenta se muestra la vista
clásica (con un botón "Taller 3D" si hay WebGL).

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # compilación de producción
```

## Estructura

```
app/
  layout.tsx            # fuentes, metadata/Open Graph, script previo (tema + taller)
  page.tsx              # taller encima + secciones de la vista clásica en orden
  globals.css           # paleta (noche / día), efectos .fx, capa del taller
components/
  Navbar.tsx            # 1. Menú sticky, hamburguesa, sección activa, "Taller 3D"
  Hero.tsx              # 2. Bienvenida + Descargar CV + captura del taller
  About.tsx             # 3. Sobre mí, datos rápidos, estadísticas, barbería
  Projects.tsx          # 4. Proyectos (repositorio, descarga, demo)
  Testimonials.tsx      # 5. Testimonios (3)
  Experience.tsx        # 6. Experiencia académica 🎓 y laboral 💼
  Skills.tsx            # ⭐ Habilidades e idiomas
  TerminalPlayground.tsx# ⭐ Terminal interactiva
  Contact.tsx           # 7. Contacto (última sección) + formulario
  Footer.tsx            # 8. © año automático
  Terminal.tsx, ContactForm.tsx   # compartidos por la vista clásica y el taller
  workshop/
    WorkshopOverlay.tsx # capa del taller: estado, enlaces #, tema, teclado
    WorkshopCanvas.tsx  # <Canvas> + escena (cargado con dynamic, ssr: false)
    CameraRig.tsx       # cámara isométrica, foco por sección, parallax, arrastre
    DayCycle.tsx        # luces y transición noche ↔ día
    Interactive.tsx, Tags.tsx
    scene/              # cuarto, ventana, escritorio, monitor, ingeniero, rack…
    ui/                 # TopBar, SectionDock, SectionPanel, StatusToast
    panels/             # contenido de cada sección del taller
lib/
  theme.ts              # tema compartido (evento themechange)
  terminal-commands.ts  # comandos de la terminal
  workshop/             # secciones, store, acciones, texturas, estado por fotograma
data/portfolio.ts       # TODO el contenido (perfil, proyectos, testimonios…)
public/                 # cv.pdf, fotos, portadas, video y taller-preview.jpg
docs/demo-taller.html   # prototipo de referencia
```

## Editar el contenido

Todo sale de `data/portfolio.ts`: los paneles del taller y la vista clásica usan los
mismos datos. Para agregar el APK de CambiaYA, cambia la etiqueta de `soon` por un
enlace en `links` con `kind: "download"`.

## Formulario de contacto

Con la variable de entorno `NEXT_PUBLIC_FORMSPREE_ID` (en Vercel) el formulario envía
por [Formspree](https://formspree.io) y muestra el resultado real. Sin ella, abre la
aplicación de correo del visitante con el mensaje ya escrito.

## Extras

- Paleta de comandos con **Ctrl / ⌘ + K** (incluye entrar al taller o a la vista clásica)
- Código Konami (↑↑↓↓←→←→BA) → lluvia Matrix
- Fondo de constelación, barra de progreso teal → ámbar, efectos al pasar el mouse
- Terminal: `help`, `whoami`, `proyectos`, `stack`, `contacto`, `ir <sección>`, `tema`…
