"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const depoimentos = [
  {
    id: 1,
    name: "Mariana & Carlos",
    type: "Casamento",
    text: "O olhar da Karoline é algo fora do comum. Ela não tirou apenas fotos do nosso casamento, ela capturou a exata energia daquele dia. Toda vez que abrimos o álbum, sentimos como se estivéssemos lá novamente. Um trabalho de pura arte e sensibilidade.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=200&auto=format&fit=crop",
    rating: 5
  },
  {
    id: 2,
    name: "Família Silva",
    type: "Ensaio Pet",
    text: "Estávamos super preocupados porque nosso cachorro é muito agitado e não para um segundo, mas a experiência foi mágica! A Karol teve uma paciência absurda e conseguiu registrar a personalidade dele de um jeito que nós nunca conseguimos. Virou um quadro na nossa sala!",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop",
    rating: 5
  },
  {
    id: 3,
    name: "Juliana Mendes",
    type: "Gestante",
    text: "Eu confesso que sempre fui tímida para fotos, mas a Karol me fez me sentir a mulher mais linda do mundo. O ensaio foi leve, natural, zero daquelas poses forçadas. O resultado é tão elegante que parece ter saído de uma revista de luxo.",
    image: "https://images.unsplash.com/photo-1517409217696-9f4a99d429dc?q=80&w=200&auto=format&fit=crop",
    rating: 5
  },
  {
    id: 4,
    name: "Amanda Costa",
    type: "Ensaio Pet & Família",
    text: "É impressionante o respeito e a empatia que a Karol tem pelos animais. Ela soube exatamente como respeitar o tempo da minha gata. As fotos ficaram com uma luz e uma edição tão poéticas que me emociono toda vez que olho.",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=200&auto=format&fit=crop",
    rating: 5
  }
];

export default function DepoimentosPage() {
  return (
    <div className="bg-background min-h-screen">
      
      {/* Dark Hero Section for Navbar compatibility */}
      <section className="relative w-full pt-40 pb-20 bg-[#120f0e] flex flex-col items-center justify-center text-center">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-[#f4ede8] mb-4"
          >
            O Que Dizem Nossos Clientes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#f4ede8]/70 text-lg max-w-2xl mx-auto font-light"
          >
            Nossa maior recompensa é ver o amor e a gratidão através dos olhos de quem confia no nosso trabalho.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-6 md:px-12 py-24">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {depoimentos.map((dep, index) => (
            <motion.div
              key={dep.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-secondary/50 p-8 md:p-10 rounded-2xl relative border border-accent"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10" />
              
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src={dep.image} alt={dep.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground">{dep.name}</h3>
                  <p className="text-sm text-primary uppercase tracking-widest font-medium">{dep.type}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(dep.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary mr-1" />
                ))}
              </div>

              <p className="text-muted-foreground font-light leading-relaxed italic">
                "{dep.text}"
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
