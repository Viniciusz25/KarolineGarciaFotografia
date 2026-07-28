"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { X, MessageCircle } from "lucide-react";

// URLs base atualizadas com categorias
const basePhotos = [
  { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop", category: "social" },
  { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop", category: "social" },
  { url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop", category: "pet" },
  { url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop", category: "pet" },
  { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop", category: "social" },
  { url: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1200&auto=format&fit=crop", category: "pet" },
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", category: "social" },
  { url: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=1200&auto=format&fit=crop", category: "pet" },
  { url: "https://images.unsplash.com/photo-1537151608804-ea6fac859422?q=80&w=1200&auto=format&fit=crop", category: "social" },
];

const baseSocial = basePhotos.filter(p => p.category === "social");
const basePet = basePhotos.filter(p => p.category === "pet");

// Gerando 15 fotos para cada categoria (total 30 na aba 'Todos')
const socialPhotos = Array.from({ length: 15 }).map((_, i) => ({
  id: `social-${i}`,
  ...baseSocial[i % baseSocial.length]
}));

const petPhotos = Array.from({ length: 15 }).map((_, i) => ({
  id: `pet-${i}`,
  ...basePet[i % basePet.length]
}));

// Misturando alternadamente para a aba "Todos" (30 fotos no total)
const allPhotos = Array.from({ length: 30 }).map((_, i) => i % 2 === 0 ? socialPhotos[i / 2] : petPhotos[Math.floor(i / 2)]);

export default function PortfolioGalleryPage() {
  const [filter, setFilter] = useState<"todos" | "social" | "pet">("todos");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Define qual array renderizar
  const filteredPhotos = filter === "todos" 
    ? allPhotos 
    : filter === "social" 
      ? socialPhotos 
      : petPhotos;

  return (
    <>
      <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-0">
          
          <header className="text-center mb-12 px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif text-foreground mb-4"
            >
              Portfólio
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8"
            >
              Nossa galeria completa. Momentos e olhares eternizados.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button 
                onClick={() => setFilter("todos")}
                className={clsx(
                  "px-6 py-2 rounded-full text-sm uppercase tracking-widest font-medium transition-all shadow-sm border",
                  filter === "todos" ? "bg-foreground text-background border-foreground" : "bg-white border-accent text-foreground hover:bg-secondary"
                )}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilter("social")}
                className={clsx(
                  "px-6 py-2 rounded-full text-sm uppercase tracking-widest font-medium transition-all shadow-sm border",
                  filter === "social" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-accent text-foreground hover:bg-secondary"
                )}
              >
                Social
              </button>
              <button 
                onClick={() => setFilter("pet")}
                className={clsx(
                  "px-6 py-2 rounded-full text-sm uppercase tracking-widest font-medium transition-all shadow-sm border",
                  filter === "pet" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-accent text-foreground hover:bg-secondary"
                )}
              >
                Pets
              </button>
            </motion.div>
          </header>

          {/* Dynamic Masonry Layout */}
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="columns-1 sm:columns-2 md:columns-3 gap-2 space-y-2 mb-24"
            >
              {filteredPhotos.map((photo, idx) => (
                <motion.div 
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: (idx % 10) * 0.02 }}
                  className="relative w-full overflow-hidden group cursor-pointer break-inside-avoid bg-muted"
                  onClick={() => setSelectedImage(photo.url)}
                >
                  <img
                    src={photo.url}
                    alt={`Foto de ensaio ${photo.category}`}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 text-transparent"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white font-serif tracking-widest text-sm bg-black/40 px-4 py-2 rounded-full transition-opacity duration-300">
                      Ampliar
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Call To Action */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center bg-secondary py-20 px-6 rounded-3xl"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-6">
              Se emocionou com essas histórias?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Cada foto carrega uma narrativa única. Chegou a hora de eternizarmos a sua também.
            </p>
            <Link
              href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Solicitar Orçamento
            </Link>
          </motion.section>

        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage} 
              alt="Foto ampliada"
              className="max-w-full max-h-full object-contain rounded-md"
              onClick={(e) => e.stopPropagation()} // Impede que o clique na foto feche o modal
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
