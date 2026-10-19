"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { animate } from "animejs";
import { isChord, keyPrefersFlats, parseChordPro, semitonesBetween, transposeContent, transposeKey } from "@/lib/chordpro";
import {
  SlidersHorizontal,
  Save,
  Check,
  RotateCcw,
  Columns2,
  FileMusic,
  Languages,
  ScrollText,
  Type,
  Music,
} from "lucide-react";
import { updateSongKey } from "@/app/songs-actions";

export function SongBody({
  content,
  showChords = true,
  size = 18,
  twoColumns = false,
  hideTabs = false,
}: {
  content: string;
  showChords?: boolean;
  size?: number;
  twoColumns?: boolean;
  hideTabs?: boolean;
}) {
  const lines = useMemo(() => parseChordPro(content), [content]);
  let inChorus = false;
  return (
    <div className={`song ${twoColumns ? "two-cols" : ""}`} style={{ fontSize: size }}>
      {lines.map((l, i) => {
        if (l.type === "chorus") { inChorus = l.open; return null; }
        if (l.type === "blank") return <div key={i} className="song-gap" />;
        if (l.type === "comment") return <div key={i} className="song-comment">{l.text}</div>;

        // Ocultar líneas de tablatura típica de guitarra (ej: e|---, B|---, G|---, D|---, etc.)
        if (hideTabs) {
          const rawText = l.segments.map((s) => s.text).join("");
          if (/^[eEaAdDgGbB1-6]\|[-0-9pbrh~/\s|]+/.test(rawText.trim()) || /^[-\s|0-9pbrh~]{10,}$/.test(rawText.trim())) {
            return null;
          }
        }

        const hasChords = showChords && l.segments.some((s) => s.chord);
        const hasLyrics = l.segments.some((s) => s.text && s.text.trim().length > 0);
        return (
          <div key={i} className={`song-line ${inChorus ? "chorus" : ""} ${!hasLyrics ? "chord-only" : ""}`}>
            {l.segments.map((s, j) => (
              <span key={j} className="seg">
                {hasChords && (
                  <span className={`chord ${s.chord && !isChord(s.chord) ? "raw" : ""}`}>{s.chord || "\u00a0"}</span>
                )}
                {hasLyrics ? (
                  <span className="lyr">{s.text || (s.chord ? "\u00a0" : "")}</span>
                ) : s.text ? (
                  <span className="chord-spacer">{s.text}</span>
                ) : null}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

import { translateLyricsToSpanish } from "@/app/translate-action";

export default function SongViewer({
  songId,
  content,
  originalKey,
  currentKey: initialCurrentKey,
}: {
  songId?: number;
  content: string;
  originalKey: string | null;
  currentKey?: string | null;
}) {
  const savedKey = initialCurrentKey || originalKey;

  const initialSteps = useMemo(() => {
    if (!originalKey || !savedKey) return 0;
    return semitonesBetween(originalKey, savedKey);
  }, [originalKey, savedKey]);

  const [steps, setSteps] = useState(initialSteps);
  const [size, setSize] = useState(18);
  const [chords, setChords] = useState(true);
  const [twoCols, setTwoCols] = useState(false);
  const [hideTabs, setHideTabs] = useState(false);
  const [activeContent, setActiveContent] = useState(content);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0);

  const [isPending, startTransition] = useTransition();
  const [persistedKey, setPersistedKey] = useState(savedKey);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const flat = keyPrefersFlats(transposeKey(originalKey, steps) ?? undefined);
  const shown = useMemo(() => transposeContent(activeContent, steps, flat), [activeContent, steps, flat]);
  const activeKey = transposeKey(originalKey, steps);

  const bump = (d: number) => {
    setSteps((s) => (((s + d + 6) % 12) + 12) % 12 - 6);
    setSavedFeedback(false);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      animate(".key-badge", { scale: [1.3, 1], duration: 500, ease: "outElastic(1, .5)" });
  };

  const handleSaveKey = () => {
    if (!songId || !activeKey) return;
    startTransition(async () => {
      const res = await updateSongKey(songId, activeKey);
      if (res?.ok) {
        setPersistedKey(activeKey);
        setSavedFeedback(true);
        setTimeout(() => setSavedFeedback(false), 3000);
      }
    });
  };

  const handleTranslate = async () => {
    if (isTranslated) {
      // Volver a la versión original
      setActiveContent(content);
      setIsTranslated(false);
      return;
    }

    setIsTranslating(true);
    try {
      const res = await translateLyricsToSpanish(activeContent);
      if (res.ok && res.text) {
        setActiveContent(res.text);
        setIsTranslated(true);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  // Autoscroll suave
  useEffect(() => {
    if (autoScrollSpeed === 0) return;
    let animId: number;
    let lastTime = performance.now();
    const speed = autoScrollSpeed === 1 ? 16 : autoScrollSpeed === 2 ? 32 : 55;

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      window.scrollBy(0, delta * speed);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [autoScrollSpeed]);

  const isDifferentFromSaved = activeKey && activeKey !== persistedKey;

  // Extraer acordes únicos de la canción para la barra superior
  const uniqueChords = useMemo(() => {
    const found = new Set<string>();
    const matches = shown.matchAll(/\[([^\]]+)\]/g);
    for (const m of matches) {
      if (isChord(m[1].trim())) found.add(m[1].trim());
    }
    return Array.from(found);
  }, [shown]);

  return (
    <div className="cifra-layout">
      {/* PANEL LATERAL IZQUIERDO: Controles estilo CifraClub */}
      <aside className="cifra-sidebar">
        {/* Tono */}
        <div className="cifra-menu-item">
          <div className="cifra-menu-label">
            <span className="cifra-icon"><SlidersHorizontal size={17} /></span>
            <span>Tono</span>
          </div>
          <div className="cifra-key-control">
            <button className="cifra-mini-btn" onClick={() => bump(-1)} aria-label="Bajar medio tono">
              −
            </button>
            <strong className="key-badge" style={{ minWidth: "2.5ch", textAlign: "center" }}>
              {activeKey ?? "—"}
            </strong>
            <button className="cifra-mini-btn" onClick={() => bump(1)} aria-label="Subir medio tono">
              +
            </button>
          </div>
        </div>

        {/* Guardar tono / Restablecer original */}
        {originalKey && (
          <div style={{ padding: "0 0.5rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {songId && isDifferentFromSaved && activeKey && (
              <button
                className="btn small"
                onClick={handleSaveKey}
                disabled={isPending}
                style={{ width: "100%", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
              >
                <Save size={13} />
                <span>{isPending ? "Guardando…" : `Guardar tono (${activeKey})`}</span>
              </button>
            )}
            {savedFeedback && (
              <span style={{ fontSize: "0.78rem", color: "var(--ok)", textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}>
                <Check size={13} /> Guardado como activo
              </span>
            )}
            {steps !== 0 && (
              <button
                className="btn ghost small"
                onClick={() => { setSteps(0); setSavedFeedback(false); }}
                style={{ width: "100%", fontSize: "0.78rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}
              >
                <RotateCcw size={12} />
                <span>Restablecer ({originalKey})</span>
              </button>
            )}
          </div>
        )}

        <hr className="cifra-divider" />

        {/* Dividir en columnas */}
        <button
          className={`cifra-menu-btn ${twoCols ? "active" : ""}`}
          onClick={() => setTwoCols((c) => !c)}
        >
          <span className="cifra-icon"><Columns2 size={17} /></span>
          <span className="grow text-left">Dividir en columnas</span>
          <span className="cifra-status">{twoCols ? "2 Col" : "1 Col"}</span>
        </button>

        {/* Ocultar tablaturas */}
        <button
          className={`cifra-menu-btn ${hideTabs ? "active" : ""}`}
          onClick={() => setHideTabs((h) => !h)}
        >
          <span className="cifra-icon"><FileMusic size={17} /></span>
          <span className="grow text-left">Tablaturas</span>
          <span className="cifra-status">{hideTabs ? "Ocultas" : "Visibles"}</span>
        </button>

        {/* Traducir a Español */}
        <button
          className={`cifra-menu-btn ${isTranslated ? "active" : ""}`}
          onClick={handleTranslate}
          disabled={isTranslating}
        >
          <span className="cifra-icon"><Languages size={17} /></span>
          <span className="grow text-left">Traducir a español</span>
          <span className="cifra-status">
            {isTranslating ? "Traduciendo…" : isTranslated ? "Original ↩" : "Traducir"}
          </span>
        </button>

        {/* Desplazamiento automático */}
        <button
          className={`cifra-menu-btn ${autoScrollSpeed > 0 ? "active" : ""}`}
          onClick={() => setAutoScrollSpeed((s) => (s + 1) % 4)}
        >
          <span className="cifra-icon"><ScrollText size={17} /></span>
          <span className="grow text-left">Desplazar</span>
          <span className="cifra-status">
            {autoScrollSpeed === 0 ? "Off" : `${autoScrollSpeed}x`}
          </span>
        </button>

        {/* Tamaño de texto */}
        <div className="cifra-menu-item">
          <div className="cifra-menu-label">
            <span className="cifra-icon"><Type size={17} /></span>
            <span>Tamaño letra</span>
          </div>
          <div className="row" style={{ gap: "0.25rem" }}>
            <button className="cifra-mini-btn" onClick={() => setSize((s) => Math.max(12, s - 2))}>
              A−
            </button>
            <button className="cifra-mini-btn" onClick={() => setSize((s) => Math.min(42, s + 2))}>
              A+
            </button>
          </div>
        </div>

        {/* Alternar Acordes */}
        <button
          className={`cifra-menu-btn ${chords ? "active" : ""}`}
          onClick={() => setChords((c) => !c)}
        >
          <span className="cifra-icon"><Music size={17} /></span>
          <span className="grow text-left">Cifrado de acordes</span>
          <span className="cifra-status">{chords ? "Visible" : "Oculto"}</span>
        </button>
      </aside>

      {/* ÁREA PRINCIPAL: Canción y Acordes */}
      <main className="cifra-main">
        {/* Chips de Acordes Usados en la Canción */}
        {chords && uniqueChords.length > 0 && (
          <div className="cifra-chords-bar">
            <span className="muted" style={{ fontSize: "0.8rem", marginRight: "0.5rem" }}>
              Acordes:
            </span>
            {uniqueChords.map((chord) => (
              <span key={chord} className="cifra-chord-chip">
                {chord}
              </span>
            ))}
          </div>
        )}

        {isTranslated && (
          <div className="alert ok" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Languages size={17} />
            <span>Letra traducida al español (los acordes se mantienen intactos en su posición).</span>
          </div>
        )}

        <div className="card" style={{ padding: "1.75rem", background: "rgba(18, 19, 38, 0.7)" }}>
          <SongBody
            content={shown}
            showChords={chords}
            size={size}
            twoColumns={twoCols}
            hideTabs={hideTabs}
          />
        </div>
      </main>
    </div>
  );
}
