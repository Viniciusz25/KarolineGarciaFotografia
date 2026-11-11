"use client";

import { useEffect, useRef } from "react";

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const patternSize = 128;
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const pCtx = patternCanvas.getContext("2d");
    if (!pCtx) return;

    const patternData = pCtx.createImageData(patternSize, patternSize);
    const patternPixelData = patternData.data;

    let frame = 0;
    let animationFrameId: number;

    const render = () => {
      if (frame % 4 === 0) {
        for (let i = 0; i < patternPixelData.length; i += 4) {
          const value = Math.random() * 255;
          patternPixelData[i] = value;
          patternPixelData[i + 1] = value;
          patternPixelData[i + 2] = value;
          patternPixelData[i + 3] = 14;
        }
        pCtx.putImageData(patternData, 0, 0);

        const pattern = ctx.createPattern(patternCanvas, "repeat");
        if (pattern) {
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, w, h);
        }
      }
      frame++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999] opacity-40"
      style={{ isolation: "isolate" }}
    />
  );
}
