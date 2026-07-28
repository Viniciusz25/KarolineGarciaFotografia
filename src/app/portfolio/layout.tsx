import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfólio | Karoline Garcia Fotografia",
  description: "Nossa galeria completa. Momentos e olhares eternizados em fotografia social e pet.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
