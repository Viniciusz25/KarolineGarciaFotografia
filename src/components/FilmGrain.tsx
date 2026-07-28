"use client";

import { useEffect, useRef } from "react";

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let patternSize = 128;
    let patternCanvas = document.createElement("canvas");
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    let pCtx = patternCanvas.getContext("2d");
    
    let patternData = pCtx!.createImageData(patternSize, patternSize);
    let patternPixelData = patternData.data;

    let frame = 0;

    const render = () => {
      // Slower framerate for cinematic feel (e.g. 15fps)
      if (frame % 4 === 0) {
        for (let i = 0; i < patternPixelData.length; i += 4) {
          let value = Math.random() * 255;
          patternPixelData[i] = value;
          patternPixelData[i + 1] = value;
          patternPixelData[i + 2] = value;
          patternPixelData[i + 3] = 12; // Extremely subtle alpha (low noise)
        }
        pCtx!.putImageData(patternData, 0, 0);

        ctx.fillStyle = ctx.createPattern(patternCanvas, "repeat")!;
        ctx.fillRect(0, 0, w, h);
      }
      frame++;
      requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999] opacity-30 mix-blend-multiply"
      style={{ isolation: "isolate" }}
    />
  );
}
