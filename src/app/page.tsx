"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

const heroImages = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop", // Wedding/Social
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2068&auto=format&fit=crop", // Pet
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"  // Couple/Social
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={heroImages[currentImage]}
              alt="Fotografia Karoline Garcia"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl mt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight"
          >
            Fotografando histórias, sentimentos e conexões.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto"
          >
            Ensaios sociais e fotografia pet com um olhar sensível, natural e atemporal.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#social"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto text-center"
            >
              Conheça a Fotografia Social
            </Link>
            <Link
              href="#pet"
              className="bg-white text-foreground px-8 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-colors w-full sm:w-auto text-center"
            >
              Conheça a Fotografia Pet
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Quick View (Pastas) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">Portfólio</p>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-16">
            Momentos que viram lembranças
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800", title: "Casamentos", slug: "casamentos" },
              { img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800", title: "Família", slug: "familia" },
              { img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800", title: "Pets", slug: "pet-externo" },
              { img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800", title: "Casais", slug: "casais" },
              { img: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=800", title: "Filhotes", slug: "filhotes" },
              { img: "https://images.unsplash.com/photo-1517409217696-9f4a99d429dc?q=80&w=800", title: "Gestantes", slug: "gestantes" },
            ].map((pasta, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative cursor-pointer block"
              >
                <Link href={`/portfolio`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={pasta.img}
                      alt={pasta.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-serif text-lg md:text-xl drop-shadow-md">{pasta.title}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12">
            <Link href="/portfolio" className="inline-flex items-center justify-center border border-accent hover:border-primary px-8 py-3 rounded-full text-sm font-medium hover:text-primary transition-colors">
              Ver mais fotos
            </Link>
          </div>
        </div>
      </section>

      {/* Two Large Areas Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            
            {/* Social Photography Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              id="social"
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden rounded-2xl mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
                  alt="Fotografia Social"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Fotografia Social</h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md">
                Ensaios que eternizam momentos únicos com elegância e autenticidade. Casamentos, gestantes, famílias e celebrações especiais.
              </p>
              <Link href="/portfolio/social" className="inline-flex items-center text-primary font-medium tracking-wide uppercase text-sm group-hover:text-foreground transition-colors">
                Ver Portfólio Social <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            {/* Pet Photography Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              id="pet"
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden rounded-2xl mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2068&auto=format&fit=crop"
                  alt="Fotografia Pet"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Fotografia Pet</h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md">
                Registre toda a personalidade e o amor do seu melhor amigo. Ensaios externos, em estúdio ou na sua casa.
              </p>
              <Link href="/portfolio/pet" className="inline-flex items-center text-primary font-medium tracking-wide uppercase text-sm group-hover:text-foreground transition-colors">
                Ver Portfólio Pet <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Featured Banner / Quote */}
      <section className="py-32 bg-secondary text-center px-6">
        <div className="container mx-auto max-w-3xl">
          <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-relaxed mb-10">
            "Pessoas nos entregam os sentimentos mais profundos. Os pets nos ensinam o amor na sua forma mais pura."
            <span className="block mt-6 text-2xl md:text-3xl text-primary/80 font-light italic">
              Através da fotografia, conectamos esses dois mundos para eternizar o que realmente importa.
            </span>
          </h3>
          <Link 
            href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <MessageCircle className="mr-2 w-5 h-5" />
            Vamos conversar
          </Link>
        </div>
      </section>
    </div>
  );
}
