"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Star, Camera, ShieldCheck, Sparkles, Smile, Clock, ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import clsx from "clsx";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  theme: "dark" | "light";
  cover_url: string | null;
  is_hidden?: boolean;
  created_at: string;
};

export default function EnsaiosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*").order("order_index", { ascending: true }).order("created_at", { ascending: true });
      if (data) {
        setCategories(data);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f4ede8]">
        <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
      </div>
    );
  }

  const rootCategories = categories.filter(c => !c.parent_id && !c.is_hidden);

  return (
    <div className="w-full flex flex-col">
      
      {/* Dark Hero Section for Navbar compatibility */}
      <section className="relative w-full pt-40 pb-20 bg-[#0f0c0b] text-[#f4ede8] flex flex-col items-center justify-center text-center">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif mb-4"
          >
            Nossos Ensaios
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto font-light"
          >
            Conheça as nossas especialidades e escolha o estilo que mais combina com a sua história.
          </motion.p>
        </div>
      </section>

      {rootCategories.map((root, index) => {
        const isDark = false; // forced light theme by user request
        const children = categories.filter(c => c.parent_id === root.id && !c.is_hidden);

        return (
          <section 
            key={root.id} 
            className={clsx(
              "w-full py-32",
              isDark ? "bg-[#0f0c0b] text-[#f4ede8]" : "bg-[#fcfaf8] text-[#2d2422]"
            )}
          >
            {/* HERO SECTION */}
            <div className={clsx(
              "container mx-auto px-6 md:px-12 flex flex-col items-center gap-12 md:gap-24 mb-32",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}>
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={clsx(
                  "flex-1 relative aspect-[3/4] md:aspect-square w-full overflow-hidden",
                  isDark ? "rounded-tr-[80px] rounded-bl-[80px]" : "rounded-tl-[80px] rounded-br-[80px]"
                )}
              >
                {root.cover_url ? (
                  <Image src={root.cover_url} alt={root.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-black/10 flex items-center justify-center"><ImageIcon className="w-12 h-12 text-[#cba37b]/30" /></div>
                )}
                <div className={clsx(
                  "absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80",
                  isDark ? "from-[#0f0c0b]" : "from-[#fcfaf8]"
                )} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#cba37b] mb-4 block">
                  Início / {root.name}
                </span>
                <h1 className="text-5xl md:text-7xl font-serif font-light tracking-wide mb-6">
                  {root.name.toUpperCase()}
                </h1>
                <p className={clsx(
                  "font-light text-sm leading-relaxed max-w-md mb-10",
                  isDark ? "text-[#f4ede8]/70" : "text-[#2d2422]/70"
                )}>
                  {root.description || "Conheça nossos ensaios criados para eternizar os seus melhores momentos."}
                </p>
                <Link href="/contato" className={clsx(
                  "inline-flex items-center text-[10px] uppercase tracking-widest font-medium border px-8 py-4 rounded transition-colors",
                  isDark 
                    ? "text-[#cba37b] border-[#cba37b]/30 hover:bg-[#cba37b] hover:text-[#0f0c0b]" 
                    : "text-[#cba37b] border-[#cba37b]/30 hover:bg-[#cba37b] hover:text-white"
                )}>
                  Solicitar Orçamento <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* MOSAICO SUB-CATEGORIAS */}
            <div className="container mx-auto px-6 md:px-12 mb-32">
              <div className="text-center mb-16 flex flex-col items-center">
                <h2 className={clsx(
                  "text-[12px] uppercase tracking-[0.3em] font-medium mb-3",
                  !isDark && "text-[#2d2422]"
                )}>
                  Escolha o seu momento
                </h2>
                <Heart size={14} className="text-[#cba37b]" />
              </div>

              {children.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[250px]">
                  {children.map((child, i) => {
                    // Padrão de tamanhos diferentes pra dar aspecto de mosaico
                    const spanClasses = [
                      "col-span-1 md:col-span-2 row-span-2", // grande
                      "col-span-1 row-span-1", // normal
                      "col-span-1 row-span-2", // vertical
                      "col-span-1 row-span-1", // normal
                      "col-span-1 md:col-span-2 row-span-1", // horizontal
                    ];
                    
                    const shape = spanClasses[i % spanClasses.length];

                    return (
                      <Link 
                        key={child.id}
                        href={`/portfolio?categoria=${root.slug}&tag=${child.slug}`} 
                        className={clsx(
                          "group relative rounded-xl overflow-hidden cursor-pointer block shadow-sm",
                          shape,
                          // No mobile, force min height
                          "min-h-[250px] md:min-h-0"
                        )}
                      >
                        {child.cover_url ? (
                          <Image src={child.cover_url} alt={child.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-black/5 flex items-center justify-center transition-transform duration-1000 group-hover:scale-105">
                            <ImageIcon className="w-8 h-8 opacity-20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                          <h3 className={clsx(
                            "font-serif text-white tracking-widest mb-2",
                            shape.includes("row-span-2") ? "text-2xl" : "text-lg"
                          )}>
                            {child.name.toUpperCase()}
                          </h3>
                          <span className="text-[9px] uppercase tracking-widest text-white/70 flex items-center group-hover:text-[#cba37b] transition-colors">
                            Ver Álbum <ArrowRight className="ml-2 w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 opacity-50 text-sm">
                  Nenhuma subcategoria adicionada ainda.
                </div>
              )}
            </div>
            
            {/* FOOTER DA SEÇÃO */}
            <div className={clsx(
              "border-y py-16",
              isDark ? "bg-[#151110] border-white/5" : "bg-[#f0ece9] border-[#e5d8cf]"
            )}>
              <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 max-w-sm rounded-xl overflow-hidden relative aspect-video md:aspect-[4/3] shadow-md">
                   {root.cover_url ? (
                     <Image src={root.cover_url} alt="Detalhe" fill className="object-cover" />
                   ) : (
                     <div className="w-full h-full bg-black/10"></div>
                   )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-light mb-4">
                    Cada detalhe importa.<br/>
                    <span className="text-[#cba37b] italic">Cada história merece ser lembrada.</span>
                  </h3>
                  <p className={clsx(
                    "font-light text-sm max-w-md mb-8",
                    isDark ? "text-white/60" : "text-[#2d2422]/60"
                  )}>
                    Transformamos seus momentos em memórias inesquecíveis, com paciência, carinho e muita dedicação.
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <Link href="/sobre" className={clsx(
                      "inline-flex items-center text-[10px] uppercase tracking-widest font-medium border px-6 py-3 rounded transition-colors",
                      isDark 
                        ? "text-white border-white/20 hover:bg-white hover:text-black"
                        : "text-[#2d2422] border-[#2d2422]/20 hover:bg-[#2d2422] hover:text-white"
                    )}>
                      Conheça Melhor <ArrowRight className="ml-2 w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

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
