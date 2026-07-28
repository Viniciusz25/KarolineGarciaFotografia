"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, User, PawPrint, ArrowRight, Camera, Clock, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const defaultSettings = {
  portfolio_hero_social: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop",
  portfolio_hero_pet: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2000&auto=format&fit=crop",
  portfolio_mosaic_1: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
  portfolio_mosaic_2: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop",
  portfolio_mosaic_3: "https://images.unsplash.com/photo-1519064438069-5c742354c0e6?q=80&w=1000&auto=format&fit=crop",
  portfolio_mosaic_4: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
  portfolio_mosaic_5: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop",
  portfolio_mosaic_6: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1000&auto=format&fit=crop",
  portfolio_mosaic_7: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1000&auto=format&fit=crop",
  portfolio_mosaic_8: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
  portfolio_mosaic_9: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1000&auto=format&fit=crop",
};

export default function PortfolioPage() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("section", "Portfolio");
      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        data.forEach(item => {
          newSettings[item.key as keyof typeof defaultSettings] = item.url;
        });
        setSettings(newSettings);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="w-full bg-[#0a0807] text-[#f4ede8] flex flex-col overflow-hidden min-h-screen">
      
      {/* 1. HERO SPLIT BACKGROUND */}
      <section className="relative w-full h-[70vh] md:h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Splitting */}
        <div className="absolute inset-0 flex">
          <div className="relative flex-1 h-full">
            <Image src={settings.portfolio_hero_social} alt="Social" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          </div>
          <div className="relative flex-1 h-full">
            <Image src={settings.portfolio_hero_pet} alt="Pet" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-transparent" />
          </div>
        </div>

        {/* Dark overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0807] to-transparent z-10" />

        {/* Content */}
        <div className="relative z-20 text-center flex flex-col items-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-serif tracking-widest text-white mb-6"
          >
            PORTFÓLIO
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center mb-10"
          >
            <Heart size={14} className="text-[#cba37b] mb-4" />
            <p className="text-white/80 font-light text-sm md:text-base">
              Histórias que ficam.<br/>Momentos que viram memórias.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 md:gap-8"
          >
            <Link href="#ensaios-sociais" className="inline-flex items-center justify-center gap-3 border border-white/20 hover:border-[#cba37b] text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-widest transition-colors bg-black/40 backdrop-blur-sm">
              <User size={14} className="text-[#cba37b]" /> Fotografia Social
            </Link>
            <Link href="#ensaios-pet" className="inline-flex items-center justify-center gap-3 border border-white/20 hover:border-[#cba37b] text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-widest transition-colors bg-black/40 backdrop-blur-sm">
              <PawPrint size={14} className="text-[#cba37b]" /> Fotografia Pet
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. DESTAQUES (MASONRY GRID) */}
      <section className="py-24 px-4 md:px-8 max-w-[1400px] mx-auto w-full relative z-20">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-xl md:text-2xl tracking-[0.3em] font-serif text-white mb-4">DESTAQUES</h2>
          <Heart size={12} className="text-[#cba37b] mb-4" />
          <span className="text-[10px] uppercase tracking-widest text-white/50">Uma seleção especial de momentos inesquecíveis.</span>
        </div>

        {/* Masonry CSS */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_1} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_2} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_3} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative w-full aspect-square rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_4} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_5} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative w-full aspect-square rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_6} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_7} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_8} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative w-full aspect-square rounded-lg overflow-hidden group break-inside-avoid">
            <Image src={settings.portfolio_mosaic_9} alt="Destaque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* DIVISOR */}
      <div className="w-full flex justify-center py-8">
        <div className="h-16 w-[1px] bg-white/10" />
      </div>

      {/* 3. ENSAIOS SOCIAIS */}
      <section id="ensaios-sociais" className="py-16">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-xl md:text-2xl tracking-[0.3em] font-serif text-white mb-4">ENSAIOS SOCIAIS</h2>
          <Heart size={12} className="text-[#cba37b]" />
        </div>

        <div className="w-full relative px-4 md:px-8 max-w-[1600px] mx-auto">
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 no-scrollbar snap-x snap-mandatory items-center justify-start md:justify-center">
            {[
              { id: 'casamentos', title: 'CASAMENTOS', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc' },
              { id: 'debutantes', title: 'DEBUTANTES', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8' },
              { id: 'gestantes', title: 'GESTANTES', img: 'https://images.unsplash.com/photo-1519064438069-5c742354c0e6' },
              { id: 'familia', title: 'FAMÍLIA', img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300' },
              { id: 'casais', title: 'CASAIS', img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2' },
              { id: 'formandos', title: 'FORMANDOS', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' },
              { id: 'eventos', title: 'EVENTOS', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622' },
            ].map((cat) => (
              <Link key={cat.id} href={`/portfolio/social?tag=${cat.id}`} className="relative flex-none w-48 md:w-56 aspect-[2/3] rounded-lg overflow-hidden group snap-center cursor-pointer">
                <Image src={`${cat.img}?q=80&w=600&auto=format&fit=crop`} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                  <h3 className="text-white text-[11px] uppercase tracking-[0.2em] font-medium mb-2">{cat.title}</h3>
                  <span className="text-[#cba37b] text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                    Ver Álbum <ArrowRight className="ml-1 w-2 h-2" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/portfolio/social" className="inline-flex items-center text-[10px] uppercase tracking-widest text-white/70 border border-white/10 px-8 py-3 rounded-sm hover:border-[#cba37b] hover:text-[#cba37b] transition-colors">
              Ver Todos os Álbuns Sociais <ArrowRight className="ml-3 w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* DIVISOR */}
      <div className="w-full flex justify-center py-8">
        <div className="h-16 w-[1px] bg-white/10" />
      </div>

      {/* 4. ENSAIOS PET */}
      <section id="ensaios-pet" className="py-16">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-xl md:text-2xl tracking-[0.3em] font-serif text-white mb-4">ENSAIOS PET</h2>
          <Heart size={12} className="text-[#cba37b]" />
        </div>

        <div className="w-full relative px-4 md:px-8 max-w-[1600px] mx-auto">
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 no-scrollbar snap-x snap-mandatory items-center justify-start md:justify-center">
            {[
              { id: 'externo', title: 'ENSAIO EXTERNO', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8' },
              { id: 'estudio', title: 'ESTÚDIO', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b' },
              { id: 'pet-e-familia', title: 'PETS E FAMÍLIA', img: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530' },
              { id: 'filhotes', title: 'FILHOTES', img: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0' },
              { id: 'datas-especiais', title: 'DATAS ESPECIAIS', img: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd' },
              { id: 'aniversarios-pet', title: 'ANIVERSÁRIOS PET', img: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a' },
              { id: 'gatos', title: 'GATOS', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba' },
            ].map((cat) => (
              <Link key={cat.id} href={`/portfolio/pet?tag=${cat.id}`} className="relative flex-none w-48 md:w-56 aspect-[2/3] rounded-lg overflow-hidden group snap-center cursor-pointer">
                <Image src={`${cat.img}?q=80&w=600&auto=format&fit=crop`} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                  <h3 className="text-white text-[11px] uppercase tracking-[0.2em] font-medium mb-2">{cat.title}</h3>
                  <span className="text-[#cba37b] text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                    Ver Álbum <ArrowRight className="ml-1 w-2 h-2" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/portfolio/pet" className="inline-flex items-center text-[10px] uppercase tracking-widest text-white/70 border border-white/10 px-8 py-3 rounded-sm hover:border-[#cba37b] hover:text-[#cba37b] transition-colors">
              Ver Todos os Álbuns Pet <ArrowRight className="ml-3 w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="relative mt-24 py-24 border-t border-white/5 bg-[#100c0a] overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" alt="Background Texture" fill className="object-cover" />
         </div>
         <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24">
            
            <div className="flex-1 w-full relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-white/5">
               <Image src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop" alt="Câmera" fill className="object-cover" />
               <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="flex-1">
               <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">Cada clique é feito com propósito:</span>
               <h3 className="text-3xl md:text-5xl font-serif text-[#cba37b] mb-8 font-light">
                  registrar o que realmente importa.
               </h3>
               
               <p className="text-sm font-light text-white/70 mb-10">Vamos criar memórias juntos?</p>
               
               <Link href="/contato" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white border border-white/20 px-8 py-4 rounded hover:border-[#cba37b] hover:text-[#cba37b] transition-colors mb-16">
                 Solicitar Orçamento <ArrowRight className="ml-3 w-4 h-4" />
               </Link>

               <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                     <User size={20} className="text-[#cba37b] mb-3" />
                     <span className="text-[8px] uppercase tracking-widest text-white/60">Atendimento<br/>Personalizado</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <Clock size={20} className="text-[#cba37b] mb-3" />
                     <span className="text-[8px] uppercase tracking-widest text-white/60">Entrega<br/>Rápida e Segura</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <Heart size={20} className="text-[#cba37b] mb-3" />
                     <span className="text-[8px] uppercase tracking-widest text-white/60">Experiência<br/>Completa</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}
