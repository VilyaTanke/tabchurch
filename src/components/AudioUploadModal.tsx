"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Sparkles, FileAudio, Music } from "lucide-react";
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
  onTrackUploaded,
}: {
  songs: SongOption[];
  isOpen: boolean;
  onClose: () => void;
  onTrackUploaded?: (track: any) => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<string>("");
  const [musicalKey, setMusicalKey] = useState<string>("");
  const [bpm, setBpm] = useState<string>("");
  const [autoSeparate, setAutoSeparate] = useState(false);
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

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(
            "El archivo supera el tamaño máximo permitido por el servidor web (Error 413: Request Entity Too Large). El proxy Nginx del servidor requiere 'client_max_body_size 100M;'."
          );
        }
        let errMsg = "Ocurrió un error al subir el archivo.";
        try {
          const errData = await res.json();
          if (errData?.error) errMsg = errData.error;
        } catch {
          errMsg = `Error del servidor (${res.status} ${res.statusText})`;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();

      setUploadProgress(100);
      onClose();
      router.refresh();
      if (onTrackUploaded && data.track) {
        onTrackUploaded(data.track);
      } else if (data.track?.id) {
        // Redirigir directamente al nuevo estudio si no hay callback personalizado
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
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Subir Audio a Zamar</h2>
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

          {/* Selector de Modo de Subida: Solo audio original vs Separación IA */}
          <div className="field">
            <label style={{ fontWeight: 600, color: "var(--text)" }}>Modo de subida:</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {/* Opción 1: Subida rápida solo audio (Por defecto) */}
              <div
                onClick={() => setAutoSeparate(false)}
                style={{
                  cursor: "pointer",
                  padding: "0.85rem",
                  borderRadius: "12px",
                  border: `2px solid ${!autoSeparate ? "var(--accent)" : "var(--border)"}`,
                  background: !autoSeparate ? "rgba(180, 83, 9, 0.05)" : "var(--surface)",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <div className="row" style={{ gap: "0.4rem" }}>
                    <Music size={17} style={{ color: !autoSeparate ? "var(--accent)" : "var(--muted)" }} />
                    <strong style={{ fontSize: "0.88rem", color: !autoSeparate ? "var(--accent)" : "inherit" }}>
                      Solo audio original
                    </strong>
                  </div>
                  {!autoSeparate && (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "0.1rem 0.4rem",
                        background: "var(--accent)",
                        color: "#fff",
                        borderRadius: "999px",
                        fontWeight: 600,
                      }}
                    >
                      Rápido
                    </span>
                  )}
                </div>
                <p className="muted" style={{ fontSize: "0.78rem", margin: 0, lineHeight: 1.35 }}>
                  Sube el audio al instante para reproducir y cambiar tono. Podrás separar los stems en cualquier momento desde el <strong>Estudio Z</strong>.
                </p>
              </div>

              {/* Opción 2: Separar con IA ahora */}
              <div
                onClick={() => setAutoSeparate(true)}
                style={{
                  cursor: "pointer",
                  padding: "0.85rem",
                  borderRadius: "12px",
                  border: `2px solid ${autoSeparate ? "var(--accent)" : "var(--border)"}`,
                  background: autoSeparate ? "rgba(180, 83, 9, 0.05)" : "var(--surface)",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <div className="row" style={{ gap: "0.4rem" }}>
                    <Sparkles size={17} style={{ color: autoSeparate ? "var(--accent)" : "var(--muted)" }} />
                    <strong style={{ fontSize: "0.88rem", color: autoSeparate ? "var(--accent)" : "inherit" }}>
                      Separar con IA ahora
                    </strong>
                  </div>
                  {autoSeparate && (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "0.1rem 0.4rem",
                        background: "var(--accent)",
                        color: "#fff",
                        borderRadius: "999px",
                        fontWeight: 600,
                      }}
                    >
                      Demucs
                    </span>
                  )}
                </div>
                <p className="muted" style={{ fontSize: "0.78rem", margin: 0, lineHeight: 1.35 }}>
                  Aísla automáticamente voz, batería, bajo, guitarra y piano en segundo plano al terminar de subir.
                </p>
              </div>
            </div>

            {/* Selector de modelo si autoSeparate está activado */}
            {autoSeparate && (
              <div style={{ marginTop: "0.5rem" }}>
                <label htmlFor="stemModelSelect" style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                  Modelo de separación Demucs:
                </label>
                <select
                  id="stemModelSelect"
                  className="input"
                  style={{ minHeight: "38px", fontSize: "0.85rem", marginTop: "0.2rem" }}
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
              {isUploading
                ? "Subiendo..."
                : autoSeparate
                ? "Subir y Separar con IA"
                : "Subir Solo Audio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
