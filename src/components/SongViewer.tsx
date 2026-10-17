"use client";

import { useMemo, useState, useTransition } from "react";
import { animate } from "animejs";
import { isChord, keyPrefersFlats, parseChordPro, semitonesBetween, transposeContent, transposeKey } from "@/lib/chordpro";
import { updateSongKey } from "@/app/songs-actions";

export function SongBody({
  content,
  showChords = true,
  size = 18,
  twoColumns = false,
}: {
  content: string;
  showChords?: boolean;
  size?: number;
  twoColumns?: boolean;
}) {
  const lines = useMemo(() => parseChordPro(content), [content]);
  let inChorus = false;
  return (
    <div className={`song ${twoColumns ? "two-cols" : ""}`} style={{ fontSize: size }}>
      {lines.map((l, i) => {
        if (l.type === "chorus") { inChorus = l.open; return null; }
        if (l.type === "blank") return <div key={i} className="song-gap" />;
        if (l.type === "comment") return <div key={i} className="song-comment">{l.text}</div>;
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
  const [isPending, startTransition] = useTransition();
  const [persistedKey, setPersistedKey] = useState(savedKey);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const flat = keyPrefersFlats(transposeKey(originalKey, steps) ?? undefined);
  const shown = useMemo(() => transposeContent(content, steps, flat), [content, steps, flat]);
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

  const isDifferentFromSaved = activeKey && activeKey !== persistedKey;

  return (
    <div className="stack">
      <div className="toolbar card">
        <div className="row" style={{ alignItems: "center" }}>
          <span className="muted">Tono</span>
          <button className="btn ghost small" onClick={() => bump(-1)} aria-label="Bajar medio tono">−</button>
          <strong className="key-badge">{activeKey ?? "—"}</strong>
          <button className="btn ghost small" onClick={() => bump(1)} aria-label="Subir medio tono">+</button>

          {/* Mensaje indicador del tono original */}
          {originalKey && (
            <span
              className="badge"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: activeKey === originalKey ? "var(--muted)" : "var(--accent)",
                padding: "0.25rem 0.55rem",
                fontSize: "0.8rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
              title="Tono original de la canción"
            >
              Original: {originalKey}
            </span>
          )}

          {/* Botón para volver al tono original */}
          {steps !== 0 && originalKey && (
            <button
              type="button"
              className="btn ghost small"
              onClick={() => {
                setSteps(0);
                setSavedFeedback(false);
              }}
              title={`Volver al tono original (${originalKey})`}
            >
              Restablecer original
            </button>
          )}

          {/* Botón para guardar el tono modificado */}
          {songId && isDifferentFromSaved && activeKey && (
            <button
              type="button"
              className="btn small"
              onClick={handleSaveKey}
              disabled={isPending}
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-2))",
                boxShadow: "0 2px 10px rgba(139, 123, 255, 0.35)",
              }}
              title="Guardar este tono como el tono activo de la canción"
            >
              {isPending ? "Guardando…" : `💾 Guardar tono (${activeKey})`}
            </button>
          )}
          {savedFeedback && (
            <span style={{ fontSize: "0.8rem", color: "var(--ok)", fontWeight: 600 }}>✓ Tono guardado</span>
          )}
        </div>

        <div className="row">
          <button
            type="button"
            className={`btn small ${twoCols ? "" : "ghost"}`}
            onClick={() => setTwoCols((c) => !c)}
            title="Alternar entre 1 y 2 columnas"
          >
            {twoCols ? "2 Columnas ✓" : "2 Columnas"}
          </button>
          <button className="btn ghost small" onClick={() => setSize((s) => Math.max(12, s - 2))} aria-label="Letra más pequeña">A−</button>
          <button className="btn ghost small" onClick={() => setSize((s) => Math.min(40, s + 2))} aria-label="Letra más grande">A+</button>
          <button className={`btn small ${chords ? "" : "ghost"}`} onClick={() => setChords((c) => !c)}>
            {chords ? "Acordes ✓" : "Acordes"}
          </button>
        </div>
      </div>

      <div className="card">
        <SongBody content={shown} showChords={chords} size={size} twoColumns={twoCols} />
      </div>
    </div>
  );
}
