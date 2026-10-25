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
import { transposeKey, semitonesBetween } from "@/lib/chordpro";
import {
  SoundTouchChannel,
  getSharedAudioContext,
  ensureAudioContextResumed,
  loadAudioBuffer,
} from "@/lib/audio-engine";

export interface ZamarMiniPlayerProps {
  trackId: number;
  trackTitle?: string;
  artist?: string | null;
  durationSec?: number | null;
  baseKey?: string | null;
  currentKey?: string | null;
  variant?: "inline" | "banner";
  showStudioLink?: boolean;
  className?: string;
  onKeyChange?: (newKey: string, semitones: number) => void;
}

export default function ZamarMiniPlayer({
  trackId,
  trackTitle,
  artist,
  durationSec,
  baseKey,
  currentKey,
  variant = "inline",
  showStudioLink = false,
  className = "",
  onKeyChange,
}: ZamarMiniPlayerProps) {
  const channelRef = useRef<SoundTouchChannel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(durationSec || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  // Calcular semitonos iniciales basados en baseKey y currentKey
  const [semitones, setSemitones] = useState<number>(() => {
    if (baseKey && currentKey) {
      return semitonesBetween(baseKey, currentKey);
    }
    return 0;
  });

  // Identificador único para coordinar un único reproductor activo
  const playerIdRef = useRef(
    `zamar-mini-${trackId}-${Math.random().toString(36).slice(2, 8)}`
  );

  // Escuchar evento global para pausar si otro reproductor comienza a sonar
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ playerId: string; trackId: number }>;
      if (customEvent.detail?.playerId !== playerIdRef.current) {
        if (channelRef.current && channelRef.current.isPlaying) {
          channelRef.current.isPlaying = false;
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener("zamar-audio-play", handleGlobalPlay);
    return () => {
      window.removeEventListener("zamar-audio-play", handleGlobalPlay);
    };
  }, []);

  // Escuchar sincronización de tono externa (por ejemplo, desde SongViewer)
  useEffect(() => {
    const handleKeySync = (e: Event) => {
      const detail = (e as CustomEvent<{ key?: string; semitones?: number; source?: string }>).detail;
      if (detail && detail.source !== "mini-player" && typeof detail.semitones === "number") {
        setSemitones(detail.semitones);
        if (channelRef.current) {
          channelRef.current.setSemitones(detail.semitones);
        }
      }
    };
    window.addEventListener("zamar-key-sync", handleKeySync);
    return () => window.removeEventListener("zamar-key-sync", handleKeySync);
  }, []);

  // Actualizar semitonos si cambia currentKey o baseKey desde props (ej. selector TONO)
  useEffect(() => {
    if (baseKey && currentKey) {
      const diff = semitonesBetween(baseKey, currentKey);
      setSemitones(diff);
      if (channelRef.current) {
        channelRef.current.setSemitones(diff);
      }
    }
  }, [baseKey, currentKey]);

  // Actualizar duración si cambia durationSec
  useEffect(() => {
    if (durationSec && durationSec > 0 && duration === 0) {
      setDuration(durationSec);
    }
  }, [durationSec, duration]);

  // Loop suave de animación para el avance de la barra de tiempo
  useEffect(() => {
    let animId: number;
    const tick = () => {
      if (channelRef.current && isPlaying && !isSeeking) {
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
  }, [isPlaying, isSeeking]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.destroy();
        channelRef.current = null;
      }
    };
  }, []);

  const togglePlay = useCallback(async () => {
    try {
      if (channelRef.current) {
        if (isPlaying) {
          channelRef.current.isPlaying = false;
          setIsPlaying(false);
        } else {
          const ctx = getSharedAudioContext();
          await ensureAudioContextResumed(ctx);
          window.dispatchEvent(
            new CustomEvent("zamar-audio-play", {
              detail: { playerId: playerIdRef.current, trackId },
            })
          );
          channelRef.current.isPlaying = true;
          setIsPlaying(true);
        }
        return;
      }

      // Carga inicial del buffer de audio con SoundTouch (motor WSOLA)
      setIsLoading(true);
      const ctx = getSharedAudioContext();
      await ensureAudioContextResumed(ctx);

      window.dispatchEvent(
        new CustomEvent("zamar-audio-play", {
          detail: { playerId: playerIdRef.current, trackId },
        })
      );

      const buffer = await loadAudioBuffer(`/api/tracks/${trackId}`, ctx);
      setDuration(buffer.duration);

      const ch = new SoundTouchChannel(ctx, buffer, ctx.destination);
      ch.setSemitones(semitones);
      ch.setVolume(isMuted ? 0 : 1.0);
      ch.seek(currentTime);
      ch.onEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        ch.seek(0);
      };

      channelRef.current = ch;
      ch.isPlaying = true;
      setIsPlaying(true);
    } catch (err) {
      console.error("Error al reproducir pista con SoundTouch:", err);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, trackId, semitones, isMuted, currentTime]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (channelRef.current) {
      channelRef.current.seek(newTime);
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const newTime = Number((e.target as HTMLInputElement).value);
    if (channelRef.current) {
      channelRef.current.seek(newTime);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (channelRef.current) {
      channelRef.current.setMuted(next);
    }
  };

  // Función para cambiar tonalidad (+ / - semitonos)
  const changePitch = (delta: number) => {
    const next = Math.max(-12, Math.min(12, semitones + delta));
    setSemitones(next);
    if (channelRef.current) {
      channelRef.current.setSemitones(next);
    }
    const nextKey = baseKey ? transposeKey(baseKey, next) : null;
    if (nextKey && onKeyChange) {
      onKeyChange(nextKey, next);
    }
    window.dispatchEvent(
      new CustomEvent("zamar-key-sync", {
        detail: { trackId, key: nextKey, semitones: next, source: "mini-player" },
      })
    );
  };

  // Función para restablecer al tono original
  const resetPitch = () => {
    setSemitones(0);
    if (channelRef.current) {
      channelRef.current.setSemitones(0);
    }
    if (baseKey && onKeyChange) {
      onKeyChange(baseKey, 0);
    }
    window.dispatchEvent(
      new CustomEvent("zamar-key-sync", {
        detail: { trackId, key: baseKey, semitones: 0, source: "mini-player" },
      })
    );
  };

  const displayedKey = baseKey ? transposeKey(baseKey, semitones) : null;
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className={`zamar-mini-player ${variant} ${isPlaying ? "is-playing" : ""} ${className}`}
      role="region"
      aria-label={`Reproductor MP3 de Zamar ${trackTitle || ""}`}
    >
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

      {/* Botones de función para cambiar tonalidad (Transposición en tiempo real) */}
      <div className="zmp-key-control" title="Cambiar tonalidad de la canción en tiempo real">
        <button
          type="button"
          className="zmp-key-btn"
          onClick={() => changePitch(-1)}
          aria-label="Bajar medio tono"
          title="Bajar 1 semitono (-)"
        >
          −
        </button>

        <button
          type="button"
          className={`zmp-key-display ${semitones !== 0 ? "transposed" : ""}`}
          onClick={resetPitch}
          title={
            semitones === 0
              ? `Tono original: ${displayedKey || "—"}`
              : `Tono modificado (${semitones > 0 ? `+${semitones}` : semitones} semitonos). Clic para restablecer original`
          }
        >
          <span className="zmp-key-text">
            {displayedKey || (semitones === 0 ? "0" : semitones > 0 ? `+${semitones}` : semitones)}
          </span>
          {semitones !== 0 && (
            <span className="zmp-key-offset">
              {semitones > 0 ? `+${semitones}` : semitones}
            </span>
          )}
        </button>

        <button
          type="button"
          className="zmp-key-btn"
          onClick={() => changePitch(1)}
          aria-label="Subir medio tono"
          title="Subir 1 semitono (+)"
        >
          +
        </button>
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
