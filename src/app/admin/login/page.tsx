"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden bg-[#120f0e]">
      {/* Fundo Editorial Elegante */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(203,163,123,0.12),_transparent_60%)]" />

      <Link
        href="/"
        className="absolute top-8 left-8 text-white/60 hover:text-white transition-colors inline-flex items-center text-xs uppercase tracking-widest z-10"
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Voltar ao site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1a1715]/95 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl border border-white/10 z-10 relative"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 border border-[#cba37b]/40 rounded-full flex items-center justify-center text-[#cba37b] font-serif text-2xl">
            KG
          </div>
          <span className="font-serif italic text-2xl text-[#cba37b] mb-1.5 block">
            Painel do Estúdio
          </span>
          <h1 className="text-[11px] uppercase tracking-[0.25em] text-white/60">
            Karoline Garcia Fotografia
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-500/30 text-red-200 rounded-xl text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-white/70 ml-1 block">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-black/25 border border-white/15 rounded-xl text-sm text-white focus:border-[#cba37b] outline-none transition-all placeholder:text-white/25"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/70 ml-1 block">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 bg-black/25 border border-white/15 rounded-xl text-sm text-white focus:border-[#cba37b] outline-none transition-all placeholder:text-white/25"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-1 cursor-pointer"
                aria-label="Mostrar ou ocultar senha"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#cba37b] text-[#120f0e] py-4 rounded-xl font-semibold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center disabled:opacity-50 mt-6 cursor-pointer shadow-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar no Painel"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
