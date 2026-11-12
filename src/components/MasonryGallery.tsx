"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import clsx from "clsx";

interface Photo {
  id: string;
  url: string;
  width: number;
  height: number;
  alt?: string;
}

interface MasonryGalleryProps {
  photos: Photo[];
}

export default function MasonryGallery({ photos }: MasonryGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  const nextPhoto = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextPhoto();
      else if (e.key === "ArrowLeft") prevPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextPhoto, prevPhoto]);

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

  const markLoaded = (id: string) => {
    setLoadedIds((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  return (
    <>
      {/* CSS Masonry */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((photo, index) => {
          const isLoaded = !!loadedIds[photo.id];
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 8) * 0.08 }}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl group relative bg-muted shadow-sm"
              onClick={() => openLightbox(index)}
            >
              {!isLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              <Image
                src={photo.url}
                alt={photo.alt || "Fotografia"}
                width={photo.width}
                height={photo.height}
                onLoad={() => markLoaded(photo.id)}
                className={clsx(
                  "w-full h-auto object-cover transition-all duration-700 group-hover:scale-105",
                  isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <Maximize2 size={14} />
                </span>
              </div>
              <span className="pointer-events-none select-none absolute bottom-2.5 left-3 text-[10px] font-serif italic tracking-wider text-white/65 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] z-10">
                @karolinegarcia.fotografia
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && photos[currentIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar */}
            <div className="absolute top-4 left-6 right-6 md:top-6 md:left-10 md:right-10 flex items-center justify-between z-50 pointer-events-none">
              <div className="text-white/70 font-sans text-xs uppercase tracking-[0.3em] bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                {currentIndex + 1} / {photos.length}
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

            {/* Main Image */}
            <div className="relative w-full h-full max-w-5xl max-h-[76vh] flex items-center justify-center p-4 mb-14">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={photos[currentIndex].url}
                  alt={photos[currentIndex].alt || "Fotografia ampliada"}
                  fill
                  className="object-contain select-none"
                  quality={90}
                  priority
                  draggable={false}
                />
                <span className="pointer-events-none select-none absolute bottom-4 right-6 text-xs md:text-sm font-serif italic tracking-wider text-white/65 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] z-20">
                  @karolinegarcia.fotografia
                </span>
              </motion.div>
            </div>

            {/* Filmstrip Thumbnails */}
            {photos.length > 1 && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90vw] md:max-w-2xl flex items-center gap-2 overflow-x-auto no-scrollbar px-3 py-2 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {photos.map((thumb, idx) => (
                  <button
                    key={thumb.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={clsx(
                      "relative flex-none w-11 h-11 md:w-13 md:h-13 rounded-lg overflow-hidden transition-all cursor-pointer",
                      idx === currentIndex
                        ? "ring-2 ring-primary scale-105 opacity-100"
                        : "opacity-45 hover:opacity-80"
                    )}
                    aria-label={`Ir para foto ${idx + 1}`}
                  >
                    <Image
                      src={thumb.url}
                      alt={thumb.alt || `Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
