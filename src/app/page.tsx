"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Camera,
  Heart,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Calendar,
  Images,
  Award,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import clsx from "clsx";
import Footer from "@/components/Footer";

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
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "Camila & Thor",
    category: "Ensaio Pet",
    text: "Nosso pet ficou super à vontade e o resultado foi simplesmente perfeito! Cada detalhe foi capturado com muito amor.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    name: "Larissa",
    category: "Ensaio Gestante",
    text: "Experiência maravilhosa! As fotos da gravidez ficaram emocionantes e vamos guardar para sempre essas lembranças.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
];

const experienceSteps = [
  {
    step: "01",
    icon: Calendar,
    title: "Conversa & Roteiro",
    description:
      "Alinhamos o estilo do ensaio, ajudamos na escolha dos figurinos, locação e o melhor horário de luz natural.",
  },
  {
    step: "02",
    icon: Camera,
    title: "O Dia do Ensaio",
    description:
      "Direção leve, descontraída e sem poses forçadas — respeitando o seu ritmo e o tempo do seu pet.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Curadoria & Edição",
    description:
      "Tratamento autoral e delicado em cada fotografia, realçando cores reais, luz e emoção.",
  },
  {
    step: "04",
    icon: Images,
    title: "Entrega Especial",
    description:
      "Você recebe sua galeria online privativa em alta resolução, pronta para baixar, compartilhar e eternizar.",
  },
];

const faqs = [
  {
    q: "Meu pet é muito agitado ou medroso, o ensaio dá certo?",
    a: "Com certeza! Todo o ensaio pet é conduzido sem pressa, com pausas para brincadeiras e petiscos. Nós nos adaptamos 100% ao ritmo e à personalidade do seu animal para capturar expressões espontâneas e cheias de vida.",
  },
  {
    q: "Sou tímido(a) e não sei posar. Você ajuda durante as fotos?",
    a: "Sim! Você não precisa saber posar. Minha direção é focada em movimentos naturais e interações reais para que você se sinta confortável e esqueça que a câmera está ali.",
  },
  {
    q: "Onde os ensaios são realizados?",
    a: "Realizamos ensaios externos em parques, praças e locações especiais em São Paulo e região, ou no conforto da sua própria casa (estilo Lifestyle), onde a família e o pet já se sentem seguros.",
  },
  {
    q: "Como recebo as fotos e como faço para reservar uma data?",
    a: "As fotos são entregues em alta resolução através de uma galeria digital exclusiva e protegida por senha. Para reservar sua data, basta clicar no botão de orçamento e conversar diretamente comigo pelo WhatsApp!",
  },
];

const defaultSettings = {
  home_hero_bg: "",
  home_escolha_social: "",
  home_escolha_pet: "",
  home_sobre_mosaic_1: "",
  home_sobre_mosaic_2: "",
  home_sobre_mosaic_3: "",
  home_sobre_mosaic_4: "",
  home_highlight_1: "",
  home_highlight_2: "",
  home_highlight_3: "",
};

const defaultSettingsPositions: Record<string, string> = {
  home_hero_bg: "50% 50%",
  home_escolha_social: "50% 50%",
  home_escolha_pet: "50% 50%",
  home_sobre_mosaic_1: "50% 50%",
  home_sobre_mosaic_2: "50% 50%",
  home_sobre_mosaic_3: "50% 50%",
  home_sobre_mosaic_4: "50% 50%",
  home_highlight_1: "50% 50%",
  home_highlight_2: "50% 50%",
  home_highlight_3: "50% 50%",
};

