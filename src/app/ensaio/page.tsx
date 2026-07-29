"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

type Album = {
  id: string;
  title: string;
  category: "social" | "pet";
  cover_url: string;
  created_at: string;
};

type Photo = {
  id: string;
  url: string;
  title: string | null;
  created_at: string;
};

function EnsaioContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAlbumData = async () => {
      // 1. Fetch Album Details
      const { data: albumData, error: albumError } = await supabase
        .from("albums")
        .select("*")
        .eq("id", id)
        .single();

      if (albumError || !albumData) {
        alert("Ensaio não encontrado.");
        router.push("/");
        return;
      }
      setAlbum(albumData);

      // 2. Fetch Photos for this Album
      const { data: photosData } = await supabase
        .from("photos")
        .select("*")
        .eq("album_id", id)
        .order("created_at", { ascending: false });

      if (photosData) setPhotos(photosData);
      
      setLoading(false);
    };

    fetchAlbumData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!album) return null;

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        
        {/* Cover Hero */}
        <section className="relative w-full h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={album.cover_url} 
              alt={album.title} 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-primary/90 text-sm md:text-base uppercase tracking-[0.3em] font-medium block mb-4">
                Ensaio {album.category}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6">
                {album.title}
              </h1>
            </motion.div>
          </div>

          {/* Botão Voltar */}
          <Link 
            href={`/portfolio?categoria=${album.category}`}
            className="absolute top-8 left-6 md:left-12 z-50 text-white/70 hover:text-white transition-colors inline-flex items-center text-sm uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
          </Link>
        </section>

        {/* Gallery */}
        <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
          {photos.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>Nenhuma foto foi adicionada a este ensaio ainda.</p>
            </div>
          ) : (
            <motion.div 
              className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
            >
              {photos.map((photo, idx) => (
                <motion.div 
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: (idx % 10) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full overflow-hidden group cursor-pointer break-inside-avoid bg-muted mb-4 rounded-xl shadow-sm"
                  onClick={() => setSelectedImage(photo.url)}
                >
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }} className="w-full h-full">
                    <img src={photo.url} alt={photo.title || "Foto do ensaio"} className="w-full h-auto object-cover" loading="lazy" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-white transition-colors bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full backdrop-blur-md z-50 shadow-lg border border-white/10"
                onClick={() => setSelectedImage(null)}
                aria-label="Fechar modal"
              >
                <X size={24} className="md:w-8 md:h-8" />
              </button>
              
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={selectedImage}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}

export default function EnsaioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <EnsaioContent />
    </Suspense>
  );
}
