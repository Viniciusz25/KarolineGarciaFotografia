"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const socialAlbums = [
  { id: 1, title: "Casamentos", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop", slug: "casamento-ana-e-joao" },
  { id: 2, title: "Gestantes", image: "https://images.unsplash.com/photo-1517409217696-9f4a99d429dc?q=80&w=800&auto=format&fit=crop", slug: "gestante-mariana" },
  { id: 3, title: "Família", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop", slug: "familia-silva" },
  { id: 4, title: "Debutantes", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", slug: "debutante-julia" },
];

const petAlbums = [
  { id: 5, title: "Ensaio Externo", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop", slug: "golden-rex" },
  { id: 6, title: "Estúdio", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop", slug: "pug-luna" },
  { id: 7, title: "Filhotes", image: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=800&auto=format&fit=crop", slug: "filhotes-baleia" },
  { id: 8, title: "Pets e Família", image: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=800&auto=format&fit=crop", slug: "familia-com-pet" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function EnsaiosPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-0">
        
        <header className="text-center mb-16 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-foreground mb-4"
          >
            Ensaios
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Explore nossos melhores momentos. Escolha a categoria abaixo para visualizar as histórias que já contamos.
          </motion.p>
        </header>

        {/* Categoria Social */}
        <section className="mb-24 px-4 md:px-0">
          <div className="flex items-center justify-between mb-8 pb-4">
            <h2 className="text-3xl font-serif text-foreground">Ensaios Sociais</h2>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="columns-1 sm:columns-2 md:columns-3 gap-2 space-y-2"
          >
            {socialAlbums.map((album) => (
              <motion.div key={album.id} variants={itemVariants} className="break-inside-avoid">
                <Link href={`/album/${album.slug}`} className="group block relative w-full overflow-hidden cursor-pointer">
                  <img
                    src={album.image}
                    alt={album.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h3 className="text-2xl md:text-3xl font-serif text-white text-center drop-shadow-md group-hover:scale-105 transition-transform duration-500">{album.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Categoria Pet */}
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-8 pb-4">
            <h2 className="text-3xl font-serif text-foreground">Fotografia Pet</h2>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="columns-1 sm:columns-2 md:columns-3 gap-2 space-y-2"
          >
            {petAlbums.map((album) => (
              <motion.div key={album.id} variants={itemVariants} className="break-inside-avoid">
                <Link href={`/album/${album.slug}`} className="group block relative w-full overflow-hidden cursor-pointer">
                  <img
                    src={album.image}
                    alt={album.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h3 className="text-2xl md:text-3xl font-serif text-white text-center drop-shadow-md group-hover:scale-105 transition-transform duration-500">{album.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

      </div>
    </div>
  );
}
