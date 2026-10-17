"use client";

import { useActionState, useRef, useState } from "react";
import { saveSong, importSongFromUrl } from "@/app/songs-actions";
import { SongBody } from "@/components/SongViewer";
import { KEYS, convertChordsOverLyrics, diatonicChords } from "@/lib/chordpro";

type Song = {
  id?: number; title?: string; artist?: string | null; originalKey?: string | null;
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
  const [key, setKey] = useState(song?.originalKey ?? "");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);

  const handleImport = async () => {
    if (!importUrl.trim()) return;
    setImporting(true);
    setImportError("");
    try {
      const res = await importSongFromUrl(importUrl.trim());
      if (res.ok && res.song) {
        setTitle(res.song.title);
        setArtist(res.song.artist);
        if (res.song.originalKey) setKey(res.song.originalKey);
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

  const chords = diatonicChords(key || null);

  return (
    <form action={action} className="stack">
      {song?.id && <input type="hidden" name="id" value={song.id} />}

      {/* Importador Rápido por URL */}
      {!song?.id && (
        <section className="card stack" style={{ background: "rgba(139, 123, 255, 0.08)", borderColor: "rgba(139, 123, 255, 0.3)" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <strong>🌐 Importar desde URL</strong>
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
            >
              {importing ? "Importando…" : "Importar"}
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
            <label htmlFor="originalKey">Tono original</label>
            <select id="originalKey" name="originalKey" className="input" value={key} onChange={(e) => setKey(e.target.value)}>
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
            <button type="button" className={tab === "edit" ? "on" : ""} onClick={() => setTab("edit")}>Editar</button>
            <button type="button" className={tab === "preview" ? "on" : ""} onClick={() => setTab("preview")}>Vista previa</button>
          </div>
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
        <button className="btn" disabled={pending}>{pending ? "Guardando…" : "Guardar canción"}</button>
      </div>
    </form>
  );
}
