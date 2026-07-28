import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Depoimentos | Karoline Garcia Fotografia",
  description: "Leia relatos de clientes que confiaram no nosso olhar para eternizar as memórias mais preciosas da sua família e dos seus pets.",
};

export default function DepoimentosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
