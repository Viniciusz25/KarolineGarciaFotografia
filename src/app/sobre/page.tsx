import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function SobrePage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Section 1: Sobre Mim (Texto Esquerda, Foto Direita) */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 mb-32">
          
          {/* Text Section (Left) */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
              Olá, eu sou a Karoline
            </h1>
            <p className="text-lg text-muted-foreground mb-6 font-light leading-relaxed">
              Sou apaixonada por contar histórias através da luz. Minha jornada na fotografia começou com a vontade de congelar o tempo e guardar os sentimentos mais genuínos que vivemos nos ensaios sociais.
            </p>
            <p className="text-lg text-muted-foreground mb-8 font-light leading-relaxed">
              Busco um olhar sensível, natural e atemporal. Minha edição é leve, valorizando cores quentes, contrastes suaves e a beleza real de cada momento. Quero que daqui a 20 anos, você olhe para suas fotos e sinta a mesma emoção daquele dia.
            </p>

            <Link
              href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Vamos criar juntos
            </Link>
          </div>

          {/* Image Section (Right) - Arco Normal */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-t-[1000px] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1554046920-90dcac471804?q=80&w=1500&auto=format&fit=crop"
                alt="Karoline Garcia"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>


        {/* Section 2: Inspiração Pet (Foto Esquerda, Texto Direita) */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          
          {/* Image Section (Left) - Arco Normal */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-t-[1000px] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1500&auto=format&fit=crop"
                alt="Pets da Karol"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Text Section (Right) */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
              Minha Grande Inspiração
            </h2>
            <p className="text-lg text-muted-foreground mb-6 font-light leading-relaxed">
              O que realmente completou meu olhar na fotografia foram os meus próprios pets. Eles foram a minha grande inspiração para entrar de cabeça na <strong className="font-medium text-primary">fotografia pet</strong>. 
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              O amor incondicional, a pureza e a energia que eles trazem para a nossa vida me fizeram perceber que essas memórias também precisam ser eternizadas com a mesma sensibilidade, respeito e emoção de um ensaio de família.
            </p>
          </div>

        </div>

        {/* Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-secondary p-12 rounded-2xl">
          <div>
            <h3 className="text-xl font-serif text-foreground mb-4 uppercase tracking-widest">Missão</h3>
            <p className="text-muted-foreground font-light">
              Eternizar momentos de forma autêntica e emocionante, entregando memórias visuais que toquem o coração das famílias e celebrem o amor em todas as suas formas, inclusive o amor pelos pets.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-serif text-foreground mb-4 uppercase tracking-widest">Visão</h3>
            <p className="text-muted-foreground font-light">
              Ser referência em fotografia social e pet, reconhecida pelo olhar sensível, qualidade premium de entrega e pela experiência acolhedora que proporciono a cada cliente.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-serif text-foreground mb-4 uppercase tracking-widest">Valores</h3>
            <p className="text-muted-foreground font-light">
              Sensibilidade, Autenticidade, Respeito, Excelência e Empatia. Cada ensaio é tratado de forma única e especial, respeitando o tempo e o limite de cada um.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
