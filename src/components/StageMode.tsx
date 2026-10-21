"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  isChord,
  keyPrefersFlats,
  parseChordPro,
  semitonesBetween,
  transposeContent,
  transposeKey,
} from "@/lib/chordpro";
import {
  X,
  ScrollText,
  Columns2,
  SunMedium,
  ChevronLeft,
  ChevronRight,
  FileMusic,
  Save,
  Check,
} from "lucide-react";
import { SongBody } from "@/components/SongViewer";
import { updateSetlistItemConfig } from "@/app/setlists-actions";

type StageSong = {
  id: number;
  itemId?: number;
  title: string;
  artist: string | null;
  originalKey: string | null;
  currentKey?: string | null;
  keyOverride: string | null;
  contentChordpro: string;
  notes: string | null;
  tempo: number | null;
};

export default function StageMode({
  songs,
  setlistName,
  setlistId,
}: {
  songs: StageSong[];
  setlistName: string;
  setlistId: number;
}) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(22);
  const [showChords, setShowChords] = useState(true);
  const [hideTabs, setHideTabs] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0); // 0 = off, 1 = lento, 2 = normal, 3 = rapido
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [twoColumns, setTwoColumns] = useState(false);
  const [isSaving, startSave] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const song = songs[index];

  // Cálculo de tono inicial basado en keyOverride, currentKey o originalKey
  const initialTargetKey = song?.keyOverride || song?.currentKey || song?.originalKey || null;
  const initialSteps = useMemo(() => {
    if (!song?.originalKey || !initialTargetKey) return 0;
    return semitonesBetween(song.originalKey, initialTargetKey);
  }, [song, initialTargetKey]);

  const [stepOffset, setStepOffset] = useState(0);

  // Reiniciar offset al cambiar de canción
  useEffect(() => {
    setStepOffset(0);
    setSavedSuccess(false);
  }, [index]);

  const handleSaveToSetlist = () => {
    if (!song?.itemId || !currentKey) return;
    startSave(async () => {
      await updateSetlistItemConfig(setlistId, song.itemId!, {
        keyOverride: currentKey,
      });
      song.keyOverride = currentKey;
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    });
  };

  const totalSteps = initialSteps + stepOffset;
  const flat = keyPrefersFlats(transposeKey(song?.originalKey, totalSteps) ?? undefined);
  const currentKey = transposeKey(song?.originalKey, totalSteps);
  const transposedContent = useMemo(() => {
    if (!song) return "";
    return transposeContent(song.contentChordpro, totalSteps, flat);
  }, [song, totalSteps, flat]);

  // Pantalla siempre encendida (Wake Lock API)
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await (navigator as any).wakeLock.request("screen");
          setWakeLockActive(true);
          wakeLock.addEventListener("release", () => {
            setWakeLockActive(false);
          });
        }
      } catch (err) {
        console.warn("Wake Lock error:", err);
      }
    };
    requestWakeLock();
    return () => {
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, []);

  // Autoscroll suave
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (autoScrollSpeed === 0) return;
    let animId: number;
    let lastTime = performance.now();

    const pixelsPerSec = autoScrollSpeed === 1 ? 16 : autoScrollSpeed === 2 ? 30 : 50;

    const scrollStep = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (scrollRef.current) {
        scrollRef.current.scrollTop += delta * pixelsPerSec;
      }
      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [autoScrollSpeed]);

  // Navegación por teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setIndex((i) => Math.min(songs.length - 1, i + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === " ") {
        // Espacio alterna autoscroll
        e.preventDefault();
        setAutoScrollSpeed((s) => (s === 0 ? 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [songs.length]);

  if (!song) {
    return (
      <div className="stage-wrap">
        <div className="card" style={{ textAlign: "center", margin: "auto" }}>
          <h2>No hay canciones en la lista</h2>
          <Link href={`/listas/${setlistId}`} className="btn" style={{ marginTop: "1rem" }}>
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stage-wrap">
      {/* Barra superior de control */}
      <header className="stage-bar">
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <Link
            href={`/listas/${setlistId}`}
            className="stage-btn"
            title="Salir del modo escenario"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <X size={15} />
            <span>Salir</span>
          </Link>
          <div className="stage-info ellipsis">
            <span className="stage-title">{song.title}</span>
            <span className="muted" style={{ fontSize: "0.85rem", marginLeft: "0.5rem" }}>
              ({index + 1}/{songs.length})
            </span>
          </div>
        </div>

        {/* Controles de tono y visualización */}
        <div className="row stage-controls">
          <div className="stage-group">
            <button
              className="stage-btn small"
              onClick={() => setStepOffset((s) => s - 1)}
              title="Bajar medio tono"
            >
              −
            </button>
            <span className="stage-key">{currentKey || "—"}</span>
            <button
              className="stage-btn small"
              onClick={() => setStepOffset((s) => s + 1)}
              title="Subir medio tono"
            >
              +
            </button>
            {song.itemId && (
              <button
                className={`stage-btn small ${savedSuccess ? "active" : ""}`}
                onClick={handleSaveToSetlist}
                disabled={isSaving}
                title="Guardar tono de esta canción en la lista personalizada"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  marginLeft: "0.2rem",
                  color: savedSuccess ? "#10b981" : undefined,
                  borderColor: savedSuccess ? "#10b981" : undefined,
                }}
              >
                {savedSuccess ? <Check size={13} /> : <Save size={13} />}
                <span>{savedSuccess ? "Guardado" : "Guardar tono"}</span>
              </button>
            )}
          </div>

          <div className="stage-group">
            <button
              className="stage-btn small"
              onClick={() => setSize((s) => Math.max(14, s - 2))}
              title="Reducir letra"
            >
              A−
            </button>
            <button
              className="stage-btn small"
              onClick={() => setSize((s) => Math.min(48, s + 2))}
              title="Aumentar letra"
            >
              A+
            </button>
          </div>

          <button
            className={`stage-btn small ${showChords ? "active" : ""}`}
            onClick={() => setShowChords((c) => !c)}
            title="Alternar cifrado/letra"
          >
            {showChords ? "Acordes" : "Solo letra"}
          </button>

          <button
            className={`stage-btn small ${hideTabs ? "active" : ""}`}
            onClick={() => setHideTabs((h) => !h)}
            title={hideTabs ? "Mostrar tablaturas" : "Ocultar tablaturas de guitarra"}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            <FileMusic size={14} />
            <span>{hideTabs ? "Sin Tabs" : "Tabs"}</span>
          </button>

          <button
            className={`stage-btn small ${autoScrollSpeed > 0 ? "active" : ""}`}
            onClick={() => setAutoScrollSpeed((s) => (s + 1) % 4)}
            title="Velocidad de desplazamiento automático"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <ScrollText size={14} />
            <span>{autoScrollSpeed === 0 ? "Scroll" : `${autoScrollSpeed}x`}</span>
          </button>

          <button
            className={`stage-btn small ${twoColumns ? "active" : ""}`}
            onClick={() => setTwoColumns((c) => !c)}
            title="2 Columnas (tablets / pantalla ancha)"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <Columns2 size={16} />
          </button>

          {wakeLockActive && (
            <span
              className="badge admin"
              style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
              title="Pantalla activa"
            >
              <SunMedium size={12} /> ON
            </span>
          )}
        </div>
      </header>

      {/* Contenido scrolleable de la canción */}
      <main
        className={`stage-content ${twoColumns ? "two-cols" : ""}`}
        ref={scrollRef}
      >
        {song.notes && (
          <div className="stage-notes">
            <strong>Notas:</strong> {song.notes}
          </div>
        )}
        <SongBody
          content={transposedContent}
          showChords={showChords}
          size={size}
          twoColumns={twoColumns}
          hideTabs={hideTabs}
        />
      </main>

      {/* Barra de navegación inferior entre canciones */}
      <footer className="stage-footer">
        <button
          className="stage-nav-btn"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
          }}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}
        >
          <ChevronLeft size={16} />
          <span>Anterior</span>
        </button>

        <div className="stage-selector">
          <select
            className="stage-select"
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              if (scrollRef.current) scrollRef.current.scrollTop = 0;
            }}
          >
            {songs.map((s, idx) => (
              <option key={s.id} value={idx}>
                {idx + 1}. {s.title} ({s.keyOverride || s.originalKey || "—"})
              </option>
            ))}
          </select>
        </div>

        <button
          className="stage-nav-btn"
          disabled={index === songs.length - 1}
          onClick={() => {
            setIndex((i) => Math.min(songs.length - 1, i + 1));
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
          }}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}
        >
          <span>Siguiente</span>
          <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
}
