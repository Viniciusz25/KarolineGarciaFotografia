"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Camera, Heart, CheckCircle, Edit3, Download, Star, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import clsx from "clsx";

type Photo = {
  id: string;
  url: string;
  category: string;
};

type Testimonial = {
  id: number;
  name: string;
  category: string;
  text: string;
  avatar: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Juliana & Rafael",
    category: "Ensaio Casal",
    text: "A Karol mandou super bem! As fotos ficaram incríveis, superou todas as nossas expectativas. Profissional incrível e muito talentosa!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5
  },
  {
    id: 2,
    name: "Camila & Thor",
    category: "Ensaio Pet",
    text: "Nosso pet ficou super à vontade e o resultado foi simplesmente perfeito! Cada detalhe foi capturado com muito amor.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5
  },
  {
    id: 3,
    name: "Larissa",
    category: "Ensaio Gestante",
    text: "Experiência maravilhosa! As fotos da gravidez ficaram emocionantes e vamos guardar para sempre essas lembranças.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5
  }
];

const defaultSettings = {
  home_hero_bg: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop",
  home_escolha_social: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
  home_escolha_pet: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop",
  home_sobre_mosaic_1: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
  home_sobre_mosaic_2: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
  home_sobre_mosaic_3: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop",
  home_sobre_mosaic_4: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
  home_highlight_1: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
  home_highlight_2: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
  home_highlight_3: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
};

