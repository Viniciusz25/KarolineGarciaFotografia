"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Heart, ImageIcon } from "lucide-react";
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

type Album = {
  id: string;
  title: string;
  subcategory?: string | null;
  cover_url: string;
  created_at: string;
};

type GalleryItem = {
  id: string;
  type: "album";
  url: string;
  title: string | null;
  subcategory?: string | null;
  sortDate: string;
};

function DynamicGalleryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const categoriaSlug = params.categoria as string;
  const tagParam = searchParams.get("tag");

  const [selectedFolder, setSelectedFolder] = useState<string | null>(tagParam || null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [rootCategory, setRootCategory] = useState<Category | null>(null);
  const [folders, setFolders] = useState<Category[]>([]);

  useEffect(() => {
    if (tagParam) setSelectedFolder(tagParam);
  }, [tagParam]);

  useEffect(() => {
    const fetchGallery = async () => {
      // Fetch Root Category and its subcategories
      const { data: catData } = await supabase.from("categories").select("*");
      
      if (catData) {
        const root = catData.find(c => c.slug === categoriaSlug && !c.parent_id && !c.is_hidden);
        if (root) {
          setRootCategory(root);
          const children = catData.filter(c => c.parent_id === root.id && !c.is_hidden);
          setFolders(children);
        }
      }

      // Fetch Albums for this category
      const { data: albumsData } = await supabase.from("albums").select("*").eq("category", categoriaSlug);
      
      const albumItems: GalleryItem[] = [];
      if (albumsData) {
        albumsData.forEach((a: Album) => albumItems.push({
          id: a.id, 
          type: "album", 
          url: a.cover_url, 
          title: a.title, 
          subcategory: a.subcategory,
          sortDate: a.created_at
        }));
      }

      albumItems.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
      setItems(albumItems);
      setLoading(false);
    };

    fetchGallery();
  }, [categoriaSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
      </div>
    );
  }

  if (!rootCategory) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-serif text-[#2d2422]">Categoria não encontrada</h2>
        <Link href="/ensaios" className="mt-4 inline-block text-sm text-[#cba37b]">Voltar para Ensaios</Link>
      </div>
    );
  }

  const isDark = rootCategory.theme === "dark";

  const renderSection = (subcatSlug: string, sectionTitle: string) => {
    const filteredItems = items.filter(item => item.subcategory === subcatSlug);
    
    if (filteredItems.length === 0) {
      return (
        <div className={clsx(
          "mb-24 text-center py-20 rounded-xl border",
          isDark ? "bg-[#151110] border-white/5 text-[#f4ede8]" : "bg-[#f2eee9] border-[#2d2422]/10 text-[#2d2422]"
        )}>
           <Heart size={24} className="mx-auto text-[#cba37b] mb-4" />
           <h3 className="font-serif text-xl mb-2">Ainda não há ensaios publicados nesta categoria.</h3>
           <p className="opacity-60 text-sm">Em breve teremos novas histórias aqui!</p>
        </div>
      );
    }

    return (
      <div className="mb-24">
        <motion.div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {filteredItems.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: (idx % 10) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full overflow-hidden group cursor-pointer break-inside-avoid bg-muted mb-4 rounded-xl shadow-sm"
            >
              <Link href={`/ensaio?id=${item.id}`} className="block relative w-full h-full">
                <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }} className="w-full h-full">
                  <img src={item.url} alt={item.title || "Ensaio"} className="w-full h-auto object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <span className="bg-[#cba37b] text-[#120f0e] text-[10px] uppercase tracking-widest px-2 py-1 rounded w-max mb-2 font-medium">Ver Ensaio</span>
                    <h3 className="text-white font-serif text-2xl">{item.title}</h3>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <header className="text-center mb-16 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "text-4xl md:text-5xl font-serif mb-4",
            isDark ? "text-[#f4ede8]" : "text-[#2d2422]"
          )}
        >
          {rootCategory.name}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={clsx(
            "text-lg max-w-2xl mx-auto mb-8 font-light",
            isDark ? "text-[#f4ede8]/70" : "text-[#2d2422]/70"
          )}
        >
          {rootCategory.description}
        </motion.p>
        
        {selectedFolder ? (
           <button onClick={() => setSelectedFolder(null)} className="inline-flex items-center text-sm uppercase tracking-widest font-medium text-[#cba37b] hover:text-[#cba37b]/70 transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar para Categorias
           </button>
        ) : (
           <Link href="/ensaios" className={clsx(
             "inline-flex items-center text-[10px] uppercase tracking-widest font-medium transition-colors",
             isDark ? "text-[#f4ede8]/50 hover:text-white" : "text-[#2d2422]/50 hover:text-[#2d2422]"
           )}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar para Ensaios
           </Link>
        )}
      </header>

      <AnimatePresence mode="popLayout">
        {!selectedFolder ? (
          // Visão de Pastas
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-24"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedFolder(folder.slug)}
                className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden cursor-pointer group shadow-md"
              >
                {folder.cover_url ? (
                  <img src={folder.cover_url} alt={folder.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full bg-black/5 flex items-center justify-center transition-transform duration-1000 group-hover:scale-105">
                    <ImageIcon className="w-12 h-12 text-[#cba37b]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-serif text-2xl mb-1">{folder.name}</h3>
                  <div className="w-8 h-1 bg-[#cba37b] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Visão de Álbum da Pasta Selecionada
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {renderSection(selectedFolder, folders.find(f => f.slug === selectedFolder)?.name || "Portfólio")}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function DynamicPortfolioPage() {
  const params = useParams();
  const categoriaSlug = params.categoria as string;
  const [isDark, setIsDark] = useState(false);

  // Um pequeno hack para pegar o tema da categoria e alterar o fundo da página inteira
  useEffect(() => {
    const fetchTheme = async () => {
      const { data } = await supabase.from("categories").select("theme").eq("slug", categoriaSlug).single();
      if (data && data.theme === "dark") {
        setIsDark(true);
      }
    };
    if (categoriaSlug) fetchTheme();
  }, [categoriaSlug]);

  return (
    <div className={clsx(
      "pt-32 pb-24 min-h-screen transition-colors duration-500",
      isDark ? "bg-[#0f0c0b]" : "bg-[#f4ede8]"
    )}>
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" /></div>}>
           <DynamicGalleryContent />
        </Suspense>
      </div>
    </div>
  );
}
