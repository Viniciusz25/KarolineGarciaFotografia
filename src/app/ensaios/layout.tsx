import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ensaios | Karoline Garcia Fotografia",
  description: "Explore nossos melhores momentos. Escolha a categoria social ou pet para visualizar as histórias que já contamos.",
};

export default function EnsaiosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
