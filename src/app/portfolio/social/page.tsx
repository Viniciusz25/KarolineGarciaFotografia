"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

const defaultSettings = {
  social_cat_casamentos: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
  social_cat_15anos: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop",
  social_cat_gestantes: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
  social_cat_familia: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
  social_cat_casais: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
  social_cat_formaturas: "https://images.unsplash.com/photo-1523580494112-071d39285bf7?q=80&w=800&auto=format&fit=crop",
  social_cat_eventos: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
};

function SocialGalleryContent() {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");

  const [selectedFolder, setSelectedFolder] = useState<string | null>(tagParam || null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(defaultSettings);

  const folders = [
    { id: "casamentos", title: "Casamentos", image: settings.social_cat_casamentos },
    { id: "debutantes", title: "15 Anos", image: settings.social_cat_15anos },
    { id: "gestantes", title: "Gestantes", image: settings.social_cat_gestantes },
    { id: "familia", title: "Família", image: settings.social_cat_familia },
    { id: "casais", title: "Casais", image: settings.social_cat_casais },
    { id: "formaturas", title: "Formaturas", image: settings.social_cat_formaturas },
    { id: "eventos", title: "Eventos", image: settings.social_cat_eventos }
  ];

  useEffect(() => {
    if (tagParam) setSelectedFolder(tagParam);
  }, [tagParam]);

  useEffect(() => {
    const fetchGalleryAndSettings = async () => {
      const [{ data: albumsData }, { data: settingsData }] = await Promise.all([
        supabase.from("albums").select("*").eq("category", "social"),
        supabase.from("site_settings").select("*").eq("section", "PortfolioSocial")
      ]);
      
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

      if (settingsData && settingsData.length > 0) {
        const newSettings = { ...defaultSettings };
        settingsData.forEach(item => {
          newSettings[item.key as keyof typeof defaultSettings] = item.url;
        });
        setSettings(newSettings);
      }

      setLoading(false);
    };

    fetchGalleryAndSettings();
  }, []);

  const renderSection = (subcatValue: string, sectionTitle: string) => {
    const filteredItems = items.filter(item => item.subcategory === subcatValue);
    
    if (filteredItems.length === 0) {
      return (
        <div className="mb-24 text-center py-20 bg-[#f2eee9] rounded-xl border border-[#2d2422]/10">
           <Heart size={24} className="mx-auto text-[#cba37b] mb-4" />
           <h3 className="font-serif text-xl text-[#2d2422] mb-2">Ainda não há ensaios publicados nesta categoria.</h3>
           <p className="text-[#2d2422]/60 text-sm">Em breve teremos novas histórias aqui!</p>
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
          className="text-4xl md:text-5xl font-serif text-[#2d2422] mb-4"
        >
          Fotografia Social
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#2d2422]/70 text-lg max-w-2xl mx-auto mb-8 font-light"
        >
          Casamentos, gestantes, famílias. Histórias reais contadas com emoção.
        </motion.p>
        
        {selectedFolder ? (
           <button onClick={() => setSelectedFolder(null)} className="inline-flex items-center text-sm uppercase tracking-widest font-medium text-[#cba37b] hover:text-[#2d2422] transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar para Categorias
           </button>
        ) : (
           <Link href="/ensaios" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/50 hover:text-[#2d2422] transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar para Ensaios
           </Link>
        )}
      </header>

      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
          </div>
        ) : !selectedFolder ? (
          // Visão de Pastas
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-24"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedFolder(folder.id)}
                className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden cursor-pointer group shadow-md"
              >
                <img src={folder.image} alt={folder.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-serif text-2xl mb-1">{folder.title}</h3>
                  <div className="w-8 h-1 bg-[#cba37b] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Visão de Álbum da Pasta Selecionada
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {renderSection(selectedFolder, folders.find(f => f.id === selectedFolder)?.title || "Portfólio")}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function SocialPortfolioPage() {
  return (
    <div className="pt-32 pb-24 bg-[#f4ede8] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" /></div>}>
           <SocialGalleryContent />
        </Suspense>
      </div>
    </div>
  );
}
