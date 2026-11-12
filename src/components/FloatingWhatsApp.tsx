"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Esconder no painel admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Link
      href="https://wa.me/5511922880601?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group"
      aria-label="Fale conosco no WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.4 1.25 4.84L2 22l5.35-1.19A9.954 9.954 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.57 0-3.05-.37-4.37-1.03l-.31-.15-3.23.72.73-3.15-.17-.33A7.95 7.95 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.1-5.65c-.23-.11-1.33-.66-1.54-.73-.2-.07-.35-.11-.5.11-.15.22-.58.73-.71.88-.13.15-.27.16-.5.05-1.3-.61-2.22-1.28-3.08-2.67-.14-.22 0-.34.11-.45.1-.1.23-.27.34-.41.11-.14.15-.23.23-.38.08-.15.04-.29-.02-.4-.05-.11-.5-1.21-.68-1.65-.18-.43-.36-.37-.5-.38-.13-.01-.27-.01-.42-.01-.15 0-.39.06-.59.27-.2.22-.76.75-.76 1.83s.78 2.12.89 2.27c.11.15 1.55 2.37 3.75 3.32.52.22.93.36 1.25.46.52.17 1 .15 1.38.09.43-.07 1.33-.54 1.52-1.07.18-.53.18-.98.13-1.07-.05-.09-.2-.14-.42-.25z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}
