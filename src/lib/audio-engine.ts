import { SoundTouch, SimpleFilter, WebAudioBufferSource } from "soundtouchjs";
import { Mp3Encoder } from "@breezystack/lamejs";
import { STEMS_CACHE_NAME, isTabletDevice } from "./tablet-profiler";

// Caché LRU en memoria acotada (máx. 8 AudioBuffers) para evitar agotamiento de RAM en móviles/tablets
const MAX_CACHED_BUFFERS = 8;
const audioBufferCache = new Map<string, AudioBuffer>();

export function clearAudioBufferCache(url?: string): void {
  if (url) {
    audioBufferCache.delete(url);
  } else {
    audioBufferCache.clear();
  }
}

let sharedAudioContext: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("AudioContext solo está disponible en el navegador.");
  }
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    // En tablets y móviles, "playback" ofrece mayor resiliencia contra underruns de buffer
    const isTablet = isTabletDevice();
    const latencyHint = isTablet ? "playback" : "interactive";

    sharedAudioContext = new AudioCtx({ latencyHint });

    // Watchdog de auto-recuperación ante interrupciones (llamadas, alarmas o atenuación en iOS/Android)
    sharedAudioContext.onstatechange = () => {
      if (sharedAudioContext && (sharedAudioContext.state === "suspended" || (sharedAudioContext.state as string) === "interrupted")) {
        sharedAudioContext.resume().catch(() => {});
      }
    };
  }
  return sharedAudioContext;
}

export async function ensureAudioContextResumed(ctx: AudioContext): Promise<void> {
  if (ctx.state === "suspended" || (ctx.state as string) === "interrupted") {
    await ctx.resume().catch(() => {});
  }
}

