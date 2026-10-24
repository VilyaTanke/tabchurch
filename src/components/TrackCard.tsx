"use client";

import { useState, useRef, useEffect } from "react";
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
import { transposeKey } from "@/lib/chordpro";
import {
  getSharedAudioContext,
  ensureAudioContextResumed,
  loadAudioBuffer,
  SoundTouchChannel,
} from "@/lib/audio-engine";

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
  canManage,
  onDelete,
}: {
  track: GalleryTrackItem;
  canManage: boolean;
  onDelete?: (id: number) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.durationSec || 0);
  const [semitones, setSemitones] = useState(0);

  const [isTriggeringAI, setIsTriggeringAI] = useState(false);
  const [stemsStatus, setStemsStatus] = useState(track.stemsStatus);
  const [stemsProgress, setStemsProgress] = useState(track.stemsProgress);

  const channelRef = useRef<SoundTouchChannel | null>(null);

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

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.destroy();
        channelRef.current = null;
      }
    };
  }, []);

  // Actualizar semitonos en tiempo real mediante SoundTouch (WSOLA DSP)
  // Conserva exactamente el tempo original (sin alterar velocidad)
  useEffect(() => {
    if (channelRef.current) {
      channelRef.current.setSemitones(semitones);
    }
  }, [semitones]);

  // Actualización fluida del progreso temporal
  useEffect(() => {
    let animId: number;
    const tick = () => {
      if (channelRef.current && isPlaying) {
        setCurrentTime(channelRef.current.getCurrentTime());
      }
      if (isPlaying) {
        animId = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) {
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const togglePlay = async () => {
    try {
      const ctx = getSharedAudioContext();
      await ensureAudioContextResumed(ctx);

      if (!channelRef.current) {
        setIsLoadingAudio(true);
        const buffer = await loadAudioBuffer(`/api/tracks/${track.id}`, ctx);
        setDuration(buffer.duration);

        const ch = new SoundTouchChannel(ctx, buffer, ctx.destination);
        ch.setSemitones(semitones);
        ch.onEnded = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };
        channelRef.current = ch;
        setIsLoadingAudio(false);
      }

      if (isPlaying) {
        channelRef.current.isPlaying = false;
        setIsPlaying(false);
      } else {
        channelRef.current.isPlaying = true;
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Error al reproducir audio:", e);
      setIsLoadingAudio(false);
    }
  };

  const handleSeek = (timeSec: number) => {
    if (channelRef.current) {
      channelRef.current.seek(timeSec);
    }
    setCurrentTime(timeSec);
  };

  const handleSeparate = async () => {
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

  const handleDelete = async () => {
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
  const currentDisplayedKey = baseKey ? transposeKey(baseKey, semitones) : null;

  return (
    <div className="card track-gallery-card">
      <div className="track-card-header">
        <div className="row" style={{ alignItems: "flex-start", gap: "0.75rem", flexWrap: "nowrap" }}>
          <button
            type="button"
            className="track-play-avatar"
            onClick={togglePlay}
            disabled={isLoadingAudio}
            title={isLoadingAudio ? "Cargando audio..." : isPlaying ? "Pausar" : "Reproducir"}
          >
            {isLoadingAudio ? (
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : isPlaying ? (
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
              {track.bpm ? ` · ${track.bpm} BPM` : ""}
              {track.sizeBytes > 0 ? ` · ${formatBytes(track.sizeBytes)}` : ""}
            </p>
          </div>
        </div>

        {/* Tonalidad actual y badge de stems */}
        <div className="row" style={{ gap: "0.4rem", justifyContent: "flex-end" }}>
          {baseKey && (
            <span className="badge" style={{ background: "rgba(223, 186, 115, 0.15)", color: "var(--accent)" }}>
              {currentDisplayedKey}
              {semitones !== 0 && (
                <span style={{ opacity: 0.8, fontSize: "0.75em", marginLeft: "4px" }}>
                  ({semitones > 0 ? `+${semitones}` : semitones})
                </span>
              )}
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
        <div className="track-linked-song">
          <Music size={13} style={{ color: "var(--accent)" }} />
          <span>Vinculada con:</span>
          <Link href={`/canciones/${track.song.id}`} className="linked-song-link">
            {track.song.title} <ExternalLink size={11} />
          </Link>
        </div>
      )}

      {/* Mini Reproductor & Barra de progreso con Scrub */}
      <div className="track-player-bar">
        <span className="time-text">{formatDuration(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="mini-scrub-slider"
        />
        <span className="time-text">{formatDuration(duration)}</span>
      </div>

      {/* Transpositor rápido en la tarjeta */}
      <div className="track-card-transposer">
        <span className="transposer-title">Transpositor:</span>
        <div className="transposer-buttons">
          <button
            type="button"
            className="trans-btn"
            onClick={() => setSemitones((s) => Math.max(-12, s - 1))}
            title="Bajar 1 semitono"
          >
            -
          </button>
          <button
            type="button"
            className="trans-btn reset"
            onClick={() => setSemitones(0)}
            title="Restablecer"
            disabled={semitones === 0}
          >
            {semitones === 0 ? "0" : semitones > 0 ? `+${semitones}` : semitones}
          </button>
          <button
            type="button"
            className="trans-btn"
            onClick={() => setSemitones((s) => Math.min(12, s + 1))}
            title="Subir 1 semitono"
          >
            +
          </button>
        </div>

        {/* Botones de acción principales */}
        <div className="row" style={{ marginLeft: "auto", gap: "0.4rem" }}>
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
            <span>Estudio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
