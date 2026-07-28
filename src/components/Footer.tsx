import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground py-16 border-t border-accent">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
        
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mb-4">
            <span className="font-serif text-2xl text-primary">KG</span>
          </div>
          <span className="font-serif text-xl tracking-wide">Karoline Garcia</span>
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mt-1">Fotografia</span>
        </Link>

        {/* Links */}
        <div className="flex space-x-6 mb-8">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-foreground hover:text-primary transition-colors hover:shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            <span className="sr-only">Instagram</span>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-foreground hover:text-primary transition-colors hover:shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            <span className="sr-only">Facebook</span>
          </a>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-foreground hover:text-primary transition-colors hover:shadow-sm">
            <MessageCircle size={20} />
            <span className="sr-only">WhatsApp</span>
          </a>
          <a href="mailto:contato@karolinegarcia.com.br" className="p-2 bg-white rounded-full text-foreground hover:text-primary transition-colors hover:shadow-sm">
            <Mail size={20} />
            <span className="sr-only">E-mail</span>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Karoline Garcia Fotografia. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
