"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Mail, Camera, MapPin, Heart, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const defaultSettings = {
  contato_hero_bg: "",
  contato_studio: "",
};

const defaultSettingsPositions: Record<string, string> = {
  contato_hero_bg: "50% 50%",
  contato_studio: "50% 50%",
};

export default function ContatoPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsPositions, setSettingsPositions] = useState(defaultSettingsPositions);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    sessionType: "",
    message: "",
    privacyAccepted: false,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("section", "Contato");
      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        const newSettingsPositions = { ...defaultSettingsPositions };
        data.forEach(item => {
          if (item.key in defaultSettings) {
            newSettings[item.key as keyof typeof defaultSettings] = item.url;
            if (item.cover_position) {
              newSettingsPositions[item.key] = item.cover_position;
            }
          }
        });
        setSettings(newSettings);
        setSettingsPositions(newSettingsPositions);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    const lines = [
      `Olá, Karoline! Meu nome é *${formData.name.trim()}*.`,
      formData.sessionType ? `*Tipo de Ensaio:* ${formData.sessionType}` : "",
      formData.phone ? `*Telefone:* ${formData.phone.trim()}` : "",
      formData.email ? `*E-mail:* ${formData.email.trim()}` : "",
      "",
      `*Mensagem:*`,
      formData.message.trim(),
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/5511940878269?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#f4ede8] text-[#2d2422] min-h-screen flex flex-col font-sans">
      
      {/* 1. HERO ESCURO */}
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-[#0a0807] text-[#f4ede8] overflow-hidden flex items-center">
        {/* Background Splitting for Hero */}
        <div className="absolute inset-0 flex flex-col md:flex-row">
          <div className="relative flex-1 h-full hidden md:block bg-[#0a0807]">
            {settings.contato_hero_bg && (
              <Image 
                src={settings.contato_hero_bg}
                alt="Fotógrafa" 
                fill 
                priority
                className="object-cover opacity-80"
                style={{ objectPosition: settingsPositions.contato_hero_bg || '50% 50%' }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-[#0a0807]" />
          </div>
          <div className="relative flex-1 h-full bg-[#0a0807]" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center">
          <div className="flex-1 hidden md:block" />
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-24 md:pt-0">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 mb-4 block">VAMOS CRIAR</span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#cba37b] mb-6 font-light leading-tight">
              memórias<br/><span className="text-white">inesquecíveis?</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-8 w-full">
              <div className="h-[1px] w-12 bg-white/20" />
              <Heart size={14} className="text-[#cba37b]" />
              <div className="h-[1px] w-12 bg-white/20 hidden md:block" />
            </div>
            <p className="text-white/70 font-light text-sm max-w-sm mb-10 leading-relaxed">
              Entre em contato e vamos conversar sobre o ensaio perfeito para você ou para o seu pet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#cba37b]">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/70">Atendimento<br/>Personalizado</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#cba37b]">
                  <Heart size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/70">Experiência<br/>Completa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FORMULÁRIO E CONTATOS (FUNDO CLARO) */}
      <section className="py-24 bg-[#f2eee9]">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 md:gap-24">
          
          {/* Esquerda: Infos de Contato */}
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#2d2422]/60 mb-4 block">FALE COMIGO</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2d2422] mb-6">
              Estou aqui para te ouvir!
            </h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-[#2d2422]/10" />
              <Heart size={12} className="text-[#cba37b]" />
            </div>
            <p className="text-[#2d2422]/70 font-light text-sm mb-12">
              Preencha o formulário ao lado ou utilize um dos canais de atendimento. Responderei o mais breve possível.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-[#2d2422]/10 flex items-center justify-center text-[#2d2422]">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#2d2422] mb-1">WhatsApp</h3>
                  <a href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento." target="_blank" rel="noopener noreferrer" className="text-[#2d2422]/70 text-sm mb-1 hover:text-[#cba37b] transition-colors block">
                    (11) 94087-8269
                  </a>
                  <span className="text-[10px] text-[#2d2422]/50 uppercase tracking-wider">Resposta rápida por aqui!</span>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-[#2d2422]/10 flex items-center justify-center text-[#2d2422]">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#2d2422] mb-1">E-mail</h3>
                  <p className="text-[#2d2422]/70 text-sm mb-1">contato@karolinegarcia.com.br</p>
                  <span className="text-[10px] text-[#2d2422]/50 uppercase tracking-wider">Responderemos em breve.</span>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-[#2d2422]/10 flex items-center justify-center text-[#2d2422]">
                  <Camera size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#2d2422] mb-1">Instagram</h3>
                  <div className="flex flex-col gap-1 mb-1">
                    <a href="https://instagram.com/karolinegarcia.fotografia" target="_blank" rel="noopener noreferrer" className="text-[#2d2422]/70 text-sm hover:text-[#cba37b] transition-colors flex items-center gap-2">
                      @karolinegarcia.fotografia <span className="text-[10px] text-[#2d2422]/40 italic">(perfil social)</span>
                    </a>
                    <a href="https://instagram.com/karolinegarcia.fotos" target="_blank" rel="noopener noreferrer" className="text-[#2d2422]/70 text-sm hover:text-[#cba37b] transition-colors flex items-center gap-2">
                      @karolinegarcia.fotos <span className="text-[10px] text-[#2d2422]/40 italic">(perfil pet)</span>
                    </a>
                  </div>
                  <span className="text-[10px] text-[#2d2422]/50 uppercase tracking-wider">Acompanhe meu trabalho!</span>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-[#2d2422]/10 flex items-center justify-center text-[#2d2422]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#2d2422] mb-1">Localização</h3>
                  <p className="text-[#2d2422]/70 text-sm mb-1">São Paulo - SP</p>
                  <span className="text-[10px] text-[#2d2422]/50 uppercase tracking-wider">Atendimento com hora marcada.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direita: Formulário Escuro */}
          <div id="formulario-contato" className="flex-1 scroll-mt-28">
            <div className="bg-[#120f0e] rounded-xl p-8 md:p-12 text-[#f4ede8] shadow-2xl h-full flex flex-col">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-medium mb-6 flex items-center gap-4">
                ENVIE SUA MENSAGEM <Heart size={10} className="text-[#cba37b]" />
              </h3>

              {submitted ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#cba37b]" />
                  <h4 className="font-serif text-2xl text-white">Mensagem pronta no WhatsApp!</h4>
                  <p className="text-sm text-white/60 max-w-sm font-light leading-relaxed">
                    Abrimos uma conversa direta com a Karoline preenchida com os dados do seu ensaio.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-[10px] uppercase tracking-widest text-[#cba37b] hover:underline cursor-pointer"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form className="space-y-6 flex-grow flex flex-col" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      required
                      placeholder="Nome completo *"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#cba37b] transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Telefone / WhatsApp"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#cba37b] transition-colors"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#cba37b] transition-colors"
                  />
                  
                  <div className="relative">
                    <select
                      value={formData.sessionType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sessionType: e.target.value }))}
                      className="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#cba37b] transition-colors appearance-none text-white/80"
                    >
                      <option value="" disabled className="bg-[#120f0e] text-white/50">Tipo de Ensaio</option>
                      <option value="Casamento" className="bg-[#120f0e] text-white">Casamento</option>
                      <option value="Pet" className="bg-[#120f0e] text-white">Pet</option>
                      <option value="Família" className="bg-[#120f0e] text-white">Família</option>
                      <option value="Gestante" className="bg-[#120f0e] text-white">Gestante</option>
                      <option value="Casal" className="bg-[#120f0e] text-white">Casal</option>
                      <option value="Outro" className="bg-[#120f0e] text-white">Outro</option>
                    </select>
                  </div>

                  <textarea
                    required
                    placeholder="Mensagem *&#10;Conte-me mais sobre o que você está buscando..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#cba37b] transition-colors resize-none flex-grow"
                  />

                  <div className="flex items-center gap-3 mt-4">
                    <input
                      type="checkbox"
                      id="privacy"
                      required
                      checked={formData.privacyAccepted}
                      onChange={(e) => setFormData((prev) => ({ ...prev, privacyAccepted: e.target.checked }))}
                      className="w-4 h-4 rounded border-white/20 bg-transparent text-[#cba37b] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="privacy" className="text-[10px] text-white/60 cursor-pointer">
                      Concordo em entrar em contato para atendimento personalizado via WhatsApp/E-mail.
                    </label>
                  </div>

                  <button type="submit" className="w-full bg-[#d5a77f] hover:bg-[#cba37b] text-[#120f0e] font-medium text-[10px] uppercase tracking-widest py-4 rounded transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer">
                    ENVIAR MENSAGEM <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className="bg-[#f0ece9] py-8 border-t border-[#e5d8cf]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 text-center md:text-left">
            <div className="hidden md:block w-32 h-20 relative rounded overflow-hidden bg-muted">
               {settings.contato_studio && (
                 <Image
                   src={settings.contato_studio}
                   alt="Estúdio e Câmera"
                   fill
                   className="object-cover"
                   style={{ objectPosition: settingsPositions.contato_studio || '50% 50%' }}
                 />
               )}
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#2d2422]/50 block mb-1">PRONTA PARA COMEÇAR?</span>
              <h3 className="text-xl md:text-2xl font-serif text-[#2d2422]">
                Vamos transformar momentos em lembranças eternas.
              </h3>
            </div>
          </div>
          <a
            href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium text-white bg-[#0f0c0b] px-8 py-3 rounded hover:bg-[#cba37b] transition-colors shrink-0"
          >
            CHAMAR NO WHATSAPP <ArrowRight className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
}
