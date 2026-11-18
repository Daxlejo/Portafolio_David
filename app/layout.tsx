import type { Metadata, Viewport } from "next";
import { Caveat, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

/** Letra a mano para la pizarra y el corcho del taller. */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
});

const TITLE = "David Alejandro Cabezas Perez · Ingeniero de software";
const DESCRIPTION =
  "Portafolio de David Alejandro Cabezas Perez, estudiante de Ingeniería de Software en Pasto, Colombia. Backend, arquitectura e IA aplicada: SafeCity AI, SmartSwap, Estudy-AI, Plomo y Paja y ExplorIA.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "David Alejandro Cabezas Perez", url: "https://github.com/Daxlejo" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "El taller de David",
    images: [{ url: "/images/perfil.jpg", width: 800, height: 1000, alt: "Foto de David Alejandro Cabezas Perez" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/perfil.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a111d" },
    { media: "(prefers-color-scheme: light)", color: "#d9e3ec" },
  ],
};

// Antes de pintar: aplica el tema guardado y decide si el taller 3D se muestra
// (hay WebGL, no se pidió #clasica, sin reduced motion ni conexión lenta). Evita parpadeos.
const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t)d.dataset.theme=t;}catch(e){}
var gl=false;try{var c=document.createElement('canvas');gl=!!(c.getContext('webgl2')||c.getContext('webgl'));}catch(e){}
d.dataset.webgl=gl?'1':'0';var n=navigator.connection,slow=!!(n&&(n.saveData||/2g/.test(n.effectiveType||'')));
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
d.dataset.workshop=(gl&&!slow&&!rm&&location.hash!=='#clasica')?'open':'closed';})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${poppins.variable} ${jetbrains.variable} ${caveat.variable} scroll-smooth antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
