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
  Zap,
  Check,
  CloudDownload,
  ShieldCheck,
  Circle,
} from "lucide-react";
import { formatDuration, stemColor, stemLabel, type StemFile, type StemModel } from "@/lib/stems";
import { transposeKey } from "@/lib/chordpro";
import SongViewer from "@/components/SongViewer";
import {
  MultiTrackSoundTouchEngine,
  type StemWaveformTelemetry,
} from "@/lib/audio-engine";
import {
  MultiTrackAudioRecorder,
  getAudioInputDevices,
  type AudioInputDevice,
  type InputRoutingMode,
  type InputMeterTelemetry,
} from "@/lib/audio-recorder";
import {
  getHardwareProfile,
  requestScreenWakeLock,
  releaseScreenWakeLock,
  isStemCachedLocally,
  saveStemToLocalCache,
  deleteStemFromLocalCache,
  requestStoragePersistence,
  type HardwareProfile,
} from "@/lib/tablet-profiler";

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

  // Optimizaciones de hardware y escenario para Tablets
  const [hardwareProfile, setHardwareProfile] = useState<HardwareProfile | null>(null);
  const [isOfflineSaved, setIsOfflineSaved] = useState(false);
  const [isSavingOffline, setIsSavingOffline] = useState(false);
  const [isEcoMode, setIsEcoMode] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Grabación multipista y conexión de interface física
  const [showRecordDrawer, setShowRecordDrawer] = useState(false);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [inputDevices, setInputDevices] = useState<AudioInputDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("default");
  const [routingMode, setRoutingMode] = useState<InputRoutingMode>("mono_ch1");
  const [customChannelIdx, setCustomChannelIdx] = useState(0);
  const [maxPhysicalChannels, setMaxPhysicalChannels] = useState(2);
  const [inputMeter, setInputMeter] = useState<InputMeterTelemetry>({ rms: 0, db: -60, isClipping: false });
  const [isSoftwareMonitoring, setIsSoftwareMonitoring] = useState(false);
  const [latencyCompensationMs, setLatencyCompensationMs] = useState(20);
  const [isMeasuringLatency, setIsMeasuringLatency] = useState(false);
  const [recordedTakesCount, setRecordedTakesCount] = useState(0);
  const recorderRef = useRef<MultiTrackAudioRecorder | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const canvasMapRef = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const vuBarLRef = useRef<HTMLDivElement>(null);
  const vuBarRRef = useRef<HTMLDivElement>(null);
  const vuDbLabelRef = useRef<HTMLSpanElement>(null);

  // Referencias para manipulación directa del DOM (Zero Re-renders en bucle de reproducción a 60/30fps)
  const playheadRef = useRef<HTMLDivElement>(null);
  const playheadTagRef = useRef<HTMLDivElement>(null);
  const scrubSliderRef = useRef<HTMLInputElement>(null);
  const timeCurrentLabelRef = useRef<HTMLSpanElement>(null);
  const lastWaveformRedrawRef = useRef<number>(0);
  const lastReactSyncRef = useRef<number>(0);

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

  // Redibujar formas de onda estáticas cuando cambian picos, canales o volumen/mute/solo
  useEffect(() => {
    const cur = engineRef.current?.getCurrentTime() ?? 0;
    drawAllWaveforms(cur, duration);
  }, [drawAllWaveforms, duration]);

  useEffect(() => {
    const onResize = () => drawAllWaveforms(engineRef.current?.getCurrentTime() ?? 0, duration);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawAllWaveforms, duration]);

  // Detección de perfil de hardware y verificación de almacenamiento offline
  useEffect(() => {
    let active = true;
    getHardwareProfile(isEcoMode).then((prof) => {
      if (!active) return;
      setHardwareProfile(prof);
    });

    const checkOffline = async () => {
      if (channels.length === 0) return;
      let allCached = true;
      for (const ch of channels) {
        const cached = await isStemCachedLocally(ch.url);
        if (!cached) {
          allCached = false;
          break;
        }
      }
      if (active) setIsOfflineSaved(allCached);
    };
    checkOffline();

    return () => {
      active = false;
    };
  }, [channels, isEcoMode]);

  // Screen Wake Lock API y Watchdog de pantalla para Tablets en atril
  useEffect(() => {
    requestStoragePersistence().catch(() => {});
    requestScreenWakeLock().then((acquired) => {
      setWakeLockActive(acquired);
    });

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        requestScreenWakeLock().then((acquired) => {
          setWakeLockActive(acquired);
        });
        if (engineRef.current && isPlaying) {
          engineRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      releaseScreenWakeLock();
    };
  }, [isPlaying]);

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

  // Limpieza del motor de audio al desmontar
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Inicialización y limpieza del grabador multipista
  useEffect(() => {
    const recorder = new MultiTrackAudioRecorder((m) => {
      setInputMeter(m);
    });
    recorderRef.current = recorder;
    return () => {
      recorder.destroy();
      recorderRef.current = null;
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
      const safeDur = duration > 0 ? duration : 1;
      const pct = Math.max(0, Math.min(100, (clamped / safeDur) * 100));

      // Sincronización directa al DOM
      if (playheadRef.current) playheadRef.current.style.left = `${pct}%`;
      if (playheadTagRef.current) playheadTagRef.current.textContent = formatDuration(clamped);
      if (scrubSliderRef.current) scrubSliderRef.current.value = String(clamped);
      if (timeCurrentLabelRef.current) timeCurrentLabelRef.current.textContent = formatDuration(clamped);

      drawAllWaveforms(clamped, duration);

      if (engineRef.current) {
        engineRef.current.seek(clamped);
      }
    },
    [duration, drawAllWaveforms]
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
      const cur = engineRef.current.getCurrentTime();
      setCurrentTime(cur);
      drawAllWaveforms(cur, duration);
    }
    setIsPlaying(false);
  }, [duration, drawAllWaveforms]);

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

  // Almacenar o eliminar stems en la memoria flash de la tablet para uso 100% offline
  const handleToggleOfflineSave = async () => {
    if (isSavingOffline || channels.length === 0) return;
    setIsSavingOffline(true);
    try {
      if (isOfflineSaved) {
        for (const ch of channels) {
          await deleteStemFromLocalCache(ch.url);
        }
        setIsOfflineSaved(false);
      } else {
        await requestStoragePersistence();
        for (const ch of channels) {
          await saveStemToLocalCache(ch.url);
        }
        setIsOfflineSaved(true);
      }
    } catch (err) {
      console.warn("Error al actualizar almacenamiento offline de stems:", err);
    } finally {
      setIsSavingOffline(false);
    }
  };

  // Control de conexión de interface física y grabación multipista
  const handleToggleRecordDrawer = async () => {
    if (showRecordDrawer) {
      if (!isRecordingActive) {
        if (recorderRef.current) {
          recorderRef.current.stopInput();
        }
        setShowRecordDrawer(false);
      }
      return;
    }

    setShowRecordDrawer(true);
    const devices = await getAudioInputDevices();
    setInputDevices(devices);
    const initialDevId = devices[0]?.deviceId || "default";
    setSelectedDeviceId(initialDevId);

    if (recorderRef.current) {
      const detected = await recorderRef.current.initializeInput(initialDevId, 2);
      setMaxPhysicalChannels(detected);
      recorderRef.current.setRouting(routingMode, customChannelIdx);
      recorderRef.current.setMonitoring(isSoftwareMonitoring);
    }
  };

  const handleDeviceChange = async (devId: string) => {
    setSelectedDeviceId(devId);
    if (recorderRef.current) {
      const detected = await recorderRef.current.initializeInput(devId, maxPhysicalChannels);
      setMaxPhysicalChannels(detected);
      recorderRef.current.setRouting(routingMode, customChannelIdx);
      recorderRef.current.setMonitoring(isSoftwareMonitoring);
    }
  };

  const handleRoutingChange = (mode: InputRoutingMode, idx = 0) => {
    setRoutingMode(mode);
    setCustomChannelIdx(idx);
    if (recorderRef.current) {
      recorderRef.current.setRouting(mode, idx);
    }
  };

  const handleMonitoringToggle = (enabled: boolean) => {
    setIsSoftwareMonitoring(enabled);
    if (recorderRef.current) {
      recorderRef.current.setMonitoring(enabled);
    }
  };

  const handleAutoMeasureLatency = async () => {
    if (!recorderRef.current || isMeasuringLatency) return;
    setIsMeasuringLatency(true);
    try {
      const measuredMs = await recorderRef.current.measureLoopbackLatency();
      setLatencyCompensationMs(measuredMs);
    } catch (err) {
      console.warn("Fallo en medición de latencia:", err);
    } finally {
      setIsMeasuringLatency(false);
    }
  };

  const handleStartRecording = async () => {
    if (!recorderRef.current || isRecordingActive) return;

    recorderRef.current.startRecording();
    setIsRecordingActive(true);

    if (engineRef.current) {
      await engineRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleStopRecording = async () => {
    if (!recorderRef.current || !isRecordingActive) return;

    if (engineRef.current) {
      engineRef.current.pause();
      setIsPlaying(false);
    }

    try {
      const result = await recorderRef.current.stopRecording(latencyCompensationMs);
      setIsRecordingActive(false);

      const nextCount = recordedTakesCount + 1;
      setRecordedTakesCount(nextCount);
      const newStemName = `rec_take_${nextCount}`;
      const newLabel = `Toma ${nextCount} (Grabada)`;

      const newChannel: StemChannelState = {
        name: newStemName,
        label: newLabel,
        color: "#ef4444",
        url: result.url,
        volume: 1.0,
        muted: false,
        solo: false,
        pan: 0,
      };

      setWaveforms((prev) => ({
        ...prev,
        [newStemName]: { peaks: result.peaks, rmsDb: result.rmsDb },
      }));

      setChannels((prev) => [...prev, newChannel]);

      if (result.durationSec > duration) {
        setDuration(result.durationSec);
      }
    } catch (err) {
      console.error("Error al finalizar la toma de grabación:", err);
      setIsRecordingActive(false);
    }
  };

  // Integración nativa con MediaSession API (pantalla bloqueada, auriculares, pedales de escenario Bluetooth)
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist || "Tab-church",
        album: "Estudio Z",
        artwork: [{ src: "/iconoApp.svg", sizes: "512x512", type: "image/svg+xml" }],
      });

      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

      navigator.mediaSession.setActionHandler("play", () => handlePlay());
      navigator.mediaSession.setActionHandler("pause", () => handlePause());
      navigator.mediaSession.setActionHandler("seekbackward", () => handleSkip(-5));
      navigator.mediaSession.setActionHandler("seekforward", () => handleSkip(5));
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (typeof details.seekTime === "number") {
          handleSeek(details.seekTime);
        }
      });
    } catch {
      // Ignorar navegadores sin soporte completo
    }

    return () => {
      if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
        try {
          navigator.mediaSession.setActionHandler("play", null);
          navigator.mediaSession.setActionHandler("pause", null);
          navigator.mediaSession.setActionHandler("seekbackward", null);
          navigator.mediaSession.setActionHandler("seekforward", null);
          navigator.mediaSession.setActionHandler("seekto", null);
        } catch {
          // Ignorar
        }
      }
    };
  }, [track.title, track.artist, isPlaying, handlePlay, handlePause, handleSkip, handleSeek]);

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

  // Bucle de sincronización de tiempo directo al DOM (Zero Re-renders en el árbol React durante reproducción)
  useEffect(() => {
    let animId: number;

    const updateTick = (now: number) => {
      if (engineRef.current && isPlaying) {
        const cur = engineRef.current.getCurrentTime();
        const safeDur = duration > 0 ? duration : 1;
        const pct = Math.max(0, Math.min(100, (cur / safeDur) * 100));

        // 1. Mover aguja por estilo directo (GPU compositor sin recalcular layout)
        if (playheadRef.current) {
          playheadRef.current.style.left = `${pct}%`;
        }
        if (playheadTagRef.current) {
          playheadTagRef.current.textContent = formatDuration(cur);
        }
        if (scrubSliderRef.current) {
          scrubSliderRef.current.value = String(cur);
        }
        if (timeCurrentLabelRef.current) {
          timeCurrentLabelRef.current.textContent = formatDuration(cur);
        }

        // 2. Throttled: Redibujar división de color en formas de onda cada 250ms (en lugar de cada frame)
        if (now - lastWaveformRedrawRef.current > 250) {
          lastWaveformRedrawRef.current = now;
          drawAllWaveforms(cur, duration);
        }

        // 3. Throttled: Sincronizar estado React cada 1 segundo para drawers/acordes
        if (now - lastReactSyncRef.current > 1000) {
          lastReactSyncRef.current = now;
          setCurrentTime(cur);
        }
      }

      if (isPlaying) {
        animId = requestAnimationFrame(updateTick);
      }
    };

    if (isPlaying) {
      animId = requestAnimationFrame(updateTick);
    }

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, duration, drawAllWaveforms]);

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

        {/* Derecha: Exportar Mezcla .WAV, Acordes, IA, Grabar y Pantalla Completa */}
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

          {/* Botón de armado y apertura del panel de grabación multipista */}
          <button
            className={`studio-header-btn record-header-btn ${isRecordingActive ? "recording-active" : ""}`}
            onClick={handleToggleRecordDrawer}
            title="Conectar interface de audio y grabar toma en multipista"
          >
            <Circle
              size={12}
              fill={isRecordingActive ? "#ef4444" : "currentColor"}
              color={isRecordingActive ? "#ef4444" : "currentColor"}
              className={isRecordingActive ? "rec-pulse-dot" : ""}
            />
            <span className="btn-text">{isRecordingActive ? "Grabando..." : "Grabar"}</span>
          </button>

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
          {/* Botón para persistir stems en almacenamiento flash de la tablet (Modo 100% Offline) */}
          <button
            type="button"
            className={`telemetry-badge tablet-offline-btn ${isOfflineSaved ? "saved" : ""}`}
            onClick={handleToggleOfflineSave}
            disabled={isSavingOffline || channels.length === 0}
            title={
              isOfflineSaved
                ? "Stems guardados en la memoria flash de la tablet para uso 100% offline. Clic para liberar espacio."
                : "Guardar todos los stems en la memoria flash de la tablet para ensayar sin internet"
            }
          >
            {isOfflineSaved ? (
              <>
                <Check size={12} style={{ color: "#10b981" }} />
                <span>En Disco (Offline)</span>
              </>
            ) : (
              <>
                <CloudDownload size={12} className={isSavingOffline ? "spin-icon" : ""} />
                <span>{isSavingOffline ? "Guardando..." : "Guardar Offline"}</span>
              </>
            )}
          </button>

          {/* Selector de Modo Eco / Escenario adaptativo para Tablets */}
          <button
            type="button"
            className={`telemetry-badge tablet-eco-btn ${isEcoMode ? "eco-active" : ""}`}
            onClick={() => setIsEcoMode((e) => !e)}
            title={`Perfil detectado: ${hardwareProfile ? `${hardwareProfile.isTablet ? "Tablet" : "Desktop"} (${hardwareProfile.tier}, ${hardwareProfile.recommendedBufferSize} samples)` : "Estándar"}. Clic para alternar Modo Escenario / Ahorro de Recursos.`}
          >
            <Zap size={12} />
            <span>{isEcoMode ? "Modo Eco" : "Modo Normal"}</span>
          </button>

          {/* Indicador de pantalla activa en atril (Screen Wake Lock) */}
          {wakeLockActive && (
            <span
              className="telemetry-badge tablet-wakelock-badge"
              title="Screen Wake Lock activo: la pantalla no se apagará en el atril"
            >
              <ShieldCheck size={12} style={{ color: "#dfba73" }} />
              <span>Pantalla Activa</span>
            </span>
          )}

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
            RAM: <strong>{ramUsageMb} MB</strong>
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
              ref={playheadRef}
              className="playback-playhead"
              style={{
                left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              }}
            >
              <div ref={playheadTagRef} className="playhead-tag">{formatDuration(currentTime)}</div>
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

        {/* DRAWER LATERAL: CONEXIÓN DE INTERFACE FÍSICA Y GRABACIÓN MULTIPISTA */}
        {showRecordDrawer && (
          <aside className="studio-record-drawer">
            <div className="drawer-header">
              <div className="record-drawer-title">
                <Circle
                  size={14}
                  fill="#ef4444"
                  color="#ef4444"
                  className={isRecordingActive ? "rec-pulse-dot" : ""}
                />
                <h3>Grabación Multipista</h3>
              </div>
              <button
                className="btn-close"
                onClick={handleToggleRecordDrawer}
                disabled={isRecordingActive}
                title="Cerrar panel de grabación"
              >
                ✕
              </button>
            </div>

            <div className="drawer-body record-drawer-body">
              {/* 1. Selector de Interfaz de Audio Física */}
              <div className="record-field-group">
                <label className="record-field-label">Interface / Entrada de Audio:</label>
                <select
                  className="record-select"
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  disabled={isRecordingActive}
                >
                  {inputDevices.length === 0 ? (
                    <option value="default">Micrófono por defecto del sistema</option>
                  ) : (
                    inputDevices.map((dev) => (
                      <option key={dev.deviceId} value={dev.deviceId}>
                        {dev.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* 2. Enrutamiento de Canales Físicos */}
              <div className="record-field-group">
                <label className="record-field-label">Canal Físico a Grabar:</label>
                <div className="record-routing-pills">
                  <button
                    type="button"
                    className={`routing-pill ${routingMode === "mono_ch1" ? "active" : ""}`}
                    onClick={() => handleRoutingChange("mono_ch1")}
                    disabled={isRecordingActive}
                  >
                    Canal 1 (Mono)
                  </button>
                  <button
                    type="button"
                    className={`routing-pill ${routingMode === "mono_ch2" ? "active" : ""}`}
                    onClick={() => handleRoutingChange("mono_ch2")}
                    disabled={isRecordingActive || maxPhysicalChannels < 2}
                  >
                    Canal 2 (Mono)
                  </button>
                  <button
                    type="button"
                    className={`routing-pill ${routingMode === "stereo_1_2" ? "active" : ""}`}
                    onClick={() => handleRoutingChange("stereo_1_2")}
                    disabled={isRecordingActive || maxPhysicalChannels < 2}
                  >
                    1-2 (Estéreo)
                  </button>
                </div>
              </div>

              {/* 3. Vúmetro de Entrada en Vivo con Detección de Clipping */}
              <div className="record-meter-card">
                <div className="meter-card-header">
                  <span>Nivel Pre-Fader</span>
                  <span className={`meter-db-badge ${inputMeter.isClipping ? "clip-alert" : ""}`}>
                    {inputMeter.isClipping ? "¡CLIP!" : `${inputMeter.db} dBFS`}
                  </span>
                </div>
                <div className="input-vu-track">
                  <div
                    className={`input-vu-fill ${inputMeter.isClipping ? "fill-clip" : ""}`}
                    style={{ width: `${Math.min(100, Math.sqrt(inputMeter.rms) * 140)}%` }}
                  />
                </div>
                <p className="meter-hint">
                  {inputMeter.isClipping
                    ? "⚠️ Señal saturando a 0 dBFS. Baja la ganancia en tu interface."
                    : "Ajusta la perilla Gain de tu tarjeta hasta que el pico ronde -12 dB a -6 dB."}
                </p>
              </div>

              {/* 4. Monitoreo por Auriculares (Directo vs Software) */}
              <div className="record-field-group toggle-group">
                <label className="record-field-label">Monitoreo Auriculares:</label>
                <div className="toggle-switch-wrapper">
                  <button
                    type="button"
                    className={`toggle-option ${!isSoftwareMonitoring ? "active" : ""}`}
                    onClick={() => handleMonitoringToggle(false)}
                  >
                    Directo (0.0 ms)
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${isSoftwareMonitoring ? "active" : ""}`}
                    onClick={() => handleMonitoringToggle(true)}
                  >
                    Software
                  </button>
                </div>
              </div>

              {/* 5. Compensación de Latencia (ADC) */}
              <div className="record-field-group">
                <div className="latency-header-row">
                  <label className="record-field-label">Compensación Retardo (ADC):</label>
                  <span className="latency-ms-badge">{latencyCompensationMs} ms</span>
                </div>
                <div className="latency-slider-row">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={latencyCompensationMs}
                    onChange={(e) => setLatencyCompensationMs(Number(e.target.value))}
                    disabled={isRecordingActive}
                    className="strip-slider"
                  />
                  <button
                    type="button"
                    className="btn-measure-latency"
                    onClick={handleAutoMeasureLatency}
                    disabled={isRecordingActive || isMeasuringLatency}
                    title="Emitir pulso para medir retardo de hardware automáticamente"
                  >
                    {isMeasuringLatency ? "Midiendo..." : "Calibrar"}
                  </button>
                </div>
                <p className="field-hint">
                  Alinea la toma grabada con los stems eliminando el retardo del buffer.
                </p>
              </div>

              {/* 6. Botón de Acción Principal (Grabar / Parar) */}
              <div className="record-action-box">
                {!isRecordingActive ? (
                  <button
                    type="button"
                    className="btn-record-main start"
                    onClick={handleStartRecording}
                    disabled={isLoadingAudio}
                  >
                    <Circle size={18} fill="#ffffff" color="#ffffff" />
                    <span>Empezar a Grabar Toma</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-record-main stop"
                    onClick={handleStopRecording}
                  >
                    <div className="rec-stop-square" />
                    <span>Detener y Guardar en Timeline</span>
                  </button>
                )}
              </div>
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
            <span ref={timeCurrentLabelRef} className="time-display">{formatDuration(currentTime)}</span>
            <input
              ref={scrubSliderRef}
              type="range"
              min="0"
              max={duration || 100}
              step="0.05"
              defaultValue={currentTime}
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
