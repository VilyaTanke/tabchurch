"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  ArrowLeft,
  Sparkles,
  Repeat,
  FastForward,
  Rewind,
  BookOpen,
  Maximize2,
  Minimize2,
  AlertCircle,
  Radio,
} from "lucide-react";
import { formatDuration, stemColor, stemLabel, type StemFile } from "@/lib/stems";
import { transposeKey } from "@/lib/chordpro";
import SongViewer from "@/components/SongViewer";
import { MultiTrackSoundTouchEngine } from "@/lib/audio-engine";

export type StudioTrackData = {
  id: number;
  title: string;
  artist: string | null;
  musicalKey: string | null;
  bpm: number | null;
  durationSec: number | null;
  fileName: string;
  stemsStatus: "none" | "queued" | "processing" | "done" | "error";
  stemsProgress: number;
  stemsModel: string | null;
  stemsList: StemFile[];
  stemsError: string | null;
  song?: {
    id: number;
    title: string;
    artist: string | null;
    originalKey: string | null;
    currentKey: string | null;
    tempo: number | null;
    contentChordpro: string;
  } | null;
};

interface StemChannelState {
  name: string;
  label: string;
  color: string;
  url: string;
  volume: number; // 0 a 1
  muted: boolean;
  solo: boolean;
  pan: number; // -1 a 1
}

