import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JEO — Jóvenes en Órbita",
  description:
    "Divulgación científica espacial. Exploramos el universo, el sistema solar y las noticias del espacio con rigurosidad y cercanía.",
  keywords: [
    "espacio",
    "astronomía",
    "divulgación científica",
    "sistema solar",
    "constelaciones",
    "JEO",
    "Jóvenes en Órbita",
  ],
  openGraph: {
    title: "JEO — Jóvenes en Órbita",
    description:
      "Exploramos el universo, el sistema solar y las noticias del espacio con rigurosidad y cercanía.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning className="min-h-screen text-[var(--color-ink)] bg-white">
        <div className="gradient-bg min-h-screen">
          <div className="base" />
          <div className="treatment" />
          <div className="glow" />
          <div className="particles" />
          <div className="vignette" />
          <div className="noise" />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}

