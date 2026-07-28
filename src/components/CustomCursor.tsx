"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  
  useEffect(() => {
    // Only run on desktop devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Triggers for buttons and links
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      // Triggers for photos (imgs)
      if (target.tagName.toLowerCase() === "img") {
        setIsHoveringPhoto(true);
      } else {
        setIsHoveringPhoto(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    // Hide default cursor
    document.body.style.cursor = 'none';
    const links = document.querySelectorAll('a, button');
    links.forEach(l => { (l as HTMLElement).style.cursor = 'none'; });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null; // No custom cursor on mobile
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[1000] mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHoveringPhoto ? 0 : isHovering ? 2.5 : 1,
          opacity: isHoveringPhoto ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      
      {/* Outer ring / Photo text */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-[1000]"
        animate={{
          x: mousePosition.x - 40,
          y: mousePosition.y - 40,
          opacity: isHoveringPhoto ? 1 : 0,
          scale: isHoveringPhoto ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="w-20 h-20 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center border border-border shadow-lg">
          <span className="text-[10px] uppercase tracking-widest font-bold text-foreground">Ver</span>
        </div>
      </motion.div>
    </>
  );
}