export default function Home() {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const router = useRouter();

  const [highlightPhotos, setHighlightPhotos] = useState<Photo[]>([]);
  const [instaPhotos, setInstaPhotos] = useState<Photo[]>([]);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from("photos")
        .select("id, url, category")
        .is("album_id", null)
        .order("created_at", { ascending: false })
        .limit(13);

      if (data) {
        setHighlightPhotos(data.slice(0, 6));
        setInstaPhotos(data.slice(6, 13));
      }
    };

    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("section", "Home");
      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        data.forEach(item => {
          newSettings[item.key as keyof typeof defaultSettings] = item.url;
        });
        setSettings(newSettings);
      }
    };

    fetchPhotos();
    fetchSettings();
  }, []);

  const handleExplore = (type: string) => {
    router.push(`/portfolio?categoria=${type}`);
  };

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden text-foreground">
      
      {/* 1. Hero Split-Screen */}
      <section className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden">
        {/* Navbar overlay gradient to ensure visibility at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />

        {/* Center Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-primary/50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center shadow-2xl">
            <span className="font-serif text-4xl text-primary mb-1">KG</span>
            <span className="text-[6px] uppercase tracking-[0.3em] text-white">Karoline Garcia</span>
            <span className="text-[5px] uppercase tracking-[0.2em] text-white/50">Fotografia</span>
          </div>
        </div>

        {/* Esquerda: SOCIAL */}
        <motion.div 
          className="relative h-1/2 md:h-full flex-1 overflow-hidden group cursor-pointer"
          onHoverStart={() => setHoveredSide("left")}
          onHoverEnd={() => setHoveredSide(null)}
          animate={{ 
            flex: hoveredSide === "left" ? 1.4 : hoveredSide === "right" ? 0.6 : 1,
            filter: hoveredSide === "right" ? "blur(4px) brightness(0.4)" : "blur(0px) brightness(1)"
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div onClick={() => handleExplore("social")} className="block w-full h-full relative">
            <Image
              src={settings.home_escolha_social}
              alt="Fotografia Social"
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent transition-opacity duration-700" />
            
            <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 text-left max-w-sm">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-primary mb-2 block">Fotografia</span>
              <h2 className="text-6xl md:text-8xl font-serif text-white mb-4 tracking-wider font-light">SOCIAL</h2>
              <p className="text-white/80 font-light text-sm mb-8 leading-relaxed">
                Momentos únicos que viram histórias eternas.
              </p>
              <span className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white border border-white/30 px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
                Conheça <ArrowRight className="ml-3 w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Direita: PET */}
        <motion.div 
          className="relative h-1/2 md:h-full flex-1 overflow-hidden group cursor-pointer"
          onHoverStart={() => setHoveredSide("right")}
          onHoverEnd={() => setHoveredSide(null)}
          animate={{ 
            flex: hoveredSide === "right" ? 1.4 : hoveredSide === "left" ? 0.6 : 1,
            filter: hoveredSide === "left" ? "blur(4px) brightness(0.4)" : "blur(0px) brightness(1)"
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div onClick={() => handleExplore("pet")} className="block w-full h-full relative">
            <Image
              src={settings.home_escolha_pet}
              alt="Fotografia Pet"
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent transition-opacity duration-700" />
            
            <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-24 text-right md:text-left md:left-24 max-w-sm">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-primary mb-2 block">Fotografia</span>
              <h2 className="text-6xl md:text-8xl font-serif text-white mb-4 tracking-wider font-light">PET</h2>
              <p className="text-white/80 font-light text-sm mb-8 leading-relaxed">
                Personalidade, amor e conexão em cada clique.
              </p>
              <span className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white border border-white/30 px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
                Conheça <ArrowRight className="ml-3 w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
        >
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center p-1 mb-3">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1 h-1 bg-white rounded-full"
            />
          </div>
          <span className="text-white/70 text-[8px] uppercase tracking-[0.3em]">Role para explorar</span>
        </motion.div>
      </section>

      {/* 2. Sobre: Fotografar é... */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary">Fotografar É</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-[1.2]">
                Conectar almas <br/>
                <span className="italic font-light text-primary">e eternizar</span> emoções.
              </h2>
              <p className="text-muted-foreground font-light text-sm md:text-base max-w-md leading-relaxed pt-4">
                Seja em um olhar, em um abraço ou em um pequeno gesto, cada detalhe importa e merece ser lembrado para sempre. O meu propósito é transformar esses fragmentos de tempo em histórias visuais autênticas.
              </p>
              <div className="pt-8">
                <Link href="/sobre" className="inline-flex items-center text-[10px] uppercase tracking-widest text-primary hover:text-foreground transition-colors font-medium border-b border-primary/30 pb-1">
                  Conheça minha história <ArrowRight className="ml-2 w-3 h-3" />
                </Link>
              </div>
            </div>
            
            <div className="flex-1 relative w-full aspect-[4/3] md:aspect-square">
              {/* Main Photo */}
              <div className="absolute right-0 top-0 w-4/5 h-4/5 rounded-t-[40px] rounded-br-[40px] rounded-bl-sm overflow-hidden shadow-2xl">
                <Image
                  src={settings.home_sobre_mosaic_1}
                  alt="Karoline Garcia"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Polaroids Decorativas */}
              <div className="absolute left-0 bottom-10 w-2/5 aspect-[3/4] bg-white p-2 pb-8 shadow-xl -rotate-6 z-10 hidden md:block">
                <div className="relative w-full h-full overflow-hidden bg-muted">
                  <Image src={settings.home_sobre_mosaic_2} alt="Polaroid 1" fill className="object-cover" />
                </div>
              </div>
              <div className="absolute left-24 bottom-0 w-2/5 aspect-[3/4] bg-white p-2 pb-8 shadow-xl rotate-3 z-20 hidden md:block">
                <div className="relative w-full h-full overflow-hidden bg-muted">
                   <Image src={settings.home_sobre_mosaic_3} alt="Polaroid 2" fill className="object-cover" />
                </div>
                <div className="absolute bottom-2 right-4 text-xs font-serif italic text-black opacity-60">fotografar é sentir ♥</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Portfólio em Destaque */}
      {highlightPhotos.length > 0 && (
        <section className="py-24 bg-background overflow-hidden border-t border-accent">
          <div className="text-center mb-16 px-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary">Portfólio em Destaque</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-3">
              Histórias <span className="italic font-light text-primary">que ficam.</span>
            </h2>
          </div>

          <div className="w-full relative px-6 md:px-12 group">
            {/* Carousel Container */}
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 no-scrollbar snap-x">
              {highlightPhotos.map((photo, i) => (
                <Link key={photo.id} href={`/portfolio`} className="relative flex-none w-64 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden group/card snap-center">
                  <Image
                    src={photo.url}
                    alt={photo.category}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <span className="text-white text-[11px] uppercase tracking-[0.3em] font-medium">
                      {photo.category || "Destaque"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/portfolio" className="inline-flex items-center text-[10px] uppercase tracking-widest text-foreground border border-white/20 px-8 py-4 rounded hover:bg-white hover:text-black transition-colors">
              Ver Todos os Álbuns <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 4. Experiência Completa */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center md:text-left mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary">Experiência Completa</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-3">
              Do primeiro clique <span className="italic font-light text-primary">à entrega.</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary mb-4 border border-accent">
                  <Heart size={20} />
                </div>
                <h4 className="font-serif text-lg mb-2">Atendimento<br/>Personalizado</h4>
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary mb-4 border border-accent">
                  <Camera size={20} />
                </div>
                <h4 className="font-serif text-lg mb-2">Planejamento<br/>do Ensaio</h4>
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary mb-4 border border-accent">
                  <CheckCircle size={20} />
                </div>
                <h4 className="font-serif text-lg mb-2">Ensaio com<br/>Direção</h4>
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary mb-4 border border-accent">
                  <Edit3 size={20} />
                </div>
                <h4 className="font-serif text-lg mb-2">Pós-produção<br/>Cuidadosa</h4>
              </div>
            </div>

            <div className="lg:w-1/3 relative aspect-video md:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={settings.home_highlight_1}
                alt="Experiência fotográfica"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Depoimentos */}
      <section className="py-24 bg-secondary border-y border-accent">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary">Depoimentos</span>
          <h2 className="font-serif text-3xl md:text-5xl mt-3 mb-16">
            Palavras que aquecem <span className="italic font-light text-primary">o coração.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((test) => (
              <div key={test.id} className="bg-background p-8 rounded-xl text-left border border-accent flex flex-col shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative">
                    <Image src={test.avatar} alt={test.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex text-primary mb-1">
                      {[...Array(test.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                </div>
                <p className="text-sm font-light text-foreground/90 italic mb-6 flex-grow">"{test.text}"</p>
                <div>
                  <p className="text-sm font-medium">{test.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary mt-1">{test.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Vamos contar a sua história */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.home_hero_bg}
            alt="Fundo CTA"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Vamos contar a sua história?</h2>
          <p className="text-white/80 font-light text-sm md:text-base mb-10 max-w-xl mx-auto">
            Será um prazer registrar momentos que farão parte da sua história para sempre. Entre em contato para conversarmos sobre o seu ensaio.
          </p>
          <Link
            href="https://wa.me/5511999999999?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-black bg-primary px-8 py-4 rounded hover:bg-white transition-colors"
          >
            <MessageCircle className="mr-3 w-4 h-4" /> Solicitar Orçamento
          </Link>
        </div>
      </section>

      {/* 7. Instagram Feed */}
      {instaPhotos.length > 0 && (
        <section className="py-16 bg-background">
          <div className="text-center mb-10">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-medium text-foreground mb-2">Acompanhe no Instagram</h3>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm font-serif italic text-primary hover:text-foreground transition-colors">@karolinegarcia.fotografia</a>
          </div>
          
          <div className="flex overflow-x-auto w-full no-scrollbar">
            {instaPhotos.map((photo) => (
              <a key={photo.id} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="relative flex-none w-1/3 md:w-1/5 lg:w-[14.28%] aspect-square group">
                <Image src={photo.url} alt="Instagram post" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
              </a>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[10px] uppercase tracking-widest text-muted-foreground border border-white/10 px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
              Seguir no Instagram <ArrowRight className="ml-2 w-3 h-3" />
            </a>
          </div>
        </section>
      )}

    </div>
  );
}
