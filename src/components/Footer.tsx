"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-background text-foreground pt-20 pb-8 border-t border-accent">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Logo e Infos */}
          <div className="lg:col-span-1 flex flex-col">
            <Link href="/" className="flex flex-col items-start mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-serif text-4xl text-foreground">KG</span>
                <div className="flex flex-col">
                  <span className="font-serif text-[10px] tracking-[0.2em] uppercase leading-none mb-1">Karoline Garcia</span>
                  <span className="text-[7px] uppercase tracking-[0.4em] text-muted-foreground leading-none">Fotografia</span>
                </div>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground font-light mb-8 max-w-[200px] leading-relaxed">
              Fotografia social e pet com um olhar sensível, natural e atemporal.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:contato@karolinegarcia.com.br" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div className="flex flex-col">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary mb-6">Navegação</h4>
            <ul className="space-y-3 text-xs text-muted-foreground font-light">
              <li><Link href="/" className="hover:text-foreground transition-colors">Início</Link></li>
              <li><Link href="/portfolio" className="hover:text-foreground transition-colors">Portfólio</Link></li>
              <li><Link href="/portfolio/social" className="hover:text-foreground transition-colors">Fotografia Social</Link></li>
              <li><Link href="/portfolio/pet" className="hover:text-foreground transition-colors">Fotografia Pet</Link></li>
              <li><Link href="/sobre" className="hover:text-foreground transition-colors">Sobre</Link></li>
              <li><Link href="/depoimentos" className="hover:text-foreground transition-colors">Depoimentos</Link></li>
              <li><Link href="/contato" className="hover:text-foreground transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Ensaios Sociais */}
          <div className="flex flex-col">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary mb-6">Ensaios Sociais</h4>
            <ul className="space-y-3 text-xs text-muted-foreground font-light">
              <li><Link href="/portfolio/social?tag=casamentos" className="hover:text-foreground transition-colors">Casamentos</Link></li>
              <li><Link href="/portfolio/social?tag=debutantes" className="hover:text-foreground transition-colors">Debutantes</Link></li>
              <li><Link href="/portfolio/social?tag=gestantes" className="hover:text-foreground transition-colors">Gestantes</Link></li>
              <li><Link href="/portfolio/social?tag=familia" className="hover:text-foreground transition-colors">Família</Link></li>
              <li><Link href="/portfolio/social?tag=casais" className="hover:text-foreground transition-colors">Casais</Link></li>
              <li><Link href="/portfolio/social?tag=formaturas" className="hover:text-foreground transition-colors">Formaturas</Link></li>
            </ul>
          </div>

          {/* Ensaios Pet */}
          <div className="flex flex-col">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary mb-6">Ensaios Pet</h4>
            <ul className="space-y-3 text-xs text-muted-foreground font-light">
              <li><Link href="/portfolio/pet?tag=externo" className="hover:text-foreground transition-colors">Ensaio Externo</Link></li>
              <li><Link href="/portfolio/pet?tag=estudio" className="hover:text-foreground transition-colors">Estúdio</Link></li>
              <li><Link href="/portfolio/pet?tag=pet-e-familia" className="hover:text-foreground transition-colors">Pets e Família</Link></li>
              <li><Link href="/portfolio/pet?tag=filhotes" className="hover:text-foreground transition-colors">Filhotes</Link></li>
              <li><Link href="/portfolio/pet?tag=datas-especiais" className="hover:text-foreground transition-colors">Datas Especiais</Link></li>
            </ul>
          </div>

          {/* Fale Comigo */}
          <div className="flex flex-col">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary mb-6">Fale Comigo</h4>
            <ul className="space-y-4 text-xs text-muted-foreground font-light mb-8">
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-primary" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-primary" />
                <span>contato@karolinegarcia.com.br</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={14} className="text-primary" />
                <span>São Paulo - SP</span>
              </li>
            </ul>
            <Link
              href="/contato"
              className="inline-flex items-center justify-between w-full border border-foreground/20 hover:border-primary text-foreground px-4 py-3 text-[10px] uppercase tracking-widest transition-colors rounded-sm"
            >
              Solicitar Orçamento
              <span>→</span>
            </Link>
          </div>

        </div>

        {/* Linha Divisória e Copyright */}
        <div className="pt-8 border-t border-accent flex flex-col md:flex-row justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider font-light">
          <p>
            &copy; {currentYear} Karoline Garcia Fotografia. Todos os direitos reservados.
          </p>
          <p className="mt-4 md:mt-0">
            Desenvolvido com ♥
          </p>
        </div>
      </div>
    </footer>
  );
}
