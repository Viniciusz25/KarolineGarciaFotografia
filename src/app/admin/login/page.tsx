"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciais inválidas. Verifique seu e-mail e senha.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden">
      
      {/* Background Hero Escuro */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2000&auto=format&fit=crop" 
          alt="Karoline Garcia" 
          fill 
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[#120f0e]/80 backdrop-blur-sm" />
      </div>

      <Link href="/" className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors inline-flex items-center text-[10px] uppercase tracking-widest z-10">
        <ArrowLeft className="mr-2 w-4 h-4" /> Voltar ao site
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1a1715]/80 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-2xl border border-white/10 z-10 relative"
      >
        <div className="text-center mb-10">
          <span className="font-serif italic text-2xl text-[#cba37b] mb-2 block opacity-90">Acesso Restrito</span>
          <h1 className="text-[10px] uppercase tracking-[0.3em] text-white/70">Painel de Administração<br/>Karoline Garcia</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 text-red-200 rounded text-[11px] text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border border-white/10 rounded text-sm text-white focus:bg-white/5 focus:border-[#cba37b] outline-none transition-all placeholder:text-white/20"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border border-white/10 rounded text-sm text-white focus:bg-white/5 focus:border-[#cba37b] outline-none transition-all placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#cba37b] text-[#120f0e] py-4 rounded font-medium uppercase tracking-widest text-[10px] hover:bg-white transition-colors flex items-center justify-center disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ENTRAR NO PAINEL"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
