# Portafolio · Next.js + TypeScript + Tailwind CSS

Portafolio personal (textos en *Lorem ipsum*) listo para desplegar en **Vercel**.

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilación de producción
```

## Estructura

```
app/
  layout.tsx        # fuentes, <html class="scroll-smooth">, tema
  page.tsx          # une todas las secciones en orden
  globals.css       # tema (variables), animaciones
components/
  Navbar.tsx        # 1. Menú sticky + hamburguesa + scroll-spy
  Hero.tsx          # 2. Bienvenida + botón Descargar CV
  About.tsx         # 3. Acerca de mí
  Projects.tsx      # 4. Proyectos (GitHub + Demo)
  Testimonials.tsx  # 5. Testimonios (carrusel, 4)
  Experience.tsx    # 6. Experiencia académica y laboral
  Contact.tsx       # 7. Contacto + formulario validado
  Skills.tsx        # ⭐ Extra: habilidades e idiomas
  TerminalPlayground.tsx # ⭐ Extra: terminal interactiva
  Footer.tsx        # 8. Pie de página + volver arriba
  BootLoader.tsx, CommandPalette.tsx, Effects.tsx  # extras
data/portfolio.ts   # todos los datos tipados (edita aquí tu info)
public/cv.pdf       # reemplázalo por tu hoja de vida
```

## Extras innovadores

- Pantalla de arranque estilo terminal
- Paleta de comandos con **Ctrl / ⌘ + K**
- Tema claro/oscuro con transición circular (View Transitions API)
- Red de partículas interactiva en el Hero y efecto máquina de escribir
- Tarjetas de proyecto con inclinación 3D y foco de luz
- Terminal interactiva (`help`, `projects`, `skills`, `goto`, `matrix`…)
- Código Konami (↑↑↓↓←→←→BA) → lluvia Matrix
- Barra de progreso de scroll, halo del cursor, contadores animados
- Clic derecho en un contacto para copiarlo

## Formulario de contacto

Por defecto simula el envío. Para recibir correos reales crea un formulario en
[Formspree](https://formspree.io) y define la variable de entorno
`NEXT_PUBLIC_FORMSPREE_ID` en Vercel.
