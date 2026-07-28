"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ParallelLines() {
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Suavidade na resposta ao scroll
      },
    });

    // Animação das linhas conectando e afastando (Simbolizando Social e Pet)
    tl.to(lineLeftRef.current, { left: "10%", ease: "power1.inOut" }, 0)
      .to(lineRightRef.current, { right: "10%", ease: "power1.inOut" }, 0)
      
      .to(lineLeftRef.current, { left: "30%", opacity: 0.8, ease: "power2.inOut" }, 0.3)
      .to(lineRightRef.current, { right: "30%", opacity: 0.8, ease: "power2.inOut" }, 0.3)
      
      // Cruza no meio da tela
      .to(lineLeftRef.current, { left: "55%", ease: "sine.inOut" }, 0.6)
      .to(lineRightRef.current, { right: "55%", ease: "sine.inOut" }, 0.6)

      // Volta pras laterais no final
      .to(lineLeftRef.current, { left: "2rem", ease: "power1.out" }, 0.9)
      .to(lineRightRef.current, { right: "2rem", ease: "power1.out" }, 0.9);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      {/* Linha da Esquerda (Representa Social) */}
      <div 
        ref={lineLeftRef}
        className="fixed top-0 bottom-0 left-8 w-[1px] bg-gradient-to-b from-transparent via-primary/40 to-transparent z-40 pointer-events-none"
      />
      {/* Linha da Direita (Representa Pet) */}
      <div 
        ref={lineRightRef}
        className="fixed top-0 bottom-0 right-8 w-[1px] bg-gradient-to-b from-transparent via-primary/40 to-transparent z-40 pointer-events-none"
      />
    </>
  );
}
