"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Star, Camera, ShieldCheck, Sparkles, Smile, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const defaultSettings = {
  ensaios_hero_bg: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2000&auto=format&fit=crop",
  ensaios_mosaic_1: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
  ensaios_mosaic_2: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1000&auto=format&fit=crop",
  ensaios_mosaic_3: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
  ensaios_mosaic_4: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop",
};

export default function EnsaiosPage() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("section", "Ensaios");
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
    <div className="w-full flex flex-col">
      
      {/* =========================================================================
          SEÇÃO 1: FOTOGRAFIA SOCIAL (DARK THEME)
          ========================================================================= */}
      <section className="bg-[#0f0c0b] text-[#f4ede8] w-full pt-32 pb-24">
        
        {/* HERO SOCIAL */}
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-24 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative aspect-[3/4] md:aspect-square w-full rounded-tr-[80px] rounded-bl-[80px] overflow-hidden"
          >
            <Image
              src={settings.ensaios_hero_bg}
              alt="Fotografia Social"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c0b] via-transparent to-transparent opacity-80" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#cba37b] mb-4 block">Início / Fotografia Social</span>
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-wide mb-6">
              FOTOGRAFIA<br/><strong className="font-serif font-normal">SOCIAL</strong>
            </h1>
            <p className="text-[#f4ede8]/70 font-light text-sm leading-relaxed max-w-md mb-10">
              Histórias reais, sentimentos verdadeiros e momentos que merecem ser eternizados com sensibilidade e elegância.
            </p>
            <Link href="/contato" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-[#cba37b] border border-[#cba37b]/30 px-8 py-4 rounded hover:bg-[#cba37b] hover:text-[#0f0c0b] transition-colors">
              Solicitar Orçamento <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* MOSAICO SOCIAL */}
        <div className="container mx-auto px-6 md:px-12 mb-32">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-[12px] uppercase tracking-[0.3em] font-medium mb-3">Escolha o seu momento</h2>
            <Heart size={14} className="text-[#cba37b]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[250px]">
            {/* Casamentos: 2x2 */}
            <Link href="/portfolio/social?tag=casamentos" className="group relative col-span-1 md:col-span-2 md:row-span-2 rounded-xl overflow-hidden cursor-pointer block min-h-[300px] md:min-h-0">
              <Image src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2070&auto=format&fit=crop" alt="Casamentos" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Star size={24} className="text-[#cba37b] mb-4 opacity-80" />
                <h3 className="text-2xl font-serif text-white tracking-widest mb-2">CASAMENTOS</h3>
                <span className="text-[9px] uppercase tracking-widest text-white/70 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-2 w-3 h-3" /></span>
              </div>
            </Link>

            {/* Debutantes: 1x1 */}
            <Link href="/portfolio/social?tag=debutantes" className="group relative col-span-1 md:col-span-1 md:row-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0">
              <Image src={settings.ensaios_mosaic_2} alt="Debutantes" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Sparkles size={20} className="text-[#cba37b] mb-3 opacity-80" />
                <h3 className="text-sm font-serif text-white tracking-widest mb-2">DEBUTANTES</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/70 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>

            {/* Gestantes: 1x2 */}
            <Link href="/portfolio/social?tag=gestantes" className="group relative col-span-1 md:col-span-1 md:row-span-2 rounded-xl overflow-hidden cursor-pointer block min-h-[300px] md:min-h-0">
              <Image src={settings.ensaios_mosaic_1} alt="Gestantes" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Heart size={20} className="text-[#cba37b] mb-3 opacity-80" />
                <h3 className="text-xl font-serif text-white tracking-widest mb-2">GESTANTES</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/70 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>

            {/* Família: 1x1 */}
            <Link href="/portfolio/social?tag=familia" className="group relative col-span-1 md:col-span-1 md:row-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0">
              <Image src={settings.ensaios_mosaic_3} alt="Família" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Smile size={20} className="text-[#cba37b] mb-3 opacity-80" />
                <h3 className="text-sm font-serif text-white tracking-widest mb-2">FAMÍLIA</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/70 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>

            {/* Linha Inferior do Mosaico */}
            {/* Casais */}
            <Link href="/portfolio/social?tag=casais" className="group relative col-span-1 md:col-span-1 md:row-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0">
              <Image src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2070&auto=format&fit=crop" alt="Casais" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Heart size={20} className="text-[#cba37b] mb-3 opacity-80" />
                <h3 className="text-sm font-serif text-white tracking-widest mb-2">CASAIS</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/70 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>

            {/* Formandos: Span 2 */}
            <Link href="/portfolio/social?tag=formaturas" className="group relative col-span-1 md:col-span-2 md:row-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0">
              <Image src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop" alt="Formandos" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Star size={20} className="text-[#cba37b] mb-3 opacity-80" />
                <h3 className="text-xl font-serif text-white tracking-widest mb-2">FORMANDOS</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/70 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>

            {/* Eventos */}
            <Link href="/portfolio/social?tag=eventos" className="group relative col-span-1 md:col-span-1 md:row-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0">
              <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" alt="Eventos" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Camera size={20} className="text-[#cba37b] mb-3 opacity-80" />
                <h3 className="text-sm font-serif text-white tracking-widest mb-2">EVENTOS</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/70 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>
          </div>
        </div>

        {/* RODAPÉ SOCIAL (Cada Detalhe Importa) */}
        <div className="bg-[#151110] border-y border-white/5 py-16">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 max-w-sm rounded-xl overflow-hidden relative aspect-video md:aspect-[4/3]">
               <Image src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2070&auto=format&fit=crop" alt="Fotógrafa" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-serif font-light mb-4">
                Cada detalhe importa.<br/>
                <span className="text-[#cba37b] italic">Cada história merece ser lembrada.</span>
              </h3>
              <p className="text-white/60 font-light text-sm max-w-md mb-8">
                Meu propósito é transformar momentos em memórias que vão acompanhar você para sempre.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/sobre" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white border border-white/20 px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
                  Me Conheça Melhor <ArrowRight className="ml-2 w-3 h-3" />
                </Link>
                <span className="font-serif italic text-2xl text-[#cba37b]/70 hidden md:block">Karoline Garcia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 2: FOTOGRAFIA PET (LIGHT THEME)
          ========================================================================= */}
      <section className="bg-[#fcfaf8] text-[#2d2422] w-full py-32">
        
        {/* HERO PET */}
        <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#cba37b] mb-4 block">Início / Fotografia Pet</span>
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-wide mb-6">
              FOTOGRAFIA<br/><strong className="font-serif font-normal flex items-center gap-4">PET <Heart className="w-8 h-8 text-[#cba37b]" /></strong>
            </h1>
            <p className="text-[#2d2422]/70 font-light text-sm leading-relaxed max-w-md mb-10">
              Personalidade, amor e conexão em cada clique. Seu melhor amigo merece fotos tão inesquecíveis quanto os momentos que vocês vivem juntos.
            </p>
            <Link href="/contato" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-[#cba37b] border border-[#cba37b]/30 px-8 py-4 rounded hover:bg-[#cba37b] hover:text-white transition-colors">
              Agendar Ensaio Pet <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative aspect-[3/4] md:aspect-square w-full rounded-tl-[80px] rounded-br-[80px] overflow-hidden"
          >
            <Image
              src={settings.ensaios_mosaic_4}
              alt="Fotografia Pet"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf8] via-transparent to-transparent opacity-50" />
          </motion.div>
        </div>

        {/* MOSAICO PET */}
        <div className="container mx-auto px-6 md:px-12 mb-32">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-[12px] uppercase tracking-[0.3em] font-medium mb-3 text-[#2d2422]">Escolha o tipo de ensaio</h2>
            <Heart size={14} className="text-[#cba37b]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[280px]">
            {/* Ensaio Externo: 1x2 (Vertical) */}
            <Link href="/portfolio/pet?tag=externo" className="group relative col-span-1 md:row-span-2 rounded-xl overflow-hidden cursor-pointer block min-h-[300px] md:min-h-0 shadow-sm">
              <Image src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2074&auto=format&fit=crop" alt="Ensaio Externo" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-serif text-white tracking-widest mb-2">ENSAIO EXTERNO</h3>
                <span className="text-[9px] uppercase tracking-widest text-white/90 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-2 w-3 h-3" /></span>
              </div>
            </Link>

            {/* Estúdio: 2x1 (Horizontal) */}
            <Link href="/portfolio/pet?tag=estudio" className="group relative col-span-1 md:col-span-2 md:row-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0 shadow-sm">
              <Image src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop" alt="Estúdio" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-serif text-white tracking-widest mb-2">ESTÚDIO</h3>
                <span className="text-[9px] uppercase tracking-widest text-white/90 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-2 w-3 h-3" /></span>
              </div>
            </Link>

            {/* Pets e Família: 2x1 (Horizontal) */}
            <Link href="/portfolio/pet?tag=pet-e-familia" className="group relative col-span-1 md:col-span-2 md:row-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0 shadow-sm">
              <Image src="https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=2000&auto=format&fit=crop" alt="Pets e Família" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-serif text-white tracking-widest mb-2">PETS E FAMÍLIA</h3>
                <span className="text-[9px] uppercase tracking-widest text-white/90 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-2 w-3 h-3" /></span>
              </div>
            </Link>

            {/* Filhotes, Datas Especiais, Aniversários: 1x1 Cada na última linha */}
            <Link href="/portfolio/pet?tag=filhotes" className="group relative col-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0 shadow-sm">
              <Image src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=2000&auto=format&fit=crop" alt="Filhotes" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-sm font-serif text-white tracking-widest mb-2">FILHOTES</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/90 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>
            <Link href="/portfolio/pet?tag=datas-especiais" className="group relative col-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0 shadow-sm">
              <Image src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=2000&auto=format&fit=crop" alt="Datas Especiais" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-sm font-serif text-white tracking-widest mb-2">DATAS ESPECIAIS</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/90 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>
            <Link href="/portfolio/pet?tag=aniversarios-pet" className="group relative col-span-1 rounded-xl overflow-hidden cursor-pointer block min-h-[250px] md:min-h-0 shadow-sm">
              <Image src="https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=2000&auto=format&fit=crop" alt="Aniversários Pet" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-sm font-serif text-white tracking-widest mb-2">ANIVERSÁRIOS PET</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/90 flex items-center group-hover:text-[#cba37b] transition-colors">Ver Álbum <ArrowRight className="ml-1 w-2 h-2" /></span>
              </div>
            </Link>
          </div>
        </div>

        {/* RODAPÉ PET (Eles fazem parte da família) */}
        <div className="bg-[#f0ece9] border-y border-[#e5d8cf] py-16">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 max-w-sm rounded-xl overflow-hidden relative aspect-video md:aspect-[4/3] shadow-md">
               <Image src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2000&auto=format&fit=crop" alt="Cachorro" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-serif font-light mb-4">
                Eles fazem parte da família.<br/>
                <span className="text-[#cba37b] italic">E cada fase merece ser eternizada.</span>
              </h3>
              <p className="text-[#2d2422]/60 font-light text-sm max-w-md mb-8">
                Ensaios feitos com paciência, carinho e técnicas especiais para que seu pet se sinta à vontade e a experiência seja leve e divertida.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8 text-center max-w-sm">
                 <div>
                    <ShieldCheck size={20} className="mx-auto text-[#cba37b] mb-2" />
                    <span className="text-[8px] uppercase tracking-wider block">Ambiente Seguro<br/>e Acolhedor</span>
                 </div>
                 <div>
                    <Heart size={20} className="mx-auto text-[#cba37b] mb-2" />
                    <span className="text-[8px] uppercase tracking-wider block">Paciência e<br/>Muito Carinho</span>
                 </div>
                 <div>
                    <Camera size={20} className="mx-auto text-[#cba37b] mb-2" />
                    <span className="text-[8px] uppercase tracking-wider block">Fotos Naturais<br/>e Autênticas</span>
                 </div>
              </div>

              <Link href="/sobre" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-[#2d2422] border border-[#2d2422]/20 px-6 py-3 rounded hover:bg-[#2d2422] hover:text-white transition-colors">
                Saiba mais sobre os ensaios <ArrowRight className="ml-2 w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RODAPÉ GERAL DE AGENDAMENTO
          ========================================================================= */}
      <section className="bg-white py-12 border-b border-[#e5d8cf]">
         <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
               <div className="w-16 h-16 rounded-full border border-[#cba37b] flex items-center justify-center bg-[#fcfaf8]">
                  <Heart size={24} className="text-[#cba37b]" />
               </div>
               <div>
                  <h3 className="font-serif text-2xl text-[#2d2422]">Vamos criar memórias incríveis juntos?</h3>
                  <p className="text-sm font-light text-[#2d2422]/60">Fale comigo e agende o ensaio.</p>
               </div>
            </div>
            <Link href="/contato" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white bg-[#0f0c0b] px-8 py-4 rounded hover:bg-[#cba37b] transition-colors">
              Agendar Agora <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
         </div>
      </section>

    </div>
  );
}
