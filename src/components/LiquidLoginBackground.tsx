"use client";

import { useEffect, useRef, useState } from "react";

interface LiquidAppInstance {
  loadImage: (src: string) => Promise<void>;
  setRain: (enabled: boolean) => void;
  setRainTime: (time: number) => void;
  dispose?: () => void;
  liquidPlane?: {
    material?: {
      metalness: number;
      roughness: number;
    };
    uniforms?: {
      displacementScale?: {
        value: number;
      };
    };
  };
}

type LiquidBackgroundFactory = (canvas: HTMLCanvasElement) => LiquidAppInstance;

interface LiquidModule {
  default?: LiquidBackgroundFactory;
}

function importModule(url: string): Promise<LiquidModule | LiquidBackgroundFactory> {
  // Use new Function so TypeScript does not attempt static module resolution at build time
  return new Function("u", "return import(u)")(url);
}

export default function LiquidLoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let liquidApp: LiquidAppInstance | null = null;

    async function init() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        let LiquidBackgroundModule: LiquidModule | LiquidBackgroundFactory;
        try {
          // Attempt local vendor file first
          LiquidBackgroundModule = await importModule("/vendor/liquid1.min.js");
        } catch {
          // Fallback to CDN
          LiquidBackgroundModule = await importModule(
            "https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js"
          );
        }

        if (isCancelled || !canvasRef.current) return;

        const LiquidBackground: LiquidBackgroundFactory =
          typeof LiquidBackgroundModule === "function"
            ? LiquidBackgroundModule
            : (LiquidBackgroundModule.default as LiquidBackgroundFactory);
        const app = LiquidBackground(canvas);
        liquidApp = app;

        // Load our Obsidian & Luxury Gold texture matching the login theme
        await app.loadImage("/liquid-gold.jpg");

        if (isCancelled) {
          app?.dispose?.();
          return;
        }

        // Fine-tune material reflections for Obsidian & Gold aesthetics
        if (app.liquidPlane?.material) {
          app.liquidPlane.material.metalness = 0.82;
          app.liquidPlane.material.roughness = 0.22;
        }

        if (app.liquidPlane?.uniforms?.displacementScale) {
          app.liquidPlane.uniforms.displacementScale.value = 5.0;
        }

        // Enable organic rain drops for continuous subtle fluid motion
        app.setRain(true);
        app.setRainTime(0.35);

        setIsLoaded(true);
      } catch (err) {
        console.warn("LiquidLoginBackground initialization notice:", err);
      }
    }

    init();

    return () => {
      isCancelled = true;
      try {
        liquidApp?.dispose?.();
      } catch {
        // ignore dispose issues
      }
    };
  }, []);

  return (
    <div
      className="liquid-bg-container"
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
      <canvas
        ref={canvasRef}
        id="liquid-canvas"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          filter: "brightness(0.9) contrast(1.1)",
        }}
      />
      {/* Sombra / Viñeta para crear contraste perfecto con la tarjeta de login */}
      <div
        className="liquid-bg-vignette"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(13, 12, 11, 0.58) 0%, rgba(10, 9, 8, 0.82) 65%, rgba(6, 5, 5, 0.94) 100%)",
          backdropFilter: "contrast(1.05)",
          pointerEvents: "none",
        }}
      />
      {/* Resplandor dorado sutil ambiental detrás de la tarjeta central */}
      <div
        className="liquid-bg-glow"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 90vw)",
          height: "min(600px, 90vh)",
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(197, 152, 61, 0.03) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
