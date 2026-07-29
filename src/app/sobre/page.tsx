"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Camera, Users, Star, ArrowRight, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const defaultSettings = {
  sobre_hero_bg: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2000&auto=format&fit=crop",
  sobre_image_1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
  sobre_image_2: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
  sobre_image_3: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop",
};

export default function SobrePage() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("section", "Sobre");
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
    <div className="w-full bg-background text-foreground min-h-screen flex flex-col font-sans">
      
      {/* 1. HERO - SOBRE MIM */}
      <section className="relative w-full min-h-screen flex items-center pt-24 md:pt-0">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10">
          
          <div className="flex-1 flex flex-col justify-center pb-12 md:pb-0">
            <span className="font-serif italic text-3xl text-[#cba37b] mb-4 block opacity-80">Sobre mim</span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8 font-light leading-[1.1]">
              Fotógrafa de<br/>
              histórias reais e<br/>
              sentimentos verdadeiros.
            </h1>
            <p className="text-muted-foreground font-light text-sm max-w-md mb-10 leading-relaxed">
              Acredito que cada clique tem o poder de eternizar o que realmente importa: o amor, os laços e os momentos que vivemos ao lado de quem amamos.
            </p>
            
            <Link href="/portfolio" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-foreground border border-foreground/20 px-8 py-4 rounded hover:bg-foreground hover:text-background transition-colors self-start">
              CONHEÇA MEU TRABALHO <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 w-full h-[60vh] md:h-screen relative">
            <Image 
              src={settings.sobre_hero_bg}
              alt="Karoline Garcia" 
              fill 
              className="object-cover"
              priority
            />
            {/* Gradiente para fundir imagem com fundo claro */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
          </div>
        </div>
      </section>

      {/* 2. MINHA HISTÓRIA */}
      <section className="py-24 md:py-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
            
            {/* Foto Esquerda com Selo */}
            <div className="w-full lg:w-1/3 relative aspect-[3/4] max-w-sm mx-auto">
               <Image 
                 src={settings.sobre_image_3}
                 alt="História" 
                 fill 
                 className="object-cover rounded grayscale opacity-80"
               />
               
               {/* Selo (Stamp) Simulado */}
               <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-primary/30 bg-secondary/80 backdrop-blur flex items-center justify-center flex-col text-primary rotate-[-15deg]">
                 <span className="font-serif text-2xl tracking-widest">KG</span>
                 <span className="text-[6px] uppercase tracking-[0.2em] mt-1 text-center w-full block">Karoline Garcia<br/>Fotografia</span>
               </div>
            </div>

            {/* Texto Centro */}
            <div className="w-full lg:w-1/3 text-center lg:text-left flex flex-col justify-center">
               <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                 <span className="text-[10px] uppercase tracking-[0.3em] text-primary">MINHA HISTÓRIA</span>
                 <Heart size={10} className="text-primary" />
               </div>
               <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-8 font-light">
                 Mais do que fotos,<br/>
                 eu crio <span className="italic text-primary">memórias</span>.
               </h2>
               <p className="text-muted-foreground font-light text-sm mb-6 leading-relaxed">
                 A fotografia entrou na minha vida como paixão e se transformou em propósito. Desde então, me dedico a contar histórias através de imagens que tocam, conectam e permanecem.
               </p>
               <p className="text-muted-foreground font-light text-sm leading-relaxed">
                 Cada ensaio é feito com um olhar sensível, buscando a essência de cada pessoa, família ou pet, para que as lembranças sejam autênticas e eternas.
               </p>
            </div>

            {/* Fotos Direita Empilhadas */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 max-w-sm mx-auto">
               <div className="relative aspect-video w-full rounded overflow-hidden">
                  <Image src={settings.sobre_image_1} alt="Pet" fill className="object-cover opacity-90" />
               </div>
               <div className="relative aspect-video w-full rounded overflow-hidden">
                  <Image src={settings.sobre_image_2} alt="Família" fill className="object-cover opacity-90" />
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MEUS VALORES (Claro) */}
      <section className="bg-background text-foreground py-20 relative overflow-hidden">
        {/* Textura de fundo bem suave */}
        <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-multiply">
           <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" alt="texture" fill className="object-cover" />
        </div>
        
        <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12">
           
           <div className="flex-1 flex flex-col md:flex-row gap-12 md:items-center">
              
              <div className="shrink-0 flex flex-col items-center md:items-start text-center md:text-left md:border-r border-[#2d2422]/10 md:pr-12">
                 <h2 className="text-[10px] uppercase tracking-[0.3em] font-medium mb-3">MEUS VALORES</h2>
                 <Heart size={12} className="text-[#cba37b]" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                 
                 <div className="flex flex-col items-center text-center">
                    <Heart size={24} className="text-[#cba37b] mb-4 font-light stroke-[1px]" />
                    <h3 className="font-serif text-lg mb-2">Sensibilidade</h3>
                    <p className="text-[10px] leading-relaxed text-[#2d2422]/60">Enxergar beleza nos detalhes e transformar emoções em imagens.</p>
                 </div>
                 
                 <div className="flex flex-col items-center text-center">
                    <Camera size={24} className="text-[#cba37b] mb-4 font-light stroke-[1px]" />
                    <h3 className="font-serif text-lg mb-2">Excelência</h3>
                    <p className="text-[10px] leading-relaxed text-[#2d2422]/60">Cuidar de cada etapa do ensaio para entregar resultados impecáveis.</p>
                 </div>
                 
                 <div className="flex flex-col items-center text-center">
                    <Users size={24} className="text-[#cba37b] mb-4 font-light stroke-[1px]" />
                    <h3 className="font-serif text-lg mb-2">Conexão</h3>
                    <p className="text-[10px] leading-relaxed text-[#2d2422]/60">Criar um ambiente leve e acolhedor para que tudo seja verdadeiro.</p>
                 </div>
                 
                 <div className="flex flex-col items-center text-center">
                    <Star size={24} className="text-[#cba37b] mb-4 font-light stroke-[1px]" />
                    <h3 className="font-serif text-lg mb-2">Propósito</h3>
                    <p className="text-[10px] leading-relaxed text-[#2d2422]/60">Registrar histórias que terão valor hoje e para as próximas gerações.</p>
                 </div>

              </div>

           </div>

           <div className="hidden lg:block shrink-0 relative w-80 aspect-video rounded-xl overflow-hidden shadow-2xl rotate-[-2deg]">
              <Image src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" alt="Câmera e Fotos" fill className="object-cover" />
           </div>

        </div>
      </section>

      {/* 4. MEU OLHAR */}
      <section className="py-24 md:py-32 bg-secondary border-t border-accent">
         <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 md:gap-24">
            
            <div className="w-full lg:w-1/3 flex flex-col justify-center">
               <div className="flex items-center gap-4 mb-6">
                 <span className="text-[10px] uppercase tracking-[0.3em] text-primary">MEU OLHAR</span>
                 <Heart size={10} className="text-primary" />
               </div>
               
               <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8 font-light leading-tight">
                 Natural, atemporal<br/>e cheio de <span className="italic">verdade</span>.
               </h2>
               
               <p className="text-muted-foreground font-light text-sm mb-6 leading-relaxed">
                 Meu trabalho é guiado pela luz natural, cores verdadeiras e composições que valorizam o que realmente importa.
               </p>
               <p className="text-muted-foreground font-light text-sm mb-12 leading-relaxed">
                 Mais do que fotos bonitas, busco entregar imagens que façam você sentir tudo novamente.
               </p>

               <div className="flex flex-col gap-2">
                  <span className="font-serif text-3xl md:text-4xl italic text-primary/80">Karoline Garcia</span>
                  <Heart size={14} className="text-primary ml-16" />
               </div>
            </div>

            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
               
               {/* Card 1 */}
               <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/5 group">
                  <Image src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop" alt="Fotografia Social" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                     <h3 className="text-[10px] uppercase tracking-widest text-[#cba37b] mb-2 font-medium">FOTOGRAFIA SOCIAL</h3>
                     <p className="text-[10px] text-white/70 leading-relaxed">Momentos que viram<br/>lembranças eternas.</p>
                     <Heart size={8} className="text-white/30 mx-auto mt-3" />
                  </div>
               </div>

               {/* Card 2 */}
               <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/5 group md:-translate-y-8">
                  <Image src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop" alt="Fotografia Pet" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                     <h3 className="text-[10px] uppercase tracking-widest text-[#cba37b] mb-2 font-medium">FOTOGRAFIA PET</h3>
                     <p className="text-[10px] text-white/70 leading-relaxed">Personalidade, amor e conexão<br/>em cada clique.</p>
                     <Heart size={8} className="text-white/30 mx-auto mt-3" />
                  </div>
               </div>

               {/* Card 3 */}
               <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/5 group">
                  <Image src="https://images.unsplash.com/photo-1519064438069-5c742354c0e6?q=80&w=600&auto=format&fit=crop" alt="Histórias Reais" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                     <h3 className="text-[10px] uppercase tracking-widest text-[#cba37b] mb-2 font-medium">HISTÓRIAS REAIS</h3>
                     <p className="text-[10px] text-white/70 leading-relaxed">Pessoas, famílias e pets.<br/>Histórias únicas.</p>
                     <Heart size={8} className="text-white/30 mx-auto mt-3" />
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 5. TESTEMUNHO */}
      <section className="bg-background text-foreground py-24 border-t border-accent">
         <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 max-w-4xl">
            
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#cba37b] shrink-0 shadow-sm">
               <Quote size={24} className="fill-current" />
            </div>
            
            <div className="text-center md:text-left flex-1">
               <h3 className="text-xl md:text-2xl font-serif leading-relaxed mb-8 text-[#2d2422]/90">
                  "A Karoline tem um dom incrível de nos deixar à vontade e capturar aquilo que nem conseguimos colocar em palavras."
               </h3>
               
               <div className="flex items-center justify-center md:justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full overflow-hidden relative shadow-md">
                        <Image src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=200&auto=format&fit=crop" alt="Juliana & Rafael" fill className="object-cover" />
                     </div>
                     <div className="text-left">
                        <span className="block text-sm font-medium">Juliana & Rafael</span>
                        <span className="block text-[10px] uppercase tracking-widest text-[#2d2422]/50">Ensaio Gestante</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <button className="w-8 h-8 rounded-full border border-[#2d2422]/20 flex items-center justify-center hover:bg-[#2d2422] hover:text-white transition-colors">
                        <ChevronLeft size={16} />
                     </button>
                     <button className="w-8 h-8 rounded-full border border-[#2d2422]/20 flex items-center justify-center hover:bg-[#2d2422] hover:text-white transition-colors">
                        <ChevronRight size={16} />
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </section>

    </div>
  );
}
