"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Sliders,
  Download,
  Save,
  Music,
  ExternalLink,
  Repeat,
  Repeat1,
  Check,
} from "lucide-react";
import { formatDuration } from "@/lib/stems";
import { transposeKey } from "@/lib/chordpro";
import type { GalleryTrackItem } from "@/components/TrackCard";

export interface UnifiedAudioPlayerProps {
  track: GalleryTrackItem | null;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  currentTime: number;
  duration: number;
  semitones: number;
  volume: number;
  isMuted: boolean;
  repeatMode: "none" | "one" | "all";
  hasPrev: boolean;
  hasNext: boolean;
  canManage: boolean;
  isSavingKey: boolean;
  saveProgress: number;
  saveSuccessMsg: string | null;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleRepeat: () => void;
  onChangeSemitones: (semitones: number) => void;
  onSaveKey: () => void;
  onChangeVolume: (vol: number) => void;
  onToggleMute: () => void;
}

export default function UnifiedAudioPlayer({
  track,
  isPlaying,
  isLoadingAudio,
  currentTime,
  duration,
  semitones,
  volume,
  isMuted,
  repeatMode,
  hasPrev,
  hasNext,
  canManage,
  isSavingKey,
  saveProgress,
  saveSuccessMsg,
  onTogglePlay,
  onSeek,
  onPrev,
  onNext,
  onToggleRepeat,
  onChangeSemitones,
  onSaveKey,
  onChangeVolume,
  onToggleMute,
}: UnifiedAudioPlayerProps) {
  const seekSliderRef = useRef<HTMLInputElement>(null);

  if (!track) return null;

  const baseKey = track.musicalKey || track.song?.currentKey || track.song?.originalKey;
  const currentDisplayedKey = baseKey ? transposeKey(baseKey, semitones) : null;
  const isTransposed = semitones !== 0;

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="unified-player-dock" role="region" aria-label="Reproductor de audio principal">
      {/* Notificación flotante de tono guardado */}
      {saveSuccessMsg && (
        <div className="player-toast-banner">
          <Check size={16} style={{ color: "#10b981" }} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Contenedor principal del reproductor */}
      <div className="unified-player-inner">
        {/* Columna Izquierda: Información de la canción activa */}
        <div className="player-track-info">
          <div className={`player-avatar ${isPlaying ? "playing" : ""}`}>
            {isPlaying ? (
              <div className="equalizer-bars" aria-hidden="true">
                <span className="eq-bar bar-1" />
                <span className="eq-bar bar-2" />
                <span className="eq-bar bar-3" />
              </div>
            ) : (
              <Music size={18} style={{ color: "var(--accent)" }} />
            )}
          </div>
          <div className="player-meta">
            <div className="player-title-row">
              <span className="player-title" title={track.title}>
                {track.title}
              </span>
              {currentDisplayedKey && (
                <span
                  className="badge player-key-badge"
                  title={
                    isTransposed
                      ? `Tono original: ${baseKey} | Transpuesto: ${semitones > 0 ? `+${semitones}` : semitones} semitonos`
                      : `Tonalidad: ${baseKey}`
                  }
                >
                  {currentDisplayedKey}
                  {isTransposed && (
                    <span className="key-diff">{semitones > 0 ? `+${semitones}` : semitones}</span>
                  )}
                </span>
              )}
            </div>
            <div className="player-sub-row">
              <span className="player-artist">{track.artist || "Sin artista"}</span>
              {track.song && (
                <Link
                  href={`/canciones/${track.song.id}`}
                  className="player-chord-link"
                  title="Ver acordes de la canción"
                >
                  <span>Acordes</span>
                  <ExternalLink size={10} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Columna Central: Controles de reproducción y barra de tiempo */}
        <div className="player-center-controls">
          <div className="player-buttons-row">
            <button
              type="button"
              className={`player-btn-icon ${repeatMode !== "none" ? "active" : ""}`}
              onClick={onToggleRepeat}
              title={
                repeatMode === "none"
                  ? "Repetición desactivada"
                  : repeatMode === "all"
                  ? "Repetir lista completa"
                  : "Repetir esta canción"
              }
            >
              {repeatMode === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>

            <button
              type="button"
              className="player-btn-icon"
              onClick={onPrev}
              disabled={!hasPrev}
              title="Canción anterior"
            >
              <SkipBack size={18} />
            </button>

            <button
              type="button"
              className="player-play-btn"
              onClick={onTogglePlay}
              disabled={isLoadingAudio}
              title={isLoadingAudio ? "Cargando audio..." : isPlaying ? "Pausar" : "Reproducir"}
            >
              {isLoadingAudio ? (
                <div className="player-spinner" />
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} style={{ marginLeft: "2px" }} />
              )}
            </button>

            <button
              type="button"
              className="player-btn-icon"
              onClick={onNext}
              disabled={!hasNext}
              title="Siguiente canción"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Barra de progreso / Scrub slider */}
          <div className="player-scrub-row">
            <span className="player-time">{formatDuration(currentTime)}</span>
            <div className="slider-wrapper">
              <input
                ref={seekSliderRef}
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="player-slider"
                style={{
                  background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${progressPercent}%, var(--surface-3) ${progressPercent}%, var(--surface-3) 100%)`,
                }}
                aria-label="Posición de reproducción"
              />
            </div>
            <span className="player-time">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Columna Derecha: Transpositor en tiempo real, Guardado de MP3 y Volumen */}
        <div className="player-right-tools">
          {/* Panel de Transposición */}
          <div className="player-transposer-box">
            <span className="trans-label" title="Transposición en tiempo real (SoundTouch WSOLA)">
              Tono:
            </span>
            <div className="trans-btn-group">
              <button
                type="button"
                className="trans-step-btn"
                onClick={() => onChangeSemitones(Math.max(-12, semitones - 1))}
                title="Bajar 1 semitono"
              >
                -
              </button>
              <button
                type="button"
                className={`trans-step-btn reset ${semitones !== 0 ? "highlighted" : ""}`}
                onClick={() => onChangeSemitones(0)}
                title="Restablecer al tono original"
                disabled={semitones === 0}
              >
                {semitones === 0 ? "0" : semitones > 0 ? `+${semitones}` : semitones}
              </button>
              <button
                type="button"
                className="trans-step-btn"
                onClick={() => onChangeSemitones(Math.min(12, semitones + 1))}
                title="Subir 1 semitono"
              >
                +
              </button>
            </div>

            {/* Botón para guardar el tono modificado permanentemente en el archivo MP3 */}
            {canManage && isTransposed && (
              <button
                type="button"
                className="btn small gold player-save-key-btn"
                onClick={onSaveKey}
                disabled={isSavingKey}
                title={`Guardar nuevo tono (${currentDisplayedKey || (semitones > 0 ? `+${semitones}` : semitones)}) permanentemente en el archivo MP3`}
              >
                {isSavingKey ? (
                  <>
                    <div className="btn-spinner" />
                    <span>{saveProgress > 0 ? `${saveProgress}%` : "Guardando..."}</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Guardar tono {currentDisplayedKey ? `(${currentDisplayedKey})` : `(${semitones > 0 ? `+${semitones}` : semitones})`}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Control de Volumen */}
          <div className="player-volume-box">
            <button
              type="button"
              className="player-vol-icon-btn"
              onClick={onToggleMute}
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={17} style={{ color: "var(--danger, #ef4444)" }} />
              ) : volume < 0.5 ? (
                <Volume1 size={17} />
              ) : (
                <Volume2 size={17} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={(e) => onChangeVolume(Number(e.target.value))}
              className="player-vol-slider"
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(isMuted ? 0 : volume) * 100}%, var(--surface-3) ${(isMuted ? 0 : volume) * 100}%, var(--surface-3) 100%)`,
              }}
              aria-label="Volumen principal"
            />
          </div>

          {/* Acciones Rápidas */}
          <div className="player-quick-actions">
            <a
              href={`/api/tracks/${track.id}?download=1`}
              className="btn ghost small player-action-icon"
              title="Descargar MP3"
              download
            >
              <Download size={15} />
            </a>
            <Link
              href={`/galeria/${track.id}/estudio`}
              className="btn ghost small player-action-icon"
              title="Abrir en Estudio Z (Stems)"
            >
              <Sliders size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
