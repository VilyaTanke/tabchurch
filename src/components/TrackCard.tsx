"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Download,
  Trash2,
  Sliders,
  Sparkles,
  Music,
  ExternalLink,
} from "lucide-react";
import { formatBytes, formatDuration, parseStemsList } from "@/lib/stems";

export interface GalleryTrackItem {
  id: number;
  title: string;
  artist: string | null;
  musicalKey: string | null;
  bpm: number | null;
  durationSec: number | null;
  sizeBytes: number;
  stemsStatus: "none" | "queued" | "processing" | "done" | "error";
  stemsProgress: number;
  stemsModel: string | null;
  stemsList: string | null;
  stemsError: string | null;
  createdAt: number;
  song?: {
    id: number;
    title: string;
    originalKey: string | null;
    currentKey: string | null;
  } | null;
}

export default function TrackCard({
  track,
  isActive = false,
  isPlaying = false,
  onSelect,
  canManage,
  onDelete,
}: {
  track: GalleryTrackItem;
  isActive?: boolean;
  isPlaying?: boolean;
  onSelect?: () => void;
  canManage: boolean;
  onDelete?: (id: number) => void;
}) {
  const [isTriggeringAI, setIsTriggeringAI] = useState(false);
  const [stemsStatus, setStemsStatus] = useState(track.stemsStatus);
  const [stemsProgress, setStemsProgress] = useState(track.stemsProgress);

  const stems = parseStemsList(track.stemsList);
  const hasStems = stemsStatus === "done" && stems.length > 0;
  const isProcessing = stemsStatus === "queued" || stemsStatus === "processing";

  // Polling si está procesando stems
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tracks/${track.id}/separate`);
        if (!res.ok) return;
        const data = await res.json();
        setStemsProgress(data.progress || 0);
        if (data.status === "done" || data.status === "error") {
          setStemsStatus(data.status);
        }
      } catch (e) {
        console.error("Error polling stems:", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isProcessing, track.id]);

  const handleSeparate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsTriggeringAI(true);
      const res = await fetch(`/api/tracks/${track.id}/separate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "htdemucs_6s" }),
      });
      if (res.ok) {
        setStemsStatus("queued");
        setStemsProgress(1);
      }
    } finally {
      setIsTriggeringAI(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar definitivamente el audio "${track.title}" y todos sus stems?`)) return;
    try {
      const res = await fetch(`/api/tracks/${track.id}`, { method: "DELETE" });
      if (res.ok && onDelete) {
        onDelete(track.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const baseKey = track.musicalKey || track.song?.currentKey || track.song?.originalKey;

  return (
    <div
      className={`card track-gallery-card ${isActive ? "active-track-card" : ""}`}
      onClick={onSelect}
      style={{ cursor: "pointer" }}
    >
      <div className="track-card-header">
        <div className="row" style={{ alignItems: "flex-start", gap: "0.75rem", flexWrap: "nowrap" }}>
          <button
            type="button"
            className={`track-play-avatar ${isActive && isPlaying ? "playing" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            title={isActive && isPlaying ? "Pausar" : "Reproducir en el reproductor principal"}
          >
            {isActive && isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} style={{ marginLeft: "2px" }} />
            )}
          </button>
          <div className="grow" style={{ minWidth: 0 }}>
            <h3 className="track-card-title" title={track.title}>
              {track.title}
            </h3>
            <p className="muted" style={{ fontSize: "0.86rem", margin: "2px 0 0" }}>
              {track.artist || "Sin artista"}
              {track.durationSec ? ` · ${formatDuration(track.durationSec)}` : ""}
              {track.bpm ? ` · ${track.bpm} BPM` : ""}
              {track.sizeBytes > 0 ? ` · ${formatBytes(track.sizeBytes)}` : ""}
            </p>
          </div>
        </div>

        {/* Tonalidad actual y badge de stems */}
        <div className="row" style={{ gap: "0.4rem", justifyContent: "flex-end" }}>
          {baseKey && (
            <span
              className="badge"
              style={{
                background: isActive ? "var(--accent)" : "rgba(223, 186, 115, 0.15)",
                color: isActive ? "#0d0c0b" : "var(--accent)",
                fontWeight: 600,
              }}
            >
              {baseKey}
            </span>
          )}

          {hasStems && (
            <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#059669" }}>
              {stems.length} Stems Listos
            </span>
          )}
          {isProcessing && (
            <span className="badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#d97706" }}>
              IA {stemsProgress}%
            </span>
          )}
        </div>
      </div>

      {/* Canción vinculada si existe */}
      {track.song && (
        <div className="track-linked-song" onClick={(e) => e.stopPropagation()}>
          <Music size={13} style={{ color: "var(--accent)" }} />
          <span>Vinculada con:</span>
          <Link href={`/canciones/${track.song.id}`} className="linked-song-link">
            {track.song.title} <ExternalLink size={11} />
          </Link>
        </div>
      )}

      {/* Barra de pie de la tarjeta con botones de acción */}
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", paddingTop: "0.4rem", borderTop: "1px dashed var(--border)" }}>
        <span className="muted" style={{ fontSize: "0.78rem" }}>
          {isActive ? (
            <strong style={{ color: "var(--accent)" }}>
              {isPlaying ? "▶ Reproduciendo ahora" : "⏸ Seleccionada"}
            </strong>
          ) : (
            "Haz clic para reproducir"
          )}
        </span>

        <div className="row" style={{ gap: "0.4rem" }} onClick={(e) => e.stopPropagation()}>
          {canManage && !hasStems && !isProcessing && (
            <button
              type="button"
              className="btn ghost small"
              onClick={handleSeparate}
              disabled={isTriggeringAI}
              title="Separar en pistas (Demucs IA)"
              style={{ fontSize: "0.78rem", padding: "0 0.5rem" }}
            >
              <Sparkles size={13} style={{ color: "var(--accent)" }} />
              <span>Separar</span>
            </button>
          )}

          <a
            href={`/api/tracks/${track.id}?download=1`}
            className="btn ghost small"
            title="Descargar MP3"
            style={{ padding: "0 0.5rem" }}
            download
          >
            <Download size={13} />
          </a>

          {canManage && (
            <button
              type="button"
              className="btn danger small"
              onClick={handleDelete}
              title="Eliminar audio"
              style={{ padding: "0 0.5rem" }}
            >
              <Trash2 size={13} />
            </button>
          )}

          <Link
            href={`/galeria/${track.id}/estudio`}
            className="btn small gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Sliders size={14} />
            <span>Estudio Z</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
