import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Karoline Garcia Fotografia",
  description: "Entre em contato para solicitar orçamentos, tirar dúvidas ou agendar o seu ensaio fotográfico.",
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
