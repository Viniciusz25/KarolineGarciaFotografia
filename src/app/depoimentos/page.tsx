"use client";

import Image from "next/image";
import { Star, Quote, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const depoimentos = [
  {
    id: 1,
    name: "Mariana & Carlos",
    type: "Casamento",
    text: "O olhar da Karoline é algo fora do comum. Ela não tirou apenas fotos do nosso casamento, ela capturou a exata energia daquele dia. Toda vez que abrimos o álbum, sentimos como se estivéssemos lá novamente. Um trabalho de pura arte e sensibilidade.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    rating: 5,
    highlight: true,
  },
  {
    id: 2,
    name: "Família Silva",
    type: "Ensaio Pet",
    text: "Estávamos super preocupados porque nosso cachorro é muito agitado e não para um segundo, mas a experiência foi mágica! A Karol teve uma paciência absurda e conseguiu registrar a personalidade dele de um jeito que nós nunca conseguimos. Virou um quadro na nossa sala!",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop",
    rating: 5,
    highlight: false,
  },
  {
    id: 3,
    name: "Juliana Mendes",
    type: "Gestante",
    text: "Eu confesso que sempre fui tímida para fotos, mas a Karol me fez me sentir a mulher mais linda do mundo. O ensaio foi leve, natural, zero daquelas poses forçadas. O resultado é tão elegante que parece ter saído de uma revista de luxo.",
    image: "https://images.unsplash.com/photo-1517409217696-9f4a99d429dc?q=80&w=400&auto=format&fit=crop",
    rating: 5,
    highlight: false,
  },
  {
    id: 4,
    name: "Amanda Costa",
    type: "Ensaio Pet & Família",
    text: "É impressionante o respeito e a empatia que a Karol tem pelos animais. Ela soube exatamente como respeitar o tempo da minha gata. As fotos ficaram com uma luz e uma edição tão poéticas que me emociono toda vez que olho.",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop",
    rating: 5,
    highlight: false,
  }
];

export default function DepoimentosPage() {
  const highlighted = depoimentos.find(d => d.highlight) || depoimentos[0];
  const others = depoimentos.filter(d => !d.highlight);

  return (
    <div className="bg-[#f4ede8] min-h-screen text-[#2d2422]">
      
      {/* 1. HERO ESCURO PREMIUM */}
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-[#0a0807] text-[#f4ede8] overflow-hidden flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2000&auto=format&fit=crop" 
            alt="Casamento Emocionante" 
            fill 
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0807]/50 via-transparent to-[#0a0807]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#cba37b] mb-4 block"
          >
            MUITO ALÉM DA FOTOGRAFIA
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-white mb-6 font-light leading-tight"
          >
            Histórias reais, <br/><span className="italic text-[#cba37b]">sentimentos eternos.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed"
          >
            A maior recompensa do meu trabalho é a emoção que vejo no rosto de cada pessoa ao reviver seu momento através da minha lente.
          </motion.p>
        </div>
      </section>

      {/* 2. DEPOIMENTO EM DESTAQUE */}
      <section className="py-24 md:py-32 bg-white relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            {/* Imagem do Destaque */}
            <div className="flex-1 relative w-full aspect-[4/5] md:aspect-square">
              <div className="absolute inset-0 rounded-tl-[80px] rounded-br-[80px] overflow-hidden shadow-2xl">
                <Image src={highlighted.image} alt={highlighted.name} fill className="object-cover transition-transform duration-1000 hover:scale-105" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#f4ede8] rounded-full flex items-center justify-center hidden md:flex shadow-xl border border-[#cba37b]/20">
                <Quote className="w-12 h-12 text-[#cba37b]" />
              </div>
            </div>

            {/* Texto do Destaque */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex mb-6">
                {[...Array(highlighted.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#cba37b] text-[#cba37b] mr-1" />
                ))}
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-[#2d2422] leading-tight mb-8 relative">
                <Quote className="w-8 h-8 text-[#2d2422]/10 absolute -top-4 -left-6 md:-left-8" />
                "{highlighted.text}"
              </h2>
              <div>
                <h3 className="font-serif text-xl text-[#2d2422]">{highlighted.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#cba37b] mt-1">{highlighted.type}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MASONRY DOS OUTROS DEPOIMENTOS */}
      <section className="py-24 bg-[#f4ede8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#2d2422]/50 block mb-3">MAIS EXPERIÊNCIAS</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d2422]">O amor em <span className="italic text-[#cba37b]">palavras</span></h2>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 max-w-7xl mx-auto">
            {others.map((dep, index) => (
              <motion.div
                key={dep.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[#2d2422]/5 relative break-inside-avoid group hover:shadow-xl transition-shadow duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-[#f4ede8]">
                    <Image src={dep.image} alt={dep.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#2d2422] group-hover:text-[#cba37b] transition-colors">{dep.name}</h3>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#2d2422]/50">{dep.type}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(dep.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#cba37b] text-[#cba37b] mr-1" />
                  ))}
                </div>
                <p className="text-[#2d2422]/70 font-light leading-relaxed text-sm italic relative z-10">
                  "{dep.text}"
                </p>
                <Quote className="absolute bottom-6 right-6 w-16 h-16 text-[#f4ede8] opacity-50 -z-0 group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER (Mesmo estilo de contato) */}
      <section className="bg-[#120f0e] py-16 text-white text-center">
        <div className="container mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#cba37b] mb-4 block">SEJA O PRÓXIMO</span>
          <h2 className="font-serif text-3xl md:text-4xl mb-8">
            Vamos contar a <span className="italic text-[#cba37b]">sua</span> história?
          </h2>
          <Link href="/contato" className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-black bg-[#cba37b] px-8 py-4 rounded hover:bg-white transition-colors">
            SOLICITAR ORÇAMENTO <ArrowRight className="ml-3 w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