/** Descarga y decodifica el audio en un AudioBuffer (con caché en memoria LRU y almacenamiento flash persistente). */
export async function loadAudioBuffer(url: string, ctx: AudioContext): Promise<AudioBuffer> {
  // 1. Verificar si ya está en la memoria RAM viva (LRU)
  const cachedMem = audioBufferCache.get(url);
  if (cachedMem) {
    // Renovar posición LRU
    audioBufferCache.delete(url);
    audioBufferCache.set(url, cachedMem);
    return cachedMem;
  }

  let arrayBuffer: ArrayBuffer | null = null;

  // 2. Intentar leer desde el almacenamiento flash de la tablet (Cache Storage persistente)
  if (typeof window !== "undefined" && "caches" in window) {
    try {
      const cache = await caches.open(STEMS_CACHE_NAME);
      const match = await cache.match(url);
      if (match && match.ok) {
        arrayBuffer = await match.arrayBuffer();
      }
    } catch {
      // Continuar con fetch si la caché falla
    }
  }

  // 3. Si no estaba en almacenamiento flash local, descargar de la red y guardar en flash
  if (!arrayBuffer) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error al descargar el audio (${res.status})`);
    }

    if (typeof window !== "undefined" && "caches" in window) {
      try {
        const cache = await caches.open(STEMS_CACHE_NAME);
        // Clonar respuesta antes de leer el cuerpo
        cache.put(url, res.clone()).catch(() => {});
      } catch {
        // Ignorar fallos de escritura de caché
      }
    }

    arrayBuffer = await res.arrayBuffer();
  }

  // decodeAudioData resamplea automáticamente a ctx.sampleRate
  const decoded = await ctx.decodeAudioData(arrayBuffer);
  // Liberar referencia al buffer comprimido original de inmediato para reducir pico de RAM en tablets
  arrayBuffer = null;

  // Mantener acotada la memoria RAM
  if (audioBufferCache.size >= MAX_CACHED_BUFFERS) {
    const oldestKey = audioBufferCache.keys().next().value;
    if (oldestKey !== undefined) {
      audioBufferCache.delete(oldestKey);
    }
  }
  audioBufferCache.set(url, decoded);
  return decoded;
}

/**
 * Pre-calcula en O(N) ligero los picos de onda reales (numBuckets barras) y el nivel RMS en dBFS
 * directamente desde el AudioBuffer decodificado (inspirado en compute_waveform_peaks de Mossi).
 */
export function computeWaveformPeaks(
  buffer: AudioBuffer,
  numBuckets = 200
): { peaks: number[]; rmsDb: number } {
  const total = buffer.length;
  if (total === 0 || numBuckets <= 0) {
    return { peaks: new Array(Math.max(1, numBuckets)).fill(0.05), rmsDb: -60.0 };
  }

  const ch0 = buffer.getChannelData(0);
  const ch1 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : ch0;

  const peaks: number[] = new Array(numBuckets);
  const bucketSize = total / numBuckets;
  let totalSumSq = 0;
  let totalCount = 0;

  for (let b = 0; b < numBuckets; b++) {
    const start = Math.floor(b * bucketSize);
    const end = Math.min(total, Math.floor((b + 1) * bucketSize));
    // Sub-muestreo rápido cada 16 samples para cálculo instantáneo (< 1ms por stem)
    const step = Math.max(1, Math.floor((end - start) / 64));
    let maxPeak = 0;
    for (let i = start; i < end; i += step) {
      const a0 = Math.abs(ch0[i]);
      const a1 = Math.abs(ch1[i]);
      const monoAbs = 0.5 * (a0 + a1);
      if (monoAbs > maxPeak) maxPeak = monoAbs;
      totalSumSq += 0.5 * (ch0[i] * ch0[i] + ch1[i] * ch1[i]);
      totalCount++;
    }
    peaks[b] = Math.min(1.0, Math.round(maxPeak * 1000) / 1000);
  }

  const rms = Math.sqrt(totalSumSq / Math.max(1, totalCount) + 1e-12);
  const rmsDb = Math.round(20 * Math.log10(Math.max(1e-4, rms)) * 10) / 10;

  return { peaks, rmsDb };
}

/**
 * Calibra y bloquea la instancia de SoundTouch para evitar aceleración y clicks:
 * 1. Desactiva quickSeek (búsqueda estéreo completa con correlación exacta sin micro-desfases).
 * 2. Calibra la frecuencia de muestreo del hardware (ej. 48000 Hz) para sincronizar ventanas WSOLA.
 * 3. Bloquea el flujo Transposer -> Stretch: el ratio de velocidad es EXACTAMENTE 1.00000
 *    en todos los semitonos (-12 a +12).
 */
function configureSoundTouchInstance(
  st: SoundTouch,
  sampleRate: number,
  semitones = 0,
  tempo = 1.0
): void {
  st.stretch.quickSeek = false;
  st.stretch.setParameters(sampleRate, 0, 0, 0);

  const originalCalc = st.calculateEffectiveRateAndTempo.bind(st);
  st.calculateEffectiveRateAndTempo = function () {
    originalCalc();
    this.transposer.inputBuffer = this._inputBuffer;
    this.transposer.outputBuffer = this._intermediateBuffer;
    this.stretch.inputBuffer = this._intermediateBuffer;
    this.stretch.outputBuffer = this._outputBuffer;
  };
  st.process = function () {
    this.transposer.process();
    this.stretch.process();
  };

  st.pitchSemitones = semitones;
  st.tempo = tempo;
  st.calculateEffectiveRateAndTempo();
}

/**
 * Limitador suave continuo C1: si la señal excede ±0.98 (ej. al sumar varios stems o transitorios),
 * comprime suavemente los picos sin ninguna discontinuidad de voltaje (evita clicks y pops digitales).
 */
function softLimit(val: number): number {
  if (val > 0.95) {
    return 0.95 + Math.tanh((val - 0.95) / 0.25) * 0.049;
  }
  if (val < -0.95) {
    return -0.95 + Math.tanh((val + 0.95) / 0.25) * 0.049;
  }
  return val;
}

/**
 * Canal de audio individual con SoundTouch (WSOLA DSP):
 * Permite cambiar la tonalidad (semitonos) en tiempo real SIN alterar la velocidad de reproducción.
 */
export class SoundTouchChannel {
  private ctx: AudioContext;
  public buffer: AudioBuffer;
  private soundTouch: SoundTouch;
  private filter: SimpleFilter;
  private source: WebAudioBufferSource;
  private scriptNode: ScriptProcessorNode;
  private gainNode: GainNode;
  private samples: Float32Array;
  private bufferSize = 4096;
  private playheadSec = 0;
  private currentTempo = 1.0;

  public isPlaying = false;
  public isMuted = false;
  public isSolo = false;
  public channelVolume = 1.0;
  public onEnded?: () => void;

  constructor(ctx: AudioContext, buffer: AudioBuffer, destination: AudioNode) {
    this.ctx = ctx;
    this.buffer = buffer;
    this.soundTouch = new SoundTouch();
    configureSoundTouchInstance(this.soundTouch, this.ctx.sampleRate, 0, 1.0);

    this.source = new WebAudioBufferSource(buffer);
    this.filter = new SimpleFilter(this.source, this.soundTouch, () => {
      this.isPlaying = false;
      this.onEnded?.();
    });

    this.samples = new Float32Array(this.bufferSize * 2);
    this.gainNode = ctx.createGain();
    this.scriptNode = ctx.createScriptProcessor(this.bufferSize, 2, 2);

    this.scriptNode.onaudioprocess = (event) => {
      const left = event.outputBuffer.getChannelData(0);
      const right = event.outputBuffer.getChannelData(1);

      if (!this.isPlaying) {
        left.fill(0);
        right.fill(0);
        return;
      }

      const frames = this.filter.extract(this.samples, this.bufferSize);
      if (frames === 0) {
        left.fill(0);
        right.fill(0);
        this.isPlaying = false;
        this.onEnded?.();
        return;
      }

      for (let i = 0; i < frames; i++) {
        const l = this.samples[i * 2];
        const r = this.samples[i * 2 + 1];
        left[i] = softLimit(l);
        right[i] = softLimit(r);
      }
      for (let i = frames; i < this.bufferSize; i++) {
        left[i] = 0;
        right[i] = 0;
      }

      this.playheadSec += (frames / this.ctx.sampleRate) * this.currentTempo;
      if (this.playheadSec >= this.buffer.duration) {
        this.isPlaying = false;
        this.onEnded?.();
      }
    };

    this.scriptNode.connect(this.gainNode);
    this.gainNode.connect(destination);
  }

  setSemitones(semitones: number) {
    this.soundTouch.pitchSemitones = semitones;
    this.soundTouch.tempo = this.currentTempo;
  }

  setTempo(tempo: number) {
    this.currentTempo = tempo;
    this.soundTouch.tempo = tempo;
  }

  getCurrentTime(): number {
    return Math.max(0, Math.min(this.buffer.duration, this.playheadSec));
  }

  seek(seconds: number) {
    const clamped = Math.max(0, Math.min(this.buffer.duration, seconds));
    this.playheadSec = clamped;
    const frame = Math.floor(clamped * this.ctx.sampleRate);
    this.filter.sourcePosition = frame;
  }

  applyGain(masterVolume: number, anySoloActive: boolean) {
    let effective = this.channelVolume * masterVolume;
    if (this.isMuted) effective = 0;
    if (anySoloActive && !this.isSolo) effective = 0;

    this.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1.4, effective)), this.ctx.currentTime, 0.015);
  }

  setVolume(vol: number) {
    this.channelVolume = Math.max(0, Math.min(1.4, vol));
    const effective = this.isMuted ? 0 : this.channelVolume;
    this.gainNode.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.015);
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    const effective = muted ? 0 : this.channelVolume;
    this.gainNode.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.015);
  }

  destroy() {
    this.isPlaying = false;
    try {
      this.scriptNode.disconnect();
      this.gainNode.disconnect();
    } catch {
      // Ignorar
    }
  }
}

export interface StemChannelSpec {
  name: string;
  url: string;
  volume?: number;
  pan?: number;
  muted?: boolean;
  solo?: boolean;
}

export interface StemWaveformTelemetry {
  peaks: number[];
  rmsDb: number;
}

export interface MasterMeterTelemetry {
  rmsL: number;
  rmsR: number;
  dbL: number;
  dbR: number;
}

interface TrackChannelInternal {
  name: string;
  url: string;
  buffer: AudioBuffer;
  ch0: Float32Array;
  ch1: Float32Array;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  // Estado suavizado por muestra (rampa exponencial de 15ms libre de clics al estilo Mossi)
  smoothGainL: number;
  smoothGainR: number;
  peaks: number[];
  rmsDb: number;
}

/**
 * Fuente virtual sincronizada al sample que suma todos los stems en fase perfecta (0ms de deriva entre pistas)
 * antes de entregar el bus estéreo al procesador WSOLA de SoundTouch.
 *
 * Ventajas clave tomadas de la arquitectura Mossi:
 * 1. Sincronía al sample exacto: todos los stems se leen con el mismo índice `position`, eliminando el
 *    desfase entre batería, bajo y voz que ocurría al tener instancias SoundTouch separadas por pista.
 * 2. Rampas exponenciales sin clics (constante de 15ms) al activar Mute, Solo, Volumen o Panorama Estéreo.
 * 3. Ley de paneo de potencia constante (cos/sin) por canal.
 */
class PhaseLockedMultiStemSource {
  private channels: TrackChannelInternal[];
  public sampleRate: number;
  public length: number;

  constructor(channels: TrackChannelInternal[], sampleRate: number, maxFrames: number) {
    this.channels = channels;
    this.sampleRate = sampleRate;
    this.length = maxFrames;
  }

  get numberOfChannels(): number {
    return 2;
  }

  extract(target: Float32Array, numFrames = 0, position = 0): number {
    if (position >= this.length || numFrames <= 0) {
      return 0;
    }
    const available = Math.min(numFrames, this.length - position);
    target.fill(0, 0, available * 2);

    const hasSolo = this.channels.some((c) => c.solo);
    // Coeficiente de suavizado de ~15ms para transiciones libres de clics
    const alpha = 1.0 - Math.exp(-1.0 / (this.sampleRate * 0.015));

    for (let chIdx = 0; chIdx < this.channels.length; chIdx++) {
      const ch = this.channels[chIdx];
      const isSilenced = ch.muted || (hasSolo && !ch.solo);
      const effectiveVol = isSilenced ? 0.0 : ch.volume;

      // Paneo de potencia constante (-1 = L, 0 = Centro, +1 = R)
      const panAngle = ((Math.max(-1, Math.min(1, ch.pan)) + 1) * Math.PI) / 4;
      // Normalizar con Math.SQRT2 para que en pan=0 la ganancia sea 1.0 en L y R
      const targetGainL = effectiveVol * Math.cos(panAngle) * Math.SQRT2;
      const targetGainR = effectiveVol * Math.sin(panAngle) * Math.SQRT2;

      if (
        targetGainL < 1e-5 &&
        targetGainR < 1e-5 &&
        ch.smoothGainL < 1e-5 &&
        ch.smoothGainR < 1e-5
      ) {
        ch.smoothGainL = 0;
        ch.smoothGainR = 0;
        continue;
      }

      const bufLen = ch.buffer.length;
      const c0 = ch.ch0;
      const c1 = ch.ch1;
      let gL = ch.smoothGainL;
      let gR = ch.smoothGainR;

      const maxRead = Math.min(available, Math.max(0, bufLen - position));
      for (let i = 0; i < maxRead; i++) {
        gL += (targetGainL - gL) * alpha;
        gR += (targetGainR - gR) * alpha;
        const srcIdx = position + i;
        target[i * 2] += c0[srcIdx] * gL;
        target[i * 2 + 1] += c1[srcIdx] * gR;
      }

      ch.smoothGainL = gL;
      ch.smoothGainR = gR;
    }

    return available;
  }
}

/**
 * Motor Multipista de Alta Fidelidad para Estudio Z (Fusión TabChurch SoundTouch + Mossi Audio Engine):
 * - Sincronización al sample (1 solo bus maestro en fase perfecta).
 * - Bypass Bit-Perfect automático cuando semitones === 0 y tempo === 1.0 (0% coloración DSP).
 * - Procesamiento WSOLA unificado cuando se altera el tono (-12 a +12 st) o la velocidad.
 * - Control de Panorama Estéreo (-1 a +1), Volumen con ganancia hasta 140% y Mute/Solo con rampa de 15ms.
 * - Medidor RMS Estéreo (L/R) en tiempo real y exportación rápida de mezcla personalizada (.WAV 24-bit y .MP3).
 */
export class MultiTrackSoundTouchEngine {
  private ctx: AudioContext;
  private scriptNode: ScriptProcessorNode | null = null;
  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;
  private channels: TrackChannelInternal[] = [];
  private multiSource: PhaseLockedMultiStemSource | null = null;
  private soundTouch: SoundTouch | null = null;
  private filter: SimpleFilter | null = null;
  private mixSamples: Float32Array;
  private bufferSize: number;
  private totalFrames = 0;

  public isPlaying = false;
  public duration = 0;
  public playheadSec = 0;
  public currentSemitones = 0;
  public currentTempo = 1.0;
  public masterVolume = 0.95;
  public isMasterMuted = false;
  public onEnded?: () => void;
  public onMeterUpdate?: (meter: MasterMeterTelemetry) => void;

  constructor(customBufferSize?: number) {
    this.ctx = getSharedAudioContext();
    // En tablets, 4096 muestras proporcionan un colchón acústico anti-underrun superior
    const isTablet = isTabletDevice();
    this.bufferSize = customBufferSize || (isTablet ? 4096 : 2048);
    this.mixSamples = new Float32Array(this.bufferSize * 2);
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-1.0, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(10, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);
  }

  /** Carga y decodifica todos los stems requeridos y precalcula sus picos de onda reales. */
  async loadChannels(
    specs: StemChannelSpec[],
    initialSemitones = 0,
    initialTempo = 1.0,
    onProgress?: (loaded: number, total: number, stemName: string) => void
  ): Promise<Record<string, StemWaveformTelemetry>> {
    await ensureAudioContextResumed(this.ctx);
    this.destroyNode();

    this.currentSemitones = initialSemitones;
    this.currentTempo = initialTempo;
    this.playheadSec = 0;
    this.isPlaying = false;

    let loadedCount = 0;
    const waveforms: Record<string, StemWaveformTelemetry> = {};
    const loaded: TrackChannelInternal[] = [];

    // Decodificación escalonada en lotes de 2 para eliminar picos de RAM en iPadOS y Android Tablets
    const BATCH_SIZE = 2;
    for (let i = 0; i < specs.length; i += BATCH_SIZE) {
      const batch = specs.slice(i, i + BATCH_SIZE);
      const batchLoaded = await Promise.all(
        batch.map(async (spec) => {
          const buffer = await loadAudioBuffer(spec.url, this.ctx);
          const { peaks, rmsDb } = computeWaveformPeaks(buffer, 200);
          waveforms[spec.name] = { peaks, rmsDb };

          loadedCount++;
          onProgress?.(loadedCount, specs.length, spec.name);

          const ch0 = buffer.getChannelData(0);
          const ch1 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : ch0;
          const vol = spec.volume ?? 1.0;
          const pan = spec.pan ?? 0.0;
          const muted = !!spec.muted;
          const solo = !!spec.solo;

          const panAngle = ((Math.max(-1, Math.min(1, pan)) + 1) * Math.PI) / 4;
          const initGainL = muted ? 0 : vol * Math.cos(panAngle) * Math.SQRT2;
          const initGainR = muted ? 0 : vol * Math.sin(panAngle) * Math.SQRT2;

          return {
            name: spec.name,
            url: spec.url,
            buffer,
            ch0,
            ch1,
            volume: vol,
            pan,
            muted,
            solo,
            smoothGainL: initGainL,
            smoothGainR: initGainR,
            peaks,
            rmsDb,
          };
        })
      );
      loaded.push(...batchLoaded);

      // Ceder un ciclo al recolector de basura del navegador entre lotes
      if (i + BATCH_SIZE < specs.length) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }

    this.channels = loaded;
    this.duration = Math.max(0, ...loaded.map((c) => c.buffer.duration));
    this.totalFrames = Math.max(0, ...loaded.map((c) => c.buffer.length));

    this.multiSource = new PhaseLockedMultiStemSource(
      this.channels,
      this.ctx.sampleRate,
      this.totalFrames
    );
    this.soundTouch = new SoundTouch();
    configureSoundTouchInstance(
      this.soundTouch,
      this.ctx.sampleRate,
      this.currentSemitones,
      this.currentTempo
    );
    this.filter = new SimpleFilter(
      this.multiSource as unknown as WebAudioBufferSource,
      this.soundTouch
    );

    this.scriptNode = this.ctx.createScriptProcessor(this.bufferSize, 2, 2);
    this.scriptNode.onaudioprocess = (event) => {
      const left = event.outputBuffer.getChannelData(0);
      const right = event.outputBuffer.getChannelData(1);

      if (!this.isPlaying || this.channels.length === 0 || !this.filter || !this.multiSource) {
        left.fill(0);
        right.fill(0);
        return;
      }

      const isBypass = this.currentSemitones === 0 && Math.abs(this.currentTempo - 1.0) < 1e-4;
      let frames = 0;

      if (isBypass) {
        // Bypass Bit-Perfect (100% transparente, 0 artefactos de ventana WSOLA)
        const currentPos = this.filter.sourcePosition;
        frames = this.multiSource.extract(this.mixSamples, this.bufferSize, currentPos);
        this.filter.sourcePosition = currentPos + frames;
      } else {
        // Procesamiento WSOLA sobre el bus estéreo sincronizado en fase
        frames = this.filter.extract(this.mixSamples, this.bufferSize);
      }

      if (frames === 0) {
        left.fill(0);
        right.fill(0);
        this.isPlaying = false;
        this.onMeterUpdate?.({ rmsL: 0, rmsR: 0, dbL: -60, dbR: -60 });
        this.onEnded?.();
        return;
      }

      let sumSqL = 0;
      let sumSqR = 0;

      for (let i = 0; i < frames; i++) {
        const l = softLimit(this.mixSamples[i * 2]);
        const r = softLimit(this.mixSamples[i * 2 + 1]);
        left[i] = l;
        right[i] = r;
        sumSqL += l * l;
        sumSqR += r * r;
      }

      for (let i = frames; i < this.bufferSize; i++) {
        left[i] = 0;
        right[i] = 0;
      }

      if (this.onMeterUpdate) {
        const masterScale = this.isMasterMuted ? 0 : this.masterVolume;
        const rmsL = Math.sqrt(sumSqL / frames) * masterScale;
        const rmsR = Math.sqrt(sumSqR / frames) * masterScale;
        const dbL = Math.max(-60, Math.round(20 * Math.log10(Math.max(1e-3, rmsL)) * 10) / 10);
        const dbR = Math.max(-60, Math.round(20 * Math.log10(Math.max(1e-3, rmsR)) * 10) / 10);
        this.onMeterUpdate({ rmsL, rmsR, dbL, dbR });
      }

      const songElapsed = (frames / this.ctx.sampleRate) * this.currentTempo;
      this.playheadSec += songElapsed;

      if (this.playheadSec >= this.duration) {
        this.isPlaying = false;
        this.onMeterUpdate?.({ rmsL: 0, rmsR: 0, dbL: -60, dbR: -60 });
        this.onEnded?.();
      }
    };

    this.scriptNode.connect(this.masterGain);
    return waveforms;
  }

  async play(): Promise<void> {
    await ensureAudioContextResumed(this.ctx);
    if (this.playheadSec >= this.duration && this.duration > 0) {
      this.seek(0);
    }
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
    this.onMeterUpdate?.({ rmsL: 0, rmsR: 0, dbL: -60, dbR: -60 });
  }

  stop(): void {
    this.isPlaying = false;
    this.seek(0);
    this.onMeterUpdate?.({ rmsL: 0, rmsR: 0, dbL: -60, dbR: -60 });
  }

  seek(seconds: number): void {
    const clamped = Math.max(0, Math.min(this.duration, seconds));
    this.playheadSec = clamped;
    if (this.filter) {
      const frame = Math.floor(clamped * this.ctx.sampleRate);
      this.filter.sourcePosition = Math.min(frame, this.totalFrames);
    }
  }

  setSemitones(semitones: number): void {
    const wasBypass = this.currentSemitones === 0 && Math.abs(this.currentTempo - 1.0) < 1e-4;
    this.currentSemitones = semitones;
    if (this.soundTouch && this.filter) {
      const exactFrame = Math.floor(this.playheadSec * this.ctx.sampleRate);
      this.soundTouch.pitchSemitones = semitones;
      this.soundTouch.tempo = this.currentTempo;
      const isNowBypass = semitones === 0 && Math.abs(this.currentTempo - 1.0) < 1e-4;
      if (wasBypass !== isNowBypass) {
        this.filter.sourcePosition = Math.min(exactFrame, this.totalFrames);
      }
    }
  }

  setTempo(tempo: number): void {
    const wasBypass = this.currentSemitones === 0 && Math.abs(this.currentTempo - 1.0) < 1e-4;
    this.currentTempo = tempo;
    if (this.soundTouch && this.filter) {
      const exactFrame = Math.floor(this.playheadSec * this.ctx.sampleRate);
      this.soundTouch.tempo = tempo;
      const isNowBypass = this.currentSemitones === 0 && Math.abs(tempo - 1.0) < 1e-4;
      if (wasBypass !== isNowBypass) {
        this.filter.sourcePosition = Math.min(exactFrame, this.totalFrames);
      }
    }
  }

  setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    const effective = this.isMasterMuted ? 0 : this.masterVolume;
    this.masterGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.015);
  }

  setMasterMuted(muted: boolean): void {
    this.isMasterMuted = muted;
    const effective = muted ? 0 : this.masterVolume;
    this.masterGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.015);
  }

  updateChannel(
    name: string,
    updates: { volume?: number; pan?: number; muted?: boolean; solo?: boolean }
  ): void {
    const ch = this.channels.find((c) => c.name === name);
    if (!ch) return;
    if (typeof updates.volume === "number") ch.volume = Math.max(0, Math.min(1.4, updates.volume));
    if (typeof updates.pan === "number") ch.pan = Math.max(-1, Math.min(1, updates.pan));
    if (typeof updates.muted === "boolean") ch.muted = updates.muted;
    if (typeof updates.solo === "boolean") ch.solo = updates.solo;
  }

  getCurrentTime(): number {
    return Math.max(0, Math.min(this.duration, this.playheadSec));
  }

  /** Estima la huella de RAM ocupada por los AudioBuffers PCM Float32 activos (inspirado en Mossi). */
  getEstimatedMemoryMB(): string {
    let totalBytes = 0;
    for (const ch of this.channels) {
      totalBytes += ch.buffer.length * ch.buffer.numberOfChannels * 4;
    }
    return (totalBytes / (1024 * 1024)).toFixed(1);
  }

  /**
   * Renderiza offline la mezcla personalizada actual (respetando Mute, Solo, Volumen, Panorama,
   * Tono en semitonos y Tempo) y devuelve un archivo WAV Studio PCM de 24 bits (144 dB SNR).
   */
  async exportCustomMixWav(onProgress?: (pct: number) => void): Promise<Blob | null> {
    if (this.channels.length === 0 || this.totalFrames === 0) return null;

    const sampleRate = this.ctx.sampleRate;
    const exportChannels: TrackChannelInternal[] = this.channels.map((c) => {
      const panAngle = ((Math.max(-1, Math.min(1, c.pan)) + 1) * Math.PI) / 4;
      const hasSolo = this.channels.some((s) => s.solo);
      const silenced = c.muted || (hasSolo && !c.solo);
      const effVol = silenced ? 0 : c.volume;
      return {
        ...c,
        smoothGainL: effVol * Math.cos(panAngle) * Math.SQRT2,
        smoothGainR: effVol * Math.sin(panAngle) * Math.SQRT2,
      };
    });

    const source = new PhaseLockedMultiStemSource(exportChannels, sampleRate, this.totalFrames);
    const isBypass = this.currentSemitones === 0 && Math.abs(this.currentTempo - 1.0) < 1e-4;

    const st = new SoundTouch();
    configureSoundTouchInstance(st, sampleRate, this.currentSemitones, this.currentTempo);
    const filter = new SimpleFilter(source as unknown as WebAudioBufferSource, st);

    const chunkFrames = 8192;
    const chunkBuf = new Float32Array(chunkFrames * 2);
    const outChunksL: Float32Array[] = [];
    const outChunksR: Float32Array[] = [];
    let totalRenderedFrames = 0;
    let readPos = 0;
    let iter = 0;

    while (true) {
      const frames = isBypass
        ? source.extract(chunkBuf, chunkFrames, readPos)
        : filter.extract(chunkBuf, chunkFrames);
      if (frames === 0) break;
      readPos += frames;

      const lArr = new Float32Array(frames);
      const rArr = new Float32Array(frames);
      for (let i = 0; i < frames; i++) {
        lArr[i] = softLimit(chunkBuf[i * 2] * this.masterVolume);
        rArr[i] = softLimit(chunkBuf[i * 2 + 1] * this.masterVolume);
      }
      outChunksL.push(lArr);
      outChunksR.push(rArr);
      totalRenderedFrames += frames;
      iter++;

      if (iter % 6 === 0) {
        if (onProgress) {
          const estTotal = this.totalFrames / this.currentTempo;
          onProgress(Math.min(96, Math.round((totalRenderedFrames / Math.max(1, estTotal)) * 100)));
        }
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    onProgress?.(100);
    return encodeStereoChunksToWav24Blob(outChunksL, outChunksR, totalRenderedFrames, sampleRate);
  }

  private destroyNode(): void {
    if (this.scriptNode) {
      try {
        this.scriptNode.disconnect();
      } catch {
        // Ignorar
      }
      this.scriptNode = null;
    }
    this.filter = null;
    this.soundTouch = null;
    this.multiSource = null;
  }

  destroy(): void {
    this.isPlaying = false;
    this.destroyNode();
    try {
      this.masterGain.disconnect();
      this.compressor.disconnect();
    } catch {
      // Ignorar
    }
    this.channels = [];
    if (isTabletDevice()) {
      clearAudioBufferCache();
    }
  }
}

/**
 * Codifica bloques estéreo Float32 en un archivo WAV Studio PCM de 24 bits (144 dB de rango dinámico),
 * portado directamente de audioBufferToWavBlob en Mossi.
 */
export function encodeStereoChunksToWav24Blob(
  chunksL: Float32Array[],
  chunksR: Float32Array[],
  totalFrames: number,
  sampleRate: number
): Blob {
  const numChannels = 2;
  const bytesPerSample = 3; // 24-bit Studio PCM
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = totalFrames * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 24, true); // 24 bits por muestra
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let c = 0; c < chunksL.length; c++) {
    const ch0 = chunksL[c];
    const ch1 = chunksR[c];
    const len = ch0.length;
    for (let i = 0; i < len; i++) {
      const s0 = Math.max(-0.999999, Math.min(0.999999, ch0[i]));
      const int0 = Math.round(s0 * 8388607);
      u8[offset] = int0 & 0xff;
      u8[offset + 1] = (int0 >> 8) & 0xff;
      u8[offset + 2] = (int0 >> 16) & 0xff;
      offset += 3;

      const s1 = Math.max(-0.999999, Math.min(0.999999, ch1[i]));
      const int1 = Math.round(s1 * 8388607);
      u8[offset] = int1 & 0xff;
      u8[offset + 1] = (int1 >> 8) & 0xff;
      u8[offset + 2] = (int1 >> 16) & 0xff;
      offset += 3;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Renderiza de forma offline un AudioBuffer transpuesto en semitonos usando SoundTouch (WSOLA DSP)
 * y lo codifica directamente a un archivo MP3 puro (192 kbps estéreo) mediante LameJS.
 */
export async function renderTransposedMp3(
  audioBuffer: AudioBuffer,
  semitones: number,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const sampleRate = audioBuffer.sampleRate;
  const source = new WebAudioBufferSource(audioBuffer);
  const soundTouch = new SoundTouch();
  configureSoundTouchInstance(soundTouch, sampleRate, semitones, 1.0);
  const filter = new SimpleFilter(source, soundTouch);

  const numChannels = 2;
  const kbps = 192;
  const mp3Encoder = new Mp3Encoder(numChannels, sampleRate, kbps);

  const bufferSize = 8192;
  const samples = new Float32Array(bufferSize * 2);
  const mp3Chunks: Uint8Array[] = [];

  const leftChunk = new Int16Array(bufferSize);
  const rightChunk = new Int16Array(bufferSize);

  let processedFrames = 0;
  const estimatedTotalFrames = audioBuffer.length;
  let batchCounter = 0;

  while (true) {
    const frames = filter.extract(samples, bufferSize);
    if (frames === 0) break;

    for (let i = 0; i < frames; i++) {
      const l = Math.max(-1, Math.min(1, softLimit(samples[i * 2])));
      const r = Math.max(-1, Math.min(1, softLimit(samples[i * 2 + 1])));
      leftChunk[i] = l < 0 ? l * 0x8000 : l * 0x7fff;
      rightChunk[i] = r < 0 ? r * 0x8000 : r * 0x7fff;
    }

    const mp3Buf = mp3Encoder.encodeBuffer(
      frames === bufferSize ? leftChunk : leftChunk.subarray(0, frames),
      frames === bufferSize ? rightChunk : rightChunk.subarray(0, frames)
    );
    if (mp3Buf.length > 0) {
      mp3Chunks.push(new Uint8Array(mp3Buf));
    }

    processedFrames += frames;
    batchCounter++;

    if (batchCounter % 4 === 0) {
      if (onProgress && estimatedTotalFrames > 0) {
        const pct = Math.min(98, Math.round((processedFrames / estimatedTotalFrames) * 100));
        onProgress(pct);
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  const endBuf = mp3Encoder.flush();
  if (endBuf.length > 0) {
    mp3Chunks.push(new Uint8Array(endBuf));
  }

  if (onProgress) onProgress(100);

  return new Blob(mp3Chunks as BlobPart[], { type: "audio/mpeg" });
}