export default function StudioPlayer({
  initialTrack,
  canManage,
}: {
  initialTrack: StudioTrackData;
  canManage: boolean;
}) {
  const [track, setTrack] = useState<StudioTrackData>(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialTrack.durationSec || 0);
  const [masterVolume, setMasterVolume] = useState(0.9);
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Transpositor en semitonos (-6 a +6)
  const [semitones, setSemitones] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showChordsDrawer, setShowChordsDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSeparating, setIsSeparating] = useState(
    initialTrack.stemsStatus === "queued" || initialTrack.stemsStatus === "processing"
  );
  const [separationProgress, setSeparationProgress] = useState(initialTrack.stemsProgress || 0);
  const [separationError, setSeparationError] = useState(initialTrack.stemsError);

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Motor multipista de audio con SoundTouch (WSOLA DSP)
  const engineRef = useRef<MultiTrackSoundTouchEngine | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);

  // Configuración de los canales de audio (stems)
  const hasStems = track.stemsStatus === "done" && track.stemsList.length > 0;

  const initialChannels = useMemo<StemChannelState[]>(() => {
    if (hasStems) {
      return track.stemsList.map((s) => ({
        name: s.name,
        label: stemLabel(s.name),
        color: stemColor(s.name),
        url: `/api/tracks/${track.id}/stems/${s.file}`,
        volume: 0.85,
        muted: false,
        solo: false,
        pan: 0,
      }));
    }
    // Si aún no tiene stems, se carga la pista original como canal principal
    return [
      {
        name: "original",
        label: "Mezcla Completa (Original)",
        color: "#dfba73",
        url: `/api/tracks/${track.id}`,
        volume: 0.9,
        muted: false,
        solo: false,
        pan: 0,
      },
    ];
  }, [hasStems, track.id, track.stemsList]);

  const [channels, setChannels] = useState<StemChannelState[]>(initialChannels);

  // Clave única de la lista de canales para saber cuándo recargar buffers
  const channelsKey = useMemo(() => channels.map((c) => `${c.name}:${c.url}`).join("|"), [channels]);

  // Inicializar o recargar canales en el motor de audio SoundTouch
  useEffect(() => {
    let active = true;
    const engine = engineRef.current || new MultiTrackSoundTouchEngine();
    engineRef.current = engine;

    engine.onEnded = () => {
      if (isLooping) {
        engine.seek(0);
        engine.play().catch(console.error);
      } else {
        setIsPlaying(false);
      }
    };

    setIsLoadingAudio(true);
    engine
      .loadChannels(
        channels.map((ch) => ({
          name: ch.name,
          url: ch.url,
          volume: ch.volume,
          muted: ch.muted,
          solo: ch.solo,
        })),
        semitones,
        playbackSpeed
      )
      .then(() => {
        if (!active) return;
        setDuration(engine.duration);
        setIsLoadingAudio(false);
      })
      .catch((err) => {
        console.error("Error al cargar pistas de audio en SoundTouch:", err);
        if (active) setIsLoadingAudio(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelsKey]);

  // Actualizar comportamiento en bucle (loop)
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.onEnded = () => {
        if (isLooping) {
          engineRef.current?.seek(0);
          engineRef.current?.play().catch(console.error);
        } else {
          setIsPlaying(false);
        }
      };
    }
  }, [isLooping]);

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Actualizar tonalidad (semitonos): SoundTouch modifica el tono mediante WSOLA sin alterar la velocidad
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSemitones(semitones);
    }
  }, [semitones]);

  // Actualizar velocidad de reproducción (tempo): independiente del tono
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTempo(playbackSpeed);
    }
  }, [playbackSpeed]);

  // Actualizar volumen general y mute maestro
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setMasterVolume(masterVolume);
      engineRef.current.setMasterMuted(isMasterMuted);
    }
  }, [masterVolume, isMasterMuted]);

  // Polling del estado de separación si está en cola o procesando
  useEffect(() => {
    if (!isSeparating) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tracks/${track.id}/separate`);
        if (!res.ok) return;
        const data = await res.json();
        setSeparationProgress(data.progress || 0);

        if (data.status === "done") {
          setIsSeparating(false);
          const newStems: StemFile[] = data.stems || [];
          setTrack((prev) => ({
            ...prev,
            stemsStatus: "done",
            stemsProgress: 100,
            stemsList: newStems,
            stemsError: null,
          }));
          if (newStems.length > 0) {
            setChannels(
              newStems.map((s) => ({
                name: s.name,
                label: stemLabel(s.name),
                color: stemColor(s.name),
                url: `/api/tracks/${track.id}/stems/${s.file}`,
                volume: 0.85,
                muted: false,
                solo: false,
                pan: 0,
              }))
            );
          }
        } else if (data.status === "error") {
          setIsSeparating(false);
          setSeparationError(data.error || "Ocurrió un error en la separación.");
          setTrack((prev) => ({
            ...prev,
            stemsStatus: "error",
            stemsError: data.error,
          }));
        }
      } catch (e) {
        console.error("Error al consultar progreso de stems:", e);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isSeparating, track.id]);

  // Iniciar separación de stems bajo demanda
  const handleStartSeparation = async (model: "htdemucs_6s" | "htdemucs" = "htdemucs_6s") => {
    try {
      setIsSeparating(true);
      setSeparationProgress(1);
      setSeparationError(null);
      const res = await fetch(`/api/tracks/${track.id}/separate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar separación");
    } catch (err: unknown) {
      setIsSeparating(false);
      setSeparationError((err as Error).message);
    }
  };

  const handleSeek = (timeSec: number) => {
    const clamped = Math.max(0, Math.min(duration || 1000, timeSec));
    setCurrentTime(clamped);
    if (engineRef.current) {
      engineRef.current.seek(clamped);
    }
  };

  const handlePlay = async () => {
    if (!engineRef.current) return;
    try {
      await engineRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn("Error al reproducir audio:", e);
    }
  };

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleSkip = (secondsDelta: number) => {
    handleSeek(currentTime + secondsDelta);
  };

  // Bucle de sincronización de tiempo con requestAnimationFrame
  useEffect(() => {
    let animId: number;

    const updateTick = () => {
      if (engineRef.current && isPlaying) {
        setCurrentTime(engineRef.current.getCurrentTime());
      }
      if (isPlaying) {
        animId = requestAnimationFrame(updateTick);
      }
    };

    if (isPlaying) {
      animId = requestAnimationFrame(updateTick);
    }

    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Modificar canal individual (volumen, mute, solo)
  const updateChannel = (name: string, updates: Partial<StemChannelState>) => {
    setChannels((prev) => {
      const next = prev.map((c) => (c.name === name ? { ...c, ...updates } : c));
      const target = next.find((c) => c.name === name);
      if (target && engineRef.current) {
        engineRef.current.updateChannel(name, {
          volume: target.volume,
          muted: target.muted,
          solo: target.solo,
        });
      }
      return next;
    });
  };

  const toggleMute = (name: string) => {
    setChannels((prev) => {
      const next = prev.map((c) => (c.name === name ? { ...c, muted: !c.muted } : c));
      const target = next.find((c) => c.name === name);
      if (target && engineRef.current) {
        engineRef.current.updateChannel(name, { muted: target.muted });
      }
      return next;
    });
  };

  const toggleSolo = (name: string) => {
    setChannels((prev) => {
      const next = prev.map((c) => (c.name === name ? { ...c, solo: !c.solo } : c));
      const target = next.find((c) => c.name === name);
      if (target && engineRef.current) {
        engineRef.current.updateChannel(name, { solo: target.solo });
      }
      return next;
    });
  };

  // Tonalidad calculada con la transposición
  const baseKey = track.musicalKey || track.song?.currentKey || track.song?.originalKey || "C";
  const displayedTransposedKey = useMemo(() => {
    return transposeKey(baseKey, semitones) || baseKey;
  }, [baseKey, semitones]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Clic en la línea de tiempo para buscar posición
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !duration) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    handleSeek(ratio * duration);
  };

  // Generación de barras simuladas de waveform para cada pista (visualizer aesthetic)
  const generateWaveBars = (seedString: string, count = 80) => {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
    }
    const bars: number[] = [];
    for (let i = 0; i < count; i++) {
      const pseudo = Math.abs(Math.sin((i + 1) * (hash % 1000) * 0.17));
      const height = Math.floor(pseudo * 65 + 15);
      bars.push(height);
    }
    return bars;
  };

  return (
    <div
      ref={containerRef}
      className={`studio-container ${isFullscreen ? "fullscreen" : ""}`}
    >
      {/* ---------- ENCABEZADO SUPERIOR DEL ESTUDIO ---------- */}
      <header className="studio-header">
        <div className="studio-header-left">
          <Link href="/galeria" className="studio-back-btn" title="Volver a Zamar">
            <ArrowLeft size={18} />
          </Link>
          <div className="studio-brand">
            <span className="studio-badge-pro">ESTUDIO Z</span>
            <div className="studio-title-block">
              <h1 className="studio-track-title" title={track.title}>
                {track.title}
              </h1>
              <span className="studio-track-artist">
                {track.artist || track.song?.artist || "TabChurch Studio"}
              </span>
            </div>
          </div>
        </div>

        {/* Centro: Tono, Tempo y Transpositor rápido */}
        <div className="studio-header-center">
          {/* Tonalidad con control de transposición */}
          <div className="studio-tool-capsule" title="Tonalidad actual y transposición">
            <span className="capsule-label">Tono:</span>
            <span className="capsule-key">
              {displayedTransposedKey}
              {semitones !== 0 && (
                <span className="key-shift">
                  ({semitones > 0 ? `+${semitones}` : semitones})
                </span>
              )}
            </span>
            <div className="capsule-controls">
              <button
                className="capsule-btn"
                onClick={() => setSemitones((s) => Math.max(-12, s - 1))}
                title="Bajar 1 semitono"
              >
                -
              </button>
              <button
                className="capsule-btn reset"
                onClick={() => setSemitones(0)}
                title="Restablecer tono original"
                disabled={semitones === 0}
              >
                0
              </button>
              <button
                className="capsule-btn"
                onClick={() => setSemitones((s) => Math.min(12, s + 1))}
                title="Subir 1 semitono"
              >
                +
              </button>
            </div>
          </div>

          {/* BPM & Velocidad */}
          <div className="studio-tool-capsule" title="Tempo / BPM de la canción">
            <span className="capsule-label">BPM:</span>
            <span className="capsule-value">
              {track.bpm || track.song?.tempo || 120}
            </span>
            <select
              className="capsule-select"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              title="Velocidad de reproducción"
            >
              <option value="0.75">0.75x</option>
              <option value="0.9">0.9x</option>
              <option value="1">1.0x</option>
              <option value="1.1">1.1x</option>
              <option value="1.25">1.25x</option>
            </select>
          </div>
        </div>

        {/* Derecha: Acciones (Acordes, Pantalla completa, Descarga) */}
        <div className="studio-header-right">
          {track.song && (
            <button
              className={`studio-header-btn ${showChordsDrawer ? "active" : ""}`}
              onClick={() => setShowChordsDrawer(!showChordsDrawer)}
              title="Ver cifrado y letra de esta canción"
            >
              <BookOpen size={16} />
              <span className="btn-text">Cifrado</span>
            </button>
          )}

          {canManage && !hasStems && (
            <button
              className="studio-header-btn ai-btn"
              onClick={() => handleStartSeparation("htdemucs_6s")}
              disabled={isSeparating}
              title="Separar en 6 pistas (Voz, Batería, Bajo, Guitarras, Piano y Otros)"
            >
              <Sparkles size={16} />
              <span className="btn-text">
                {isSeparating ? `Separando (${separationProgress}%)` : "Separar con IA"}
              </span>
            </button>
          )}

          <a
            href={`/api/tracks/${track.id}?download=1`}
            className="studio-header-btn"
            title="Descargar mezcla original"
            download
          >
            <Download size={16} />
          </a>

          <button
            className="studio-header-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* ---------- AVISO DE SEPARACIÓN EN CURSO ---------- */}
      {isSeparating && (
        <div className="studio-processing-banner">
          <div className="banner-left">
            <div className="ai-spinner" />
            <div>
              <strong>Separando pistas con Demucs IA (Meta)...</strong>
              <p className="muted">
                Extrayendo voces e instrumentos por separado en alta calidad. Progreso: {separationProgress}%
              </p>
            </div>
          </div>
          <div className="banner-progress-bar">
            <div
              className="banner-progress-fill"
              style={{ width: `${Math.max(5, separationProgress)}%` }}
            />
          </div>
        </div>
      )}

      {separationError && (
        <div className="studio-error-banner">
          <AlertCircle size={18} />
          <span>{separationError}</span>
        </div>
      )}

      {/* ---------- CUERPO PRINCIPAL DEL ESTUDIO (MIXER + TIMELINE) ---------- */}
      <div className="studio-workspace">
        {/* PANEL DE MEZCLADOR LATERAL (CHANNELS LIST) */}
        <div className="studio-mixer">
          <div className="mixer-header">
            <span className="mixer-title">PISTAS & CANALES</span>
            <span className="mixer-count">
              {isLoadingAudio ? "Cargando audio..." : `${channels.length} ${channels.length === 1 ? "pista" : "pistas"}`}
            </span>
          </div>

          <div className="mixer-channels">
            {channels.map((ch) => (
              <div
                key={ch.name}
                className={`mixer-strip ${ch.muted ? "is-muted" : ""} ${ch.solo ? "is-solo" : ""}`}
                style={{ "--stem-accent": ch.color } as React.CSSProperties}
              >
                <div className="strip-top">
                  <span
                    className="strip-indicator"
                    style={{ backgroundColor: ch.color }}
                  />
                  <span className="strip-name" title={ch.label}>
                    {ch.label}
                  </span>
                  <div className="strip-actions">
                    <button
                      className={`btn-ms btn-mute ${ch.muted ? "active" : ""}`}
                      onClick={() => toggleMute(ch.name)}
                      title={ch.muted ? "Activar audio" : "Silenciar pista (Mute)"}
                    >
                      M
                    </button>
                    <button
                      className={`btn-ms btn-solo ${ch.solo ? "active" : ""}`}
                      onClick={() => toggleSolo(ch.name)}
                      title={ch.solo ? "Desactivar Solo" : "Solo esta pista (Solo)"}
                    >
                      S
                    </button>
                  </div>
                </div>

                {/* Slider de volumen por pista */}
                <div className="strip-slider-row">
                  <Volume2 size={13} className="slider-icon" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={ch.muted ? 0 : ch.volume}
                    onChange={(e) =>
                      updateChannel(ch.name, {
                        volume: Number(e.target.value),
                        muted: false,
                      })
                    }
                    className="strip-slider"
                    style={{
                      accentColor: ch.color,
                    }}
                  />
                  <span className="slider-pct">
                    {ch.muted ? "0%" : `${Math.round(ch.volume * 100)}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Botón para separar con IA si aún está en pista única */}
          {!hasStems && canManage && (
            <div className="mixer-promo-card">
              <Sparkles size={20} className="promo-icon" />
              <h4>¿Separar voces e instrumentos?</h4>
              <p>
                Utiliza la IA de Demucs para extraer automáticamente la voz, batería, guitarras, bajo y piano.
              </p>
              <button
                className="btn small gold"
                onClick={() => handleStartSeparation("htdemucs_6s")}
                disabled={isSeparating}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {isSeparating ? "Procesando..." : "Separar en Stems"}
              </button>
            </div>
          )}
        </div>

        {/* LIENZO DE LÍNEA DE TIEMPO Y FORMAS DE ONDA */}
        <div className="studio-timeline-panel">
          {/* Regla de compases / tiempo superior */}
          <div className="timeline-ruler">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="ruler-mark">
                <span>{i * 15}s</span>
              </div>
            ))}
          </div>

          {/* Carriles de formas de onda por cada canal */}
          <div
            ref={timelineRef}
            className="timeline-tracks-area"
            onClick={handleTimelineClick}
          >
            {/* Aguja / Cursor de reproducción sincronizado */}
            <div
              className="playback-playhead"
              style={{
                left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              }}
            >
              <div className="playhead-tag">{formatDuration(currentTime)}</div>
            </div>

            {channels.map((ch) => {
              const bars = generateWaveBars(`${track.id}_${ch.name}`, 96);
              const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

              return (
                <div
                  key={ch.name}
                  className={`timeline-lane ${ch.muted ? "lane-muted" : ""}`}
                  style={{ "--lane-color": ch.color } as React.CSSProperties}
                >
                  <div className="lane-label" style={{ color: ch.color }}>
                    {ch.label}
                  </div>

                  {/* Visualización de forma de onda */}
                  <div className="waveform-display">
                    {bars.map((h, i) => {
                      const barPosPct = (i / bars.length) * 100;
                      const isPassed = barPosPct <= progressPct;

                      return (
                        <div
                          key={i}
                          className={`wave-bar ${isPassed ? "active" : ""}`}
                          style={{
                            height: `${h}%`,
                            backgroundColor: isPassed ? ch.color : "rgba(255, 255, 255, 0.16)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DRAWER LATERAL: CIFRADO Y LETRA DE LA CANCIÓN */}
        {showChordsDrawer && track.song && (
          <aside className="studio-chords-drawer">
            <div className="drawer-header">
              <h3>{track.song.title}</h3>
              <button
                className="btn-close"
                onClick={() => setShowChordsDrawer(false)}
              >
                ✕
              </button>
            </div>
            <div className="drawer-body">
              <SongViewer
                songId={track.song.id}
                content={track.song.contentChordpro}
                originalKey={track.song.originalKey}
                currentKey={displayedTransposedKey}
                canSaveKey={false}
              />
            </div>
          </aside>
        )}
      </div>

      {/* ---------- BARRA DE TRANSPORTE INFERIOR (FOOTER) ---------- */}
      <footer className="studio-transport">
        {/* Lado izquierdo: Información de la pista */}
        <div className="transport-track-info">
          <div className="track-disc-icon">
            <Radio size={20} />
          </div>
          <div className="track-meta">
            <strong className="track-name">{track.title}</strong>
            <span className="track-sub">
              {displayedTransposedKey} · {track.bpm || 120} BPM
            </span>
          </div>
        </div>

        {/* Centro: Controles principales de reproducción */}
        <div className="transport-controls">
          <div className="controls-buttons">
            <button
              className={`ctrl-btn ${isLooping ? "active" : ""}`}
              onClick={() => setIsLooping(!isLooping)}
              title={isLooping ? "Desactivar repetición en bucle" : "Repetir en bucle"}
            >
              <Repeat size={16} />
            </button>

            <button
              className="ctrl-btn"
              onClick={() => handleSkip(-5)}
              title="Retroceder 5 segundos"
            >
              <Rewind size={18} />
            </button>

            <button
              className="ctrl-btn-play"
              onClick={handleTogglePlay}
              disabled={isLoadingAudio}
              title={isLoadingAudio ? "Cargando audio..." : isPlaying ? "Pausar" : "Reproducir"}
            >
              {isLoadingAudio ? (
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} style={{ marginLeft: "3px" }} />
              )}
            </button>

            <button
              className="ctrl-btn"
              onClick={() => handleSkip(5)}
              title="Avanzar 5 segundos"
            >
              <FastForward size={18} />
            </button>

            <button
              className="ctrl-btn"
              onClick={() => handleSeek(0)}
              title="Reiniciar al inicio"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Línea de tiempo / Progreso de tiempo */}
          <div className="controls-timeline-scrub">
            <span className="time-display">{formatDuration(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="scrub-slider"
            />
            <span className="time-display">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Lado derecho: Transpositor y Volumen Maestro */}
        <div className="transport-right">
          {/* Selector de Transposición */}
          <div className="transpose-control">
            <span className="transpose-label">Semitonos:</span>
            <div className="transpose-pills">
              <button
                className="pill-btn"
                onClick={() => setSemitones((s) => Math.max(-12, s - 1))}
              >
                -
              </button>
              <span className="pill-value">
                {semitones > 0 ? `+${semitones}` : semitones}
              </span>
              <button
                className="pill-btn"
                onClick={() => setSemitones((s) => Math.min(12, s + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* Volumen Maestro */}
          <div className="master-volume">
            <button
              className="vol-btn"
              onClick={() => setIsMasterMuted(!isMasterMuted)}
              title={isMasterMuted ? "Restablecer volumen" : "Silenciar todo"}
            >
              {isMasterMuted || masterVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMasterMuted ? 0 : masterVolume}
              onChange={(e) => {
                setMasterVolume(Number(e.target.value));
                setIsMasterMuted(false);
              }}
              className="master-slider"
              title="Volumen general del estudio"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
