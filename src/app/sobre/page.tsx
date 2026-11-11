"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Camera, Users, Star, ArrowRight, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Photo {
  id: string;
  url: string;
  category: string;
}

const defaultSettings = {
  sobre_hero_bg: "",
  sobre_image_1: "",
  sobre_image_2: "",
  sobre_image_3: "",
  sobre_pets_album: "",
};

const defaultSettingsPositions: Record<string, string> = {
  sobre_hero_bg: "50% 50%",
  sobre_image_1: "50% 50%",
  sobre_image_2: "50% 50%",
  sobre_image_3: "50% 50%",
};

export default function SobrePage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsPositions, setSettingsPositions] = useState(defaultSettingsPositions);
  const [petPhotos, setPetPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .in("section", ["Sobre", "Sobre Dinâmica"]);
      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        const newSettingsPositions = { ...defaultSettingsPositions };
        data.forEach(item => {
          if (item.key in defaultSettings) {
            newSettings[item.key as keyof typeof defaultSettings] = item.url;
            if (item.cover_position) {
              newSettingsPositions[item.key] = item.cover_position;
            }
          }
        });
        setSettings(newSettings);
        setSettingsPositions(newSettingsPositions);

        if (newSettings.sobre_pets_album) {
          const { data: pData } = await supabase
            .from("photos")
            .select("id, url, category")
            .eq("album_id", newSettings.sobre_pets_album)
            .order("created_at", { ascending: false })
            .limit(8);
          if (pData) setPetPhotos(pData);
        }
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="w-full bg-background text-foreground min-h-screen flex flex-col font-sans">
      {/* 2. MINHA HISTÓRIA (Agora funciona como Hero) */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
            
            {/* Foto Esquerda com Selo */}
            <div className="w-full lg:w-1/3 relative aspect-[3/4] max-w-sm mx-auto bg-muted rounded">
               {settings.sobre_image_3 && (
                 <Image 
                   src={settings.sobre_image_3}
                   alt="História" 
                   fill 
                   className="object-cover rounded grayscale opacity-80"
                   style={{ objectPosition: settingsPositions.sobre_image_3 || '50% 50%' }}
                 />
               )}
               
               {/* Selo (Stamp) Simulado */}
               <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-primary/30 bg-secondary/80 backdrop-blur flex items-center justify-center flex-col text-primary rotate-[-15deg]">
                 <span className="font-serif text-2xl tracking-widest">KG</span>
                 <span className="text-[6px] uppercase tracking-[0.2em] mt-1 text-center w-full block">Karoline Garcia<br/>Fotografia</span>
               </div>
            </div>

            {/* Texto Centro */}
            <div className="w-full lg:w-2/3 text-center lg:text-left flex flex-col justify-center">
               <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                 <span className="text-[10px] uppercase tracking-[0.3em] text-primary">MINHA HISTÓRIA</span>
                 <Heart size={10} className="text-primary" />
               </div>
               <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-8 font-light">
                 Sou Karoline Garcia,<br/>
                 <span className="italic text-primary">fotógrafa social e pet.</span>
               </h2>
               
               <div className="space-y-4 text-muted-foreground font-light text-sm leading-relaxed max-w-2xl">
                 <p>
                   Com formação em Fotografia pelo Senac e atuando em São Paulo, encontrei na fotografia um propósito claro: eternizar os vínculos que mais importam. Seja registrando os momentos singulares de uma família ou a pureza incondicional de um pet, meu trabalho é movido pelas histórias que nos conectam.
                 </p>
                 <p>
                   Atuando nas áreas social e pet, percebi rapidamente como esses dois mundos se complementam. Afinal, nossos animais de estimação são capítulos essenciais da nossa história familiar. Eles dividem nossos dias e merecem ser lembrados com a mesma sensibilidade e respeito com que guardamos as memórias das pessoas que amamos.
                 </p>
                 <p>
                   Meu olhar busca a leveza, a luz natural e as expressões genuínas. Em cada ensaio — seja focado em pessoas ou nos pets — o principal objetivo é criar um ambiente leve e confortável, onde a personalidade de cada um possa brilhar de forma espontânea.
                 </p>
                 <p>
                   Ao longo da minha trajetória profissional, desenvolvi um estilo que mescla o naturalismo ao toque afetivo. Não busco poses forçadas, mas sim a beleza dos instantes autênticos — um abraço apertado, as brincadeiras soltas, os olhares atentos e o carinho trocado.
                 </p>
                 <p>
                   Meu maior objetivo é entregar a você mais do que belas imagens: é transformar frações de segundo em heranças visuais atemporais, para que você possa reviver esses sentimentos sempre que olhar para as fotografias.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 MEUS PETS (Galeria em Tira) */}
      <section className="bg-background pt-24 pb-0 flex flex-col items-center border-t border-accent">
        <div className="container mx-auto px-6 text-center max-w-3xl mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary">MINHA INSPIRAÇÃO</span>
            <Heart size={10} className="text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6 font-light">
            Lucky e Alice
          </h2>
          <p className="text-muted-foreground font-light text-sm leading-relaxed">
            Meus dois Shih Tzus, Lucky e Alice, são o coração da minha inspiração. É no convívio diário com eles — entre olhares curiosos, carinhos e muita brincadeira — que reafirmo minha crença de que as melhores fotografias nascem da paciência, da conexão e do amor autêntico pelos animais.
          </p>
        </div>

        {/* Galeria Grid (6 imagens) */}
        {petPhotos.length > 0 && (
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
            {petPhotos.slice(0, 6).map((photo) => (
              <div key={photo.id} className="relative group overflow-hidden bg-muted aspect-[4/5] md:aspect-auto md:h-[40vh] lg:h-[50vh]">
                <Image src={photo.url} alt="Pet" fill className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. MEUS VALORES (Claro) */}
      <section className="bg-background text-foreground py-20 relative overflow-hidden">
        {/* Textura de fundo bem suave */}
        {settings.sobre_hero_bg && (
          <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-multiply">
             <Image
               src={settings.sobre_hero_bg}
               alt="texture"
               fill
               className="object-cover"
               style={{ objectPosition: settingsPositions.sobre_hero_bg || '50% 50%' }}
             />
          </div>
        )}
        
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

           <div className="hidden lg:block shrink-0 relative w-80 aspect-video rounded-xl overflow-hidden shadow-2xl rotate-[-2deg] bg-muted">
              {settings.sobre_image_1 && (
                <Image
                  src={settings.sobre_image_1}
                  alt="Câmera e Fotos"
                  fill
                  className="object-cover"
                  style={{ objectPosition: settingsPositions.sobre_image_1 || '50% 50%' }}
                />
              )}
           </div>

        </div>
      </section>

    </div>
  );
}
