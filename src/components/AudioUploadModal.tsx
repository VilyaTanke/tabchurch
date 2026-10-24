"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Sparkles, FileAudio } from "lucide-react";
import { KEYS } from "@/lib/chordpro";
import { DEFAULT_STEM_MODEL, STEM_MODELS } from "@/lib/stems";

interface SongOption {
  id: number;
  title: string;
  artist: string | null;
  key: string | null;
  bpm: number | null;
}

export default function AudioUploadModal({
  songs,
  isOpen,
  onClose,
}: {
  songs: SongOption[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<string>("");
  const [musicalKey, setMusicalKey] = useState<string>("");
  const [bpm, setBpm] = useState<string>("");
  const [autoSeparate, setAutoSeparate] = useState(true);
  const [stemModel, setStemModel] = useState<string>(DEFAULT_STEM_MODEL);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMsg(null);

    // Sugerir título limpiando la extensión
    const cleanName = file.name.replace(/\.[^/.]+$/, "");
    if (!title) {
      setTitle(cleanName);
    }
  };

  const handleSongSelect = (songIdStr: string) => {
    setSelectedSongId(songIdStr);
    if (!songIdStr) return;

    const matched = songs.find((s) => s.id === Number(songIdStr));
    if (matched) {
      if (!title) setTitle(matched.title);
      if (!artist && matched.artist) setArtist(matched.artist);
      if (!musicalKey && matched.key) setMusicalKey(matched.key);
      if (!bpm && matched.bpm) setBpm(String(matched.bpm));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Por favor selecciona un archivo de audio.");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("El título es obligatorio.");
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg(null);
      setUploadProgress(15);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title.trim());
      if (artist.trim()) formData.append("artist", artist.trim());
      if (selectedSongId) formData.append("songId", selectedSongId);
      if (musicalKey) formData.append("musicalKey", musicalKey);
      if (bpm) formData.append("bpm", bpm);
      formData.append("autoSeparate", String(autoSeparate));
      formData.append("model", stemModel);

      setUploadProgress(45);

      const res = await fetch("/api/tracks/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(85);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al subir el archivo.");
      }

      setUploadProgress(100);
      onClose();
      router.refresh();
      // Redirigir directamente al nuevo estudio
      if (data.track?.id) {
        router.push(`/galeria/${data.track.id}/estudio`);
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || "Error al subir");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px", width: "95%" }}
      >
        <div className="row" style={{ justifyContent: "space-between", marginBottom: "1rem" }}>
          <div className="row" style={{ gap: "0.5rem" }}>
            <FileAudio size={22} style={{ color: "var(--accent)" }} />
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Subir Audio a la Galería</h2>
          </div>
          <button
            type="button"
            className="btn ghost small"
            onClick={onClose}
            disabled={isUploading}
            style={{ padding: "0.2rem 0.5rem", borderRadius: "8px" }}
          >
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div className="alert error" style={{ marginBottom: "1rem" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="stack">
          {/* Selector de archivo / Drag & Drop */}
          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.ogg,.flac,.m4a"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {selectedFile ? (
              <div className="dropzone-selected">
                <FileAudio size={32} style={{ color: "var(--accent)" }} />
                <div>
                  <strong>{selectedFile.name}</strong>
                  <p className="muted" style={{ fontSize: "0.82rem" }}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="dropzone-empty">
                <UploadCloud size={36} style={{ color: "var(--gold)" }} />
                <strong>Haz clic o arrastra un archivo de audio</strong>
                <p className="muted" style={{ fontSize: "0.82rem" }}>
                  Soporta MP3, WAV, OGG, FLAC (Hasta 80 MB)
                </p>
              </div>
            )}
          </div>

          {/* Vincular con canción existente de la biblioteca */}
          <div className="field">
            <label htmlFor="songSelect">Vincular con canción de la biblioteca (opcional):</label>
            <select
              id="songSelect"
              className="input"
              value={selectedSongId}
              onChange={(e) => handleSongSelect(e.target.value)}
              disabled={isUploading}
            >
              <option value="">-- Sin vincular (Audio independiente) --</option>
              {songs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} {s.artist ? `· ${s.artist}` : ""} {s.key ? `[${s.key}]` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid two" style={{ gap: "0.75rem" }}>
            <div className="field">
              <label htmlFor="trackTitle">Título de la pista *</label>
              <input
                id="trackTitle"
                className="input"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Como en el Cielo"
                disabled={isUploading}
              />
            </div>

            <div className="field">
              <label htmlFor="trackArtist">Artista / Banda</label>
              <input
                id="trackArtist"
                className="input"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ej: Elevation Worship"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="grid two" style={{ gap: "0.75rem" }}>
            <div className="field">
              <label htmlFor="musicalKey">Tono inicial / Clave</label>
              <select
                id="musicalKey"
                className="input"
                value={musicalKey}
                onChange={(e) => setMusicalKey(e.target.value)}
                disabled={isUploading}
              >
                <option value="">-- Seleccionar Tono --</option>
                {KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="bpm">Tempo (BPM)</label>
              <input
                id="bpm"
                type="number"
                min="30"
                max="300"
                className="input"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                placeholder="Ej: 130"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Opción de separar con IA (Demucs) */}
          <div className="ai-separation-box">
            <label className="row" style={{ cursor: "pointer", alignItems: "flex-start", gap: "0.6rem" }}>
              <input
                type="checkbox"
                checked={autoSeparate}
                onChange={(e) => setAutoSeparate(e.target.checked)}
                disabled={isUploading}
                style={{ marginTop: "3px", width: "16px", height: "16px", accentColor: "var(--accent)" }}
              />
              <div className="grow">
                <div className="row" style={{ gap: "0.4rem" }}>
                  <Sparkles size={16} style={{ color: "var(--accent)" }} />
                  <strong>Separar en pistas (stems) con IA (Demucs)</strong>
                </div>
                <p className="muted" style={{ fontSize: "0.82rem", margin: "0.2rem 0 0" }}>
                  Aísla automáticamente la voz, batería, guitarras, bajo y piano para tratarlos por separado en el Estudio.
                </p>
              </div>
            </label>

            {autoSeparate && (
              <div style={{ marginTop: "0.6rem", paddingLeft: "1.6rem" }}>
                <select
                  className="input"
                  style={{ minHeight: "38px", fontSize: "0.85rem" }}
                  value={stemModel}
                  onChange={(e) => setStemModel(e.target.value)}
                  disabled={isUploading}
                >
                  <option value="htdemucs_6s">
                    {STEM_MODELS.htdemucs_6s.label} ({STEM_MODELS.htdemucs_6s.description})
                  </option>
                  <option value="htdemucs">
                    {STEM_MODELS.htdemucs.label} ({STEM_MODELS.htdemucs.description})
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Barra de progreso si está subiendo */}
          {isUploading && (
            <div style={{ marginTop: "0.5rem" }}>
              <div className="row" style={{ justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.25rem" }}>
                <span>Subiendo archivo y preparando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--surface-3)", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${uploadProgress}%`,
                    background: "linear-gradient(90deg, #dfba73, #b45309)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              className="btn ghost"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn gold"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? "Subiendo..." : "Subir Audio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
