"use client";

import { useEffect, useRef } from "react";

interface CrystalDot {
  x: number;
  y: number;
  w: number;
  h: number;
  hue: number;
  speed: number;
  alpha: number;
  layer: number;
}

export default function CrystalParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const dotCount = 75;
    let dots: CrystalDot[] = [];

    // Paleta de Oro y Obsidiana correspondiente al Login / Marca
    const baseHue = 42; // Tono oro cálido
    const hueVariance = 7; // Variación sutil entre ámbar y oro champaña (35° a 49°)

    function initDots() {
      dots = [];
      const maxHeight = height * 0.95;
      const minHeight = height * 0.45;
      const minWidth = 2.5;
      const maxWidth = 13;

      for (let i = 0; i < dotCount; i++) {
        const layer = Math.random(); // 0 = fondo distante, 1 = primer plano
        dots.push({
          x: Math.random() * (width + 120) - 60,
          y: Math.random() * (height * 0.55) - 30,
          w: minWidth + (maxWidth - minWidth) * layer,
          h: minHeight + Math.random() * (maxHeight - minHeight),
          hue: baseHue + (Math.random() * 2 - 1) * hueVariance,
          speed: 0.14 + layer * 0.32,
          alpha: 0.25 + layer * 0.55,
          layer,
        });
      }
    }

    function handleResize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      initDots();
    }

    function handlePointerMove(e: PointerEvent) {
      if (!width || !height) return;
      targetMouseX = (e.clientX / width - 0.5) * 50;
      targetMouseY = (e.clientY / height - 0.5) * 25;
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    function render() {
      if (!ctx) return;

      // Suavizado del paralaje con la posición del ratón
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Desplazamiento por capas para el efecto 3D Crystal Parallax
        const parallaxX = mouseX * (0.25 + dot.layer * 0.85);
        const parallaxY = mouseY * (0.15 + dot.layer * 0.45);
        const drawX = dot.x + parallaxX;
        const drawY = dot.y + parallaxY;

        const h = dot.hue;
        const a = dot.alpha;

        const grd = ctx.createLinearGradient(
          drawX,
          drawY,
          drawX + dot.w,
          drawY + dot.h
        );
        grd.addColorStop(0.0, `hsla(${h - 4}, 75%, 45%, 0)`);
        grd.addColorStop(0.18, `hsla(${h}, 78%, 52%, ${a * 0.45})`);
        grd.addColorStop(0.5, `hsla(${h + 3}, 88%, 66%, ${a * 0.85})`);
        grd.addColorStop(0.82, `hsla(${h}, 75%, 50%, ${a * 0.45})`);
        grd.addColorStop(1.0, `hsla(${h - 4}, 70%, 42%, 0)`);

        ctx.shadowBlur = 8 + dot.layer * 14;
        ctx.shadowColor = `hsla(${h}, 85%, 56%, ${a * 0.65})`;
        ctx.fillStyle = grd;
        ctx.fillRect(drawX, drawY, dot.w, dot.h);

        // Desplazamiento horizontal continuo
        dot.x += dot.speed;
        if (dot.x > width + 60) {
          dot.x = -dot.w - 60;
          dot.y = Math.random() * (height * 0.55) - 30;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      className="crystal-bg-container"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Resplandor cálido dorado central */}
      <div
        className="crystal-bg-glow"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 48%, hsla(42, 60%, 45%, 0.18) 0%, rgba(13, 12, 11, 0) 70%)",
          zIndex: 1,
        }}
      />

      {/* Canvas interactivo con columnas de cristal y paralaje */}
      <canvas
        ref={canvasRef}
        id="crystal-canvas"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 2,
        }}
      />

      {/* Viñeta de alto contraste para máxima legibilidad de la tarjeta de login */}
      <div
        className="crystal-bg-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(13, 12, 11, 0.25) 15%, rgba(10, 9, 8, 0.72) 65%, rgba(5, 5, 4, 0.92) 100%)",
          zIndex: 3,
        }}
      />
    </div>
  );
}
