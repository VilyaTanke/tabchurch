"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
  Sliders,
  Activity,
  Disc3,
} from "lucide-react";
import { formatDuration, stemColor, stemLabel, type StemFile, type StemModel } from "@/lib/stems";
import { transposeKey } from "@/lib/chordpro";
import SongViewer from "@/components/SongViewer";
import {
  MultiTrackSoundTouchEngine,
  type StemWaveformTelemetry,
} from "@/lib/audio-engine";

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
  volume: number; // 0 a 1.4 (hasta 140% boost estilo Mossi)
  muted: boolean;
  solo: boolean;
  pan: number; // -1 (100L) a +1 (100R)
}

type PracticePreset = "all" | "karaoke" | "drumless" | "bassless" | "guitarless" | "acapella";

function formatPanLabel(pan: number): string {
  if (Math.abs(pan) < 0.04) return "C";
  if (pan < 0) return `${Math.round(Math.abs(pan) * 100)}L`;
  return `${Math.round(pan * 100)}R`;
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
  const [masterVolume, setMasterVolume] = useState(0.95);
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Transpositor en semitonos (-12 a +12) y velocidad (tempo)
  const [semitones, setSemitones] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showChordsDrawer, setShowChordsDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<StemModel>(
    initialTrack.stemsModel === "htdemucs" ? "htdemucs" : "htdemucs_6s"
  );
  const [isSeparating, setIsSeparating] = useState(
    initialTrack.stemsStatus === "queued" || initialTrack.stemsStatus === "processing"
  );
  const [separationProgress, setSeparationProgress] = useState(initialTrack.stemsProgress || 0);
  const [separationError, setSeparationError] = useState(initialTrack.stemsError);

  // Estado de carga, telemetría de ondas reales y exportación de mezcla
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [loadingStatusText, setLoadingStatusText] = useState("Cargando motor de audio...");
  const [waveforms, setWaveforms] = useState<Record<string, StemWaveformTelemetry>>({});
  const [ramUsageMb, setRamUsageMb] = useState("0.0");
  const [activePreset, setActivePreset] = useState<PracticePreset>("all");
  const [isExportingMix, setIsExportingMix] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const canvasMapRef = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const vuBarLRef = useRef<HTMLDivElement>(null);
  const vuBarRRef = useRef<HTMLDivElement>(null);
  const vuDbLabelRef = useRef<HTMLSpanElement>(null);

  // Motor multipista sincronizado al sample (Fusión SoundTouch WSOLA + Mossi Phase-Locked Bus)
  const engineRef = useRef<MultiTrackSoundTouchEngine | null>(null);

  const hasStems = track.stemsStatus === "done" && track.stemsList.length > 0;

  const initialChannels = useMemo<StemChannelState[]>(() => {
    if (hasStems) {
      return track.stemsList.map((s) => ({
        name: s.name,
        label: stemLabel(s.name),
        color: stemColor(s.name),
        url: `/api/tracks/${track.id}/stems/${s.file}`,
        volume: 1.0,
        muted: false,
        solo: false,
        pan: 0,
      }));
    }
    return [
      {
        name: "original",
        label: "Mezcla Completa (Original)",
        color: "#dfba73",
        url: `/api/tracks/${track.id}`,
        volume: 1.0,
        muted: false,
        solo: false,
        pan: 0,
      },
    ];
  }, [hasStems, track.id, track.stemsList]);

  const [channels, setChannels] = useState<StemChannelState[]>(initialChannels);
  const anySolo = useMemo(() => channels.some((c) => c.solo), [channels]);

  const channelsKey = useMemo(
    () => channels.map((c) => `${c.name}:${c.url}`).join("|"),
    [channels]
  );

  // Renderizador de formas de onda simétricas de alta definición en <canvas> (portado de Mossi)
  const drawAllWaveforms = useCallback(
    (playheadSec: number, totalSec: number) => {
      const safeTotal = totalSec > 0 ? totalSec : 1;
      const progressRatio = Math.max(0, Math.min(1, playheadSec / safeTotal));
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      for (const ch of channels) {
        const canvas = canvasMapRef.current.get(ch.name);
        if (!canvas) continue;

        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        const targetW = Math.floor(rect.width * dpr);
        const targetH = Math.floor(rect.height * dpr);
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        ctx.save();
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const midY = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Línea horizontal central sutil (estilo Mossi)
        ctx.strokeStyle = "rgba(223, 186, 115, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();

        const peaks = waveforms[ch.name]?.peaks;
        const isSilenced = ch.muted || (anySolo && !ch.solo);

        if (peaks && peaks.length > 0) {
          const barCount = peaks.length;
          const step = w / barCount;
          const barWidth = Math.max(1.5, step * 0.66);
          const volScale = Math.min(1.35, ch.volume);

          for (let i = 0; i < barCount; i++) {
            const x = i * step;
            const barRatio = i / barCount;
            const amp = Math.max(0.04, Math.min(1.0, peaks[i] * volScale));
            const barHeight = amp * (h * 0.82);

            if (isSilenced) {
              ctx.fillStyle = "rgba(161, 161, 170, 0.14)";
            } else if (barRatio <= progressRatio) {
              ctx.fillStyle = ch.color;
            } else {
              ctx.fillStyle = "rgba(223, 186, 115, 0.22)";
            }

            ctx.fillRect(x, midY - barHeight / 2, barWidth, barHeight);
          }
        }
        ctx.restore();
      }
    },
    [channels, waveforms, anySolo]
  );

  // Inicializar o recargar canales en el motor de audio
  useEffect(() => {
    let active = true;
    const engine = engineRef.current || new MultiTrackSoundTouchEngine();
    engineRef.current = engine;

    engine.onMeterUpdate = ({ rmsL, rmsR, dbL, dbR }) => {
      const pctL = Math.min(100, Math.sqrt(rmsL) * 142);
      const pctR = Math.min(100, Math.sqrt(rmsR) * 142);
      if (vuBarLRef.current) vuBarLRef.current.style.width = `${pctL.toFixed(1)}%`;
      if (vuBarRRef.current) vuBarRRef.current.style.width = `${pctR.toFixed(1)}%`;
      if (vuDbLabelRef.current) {
        const maxDb = Math.max(dbL, dbR);
        vuDbLabelRef.current.textContent = maxDb <= -59 ? "-∞ dB" : `${maxDb.toFixed(1)} dB`;
      }
    };

    engine.onEnded = () => {
      if (isLooping) {
        engine.seek(0);
        engine.play().catch(console.error);
      } else {
        setIsPlaying(false);
      }
    };

    engine
      .loadChannels(
        channels.map((ch) => ({
          name: ch.name,
          url: ch.url,
          volume: ch.volume,
          pan: ch.pan,
          muted: ch.muted,
          solo: ch.solo,
        })),
        semitones,
        playbackSpeed,
        (loaded, total, stemName) => {
          if (active) {
            setLoadingStatusText(
              `Decodificando pista ${loaded}/${total}: ${stemLabel(stemName)}...`
            );
          }
        }
      )
      .then((computedWaveforms) => {
        if (!active) return;
        setWaveforms(computedWaveforms);
        setDuration(engine.duration);
        setRamUsageMb(engine.getEstimatedMemoryMB());
        setIsLoadingAudio(false);

        if (!track.durationSec && engine.duration > 0) {
          const roundedDur = Math.round(engine.duration);
          fetch(`/api/tracks/${track.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ durationSec: roundedDur }),
          }).catch(() => {});
        }
      })
      .catch((err) => {
        console.error("Error al cargar pistas de audio en Estudio Z:", err);
        if (active) setIsLoadingAudio(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelsKey]);

  // Redibujar formas de onda cuando cambian picos, volumen, mute/solo o el tamaño de ventana
  useEffect(() => {
    drawAllWaveforms(currentTime, duration);
  }, [drawAllWaveforms, currentTime, duration]);

  useEffect(() => {
    const onResize = () => drawAllWaveforms(engineRef.current?.getCurrentTime() ?? 0, duration);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawAllWaveforms, duration]);

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

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Actualizar tonalidad (semitonos)
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSemitones(semitones);
    }
  }, [semitones]);

  // Actualizar velocidad de reproducción (tempo)
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
            setIsLoadingAudio(true);
            setLoadingStatusText("Cargando nuevos stems separados...");
            setChannels(
              newStems.map((s) => ({
                name: s.name,
                label: stemLabel(s.name),
                color: stemColor(s.name),
                url: `/api/tracks/${track.id}/stems/${s.file}`,
                volume: 1.0,
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
    }, 2000);

    return () => clearInterval(interval);
  }, [isSeparating, track.id]);

  // Iniciar separación de stems bajo demanda
  const handleStartSeparation = async (model: StemModel = selectedModel) => {
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

  const handleSeek = useCallback(
    (timeSec: number) => {
      const clamped = Math.max(0, Math.min(duration || 1000, timeSec));
      setCurrentTime(clamped);
      if (engineRef.current) {
        engineRef.current.seek(clamped);
      }
    },
    [duration]
  );

  const handlePlay = useCallback(async () => {
    if (!engineRef.current) return;
    try {
      await engineRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn("Error al reproducir audio:", e);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePause, handlePlay]);

  const handleSkip = useCallback(
    (secondsDelta: number) => {
      const cur = engineRef.current ? engineRef.current.getCurrentTime() : currentTime;
      handleSeek(cur + secondsDelta);
    },
    [currentTime, handleSeek]
  );

  // Atajos de teclado de estudio (Espacio = Play/Pause, Flechas = ±5s) al estilo Mossi
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (!isLoadingAudio) handleTogglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handleSkip(-5);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleSkip(5);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLoadingAudio, handleTogglePlay, handleSkip]);

  // Bucle de sincronización de tiempo a 60fps con requestAnimationFrame
  useEffect(() => {
    let animId: number;

    const updateTick = () => {
      if (engineRef.current && isPlaying) {
        const cur = engineRef.current.getCurrentTime();
        setCurrentTime(cur);
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

  // Modificar canal individual (volumen, panorama, mute, solo)
  const updateChannel = (name: string, updates: Partial<StemChannelState>) => {
    setActivePreset("all");
    setChannels((prev) => {
      const next = prev.map((c) => (c.name === name ? { ...c, ...updates } : c));
      const target = next.find((c) => c.name === name);
      if (target && engineRef.current) {
        engineRef.current.updateChannel(name, {
          volume: target.volume,
          pan: target.pan,
          muted: target.muted,
          solo: target.solo,
        });
      }
      return next;
    });
  };

  const toggleMute = (name: string) => {
    setActivePreset("all");
    setChannels((prev) => {
      const next = prev.map((c) =>
        c.name === name ? { ...c, muted: !c.muted, solo: !c.muted ? false : c.solo } : c
      );
      const target = next.find((c) => c.name === name);
      if (target && engineRef.current) {
        engineRef.current.updateChannel(name, { muted: target.muted, solo: target.solo });
      }
      return next;
    });
  };

  const toggleSolo = (name: string) => {
    setActivePreset("all");
    setChannels((prev) => {
      const next = prev.map((c) =>
        c.name === name ? { ...c, solo: !c.solo, muted: !c.solo ? false : c.muted } : c
      );
      const target = next.find((c) => c.name === name);
      if (target && engineRef.current) {
        engineRef.current.updateChannel(name, { solo: target.solo, muted: target.muted });
      }
      return next;
    });
  };

  // Preajustes rápidos de práctica (inspirados en Mossi: Karaoke, Sin Batería, Sin Bajo, Solo Voz)
  const applyPracticePreset = (preset: PracticePreset) => {
    setActivePreset(preset);
    setChannels((prev) => {
      const next = prev.map((c) => {
        let muted = false;
        let solo = false;
        if (preset === "karaoke" && c.name === "vocals") muted = true;
        if (preset === "drumless" && c.name === "drums") muted = true;
        if (preset === "bassless" && c.name === "bass") muted = true;
        if (preset === "guitarless" && c.name === "guitar") muted = true;
        if (preset === "acapella" && c.name === "vocals") solo = true;
        if (engineRef.current) {
          engineRef.current.updateChannel(c.name, { muted, solo });
        }
        return { ...c, muted, solo };
      });
      return next;
    });
  };

  // Exportar mezcla personalizada (.WAV 24-bit Studio PCM con Mute/Solo/Vol/Pan/Tono aplicados)
  const handleExportCustomMix = async () => {
    if (!engineRef.current || isExportingMix || isLoadingAudio) return;
    setIsExportingMix(true);
    setExportProgress(5);
    try {
      const wavBlob = await engineRef.current.exportCustomMixWav((pct) => {
        setExportProgress(pct);
      });
      if (wavBlob) {
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement("a");
        const suffix =
          activePreset !== "all"
            ? `_${activePreset}`
            : semitones !== 0
            ? `_${displayedTransposedKey}`
            : "_mezcla";
        a.href = url;
        a.download = `${track.title.replace(/[^\w\s-]/g, "").trim() || "estudio"}${suffix}_24bit.wav`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
    } catch (err) {
      console.error("Error exportando mezcla:", err);
    } finally {
      setIsExportingMix(false);
      setExportProgress(0);
    }
  };

  // Tonalidad y BPM efectivos calculados con la transposición y velocidad
  const baseKey = track.musicalKey || track.song?.currentKey || track.song?.originalKey || "C";
  const displayedTransposedKey = transposeKey(baseKey, semitones) || baseKey;

  const baseBpm = track.bpm || track.song?.tempo || 120;
  const effectiveBpm = Math.round(baseBpm * playbackSpeed);
  const isBitPerfectBypass = semitones === 0 && Math.abs(playbackSpeed - 1.0) < 1e-4;

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

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !duration) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    handleSeek(ratio * duration);
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
            <span className="studio-badge-pro">ESTUDIO Z · PRO</span>
            <div className="studio-title-block">
              <h1 className="studio-track-title" title={track.title}>
                {track.title}
              </h1>
              <span className="studio-track-artist">
                {track.artist || track.song?.artist || "Tab-NuevaVida Studio"}
              </span>
            </div>
          </div>
        </div>

        {/* Centro: Tono, Tempo y Medidor Maestro Estéreo L/R (Estilo Mossi) */}
        <div className="studio-header-center">
          {/* Tonalidad con control de transposición */}
          <div className="studio-tool-capsule" title="Tonalidad actual y transposición WSOLA">
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
                −
              </button>
              <button
                className="capsule-btn reset"
                onClick={() => setSemitones(0)}
                title="Restablecer tono original (Bypass Bit-Perfect)"
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
          <div className="studio-tool-capsule" title="Tempo efectivo y velocidad de reproducción">
            <span className="capsule-label">BPM:</span>
            <span className="capsule-value">{effectiveBpm}</span>
            <select
              className="capsule-select"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              title="Velocidad de reproducción"
            >
              <option value="0.5">0.50x</option>
              <option value="0.75">0.75x</option>
              <option value="0.9">0.90x</option>
              <option value="1">1.00x</option>
              <option value="1.1">1.10x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.50x</option>
            </select>
          </div>

          {/* Medidor VU Maestro Estéreo L/R en Tiempo Real (Integrado de Mossi) */}
          <div className="studio-vu-capsule" title="Medidor RMS Estéreo Maestro en tiempo real">
            <div className="studio-vu-bars">
              <div className="studio-vu-row">
                <span className="studio-vu-ch">L</span>
                <div className="studio-vu-track">
                  <div ref={vuBarLRef} className="studio-vu-fill" />
                </div>
              </div>
              <div className="studio-vu-row">
                <span className="studio-vu-ch">R</span>
                <div className="studio-vu-track">
                  <div ref={vuBarRRef} className="studio-vu-fill" />
                </div>
              </div>
            </div>
            <span ref={vuDbLabelRef} className="studio-vu-db">
              -∞ dB
            </span>
          </div>
        </div>

        {/* Derecha: Exportar Mezcla .WAV, Acordes, IA y Pantalla Completa */}
        <div className="studio-header-right">
          {track.song && (
            <button
              className={`studio-header-btn ${showChordsDrawer ? "active" : ""}`}
              onClick={() => setShowChordsDrawer(!showChordsDrawer)}
              title="Ver cifrado y letra sincronizada"
            >
              <BookOpen size={15} />
              <span className="btn-text">Cifrado</span>
            </button>
          )}

          {canManage && !hasStems && (
            <div className="studio-ai-group">
              <select
                className="studio-model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as StemModel)}
                disabled={isSeparating}
                title="Modelo de separación IA"
              >
                <option value="htdemucs_6s">6 Stems (Voz/Bat/Bajo/Gtr/Pno/Otros)</option>
                <option value="htdemucs">4 Stems (Voz/Bat/Bajo/Otros · Preciso)</option>
              </select>
              <button
                className="studio-header-btn ai-btn"
                onClick={() => handleStartSeparation(selectedModel)}
                disabled={isSeparating}
                title="Separar pistas con Demucs IA + Motor Espectral Mossi"
              >
                <Sparkles size={15} />
                <span className="btn-text">
                  {isSeparating ? `Separando (${separationProgress}%)` : "Separar Stems"}
                </span>
              </button>
            </div>
          )}

          <button
            className="studio-header-btn gold-outline"
            onClick={handleExportCustomMix}
            disabled={isLoadingAudio || isExportingMix}
            title="Exportar mezcla personalizada actual (con tus ajustes de Mute, Solo, Volumen, Pan y Tono) en WAV 24-bit Studio PCM"
          >
            <Disc3 size={15} className={isExportingMix ? "spin-icon" : ""} />
            <span className="btn-text">
              {isExportingMix ? `Exportando (${exportProgress}%)` : "Exportar Mezcla (.WAV)"}
            </span>
          </button>

          <a
            href={`/api/tracks/${track.id}?download=1`}
            className="studio-header-btn"
            title="Descargar archivo de audio original"
            download
          >
            <Download size={15} />
          </a>

          <button
            className="studio-header-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {/* ---------- BARRA DE PREAJUSTES RÁPIDOS DE PRÁCTICA Y TELEMETRÍA (ESTILO MOSSI) ---------- */}
      <div className="studio-subbar">
        <div className="studio-presets-row">
          <span className="subbar-label">
            <Sliders size={13} />
            <span>Preajustes de ensayo:</span>
          </span>
          <button
            type="button"
            className={`studio-preset-chip ${activePreset === "all" ? "active" : ""}`}
            onClick={() => applyPracticePreset("all")}
            disabled={!hasStems}
          >
            Todo Activo
          </button>
          <button
            type="button"
            className={`studio-preset-chip ${activePreset === "karaoke" ? "active" : ""}`}
            onClick={() => applyPracticePreset("karaoke")}
            disabled={!hasStems}
            title="Silenciar la voz principal (Pista de acompañamiento)"
          >
            Karaoke (Sin Voz)
          </button>
          <button
            type="button"
            className={`studio-preset-chip ${activePreset === "drumless" ? "active" : ""}`}
            onClick={() => applyPracticePreset("drumless")}
            disabled={!hasStems}
            title="Silenciar batería para práctica de bateristas"
          >
            Sin Batería
          </button>
          <button
            type="button"
            className={`studio-preset-chip ${activePreset === "bassless" ? "active" : ""}`}
            onClick={() => applyPracticePreset("bassless")}
            disabled={!hasStems}
            title="Silenciar bajo para práctica de bajistas"
          >
            Sin Bajo
          </button>
          {channels.some((c) => c.name === "guitar") && (
            <button
              type="button"
              className={`studio-preset-chip ${activePreset === "guitarless" ? "active" : ""}`}
              onClick={() => applyPracticePreset("guitarless")}
              disabled={!hasStems}
              title="Silenciar guitarras"
            >
              Sin Guitarras
            </button>
          )}
          <button
            type="button"
            className={`studio-preset-chip ${activePreset === "acapella" ? "active" : ""}`}
            onClick={() => applyPracticePreset("acapella")}
            disabled={!hasStems}
            title="Aislar únicamente la voz (Solo Voz)"
          >
            Solo Voz
          </button>
        </div>

        <div className="studio-telemetry-pills">
          <span
            className={`telemetry-badge ${isBitPerfectBypass ? "bypass" : "wsola"}`}
            title={
              isBitPerfectBypass
                ? "Audio 100% transparente sin procesamiento WSOLA al estar en tono y velocidad originales"
                : "Procesamiento WSOLA de fase bloqueada sobre el bus maestro"
            }
          >
            <Activity size={12} />
            <span>
              {isBitPerfectBypass
                ? "Sincronía 1-Sample · Bypass Bit-Perfect"
                : `Sincronía 1-Sample · WSOLA (${semitones > 0 ? `+${semitones}` : semitones} st)`}
            </span>
          </span>
          <span className="telemetry-ram" title="Memoria PCM Float32 activa en Web Audio API">
            RAM Audio: <strong>{ramUsageMb} MB</strong>
          </span>
        </div>
      </div>

      {/* ---------- AVISO DE SEPARACIÓN EN CURSO ---------- */}
      {isSeparating && (
        <div className="studio-processing-banner">
          <div className="banner-left">
            <div className="ai-spinner" />
            <div>
              <strong>Separando pistas con IA HTDemucs + Motor Espectral Mossi...</strong>
              <p className="muted">
                Extrayendo instrumentos con reconstrucción WOLA en alta resolución. Progreso: {separationProgress}%
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

      {/* ---------- CUERPO PRINCIPAL DEL ESTUDIO (MIXER + CANVAS TIMELINE) ---------- */}
      <div className="studio-workspace">
        {/* PANEL DE MEZCLADOR LATERAL (CHANNELS LIST CON VOLUMEN, PAN, MUTE, SOLO Y DESCARGA) */}
        <div className="studio-mixer">
          <div className="mixer-header">
            <span className="mixer-title">CANALES (M / S / VOL / PAN)</span>
            <span className="mixer-count">
              {isLoadingAudio
                ? loadingStatusText
                : `${channels.length} ${channels.length === 1 ? "pista" : "stems"}`}
            </span>
          </div>

          <div className="mixer-channels">
            {channels.map((ch) => {
              const effectivelySilenced = ch.muted || (anySolo && !ch.solo);
              return (
                <div
                  key={ch.name}
                  className={`mixer-strip ${effectivelySilenced ? "is-muted" : ""} ${ch.solo ? "is-solo" : ""}`}
                  style={{ "--stem-accent": ch.color } as React.CSSProperties}
                >
                  <div className="strip-top">
                    <span
                      className="strip-indicator"
                      style={{ backgroundColor: ch.color, boxShadow: `0 0 8px ${ch.color}` }}
                    />
                    <span className="strip-name" title={ch.label}>
                      {ch.label}
                    </span>
                    <div className="strip-actions">
                      <button
                        className={`btn-ms btn-mute ${ch.muted ? "active" : ""}`}
                        onClick={() => toggleMute(ch.name)}
                        title={
                          ch.muted
                            ? "Activar pista"
                            : "Silenciar pista (Mute con rampa suave de 15ms)"
                        }
                      >
                        M
                      </button>
                      <button
                        className={`btn-ms btn-solo ${ch.solo ? "active" : ""}`}
                        onClick={() => toggleSolo(ch.name)}
                        title={ch.solo ? "Desactivar Solo" : "Aislar esta pista (Solo)"}
                      >
                        S
                      </button>
                      <a
                        href={`${ch.url}?download=1`}
                        download={`${track.title} - ${ch.label}`}
                        className="btn-ms btn-dl-stem"
                        title={`Descargar stem individual: ${ch.label}`}
                      >
                        ⇩
                      </a>
                    </div>
                  </div>

                  {/* Slider de Volumen por pista (0% a 140% con doble clic para 100%) */}
                  <div className="strip-slider-row" title="Doble clic para restablecer volumen al 100%">
                    <span className="strip-param-label">Vol</span>
                    <input
                      type="range"
                      min="0"
                      max="1.4"
                      step="0.01"
                      value={ch.muted ? 0 : ch.volume}
                      onChange={(e) =>
                        updateChannel(ch.name, {
                          volume: Number(e.target.value),
                          muted: false,
                        })
                      }
                      onDoubleClick={() => updateChannel(ch.name, { volume: 1.0, muted: false })}
                      className="strip-slider"
                      style={{ accentColor: ch.color }}
                    />
                    <span className="slider-pct">
                      {ch.muted ? "0%" : `${Math.round(ch.volume * 100)}%`}
                    </span>
                  </div>

                  {/* Slider de Panorama Estéreo L/R (Estilo Mossi con doble clic para centrar en C) */}
                  <div className="strip-slider-row" title="Panorama estéreo (Doble clic para centrar en C)">
                    <span className="strip-param-label">Pan</span>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={ch.pan}
                      onChange={(e) =>
                        updateChannel(ch.name, {
                          pan: Number(e.target.value),
                        })
                      }
                      onDoubleClick={() => updateChannel(ch.name, { pan: 0 })}
                      className="strip-slider pan-slider"
                      style={{ accentColor: "#dfba73" }}
                    />
                    <span className="slider-pct pan-val">{formatPanLabel(ch.pan)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tarjeta para iniciar separación si aún está en pista única */}
          {!hasStems && canManage && (
            <div className="mixer-promo-card">
              <Sparkles size={20} className="promo-icon" />
              <h4>¿Separar voces e instrumentos?</h4>
              <p>
                Extrae Voz, Batería, Bajo, Guitarras y Piano en pistas independientes sincronizadas al sample.
              </p>
              <button
                className="btn small gold"
                onClick={() => handleStartSeparation(selectedModel)}
                disabled={isSeparating}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {isSeparating ? "Procesando..." : "Separar en Stems"}
              </button>
            </div>
          )}
        </div>

        {/* LIENZO DE LÍNEA DE TIEMPO Y FORMAS DE ONDA REALES EN <CANVAS> */}
        <div className="studio-timeline-panel">
          {/* Regla de tiempo proporcional superior */}
          <div className="timeline-ruler">
            <div className="ruler-mark"><span>0:00</span></div>
            <div className="ruler-mark"><span>{formatDuration(duration * 0.25)}</span></div>
            <div className="ruler-mark"><span>{formatDuration(duration * 0.5)}</span></div>
            <div className="ruler-mark"><span>{formatDuration(duration * 0.75)}</span></div>
            <div className="ruler-mark" style={{ textAlign: "right", paddingRight: "0.5rem" }}>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Carriles de formas de onda renderizados en Canvas de alta resolución */}
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
              const effectivelySilenced = ch.muted || (anySolo && !ch.solo);
              const telemetry = waveforms[ch.name];

              return (
                <div
                  key={ch.name}
                  className={`timeline-lane ${effectivelySilenced ? "lane-muted" : ""}`}
                  style={{ "--lane-color": ch.color } as React.CSSProperties}
                >
                  <div className="lane-label" style={{ color: ch.color }}>
                    <span
                      className="lane-dot"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span>{ch.label}</span>
                  </div>

                  {/* Badge de telemetría RMS por pista (estilo Mossi) */}
                  <div className="lane-telemetry-badge">
                    {telemetry
                      ? `RMS: ${telemetry.rmsDb} dB · Pan: ${formatPanLabel(ch.pan)}`
                      : "Decodificando onda..."}
                  </div>

                  <canvas
                    ref={(el) => {
                      if (el) {
                        canvasMapRef.current.set(ch.name, el);
                      } else {
                        canvasMapRef.current.delete(ch.name);
                      }
                    }}
                    className="studio-stem-canvas"
                  />
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

      {/* ---------- BARRA DE TRANSPORTE INFERIOR (FOOTER DAW) ---------- */}
      <footer className="studio-transport">
        {/* Lado izquierdo: Información de la pista */}
        <div className="transport-track-info">
          <div className="track-disc-icon">
            <Radio size={20} />
          </div>
          <div className="track-meta">
            <strong className="track-name">{track.title}</strong>
            <span className="track-sub">
              Tono: <strong style={{ color: "#dfba73" }}>{displayedTransposedKey}</strong> · {effectiveBpm} BPM
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
              title="Retroceder 5 segundos (Flecha Izquierda)"
            >
              <Rewind size={18} />
            </button>

            <button
              className="ctrl-btn-play"
              onClick={handleTogglePlay}
              disabled={isLoadingAudio}
              title={
                isLoadingAudio
                  ? "Cargando audio..."
                  : isPlaying
                  ? "Pausar (Espacio)"
                  : "Reproducir (Espacio)"
              }
            >
              {isLoadingAudio ? (
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(13,12,11,0.3)",
                    borderTopColor: "#0d0c0b",
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
              title="Avanzar 5 segundos (Flecha Derecha)"
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
              step="0.05"
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
                title="Bajar medio tono"
              >
                −
              </button>
              <span
                className="pill-value"
                onClick={() => setSemitones(0)}
                style={{ cursor: "pointer" }}
                title="Clic para restablecer a 0 st"
              >
                {semitones > 0 ? `+${semitones}` : semitones}
              </span>
              <button
                className="pill-btn"
                onClick={() => setSemitones((s) => Math.min(12, s + 1))}
                title="Subir medio tono"
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
              title={isMasterMuted ? "Restablecer volumen maestro" : "Silenciar salida maestra"}
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
