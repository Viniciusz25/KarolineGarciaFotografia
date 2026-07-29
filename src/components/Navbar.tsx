"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Ensaios", href: "/ensaios" },
  { name: "Sobre", href: "/sobre" },
  { name: "Depoimentos", href: "/depoimentos" },
  { name: "Contato", href: "/contato" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  // Na home, fica transparente no topo. Nas outras páginas (como Sobre que é clara), já começa com fundo sólido.
  const showSolidBackground = isHome ? isScrolled : true;
  const useWhiteText = isHome ? !isScrolled : false;

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document;
      if (target === document) {
        setIsScrolled(window.scrollY > 20);
      } else {
        setIsScrolled((target as HTMLElement).scrollTop > 20);
      }
    };

    // Tenta encontrar o scroller da home (se existir)
    const scroller = document.getElementById('home-scroller');
    
    if (scroller) {
      scroller.addEventListener("scroll", handleScroll);
      return () => scroller.removeEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [pathname]);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          showSolidBackground ? "bg-background/90 backdrop-blur-md shadow-sm py-4 border-b border-accent" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex flex-col z-50">
            <span className={clsx(
              "font-serif text-2xl tracking-wide transition-colors",
              useWhiteText ? "text-white" : "text-foreground"
            )}>
              Karoline Garcia
            </span>
            <span className={clsx(
              "text-[0.65rem] uppercase tracking-[0.2em] mt-1 transition-colors",
              useWhiteText ? "text-white/70" : "text-muted-foreground"
            )}>
              Fotografia
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href 
                    ? (useWhiteText ? "text-white border-b border-white pb-1" : "text-primary border-b border-primary pb-1") 
                    : (useWhiteText ? "text-white/90" : "text-foreground")
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Solicitar Orçamento
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={clsx(
              "lg:hidden z-50 transition-colors",
              (isMobileMenuOpen || !useWhiteText) ? "text-foreground" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Alternar menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-lg flex flex-col items-center justify-center space-y-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "text-2xl font-serif transition-colors",
                  pathname === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-medium shadow-md"
            >
              Solicitar Orçamento
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
