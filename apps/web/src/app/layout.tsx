import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
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
    <html lang="es" className={`${barlow.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
