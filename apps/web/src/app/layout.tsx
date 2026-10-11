import type { Metadata } from "next";
import { Montserrat, Poppins, Inter, Chakra_Petch } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-chakra",
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
    <html
      lang="es"
      className={`${montserrat.variable} ${poppins.variable} ${inter.variable} ${chakraPetch.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
