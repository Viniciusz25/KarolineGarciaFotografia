"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2, X, ChevronLeft, ChevronRight, Maximize2, Film, Play } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import clsx from "clsx";

type Album = {
  id: string;
  title: string;
  category: string;
  subcategory?: string | null;
  cover_url: string;
  cover_position?: string | null;
  video_url?: string | null;
  created_at: string;
};

type Photo = {
  id: string;
  url: string;
  title: string | null;
  created_at: string;
};

function getEmbedVideoUrl(url: string): { type: "iframe" | "video"; src: string } {
  const trimmed = url.trim();
  // YouTube watch / youtu.be / shorts
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch?.[1]) {
    return {
      type: "iframe",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
    };
  }
  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch?.[1]) {
    return {
      type: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }
  return { type: "video", src: trimmed };
}

function EnsaioContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchAlbumData = async () => {
      // 1. Fetch Album Details, Photos, and Video Summary Setting in parallel
      const [albumRes, photosRes, videoSettingRes] = await Promise.all([
        supabase.from("albums").select("*").eq("id", id).single(),
        supabase
          .from("photos")
          .select("*")
          .eq("album_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("site_settings")
          .select("url")
          .eq("key", `album_video_${id}`)
          .maybeSingle(),
      ]);

      if (albumRes.error || !albumRes.data) {
        setLoading(false);
        return;
      }
      setAlbum(albumRes.data);

      if (photosRes.data) setPhotos(photosRes.data);

      const resolvedVideo =
        videoSettingRes.data?.url || albumRes.data.video_url || null;
      if (resolvedVideo) setVideoUrl(resolvedVideo);

      setLoading(false);
    };

    fetchAlbumData();
  }, [id, router]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = "auto";
  }, []);

  const openLightbox = (idx: number) => {
    setSelectedIndex(idx);
    document.body.style.overflow = "hidden";
  };

  const nextPhoto = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length === 0) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % photos.length));
  }, [photos.length]);

  const prevPhoto = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length === 0) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev - 1 + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextPhoto();
      else if (e.key === "ArrowLeft") prevPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, closeLightbox, nextPhoto, prevPhoto]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) nextPhoto();
      else prevPhoto();
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif text-3xl mb-4">Ensaio não encontrado</h2>
        <p className="text-muted-foreground text-sm mb-8">O álbum que você procura não está disponível ou foi removido.</p>
        <Link href="/ensaios" className="text-xs uppercase tracking-widest text-primary border border-primary/40 px-6 py-3 rounded hover:bg-primary hover:text-white transition-colors">
          Voltar para Ensaios
        </Link>
      </div>
    );
  }

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
              style={{ objectPosition: album.cover_position || "50% 50%" }}
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
                {album.subcategory ? ` · ${album.subcategory}` : ""}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6">
                {album.title}
              </h1>
              {videoUrl && (
                <a
                  href="#video-resumo"
                  className="inline-flex items-center gap-2.5 bg-[#cba37b] text-[#120f0e] px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all shadow-lg mt-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Assistir Vídeo Resumo
                </a>
              )}
            </motion.div>
          </div>

          {/* Botão Voltar */}
          <Link 
            href={`/portfolio?categoria=${album.category}`}
            className="absolute top-24 md:top-32 left-6 md:left-12 z-40 text-white/70 hover:text-white transition-colors inline-flex items-center text-sm uppercase tracking-widest bg-black/30 hover:bg-black/50 px-5 py-2.5 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
          </Link>
        </section>

        {/* Gallery + Video Summary */}
        <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
          {/* Seção de Vídeo Resumo do Ensaio (Especial Debutantes & Eventos) */}
          {videoUrl && (() => {
            const parsedVideo = getEmbedVideoUrl(videoUrl);
            return (
              <motion.section
                id="video-resumo"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="mb-20"
              >
                <div className="bg-[#120f0e] text-[#f4ede8] rounded-2xl p-6 md:p-10 lg:p-12 border border-[#cba37b]/25 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                      <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#cba37b] mb-2">
                        <Film className="w-3.5 h-3.5" /> Filme do Ensaio
                      </span>
                      <h2 className="font-serif text-2xl md:text-4xl text-white font-light">
                        Vídeo Resumo —{" "}
                        <span className="italic text-[#cba37b]">
                          {album.title}
                        </span>
                      </h2>
                    </div>
                    <p className="text-xs text-white/60 font-light max-w-sm">
                      Dê o play para sentir a atmosfera e os bastidores deste momento especial antes de conferir a galeria completa de fotos abaixo.
                    </p>
                  </div>

                  <div className="relative w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                    {parsedVideo.type === "iframe" ? (
                      <div className="w-full aspect-video">
                        <iframe
                          src={parsedVideo.src}
                          title={`Vídeo Resumo - ${album.title}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video
                        src={parsedVideo.src}
                        poster={album.cover_url || undefined}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full max-h-[75vh] object-contain bg-black"
                      />
                    )}
                  </div>
                </div>
              </motion.section>
            );
          })()}
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
                  onClick={() => openLightbox(idx)}
                >
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }} className="w-full h-full relative">
                    <img src={photo.url} alt={photo.title || "Foto do ensaio"} className="w-full h-auto object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                      <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                        <Maximize2 size={14} />
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>

        {/* Lightbox Completo */}
        <AnimatePresence>
          {selectedIndex !== null && photos[selectedIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12"
              onClick={closeLightbox}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Top Bar */}
              <div className="absolute top-4 left-6 right-6 md:top-6 md:left-10 md:right-10 flex items-center justify-between z-50 pointer-events-none">
                <div className="text-white/70 font-sans text-xs uppercase tracking-[0.3em] bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                  {selectedIndex + 1} / {photos.length}
                </div>
                <button 
                  className="pointer-events-auto text-white/80 hover:text-white transition-colors bg-black/50 hover:bg-black/80 p-2.5 md:p-3 rounded-full backdrop-blur-md shadow-lg border border-white/10 cursor-pointer"
                  onClick={closeLightbox}
                  aria-label="Fechar modal"
                >
                  <X size={22} className="md:w-6 md:h-6" />
                </button>
              </div>

              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <button
                    className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white bg-black/30 hover:bg-black/60 p-3 rounded-full backdrop-blur-sm border border-white/10 transition-all z-50 cursor-pointer"
                    onClick={prevPhoto}
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white bg-black/30 hover:bg-black/60 p-3 rounded-full backdrop-blur-sm border border-white/10 transition-all z-50 cursor-pointer"
                    onClick={nextPhoto}
                    aria-label="Próxima foto"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
              
              <motion.img
                key={selectedIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={photos[selectedIndex].url}
                alt={photos[selectedIndex].title || "Foto ampliada"}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl mb-14"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Filmstrip Thumbnails */}
              {photos.length > 1 && (
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90vw] md:max-w-2xl flex items-center gap-2 overflow-x-auto no-scrollbar px-3 py-2 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {photos.map((thumb, idx) => (
                    <button
                      key={thumb.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={clsx(
                        "relative flex-none w-11 h-11 md:w-13 md:h-13 rounded-lg overflow-hidden transition-all cursor-pointer",
                        idx === selectedIndex
                          ? "ring-2 ring-primary scale-105 opacity-100"
                          : "opacity-45 hover:opacity-80"
                      )}
                      aria-label={`Ir para foto ${idx + 1}`}
                    >
                      <img
                        src={thumb.url}
                        alt={thumb.title || `Miniatura ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
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
