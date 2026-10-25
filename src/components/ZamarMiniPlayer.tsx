"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  SlidersHorizontal,
  Music,
} from "lucide-react";
import { formatDuration } from "@/lib/stems";

export interface ZamarMiniPlayerProps {
  trackId: number;
  trackTitle?: string;
  artist?: string | null;
  durationSec?: number | null;
  variant?: "inline" | "banner";
  showStudioLink?: boolean;
  className?: string;
}

export default function ZamarMiniPlayer({
  trackId,
  trackTitle,
  artist,
  durationSec,
  variant = "inline",
  showStudioLink = false,
  className = "",
}: ZamarMiniPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(durationSec || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  // Identificador único para coordinar un único reproductor activo
  const playerIdRef = useRef(
    `zamar-mini-${trackId}-${Math.random().toString(36).slice(2, 8)}`
  );

  // Escuchar evento global para pausar si otro reproductor comienza a sonar
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ playerId: string; trackId: number }>;
      if (customEvent.detail?.playerId !== playerIdRef.current) {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener("zamar-audio-play", handleGlobalPlay);
    return () => {
      window.removeEventListener("zamar-audio-play", handleGlobalPlay);
    };
  }, []);

  // Actualizar duración si cambia la prop
  useEffect(() => {
    if (durationSec && durationSec > 0 && duration === 0) {
      setDuration(durationSec);
    }
  }, [durationSec, duration]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Notificar a todos los demás reproductores para que se silencien
      window.dispatchEvent(
        new CustomEvent("zamar-audio-play", {
          detail: { playerId: playerIdRef.current, trackId },
        })
      );

      try {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Reproducción impedida o interrumpida:", err);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isPlaying, trackId]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current?.duration && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const newTime = Number((e.target as HTMLInputElement).value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className={`zamar-mini-player ${variant} ${isPlaying ? "is-playing" : ""} ${className}`}
      role="region"
      aria-label={`Reproductor MP3 de Zamar ${trackTitle || ""}`}
    >
      <audio
        ref={audioRef}
        src={`/api/tracks/${trackId}`}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
      />

      {/* Botón principal de Reproducir / Pausar */}
      <button
        type="button"
        className="zmp-btn-play"
        onClick={togglePlay}
        disabled={isLoading && !isPlaying}
        aria-label={isPlaying ? "Pausar pista" : "Reproducir pista"}
        title={isPlaying ? "Pausar audio" : "Reproducir audio"}
      >
        {isLoading ? (
          <Loader2 size={16} className="spin" />
        ) : isPlaying ? (
          <Pause size={15} />
        ) : (
          <Play size={15} style={{ marginLeft: "2px" }} />
        )}
      </button>

      {/* Indicador / Badge Zamar */}
      <div className="zmp-tag">
        <Music size={12} style={{ color: "var(--accent)" }} />
        <span className="zmp-tag-text">Zamar MP3</span>
      </div>

      {/* Línea de tiempo interactiva y tiempos */}
      <div className="zmp-timeline">
        <span className="zmp-time">{formatDuration(currentTime)}</span>
        <input
          type="range"
          className="zmp-slider"
          min={0}
          max={duration > 0 ? duration : 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeekChange}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onTouchStart={handleSeekStart}
          onTouchEnd={handleSeekEnd}
          aria-label="Posición de reproducción"
          style={{
            background: `linear-gradient(to right, #dfba73 0%, #dfba73 ${progressPercent}%, rgba(148, 163, 184, 0.28) ${progressPercent}%, rgba(148, 163, 184, 0.28) 100%)`,
          }}
        />
        <span className="zmp-time">{formatDuration(duration)}</span>
      </div>

      {/* Controles secundarios: Mute y enlace a Estudio Z opcional */}
      <div className="zmp-tools">
        <button
          type="button"
          className="zmp-btn-tool"
          onClick={toggleMute}
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
          title={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {showStudioLink && (
          <Link
            href={`/galeria/${trackId}/estudio`}
            className="zmp-btn-tool"
            aria-label="Abrir en Estudio Z"
            title="Abrir en Estudio Z (mezclador de stems y tono)"
          >
            <SlidersHorizontal size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
