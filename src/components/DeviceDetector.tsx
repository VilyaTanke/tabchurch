"use client";

import { useEffect } from "react";

export type DeviceType = "tablet" | "mobile" | "desktop";
export type ReadingScale = "normal" | "comfort" | "large";

export const READING_SCALE_KEY = "tabchurch_reading_scale";

export function getStoredReadingScale(): ReadingScale | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(READING_SCALE_KEY);
  if (val === "normal" || val === "comfort" || val === "large") return val;
  return null;
}

export function setReadingScale(scale: ReadingScale) {
  if (typeof window === "undefined") return;
  localStorage.setItem(READING_SCALE_KEY, scale);
  document.documentElement.setAttribute("data-reading-scale", scale);
  window.dispatchEvent(new CustomEvent("reading-scale-changed", { detail: scale }));
}

export default function DeviceDetector() {
  useEffect(() => {
    function detect() {
      const doc = document.documentElement;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const minDim = Math.min(width, height);
      const maxDim = Math.max(width, height);

      // 1. Detección de soporte táctil / puntero grueso
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

      // 2. Detección de User-Agent de tablets comunes (iPad, Android tablet, etc.)
      const ua = navigator.userAgent.toLowerCase();
      const isTabletUA =
        /ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk/i.test(
          ua
        ) ||
        // iPad Pro con iPadOS se reporta a veces como Macintosh con maxTouchPoints > 1
        (ua.includes("macintosh") && navigator.maxTouchPoints > 1);

      // 3. Heurística de dimensiones de pantalla para Tablets (600px a 1366px con táctil o aspect ratio)
      const isTabletDimensions =
        hasTouch && minDim >= 600 && maxDim <= 1366;

      let device: DeviceType = "desktop";
      if (isTabletUA || isTabletDimensions) {
        device = "tablet";
      } else if (width < 640 || (hasTouch && minDim < 600)) {
        device = "mobile";
      } else {
        device = "desktop";
      }

      // Orientación
      const orientation = width >= height ? "landscape" : "portrait";
      const pixelRatio = window.devicePixelRatio || 1;

      // Atributos en <html> para que CSS y componentes reaccionen
      doc.setAttribute("data-device", device);
      doc.setAttribute("data-touch", hasTouch ? "true" : "false");
      doc.setAttribute("data-orientation", orientation);
      doc.setAttribute("data-dpr", pixelRatio >= 2 ? "high" : "normal");

      // Escala de lectura: si el usuario no eligió ninguna manualmente,
      // en tablets se asigna 'comfort' por defecto para una lectura óptima a distancia de atril
      const storedScale = getStoredReadingScale();
      if (storedScale) {
        doc.setAttribute("data-reading-scale", storedScale);
      } else if (device === "tablet") {
        doc.setAttribute("data-reading-scale", "comfort");
      } else {
        doc.setAttribute("data-reading-scale", "normal");
      }

      // Variables CSS dinámicas para altura y ancho de viewport real
      doc.style.setProperty("--vw", `${width * 0.01}px`);
      doc.style.setProperty("--vh", `${height * 0.01}px`);
    }

    detect();

    let timer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(detect, 150);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return null;
}
