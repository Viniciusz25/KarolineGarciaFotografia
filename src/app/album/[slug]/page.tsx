import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import MasonryGallery from "@/components/MasonryGallery";

// Mock data for demonstration
const mockAlbum = {
  title: "Casamento Ana e João",
  description: "Um dia inesquecível de muito amor e emoção no campo. Celebrando a união de duas almas que nasceram uma para a outra.",
  coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
  category: "Fotografia Social",
  photos: [
    { id: "1", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop", width: 800, height: 1200 },
    { id: "2", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", width: 1200, height: 800 },
    { id: "3", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop", width: 800, height: 1000 },
    { id: "4", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop", width: 1200, height: 800 },
    { id: "5", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop", width: 800, height: 1200 },
    { id: "6", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop", width: 1200, height: 800 },
    { id: "7", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop", width: 800, height: 1000 },
  ]
};

// In Next.js App Router, params is a Promise in page components
export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params Promise
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Here we would typically fetch the album data using the slug
  const album = mockAlbum;

  return (
    <div className="bg-background min-h-screen">
      {/* Banner / Header */}
      <div className="relative h-[60vh] w-full pt-20">
        <Image
          src={album.coverImage}
          alt={album.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-6 md:px-12 pb-16">
          <Link href="/portfolio" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm uppercase tracking-widest font-medium">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar para o Portfólio
          </Link>
          <p className="text-primary font-medium tracking-widest uppercase mb-2">
            {album.category}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            {album.title}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl font-light">
            {album.description}
          </p>
        </div>
      </div>

      {/* Gallery & Actions */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        
        <div className="flex justify-between items-center mb-12">
          <button className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium">
            <Share2 className="mr-2 w-5 h-5" />
            Compartilhar Álbum
          </button>

          <Link href="https://wa.me/5511940878269?text=Olá,%20Karoline!%20Gostaria%20de%20solicitar%20um%20orçamento." target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Solicitar Orçamento
          </Link>
        </div>

        <MasonryGallery photos={album.photos} />
        
      </div>
    </div>
  );
}
