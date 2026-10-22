"use client";

import { useEffect, useState } from "react";
import { Tablet, Check, ZoomIn } from "lucide-react";
import {
  type ReadingScale,
  getStoredReadingScale,
  setReadingScale,
} from "./DeviceDetector";

export default function ReadingScaleControl() {
  const [scale, setScaleState] = useState<ReadingScale>("normal");
  const [isTablet, setIsTablet] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Inicializar estado
    const docScale = document.documentElement.getAttribute("data-reading-scale") as ReadingScale;
    const device = document.documentElement.getAttribute("data-device");
    setIsTablet(device === "tablet");
    if (docScale === "comfort" || docScale === "large" || docScale === "normal") {
      setScaleState(docScale);
    } else {
      const stored = getStoredReadingScale();
      if (stored) setScaleState(stored);
      else if (device === "tablet") setScaleState("comfort");
    }

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<ReadingScale>;
      if (customEvent.detail) setScaleState(customEvent.detail);
    };

    window.addEventListener("reading-scale-changed", handleChange);
    return () => window.removeEventListener("reading-scale-changed", handleChange);
  }, []);

  const selectScale = (newScale: ReadingScale) => {
    setScaleState(newScale);
    setReadingScale(newScale);
    setOpen(false);
  };

  const scaleLabels: Record<ReadingScale, { label: string; desc: string }> = {
    normal: { label: "Normal (100%)", desc: "Estándar compacto" },
    comfort: { label: "Cómodo (115%)", desc: "Optimizado para Tablet" },
    large: { label: "Atril (130%)", desc: "Grande para leer a distancia" },
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        className="btn ghost small"
        onClick={() => setOpen((prev) => !prev)}
        title="Ajustar tamaño y escala de lectura"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          borderColor: scale !== "normal" ? "rgba(180, 83, 9, 0.4)" : undefined,
          background: scale !== "normal" ? "rgba(180, 83, 9, 0.08)" : undefined,
          color: scale !== "normal" ? "var(--accent)" : undefined,
        }}
        aria-label="Escala de lectura y tamaño"
        aria-expanded={open}
      >
        {isTablet ? <Tablet size={15} /> : <ZoomIn size={15} />}
        <span>
          {scale === "comfort" ? "Escala: Cómoda" : scale === "large" ? "Escala: Grande" : "Escala: Normal"}
        </span>
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 60 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 6px)",
              zIndex: 70,
              width: "250px",
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "0.5rem",
              boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
            }}
          >
            <div
              style={{
                fontSize: "0.76rem",
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "0.4rem 0.6rem 0.2rem",
              }}
            >
              {isTablet ? "Dispositivo Tablet detectado" : "Escala de lectura"}
            </div>

            {(["normal", "comfort", "large"] as ReadingScale[]).map((key) => {
              const active = scale === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectScale(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "10px",
                    border: "0",
                    background: active ? "rgba(223, 186, 115, 0.15)" : "transparent",
                    color: active ? "var(--primary)" : "var(--text)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: active ? 700 : 500, fontSize: "0.88rem" }}>
                      {scaleLabels[key].label}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
                      {scaleLabels[key].desc}
                    </div>
                  </div>
                  {active && <Check size={16} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
