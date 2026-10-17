"use client";

import { useMemo, useState } from "react";
import { animate } from "animejs";
import { isChord, keyPrefersFlats, parseChordPro, transposeContent, transposeKey } from "@/lib/chordpro";

export function SongBody({
  content, showChords = true, size = 18,
}: { content: string; showChords?: boolean; size?: number }) {
  const lines = useMemo(() => parseChordPro(content), [content]);
  let inChorus = false;
  return (
    <div className="song" style={{ fontSize: size }}>
      {lines.map((l, i) => {
        if (l.type === "chorus") { inChorus = l.open; return null; }
        if (l.type === "blank") return <div key={i} className="song-gap" />;
        if (l.type === "comment") return <div key={i} className="song-comment">{l.text}</div>;
        const hasChords = showChords && l.segments.some((s) => s.chord);
        return (
          <div key={i} className={`song-line ${inChorus ? "chorus" : ""}`}>
            {l.segments.map((s, j) => (
              <span key={j} className="seg">
                {hasChords && (
                  <span className={`chord ${s.chord && !isChord(s.chord) ? "raw" : ""}`}>{s.chord || "\u00a0"}</span>
                )}
                <span className="lyr">{s.text || (s.chord ? "\u00a0" : "")}</span>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function SongViewer({
  content, originalKey,
}: { content: string; originalKey: string | null }) {
  const [steps, setSteps] = useState(0);
  const [size, setSize] = useState(18);
  const [chords, setChords] = useState(true);
  const flat = keyPrefersFlats(transposeKey(originalKey, steps) ?? undefined);
  const shown = useMemo(() => transposeContent(content, steps, flat), [content, steps, flat]);
  const key = transposeKey(originalKey, steps);

  const bump = (d: number) => {
    setSteps((s) => (((s + d + 6) % 12) + 12) % 12 - 6);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      animate(".key-badge", { scale: [1.3, 1], duration: 500, ease: "outElastic(1, .5)" });
  };

  return (
    <div className="stack">
      <div className="toolbar card">
        <div className="row">
          <span className="muted">Tono</span>
          <button className="btn ghost small" onClick={() => bump(-1)} aria-label="Bajar medio tono">−</button>
          <strong className="key-badge">{key ?? "—"}</strong>
          <button className="btn ghost small" onClick={() => bump(1)} aria-label="Subir medio tono">+</button>
          {steps !== 0 && (
            <button className="btn ghost small" onClick={() => setSteps(0)}>
              Original ({originalKey})
            </button>
          )}
        </div>
        <div className="row">
          <button className="btn ghost small" onClick={() => setSize((s) => Math.max(12, s - 2))} aria-label="Letra más pequeña">A−</button>
          <button className="btn ghost small" onClick={() => setSize((s) => Math.min(40, s + 2))} aria-label="Letra más grande">A+</button>
          <button className={`btn small ${chords ? "" : "ghost"}`} onClick={() => setChords((c) => !c)}>
            {chords ? "Acordes ✓" : "Acordes"}
          </button>
        </div>
      </div>
      <div className="card"><SongBody content={shown} showChords={chords} size={size} /></div>
    </div>
  );
}
