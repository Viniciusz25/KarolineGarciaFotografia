import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FilmGrain from "@/components/FilmGrain";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Karoline Garcia | Fotografia Social e Pet em São Paulo",
    template: "%s | Karoline Garcia Fotografia",
  },
  description:
    "Ensaios sociais, casamentos, gestantes, famílias e fotografia pet em São Paulo com um olhar sensível, natural e atemporal.",
  keywords: [
    "fotografia social",
    "fotografia pet",
    "ensaio pet são paulo",
    "fotógrafa são paulo",
    "ensaio gestante",
    "ensaio família",
    "Karoline Garcia Fotografia",
  ],
  openGraph: {
    title: "Karoline Garcia | Fotografia Social e Pet",
    description:
      "Transformando instantes autênticos e o amor pelos pets em memórias eternas. Conheça o portfólio e agende seu ensaio em São Paulo.",
    type: "website",
    locale: "pt_BR",
    siteName: "Karoline Garcia Fotografia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karoline Garcia | Fotografia Social e Pet",
    description:
      "Ensaios sociais e fotografia pet com um olhar sensível, natural e atemporal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-foreground">
        <SmoothScroll>
          <FilmGrain />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </SmoothScroll>
      </body>
    </html>
  );
}