export default function Home() {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const router = useRouter();
  const highlightCarouselRef = useRef<HTMLDivElement>(null);

  const [highlightPhotos, setHighlightPhotos] = useState<Photo[]>([]);
  const [instaPhotos, setInstaPhotos] = useState<Photo[]>([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsPositions, setSettingsPositions] = useState(
    defaultSettingsPositions
  );
  const [masonryPhotos, setMasonryPhotos] = useState<Photo[]>([]);
  const [masonryTitle, setMasonryTitle] = useState<string>("");
  const [masonryLink, setMasonryLink] = useState<string>("");

  const [masonryPhotos2, setMasonryPhotos2] = useState<Photo[]>([]);
  const [masonryTitle2, setMasonryTitle2] = useState<string>("");
  const [masonryLink2, setMasonryLink2] = useState<string>("");

  const scrollHighlightCarousel = (direction: "left" | "right") => {
    if (!highlightCarouselRef.current) return;
    const scrollAmount = 340;
    highlightCarouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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
      const { data } = await supabase.from("site_settings").select("*");
      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        const newSettingsPositions = { ...defaultSettingsPositions };
        let mAlbum = "";
        let mAlbum2 = "";

        data.forEach((item) => {
          if (item.key in defaultSettings) {
            newSettings[item.key as keyof typeof defaultSettings] = item.url;
            if (item.cover_position) {
              newSettingsPositions[item.key] = item.cover_position;
            }
          }
          if (item.key === "home_masonry_album") {
            mAlbum = item.url;
          }
          if (item.key === "home_masonry_album_2") {
            mAlbum2 = item.url;
          }
        });
        setSettings(newSettings);
        setSettingsPositions(newSettingsPositions);

        if (mAlbum) {
          const { data: aData } = await supabase
            .from("albums")
            .select("title, category")
            .eq("id", mAlbum)
            .single();
          if (aData) {
            setMasonryTitle(aData.title);
            setMasonryLink(`/ensaio?id=${mAlbum}`);
          }

          const { data: mData } = await supabase
            .from("photos")
            .select("id, url, category")
            .eq("album_id", mAlbum)
            .order("created_at", { ascending: false })
            .limit(6);

          if (mData) setMasonryPhotos(mData);
        }

        if (mAlbum2) {
          const { data: aData2 } = await supabase
            .from("albums")
            .select("title, category")
            .eq("id", mAlbum2)
            .single();
          if (aData2) {
            setMasonryTitle2(aData2.title);
            setMasonryLink2(`/ensaio?id=${mAlbum2}`);
          }

          const { data: mData2 } = await supabase
            .from("photos")
            .select("id, url, category")
            .eq("album_id", mAlbum2)
            .order("created_at", { ascending: false })
            .limit(6);

          if (mData2) setMasonryPhotos2(mData2);
        }
      }
    };

    fetchPhotos();
    fetchSettings();
  }, []);

  const handleExplore = (type: string) => {
    router.push(`/portfolio?categoria=${type}`);
  };

  return (
    <div
      id="home-scroller"
      className="h-screen w-full bg-background overflow-y-scroll overflow-x-hidden text-foreground md:snap-y md:snap-proximity scroll-smooth"
    >
      {/* 1. Hero Split-Screen */}
      <section className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden snap-start">
        {/* Navbar overlay gradient to ensure visibility at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />

        {/* Esquerda: SOCIAL */}
        <motion.div
          className="relative h-1/2 md:h-full flex-1 overflow-hidden group cursor-pointer bg-[#120f0e]"
          onHoverStart={() => setHoveredSide("left")}
          onHoverEnd={() => setHoveredSide(null)}
          animate={{
            flex:
              hoveredSide === "left" ? 1.4 : hoveredSide === "right" ? 0.6 : 1,
            filter:
              hoveredSide === "right"
                ? "blur(4px) brightness(0.4)"
                : "blur(0px) brightness(1)",
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            onClick={() => handleExplore("social")}
            className="block w-full h-full relative"
          >
            {settings.home_escolha_social && (
              <Image
                src={settings.home_escolha_social}
                alt="Fotografia Social"
                fill
                priority
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                style={{
                  objectPosition:
                    settingsPositions.home_escolha_social || "50% 50%",
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent transition-opacity duration-700" />

            <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 text-left max-w-sm">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-primary mb-2 block">
                Fotografia
              </span>
              <h2 className="text-5xl md:text-8xl font-serif text-white mb-3 tracking-wider font-light">
                SOCIAL
              </h2>
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/90 mb-3 font-medium">
                Casamentos · Gestante · Casal · Família
              </p>
              <p className="text-white/80 font-light text-sm mb-7 leading-relaxed">
                Momentos únicos que viram histórias eternas.
              </p>
              <span className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white border border-white/30 px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
                Ver Portfólio Social <ArrowRight className="ml-3 w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Direita: PET */}
        <motion.div
          className="relative h-1/2 md:h-full flex-1 overflow-hidden group cursor-pointer bg-[#120f0e]"
          onHoverStart={() => setHoveredSide("right")}
          onHoverEnd={() => setHoveredSide(null)}
          animate={{
            flex:
              hoveredSide === "right" ? 1.4 : hoveredSide === "left" ? 0.6 : 1,
            filter:
              hoveredSide === "left"
                ? "blur(4px) brightness(0.4)"
                : "blur(0px) brightness(1)",
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            onClick={() => handleExplore("pet")}
            className="block w-full h-full relative"
          >
            <div className="absolute inset-0 z-0">
              {settings.home_escolha_pet && (
                <Image
                  src={settings.home_escolha_pet}
                  alt="Sessão Pet"
                  fill
                  priority
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  style={{
                    objectPosition:
                      settingsPositions.home_escolha_pet || "50% 50%",
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors duration-500" />
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-24 text-right md:text-left md:left-24 max-w-sm">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-primary mb-2 block">
                Fotografia
              </span>
              <h2 className="text-5xl md:text-8xl font-serif text-white mb-3 tracking-wider font-light">
                PET
              </h2>
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/90 mb-3 font-medium">
                Cães · Gatos · Pet & Família · Ao Ar Livre
              </p>
              <p className="text-white/80 font-light text-sm mb-7 leading-relaxed">
                Personalidade, amor e conexão em cada clique.
              </p>
              <span className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white border border-white/30 px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
                Ver Portfólio Pet <ArrowRight className="ml-3 w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Indicador Central de Rolagem + Atalho Campanha de Natal */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <a
            href="#campanha-natal"
            className="flex items-center gap-2.5 bg-[#120f0e]/75 hover:bg-[#120f0e]/95 backdrop-blur-md border border-[#cba37b]/40 px-4 py-1.5 rounded-full mb-3 transition-all group"
          >
            <Sparkles className="w-3 h-3 text-[#cba37b] group-hover:rotate-12 transition-transform" />
            <span className="text-[#f4ede8] text-[9px] uppercase tracking-[0.25em]">
              Especial de Natal · Vagas Limitadas
            </span>
          </a>
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center p-1 mb-2 pointer-events-none">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1 h-1 bg-white rounded-full"
            />
          </div>
          <span className="text-white/70 text-[8px] uppercase tracking-[0.3em] pointer-events-none">
            Role para explorar
          </span>
        </motion.div>
      </section>

      {/* 1.2 Banner Minimalista — Campanha de Natal */}
      <section
        id="campanha-natal"
        className="w-full bg-[#120f0e] text-[#f4ede8] border-y border-[#cba37b]/20 py-14 md:py-20 px-6 md:px-12 snap-start relative overflow-hidden"
      >
        {/* Brilho sutil de fundo */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[220px] rounded-full bg-[#cba37b]/10 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="border border-[#cba37b]/25 bg-white/[0.02] rounded-2xl p-8 md:p-12 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
          >
            {/* Texto e Destaques Minimalistas */}
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.35em] text-[#cba37b]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Edição Limitada · Temporada de Natal</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-wide leading-[1.15] text-white">
                Especial de Natal{" "}
                <span className="italic text-[#cba37b]">Família &amp; Pet</span>
              </h2>

              <p className="text-white/70 font-light text-sm md:text-base leading-relaxed">
                Retratos atemporais com estética acolhedora e direção afetiva para
                celebrar o fim de ano com quem você mais ama — em sessões
                exclusivas pensadas para famílias, casais e pets.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cba37b]" />
                  Vagas Limitadas na Agenda
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cba37b]" />
                  Social &amp; Pet Friendly
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cba37b]" />
                  Entrega antes do Natal
                </span>
              </div>
            </div>

            {/* Ações / CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto shrink-0">
              <a
                href="https://wa.me/5511922880601?text=Ol%C3%A1%2C%20Karoline!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Especial%20de%20Natal%20e%20consultar%20as%20datas%20dispon%C3%ADveis."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#cba37b] text-[#120f0e] px-8 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Reservar Ensaio de Natal
              </a>
              <Link
                href="/ensaios"
                className="inline-flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/65 hover:text-[#cba37b] px-4 py-2 transition-colors"
              >
                Conhecer Estilos de Ensaio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1.5 Galeria Mosaico Dinâmica Unificada */}
      {(masonryPhotos.length > 0 || masonryPhotos2.length > 0) && (
        <section className="min-h-screen bg-background flex flex-col justify-center snap-start w-full border-t border-accent pt-16 md:pt-24 pb-12">
          <div className="w-full flex flex-col justify-center">
            <div className="text-center mb-10 px-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary block">
                01 — Destaques
              </span>
              <p className="font-serif italic text-lg text-muted-foreground mt-1">
                Conheça nosso trabalho recente
              </p>
            </div>

            {masonryPhotos2.length > 0 && (
              <div className="relative group/strip w-full">
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
                  {masonryPhotos2.map((photo) => (
                    <Link
                      href={masonryLink2 || "/portfolio"}
                      key={photo.id}
                      className="relative group overflow-hidden bg-muted aspect-[4/5] md:aspect-auto md:h-[35vh] lg:h-[40vh] block"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.category}
                        fill
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 select-none"
                        draggable={false}
                      />
                      <span className="pointer-events-none select-none absolute bottom-2 right-2.5 text-[9px] font-serif italic tracking-wider text-white/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] z-10">
                        @karolinegarcia.fotografia
                      </span>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        {masonryTitle2 && (
                          <span className="text-[10px] uppercase tracking-[0.25em] text-white/90 flex items-center gap-1.5">
                            {masonryTitle2} <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {masonryPhotos.length > 0 && (
              <div className="relative group/strip w-full">
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
                  {masonryPhotos.map((photo) => (
                    <Link
                      href={masonryLink || "/portfolio"}
                      key={photo.id}
                      className="relative group overflow-hidden bg-muted aspect-[4/5] md:aspect-auto md:h-[35vh] lg:h-[40vh] block"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.category}
                        fill
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 select-none"
                        draggable={false}
                      />
                      <span className="pointer-events-none select-none absolute bottom-2 right-2.5 text-[9px] font-serif italic tracking-wider text-white/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] z-10">
                        @karolinegarcia.fotografia
                      </span>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        {masonryTitle && (
                          <span className="text-[10px] uppercase tracking-[0.25em] text-white/90 flex items-center gap-1.5">
                            {masonryTitle} <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. Sobre: Fotografar é... + Credenciais de Confiança */}
      <section className="min-h-screen py-24 md:py-32 bg-secondary flex items-center justify-center snap-start">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary/50" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
                  02 — O Olhar · Fotografar É
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif leading-[1.2]">
                Conectar almas <br />
                <span className="italic font-light text-primary">
                  e eternizar
                </span>{" "}
                emoções.
              </h2>
              <p className="text-muted-foreground font-light text-sm md:text-base max-w-lg leading-relaxed pt-2">
                A fotografia é a arte de pausar o tempo. Nos{" "}
                <strong>ensaios sociais</strong>, ela traduz a sua essência,
                destacando a sua beleza real e as fases mais marcantes da sua
                vida com leveza e elegância. Já na{" "}
                <strong>fotografia pet</strong>, ela materializa um amor puro e
                incondicional, transformando instantes de carinho e diversão na
                sua maior herança de família.
              </p>
              <p className="text-muted-foreground font-light text-sm md:text-base max-w-lg leading-relaxed">
                Muito além de cliques roteirizados, meu propósito é criar uma
                experiência onde você e quem você ama possam simplesmente ser
                quem são. O resultado? Memórias autênticas que aquecem o peito
                todas as vezes que você olhar para trás.
              </p>

              {/* Selos de Confiança & Credenciais */}
              <div className="grid grid-cols-3 gap-4 pt-4 pb-2 border-y border-accent max-w-lg">
                <div>
                  <span className="font-serif text-lg md:text-xl text-foreground flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" /> Senac SP
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    Formação Profissional
                  </p>
                </div>
                <div>
                  <span className="font-serif text-lg md:text-xl text-foreground flex items-center gap-1.5">
                    100% Natural
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    Zero Poses Forçadas
                  </p>
                </div>
                <div>
                  <span className="font-serif text-lg md:text-xl text-foreground flex items-center gap-1">
                    5.0 <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    Clientes Encantados
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6">
                <Link
                  href="/sobre"
                  className="inline-flex items-center text-[10px] uppercase tracking-widest text-primary hover:text-foreground transition-colors font-medium border-b border-primary/30 hover:border-foreground pb-1.5 group"
                >
                  Conheça minha história{" "}
                  <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/ensaios"
                  className="inline-flex items-center text-[10px] uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium pb-1.5"
                >
                  Explorar Especialidades →
                </Link>
              </div>
            </div>

            <div className="flex-1 relative w-full aspect-[4/3] md:aspect-square">
              {/* Main Photo */}
              <div className="absolute right-0 top-0 w-4/5 h-4/5 rounded-t-[40px] rounded-br-[40px] rounded-bl-sm overflow-hidden shadow-2xl border border-accent bg-muted">
                {settings.home_sobre_mosaic_1 && (
                  <Image
                    src={settings.home_sobre_mosaic_1}
                    alt="Karoline Garcia"
                    fill
                    className="object-cover"
                    style={{
                      objectPosition:
                        settingsPositions.home_sobre_mosaic_1 || "50% 50%",
                    }}
                  />
                )}
              </div>
              {/* Polaroids Decorativas */}
              <div className="absolute left-0 bottom-10 w-2/5 aspect-[3/4] bg-white p-2 pb-8 shadow-xl -rotate-6 hover:-rotate-2 transition-transform duration-500 z-10 hidden md:block">
                <div className="relative w-full h-full overflow-hidden bg-muted">
                  {settings.home_sobre_mosaic_2 && (
                    <Image
                      src={settings.home_sobre_mosaic_2}
                      alt="Polaroid 1"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition:
                          settingsPositions.home_sobre_mosaic_2 || "50% 50%",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="absolute left-24 bottom-0 w-2/5 aspect-[3/4] bg-white p-2 pb-8 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500 z-20 hidden md:block">
                <div className="relative w-full h-full overflow-hidden bg-muted">
                  {settings.home_sobre_mosaic_3 && (
                    <Image
                      src={settings.home_sobre_mosaic_3}
                      alt="Polaroid 2"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition:
                          settingsPositions.home_sobre_mosaic_3 || "50% 50%",
                      }}
                    />
                  )}
                </div>
                <div className="absolute bottom-2 right-4 text-xs font-serif italic text-black opacity-60">
                  fotografar é sentir ♥
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Portfólio em Destaque */}
      {highlightPhotos.length > 0 && (
        <section className="min-h-screen py-24 bg-background overflow-hidden border-t border-accent flex flex-col items-center justify-center snap-start w-full">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
                03 — Portfólio em Destaque
              </span>
              <h2 className="font-serif text-3xl md:text-5xl mt-3">
                Histórias{" "}
                <span className="italic font-light text-primary">
                  que ficam.
                </span>
              </h2>
            </div>

            {/* Controles Editoriais do Carrossel */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scrollHighlightCarousel("left")}
                aria-label="Anterior"
                className="w-11 h-11 rounded-full border border-accent flex items-center justify-center text-foreground hover:border-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollHighlightCarousel("right")}
                aria-label="Próximo"
                className="w-11 h-11 rounded-full border border-accent flex items-center justify-center text-foreground hover:border-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full relative px-6 md:px-12 group">
            {/* Carousel Container */}
            <div
              ref={highlightCarouselRef}
              className="flex overflow-x-auto gap-4 md:gap-6 pb-8 no-scrollbar snap-x"
            >
              {highlightPhotos.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/ensaios`}
                  className="relative flex-none w-64 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden group/card snap-center shadow-sm"
                >
                  <Image
                    src={photo.url}
                    alt={photo.category}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-105 select-none"
                    draggable={false}
                  />
                  <span className="pointer-events-none select-none absolute top-3 right-3 text-[9px] font-serif italic tracking-wider text-white/65 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] z-10">
                    @karolinegarcia.fotografia
                  </span>
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
            <Link
              href="/ensaios"
              className="inline-flex items-center text-[10px] uppercase tracking-widest text-foreground border border-primary/40 px-8 py-4 rounded hover:bg-foreground hover:text-background hover:border-foreground transition-all"
            >
              Ver Todos os Ensaios <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 3.5 Como Funciona a Experiência (4 Passos) */}
      <section className="py-24 bg-background border-t border-accent flex items-center justify-center snap-start w-full">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
              Do Primeiro Olá à Entrega
            </span>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 text-foreground">
              Uma experiência{" "}
              <span className="italic font-light text-primary">
                leve e descomplicada.
              </span>
            </h2>
            <p className="text-muted-foreground font-light text-sm mt-4">
              Cuidamos de cada etapa para que você só precise aproveitar o momento ao lado de quem ama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {experienceSteps.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-secondary/70 border border-accent rounded-2xl p-7 flex flex-col justify-between hover:border-primary/50 hover:shadow-sm transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="font-serif text-2xl text-primary/40">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-foreground mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground font-light text-xs md:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Dicas de Ensaios (Cards com Botões Diretos de Conversão) */}
      <section className="min-h-screen py-24 bg-secondary flex items-center justify-center snap-start w-full border-t border-accent">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
              04 — Prepare-se para o seu momento
            </span>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 text-foreground">
              Dicas de{" "}
              <span className="italic font-light text-primary">Ensaios.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card Social */}
            <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow border border-accent relative overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="absolute top-0 right-0 p-6 opacity-5 text-primary pointer-events-none transition-transform duration-1000 group-hover:scale-125">
                  <Camera size={180} strokeWidth={1} />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl mb-8 text-foreground flex items-center relative z-10">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                    <span className="text-sm font-bold">1</span>
                  </span>
                  Ensaio Social
                </h3>
                <ul className="space-y-5 relative z-10">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Escolha roupas confortáveis e em tons neutros. Evite estampas muito chamativas que roubem a atenção.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      O melhor horário para fotos externas é na &ldquo;golden hour&rdquo; (início da manhã ou fim da tarde).
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Cabelo e Maquiagem: opte por uma produção mais natural que destaque a sua beleza real.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Descanso: uma boa noite de sono na véspera faz toda a diferença na disposição e no olhar.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Seja você mesmo! As melhores fotos capturam a sua essência natural de forma autêntica.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-accent relative z-10 flex items-center justify-between gap-4">
                <a
                  href="https://wa.me/5511922880601?text=Olá,%20Karoline!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Ensaio%20Social."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-primary hover:text-foreground transition-colors"
                >
                  Orçar Ensaio Social no WhatsApp{" "}
                  <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card Pet */}
            <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow border border-accent relative overflow-hidden group flex flex-col justify-between h-full">
              <div>
                <div className="absolute top-0 right-0 p-6 opacity-5 text-primary pointer-events-none transition-transform duration-1000 group-hover:scale-125">
                  <Heart size={180} strokeWidth={1} />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl mb-8 text-foreground flex items-center relative z-10">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                    <span className="text-sm font-bold">2</span>
                  </span>
                  Ensaio Pet
                </h3>
                <ul className="space-y-5 relative z-10">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Leve os petiscos e os brinquedos favoritos dele para prender a atenção durante as fotos.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Gaste um pouco da energia do pet com um passeio rápido antes do ensaio começar.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Limpeza básica: um bom banho no dia anterior garante pelos bonitos, soltinhos e super charmosos nas fotos.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Segurança: se for ao ar livre, garanta que a coleira esteja confortável e com identificação.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-4 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light leading-relaxed text-sm">
                      Paciência é a chave. Nós nos adaptamos ao ritmo e ao tempo deles, sem pressa.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-accent relative z-10 flex items-center justify-between gap-4">
                <a
                  href="https://wa.me/5511922880601?text=Olá,%20Karoline!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Ensaio%20Pet."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-primary hover:text-foreground transition-colors"
                >
                  Orçar Ensaio Pet no WhatsApp{" "}
                  <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Depoimentos */}
      <section className="min-h-screen py-24 bg-background border-t border-accent flex flex-col items-center justify-center snap-start w-full">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
            05 — Depoimentos
          </span>
          <h2 className="font-serif text-3xl md:text-5xl mt-3 mb-16">
            Palavras que aquecem{" "}
            <span className="italic font-light text-primary">o coração.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="relative bg-secondary/60 p-8 rounded-xl text-left border border-accent flex flex-col shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <span className="absolute top-3 right-6 font-serif text-7xl text-primary/15 leading-none select-none pointer-events-none">
                  &ldquo;
                </span>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative ring-2 ring-primary/20">
                    <Image
                      src={test.avatar}
                      alt={test.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex text-primary mb-1 gap-0.5">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm font-light text-foreground/90 italic mb-6 flex-grow leading-relaxed relative z-10">
                  &ldquo;{test.text}&rdquo;
                </p>
                <div className="pt-4 border-t border-accent/60 relative z-10">
                  <p className="text-sm font-medium">{test.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary mt-1">
                    {test.category}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/depoimentos"
              className="inline-flex items-center text-[10px] uppercase tracking-widest text-primary hover:text-foreground transition-colors font-medium border-b border-primary/30 pb-1"
            >
              Ver mais relatos de clientes <ArrowRight className="ml-2 w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5.5 Dúvidas Frequentes (Quebra de Objeções) */}
      <section className="py-24 bg-secondary border-t border-accent flex items-center justify-center snap-start w-full">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
              Tire suas dúvidas
            </span>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 text-foreground">
              Perguntas{" "}
              <span className="italic font-light text-primary">Frequentes.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-background border border-accent rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-secondary/40 transition-colors"
                  >
                    <span className="font-serif text-lg md:text-xl text-foreground">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={clsx(
                        "w-5 h-5 text-primary shrink-0 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-sm text-muted-foreground font-light leading-relaxed border-t border-accent/40 pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CTA Vamos contar a sua história */}
      <section className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden snap-start w-full bg-foreground group">
        <div className="absolute inset-0 z-0">
          {settings.home_hero_bg && (
            <Image
              src={settings.home_hero_bg}
              alt="Vamos contar a sua história"
              fill
              className="object-cover transition-transform duration-[3s] group-hover:scale-105 opacity-35"
              style={{
                objectPosition: settingsPositions.home_hero_bg || "50% 50%",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/75" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/90">
              Agenda Aberta · Vagas limitadas por mês
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
            Vamos contar a sua história?
          </h2>
          <p className="text-white/80 font-light text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Será um prazer registrar momentos que farão parte da sua história
            para sempre. Entre em contato para conversarmos sobre o seu ensaio e
            consultarmos disponibilidade de datas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white bg-primary px-8 py-4 rounded hover:bg-white hover:text-black transition-all shadow-lg"
              href="https://wa.me/5511922880601?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento%20e%20consultar%20disponibilidade."
            >
              <MessageCircle className="mr-3 w-4 h-4" /> Solicitar Orçamento no WhatsApp
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white/90 border border-white/30 px-8 py-4 rounded hover:bg-white hover:text-black transition-all"
            >
              Formulário de Contato <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Instagram Feed */}
      {instaPhotos.length > 0 && (
        <section className="min-h-screen py-16 bg-background flex flex-col items-center justify-center snap-start w-full">
          <div className="text-center mb-10">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-medium text-foreground mb-2">
              Acompanhe no Instagram
            </h3>
            <a
              href="https://instagram.com/karolinegarcia.fotografia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-serif italic text-primary hover:text-foreground transition-colors"
            >
              @karolinegarcia.fotografia
            </a>
          </div>

          <div className="flex overflow-x-auto w-full no-scrollbar">
            {instaPhotos.map((photo) => (
              <a
                key={photo.id}
                href="https://instagram.com/karolinegarcia.fotografia"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex-none w-1/3 md:w-1/5 lg:w-[14.28%] aspect-square group overflow-hidden"
              >
                <Image
                  src={photo.url}
                  alt="Instagram post"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                  draggable={false}
                />
                <span className="pointer-events-none select-none absolute bottom-2 right-2.5 text-[9px] font-serif italic tracking-wider text-white/65 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] z-10">
                  @karolinegarcia.fotografia
                </span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://instagram.com/karolinegarcia.fotografia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] uppercase tracking-widest text-foreground border border-primary/40 px-6 py-3 rounded hover:bg-foreground hover:text-background hover:border-foreground transition-all"
            >
              Seguir no Instagram <ArrowRight className="ml-2 w-3 h-3" />
            </a>
          </div>
        </section>
      )}

      {/* Footer Renderizado Manualmente para compatibilidade com Scroll Snap */}
      <div className="snap-end w-full">
        <Footer inHome={true} />
      </div>
    </div>
  );
}
