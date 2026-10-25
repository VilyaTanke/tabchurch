"use client";

import { useActionState, useRef, useState } from "react";
import { Globe, Download, Edit3, Eye, Save, SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { saveSong, importSongFromUrl } from "@/app/songs-actions";
import { SongBody } from "@/components/SongViewer";
import {
  KEYS,
  convertChordsOverLyrics,
  diatonicChords,
  transposeContent,
  transposeKey,
  semitonesBetween,
  keyPrefersFlats,
} from "@/lib/chordpro";

type Song = {
  id?: number; title?: string; artist?: string | null; originalKey?: string | null; currentKey?: string | null;
  tempo?: number | null; contentChordpro?: string; notes?: string | null;
};

const EXAMPLE = `{c: Verso 1}
[C]Sublime [G]gracia del [Am]Señor
Que a un [F]infeliz [C]salvó

{soc}
[F]Cuán dulce el [C]soni[G]do
{eoc}
`;

export default function SongEditor({ song }: { song?: Song }) {
  const [state, action, pending] = useActionState(saveSong, undefined);
  const [title, setTitle] = useState(song?.title ?? "");
  const [artist, setArtist] = useState(song?.artist ?? "");
  const [content, setContent] = useState(song?.contentChordpro ?? "");
  const [origKey, setOrigKey] = useState(song?.originalKey ?? "");
  const [currKey, setCurrKey] = useState(song?.currentKey || song?.originalKey || "");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [transposeFeedback, setTransposeFeedback] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);

  const handleTransposeStep = (delta: number) => {
    const fromKey = currKey || origKey || "C";
    const targetKey = transposeKey(fromKey, delta);
    if (!targetKey) return;
    const flat = keyPrefersFlats(targetKey);
    const newContent = transposeContent(content, delta, flat);
    setContent(newContent);
    setCurrKey(targetKey);
    if (!origKey) setOrigKey(fromKey);
    setTransposeFeedback(`Cifrado transpuesto a ${targetKey}`);
    setTimeout(() => setTransposeFeedback(""), 2500);
  };

  const handleTransposeTo = (targetKey: string) => {
    if (!targetKey) return;
    const fromKey = currKey || origKey || "C";
    const steps = semitonesBetween(fromKey, targetKey);
    if (steps === 0) return;
    const flat = keyPrefersFlats(targetKey);
    const newContent = transposeContent(content, steps, flat);
    setContent(newContent);
    setCurrKey(targetKey);
    if (!origKey) setOrigKey(fromKey);
    setTransposeFeedback(`Cifrado transpuesto a ${targetKey}`);
    setTimeout(() => setTransposeFeedback(""), 2500);
  };

  const handleImport = async () => {
    if (!importUrl.trim()) return;
    setImporting(true);
    setImportError("");
    try {
      const res = await importSongFromUrl(importUrl.trim());
      if (res.ok && res.song) {
        setTitle(res.song.title);
        setArtist(res.song.artist);
        if (res.song.originalKey) {
          setOrigKey(res.song.originalKey);
          setCurrKey(res.song.originalKey);
        }
        setContent(res.song.contentChordpro);
        setImportUrl("");
      } else {
        setImportError(res.error || "No se pudo extraer la canción");
      }
    } catch (e: any) {
      setImportError("Error de conexión al importar");
    } finally {
      setImporting(false);
    }
  };

  const insert = (text: string, caret = text.length) => {
    const el = ta.current;
    if (!el) return setContent((c) => c + text);
    const { selectionStart: s, selectionEnd: e } = el;
    const next = content.slice(0, s) + text + content.slice(e);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + caret, s + caret);
    });
  };

  const wrapSelection = () => {
    const el = ta.current;
    if (!el) return;
    const sel = content.slice(el.selectionStart, el.selectionEnd);
    insert(`[${sel}]`, sel ? sel.length + 2 : 1);
  };

  const chords = diatonicChords(currKey || origKey || null);

  return (
    <form action={action} className="stack">
      {song?.id && <input type="hidden" name="id" value={song.id} />}

      {/* Importador Rápido por URL */}
      {!song?.id && (
        <section className="card stack" style={{ background: "rgba(223, 186, 115, 0.08)", borderColor: "rgba(212, 175, 55, 0.3)" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <strong style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                <Globe size={18} />
                <span>Importar desde URL</span>
              </strong>
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                Pega el enlace de una canción (ej: CifraClub) y extraeremos título, artista y acordes automáticamente.
              </p>
            </div>
          </div>
          <div className="row">
            <input
              type="url"
              className="input grow"
              placeholder="https://www.cifraclub.com/artista/cancion/"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              disabled={importing}
            />
            <button
              type="button"
              className="btn"
              onClick={handleImport}
              disabled={importing || !importUrl.trim()}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Download size={14} />
              <span>{importing ? "Importando…" : "Importar"}</span>
            </button>
          </div>
          {importError && <div className="alert error">{importError}</div>}
        </section>
      )}

      <section className="card stack">
        <div className="grid two">
          <div className="field">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              className="input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="artist">Artista / Autor</label>
            <input
              id="artist"
              name="artist"
              className="input"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="currentKey">Tono actual (de uso)</label>
            <select
              id="currentKey"
              name="currentKey"
              className="input"
              value={currKey}
              onChange={(e) => {
                setCurrKey(e.target.value);
                if (!origKey) setOrigKey(e.target.value);
              }}
            >
              <option value="">— sin definir —</option>
              {KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="originalKey">
              Tono original {origKey && currKey && origKey !== currKey ? `(Original: ${origKey})` : ""}
            </label>
            <select
              id="originalKey"
              name="originalKey"
              className="input"
              value={origKey}
              onChange={(e) => {
                setOrigKey(e.target.value);
                if (!currKey) setCurrKey(e.target.value);
              }}
            >
              <option value="">— sin definir —</option>
              {KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tempo">Tempo (BPM)</label>
            <input id="tempo" name="tempo" type="number" min={30} max={300} className="input" defaultValue={song?.tempo ?? ""} />
          </div>
        </div>
      </section>

      <section className="card stack">
        <div className="row">
          <h2 className="grow">Cifrado</h2>
          <div className="seg-toggle">
            <button
              type="button"
              className={tab === "edit" ? "on" : ""}
              onClick={() => setTab("edit")}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            >
              <Edit3 size={13} />
              <span>Editar</span>
            </button>
            <button
              type="button"
              className={tab === "preview" ? "on" : ""}
              onClick={() => setTab("preview")}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            >
              <Eye size={13} />
              <span>Vista previa</span>
            </button>
          </div>
        </div>

        {/* Barra de Transposición de Tonalidad del Cifrado */}
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.55rem 0.85rem",
            background: "rgba(223, 186, 115, 0.09)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "12px",
            flexWrap: "wrap",
            gap: "0.65rem",
          }}
        >
          <div className="row" style={{ gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <SlidersHorizontal size={15} />
              <span>Transponer acordes:</span>
            </span>

            {/* Controles de tono paso a paso (- / + semitono) */}
            <div className="zmp-key-control">
              <button
                type="button"
                className="zmp-key-btn"
                onClick={() => handleTransposeStep(-1)}
                title="Bajar medio tono (-1 semitono a todos los acordes)"
                aria-label="Bajar medio tono"
              >
                −
              </button>
              <div
                className="zmp-key-display"
                style={{ cursor: "default" }}
                title={`Tono actual del cifrado: ${currKey || "—"}`}
              >
                <span className="zmp-key-text">{currKey || "—"}</span>
              </div>
              <button
                type="button"
                className="zmp-key-btn"
                onClick={() => handleTransposeStep(1)}
                title="Subir medio tono (+1 semitono a todos los acordes)"
                aria-label="Subir medio tono"
              >
                +
              </button>
            </div>

            {/* Selector directo de tono destino */}
            <div className="row" style={{ gap: "0.35rem", alignItems: "center" }}>
              <span className="muted" style={{ fontSize: "0.8rem" }}>a:</span>
              <select
                className="key-select"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.2rem 0.5rem",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
                value={currKey}
                onChange={(e) => handleTransposeTo(e.target.value)}
                aria-label="Transponer cifrado directamente a otro tono"
                title="Elige un tono para transponer todos los acordes automáticamente"
              >
                <option value="" disabled>Seleccionar tono…</option>
                {KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k} {origKey && k === origKey ? "(original)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón para restablecer al tono original si está transpuesto */}
            {origKey && currKey && origKey !== currKey && (
              <button
                type="button"
                className="btn ghost small"
                onClick={() => handleTransposeTo(origKey)}
                style={{ fontSize: "0.78rem", padding: "0.2rem 0.55rem" }}
                title={`Restablecer acordes al tono original (${origKey})`}
              >
                <RotateCcw size={12} style={{ marginRight: "3px" }} />
                <span>Restablecer ({origKey})</span>
              </button>
            )}
          </div>

          {/* Notificación de transposición */}
          {transposeFeedback && (
            <span
              className="badge"
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "#059669",
                fontSize: "0.78rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Check size={13} />
              <span>{transposeFeedback}</span>
            </span>
          )}
        </div>

        <div className="chip-bar" role="toolbar" aria-label="Insertar acordes">
          {chords.map((c) => (
            <button type="button" key={c} className="chip" onClick={() => insert(`[${c}]`)}>{c}</button>
          ))}
          <button type="button" className="chip alt" onClick={wrapSelection}>[ ] selección</button>
          <button type="button" className="chip alt" onClick={() => insert("{c: Verso}\n")}>Verso</button>
          <button type="button" className="chip alt" onClick={() => insert("{soc}\n\n{eoc}\n", 6)}>Coro</button>
          <button
            type="button" className="chip alt"
            title="Convierte líneas de acordes situadas encima de la letra"
            onClick={() => setContent(convertChordsOverLyrics(content))}
          >
            Acordes arriba → ChordPro
          </button>
          {!content && <button type="button" className="chip alt" onClick={() => setContent(EXAMPLE)}>Ejemplo</button>}
        </div>

        <div className={`editor-split show-${tab}`}>
          <textarea
            ref={ta} name="content" className="input editor" value={content}
            onChange={(e) => setContent(e.target.value)} spellCheck={false}
            placeholder={"Escribe con acordes entre corchetes:\n[C]Sublime [G]gracia\n\nO pega letra con acordes arriba y pulsa «Acordes arriba → ChordPro»."}
          />
          <div className="preview">
            {content.trim() ? <SongBody content={content} size={16} /> : <p className="muted">La vista previa aparecerá aquí.</p>}
          </div>
        </div>
      </section>

      <section className="card stack">
        <div className="field">
          <label htmlFor="notes">Notas (intro, dinámica, estructura…)</label>
          <textarea id="notes" name="notes" rows={3} className="input" style={{ padding: "0.75rem 1rem" }} defaultValue={song?.notes ?? ""} />
        </div>
      </section>

      {state?.error && <div className="alert error" role="alert">{state.error}</div>}
      <div className="row">
        <button
          className="btn"
          disabled={pending}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          <Save size={16} />
          <span>{pending ? "Guardando…" : "Guardar canción"}</span>
        </button>
      </div>
    </form>
  );
}
