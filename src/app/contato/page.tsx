"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Mail, ArrowRight } from "lucide-react";

export default function ContatoPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Immersive Image */}
        <div className="w-full h-[50vh] lg:w-1/2 lg:h-screen lg:sticky lg:top-0 relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1500&auto=format&fit=crop"
            alt="Vamos criar memórias"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-12 left-8 lg:left-16 right-8">
            <h2 className="text-3xl lg:text-5xl font-serif text-white mb-4 leading-tight">
              Deixe-me contar <br/> a sua história.
            </h2>
            <p className="text-white/80 font-light text-lg">
              Estou ansiosa para eternizar os seus melhores momentos.
            </p>
          </div>
        </div>

        {/* Right Side: Modern Contact Links (Bento Style) */}
        <div className="w-full lg:w-1/2 p-8 lg:p-20 xl:p-24 pt-16 lg:pt-32 flex flex-col justify-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-5xl lg:text-7xl font-serif text-foreground mb-6 tracking-tight">
              Vamos <span className="italic font-light text-primary">Conversar</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light">
              Escolha o canal de sua preferência para solicitar orçamentos, tirar dúvidas ou agendar o seu ensaio.
            </p>
          </motion.div>

          <div className="space-y-6">
            
            {/* WhatsApp Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-8 rounded-3xl bg-secondary hover:bg-primary transition-colors duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                    <MessageCircle size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-foreground group-hover:text-primary-foreground transition-colors duration-500">WhatsApp</h3>
                    <p className="text-muted-foreground group-hover:text-primary-foreground/80 font-light transition-colors duration-500">
                      Resposta rápida para orçamentos
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-foreground group-hover:text-primary-foreground transform group-hover:translate-x-2 transition-all duration-500" />
              </Link>
            </motion.div>

            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href="mailto:contato@karolinegarcia.com"
                className="group flex items-center justify-between p-8 rounded-3xl border border-accent hover:border-primary transition-colors duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                    <Mail size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-foreground">E-mail</h3>
                    <p className="text-muted-foreground font-light">
                      contato@karolinegarcia.com
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-primary transform group-hover:translate-x-2 transition-all duration-500" />
              </a>
            </motion.div>

            {/* Instagram Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-8 rounded-3xl border border-accent hover:border-primary transition-colors duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-foreground">Instagram</h3>
                    <p className="text-muted-foreground font-light">
                      Acompanhe os bastidores
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-primary transform group-hover:translate-x-2 transition-all duration-500" />
              </a>
            </motion.div>

          </div>

          <div className="mt-20 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">Atendimento</p>
            <p className="text-foreground font-light">São Paulo, SP — Disponível para viagens.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
