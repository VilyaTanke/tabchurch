import { SoundTouch, SimpleFilter, WebAudioBufferSource } from "soundtouchjs";

// Caché en memoria para no re-descargar ni re-decodificar buffers de audio ya cargados
const audioBufferCache = new Map<string, AudioBuffer>();

let sharedAudioContext: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("AudioContext solo está disponible en el navegador.");
  }
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioContext = new AudioCtx();
  }
  return sharedAudioContext;
}

export async function ensureAudioContextResumed(ctx: AudioContext): Promise<void> {
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

/** Descarga y decodifica el audio en un AudioBuffer (con caché en memoria). */
export async function loadAudioBuffer(url: string, ctx: AudioContext): Promise<AudioBuffer> {
  const cached = audioBufferCache.get(url);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al descargar el audio (${res.status})`);
  }
  const arrayBuffer = await res.arrayBuffer();
  // decodeAudioData resamplea automáticamente a ctx.sampleRate
  const decoded = await ctx.decodeAudioData(arrayBuffer);
  audioBufferCache.set(url, decoded);
  return decoded;
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
    // Por defecto: tono original (0 semitonos) y velocidad normal (tempo = 1.0)
    this.soundTouch.pitchSemitones = 0;
    this.soundTouch.tempo = 1.0;

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
        left[i] = this.samples[i * 2];
        right[i] = this.samples[i * 2 + 1];
      }
      for (let i = frames; i < this.bufferSize; i++) {
        left[i] = 0;
        right[i] = 0;
      }

      // Avance exacto del playhead
      this.playheadSec += (frames / this.ctx.sampleRate) * this.currentTempo;
      if (this.playheadSec >= this.buffer.duration) {
        this.isPlaying = false;
        this.onEnded?.();
      }
    };

    this.scriptNode.connect(this.gainNode);
    this.gainNode.connect(destination);
  }

  /**
   * Cambia la tonalidad en semitonos (-12 a +12)
   * ¡IMPORTANTE! SoundTouch cambia el tono mediante algoritmo WSOLA conservando exactamente
   * la velocidad original (tempo = 1.0), sin acelerar ni ralentizar la canción.
   */
  setSemitones(semitones: number) {
    this.soundTouch.pitchSemitones = semitones;
  }

  /** Permite ajustar la velocidad de reproducción de manera independiente al tono. */
  setTempo(tempo: number) {
    this.currentTempo = tempo;
    this.soundTouch.tempo = tempo;
  }

  /** Posición de lectura en segundos. */
  getCurrentTime(): number {
    return Math.max(0, Math.min(this.buffer.duration, this.playheadSec));
  }

  seek(seconds: number) {
    const clamped = Math.max(0, Math.min(this.buffer.duration, seconds));
    this.playheadSec = clamped;
    const frame = Math.floor(clamped * this.ctx.sampleRate);
    this.filter.sourcePosition = frame;
  }

  /** Aplica el volumen efectivo combinando el volumen del canal, mute y solo. */
  applyGain(masterVolume: number, anySoloActive: boolean) {
    let effective = this.channelVolume * masterVolume;
    if (this.isMuted) effective = 0;
    if (anySoloActive && !this.isSolo) effective = 0;

    this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, effective)), this.ctx.currentTime);
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
  muted?: boolean;
  solo?: boolean;
}

interface TrackChannelInternal {
  name: string;
  url: string;
  buffer: AudioBuffer;
  source: WebAudioBufferSource;
  soundTouch: SoundTouch;
  filter: SimpleFilter;
  samples: Float32Array;
  volume: number;
  muted: boolean;
  solo: boolean;
  isEnded: boolean;
}

/**
 * Motor multipista unificado para el Estudio:
 * Mezcla y sincroniza perfectamente la pista original o todos los stems separados con SoundTouch (WSOLA DSP).
 * Garantiza que la tonalidad cambie en semitonos SIN alterar la velocidad de reproducción de la canción.
 */
export class MultiTrackSoundTouchEngine {
  private ctx: AudioContext;
  private scriptNode: ScriptProcessorNode | null = null;
  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;
  private channels: TrackChannelInternal[] = [];
  private bufferSize = 4096;

  public isPlaying = false;
  public duration = 0;
  public playheadSec = 0;
  public currentSemitones = 0;
  public currentTempo = 1.0;
  public masterVolume = 0.9;
  public isMasterMuted = false;
  public onEnded?: () => void;

  constructor() {
    this.ctx = getSharedAudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

    // Compresor/limitador suave para evitar distorsión o clipping cuando suenan todos los stems juntos
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-1, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);
  }

  /** Carga y decodifica todos los stems requeridos. */
  async loadChannels(
    specs: StemChannelSpec[],
    initialSemitones = 0,
    initialTempo = 1.0
  ): Promise<void> {
    await ensureAudioContextResumed(this.ctx);
    this.destroyNode();

    this.currentSemitones = initialSemitones;
    this.currentTempo = initialTempo;
    this.playheadSec = 0;
    this.isPlaying = false;

    // Cargar en paralelo todos los AudioBuffers requeridos
    const loaded = await Promise.all(
      specs.map(async (spec) => {
        const buffer = await loadAudioBuffer(spec.url, this.ctx);
        const source = new WebAudioBufferSource(buffer);
        const soundTouch = new SoundTouch();
        soundTouch.pitchSemitones = this.currentSemitones;
        soundTouch.tempo = this.currentTempo;

        const filter = new SimpleFilter(source, soundTouch);
        const samples = new Float32Array(this.bufferSize * 2);

        return {
          name: spec.name,
          url: spec.url,
          buffer,
          source,
          soundTouch,
          filter,
          samples,
          volume: spec.volume ?? 0.85,
          muted: !!spec.muted,
          solo: !!spec.solo,
          isEnded: false,
        };
      })
    );

    this.channels = loaded;
    this.duration = Math.max(0, ...loaded.map((c) => c.buffer.duration));

    // ScriptProcessorNode unificado para mezclar todos los stems simultáneamente y sin desfases
    this.scriptNode = this.ctx.createScriptProcessor(this.bufferSize, 2, 2);
    this.scriptNode.onaudioprocess = (event) => {
      const left = event.outputBuffer.getChannelData(0);
      const right = event.outputBuffer.getChannelData(1);

      if (!this.isPlaying || this.channels.length === 0) {
        left.fill(0);
        right.fill(0);
        return;
      }

      left.fill(0);
      right.fill(0);

      const hasSolo = this.channels.some((c) => c.solo);
      let maxFrames = 0;

      for (let chIdx = 0; chIdx < this.channels.length; chIdx++) {
        const ch = this.channels[chIdx];
        const frames = ch.filter.extract(ch.samples, this.bufferSize);
        if (frames > 0) {
          maxFrames = Math.max(maxFrames, frames);
          ch.isEnded = false;
        } else {
          ch.isEnded = true;
        }

        // Si el canal está silenciado o si hay otros en Solo y este no, no se suma a la mezcla
        if (ch.muted) continue;
        if (hasSolo && !ch.solo) continue;
        if (ch.volume <= 0) continue;

        const vol = ch.volume;
        for (let i = 0; i < frames; i++) {
          left[i] += ch.samples[i * 2] * vol;
          right[i] += ch.samples[i * 2 + 1] * vol;
        }
      }

      if (maxFrames === 0) {
        this.isPlaying = false;
        this.onEnded?.();
        return;
      }

      const songElapsed = (maxFrames / this.ctx.sampleRate) * this.currentTempo;
      this.playheadSec += songElapsed;

      if (this.playheadSec >= this.duration) {
        this.isPlaying = false;
        this.onEnded?.();
      }
    };

    this.scriptNode.connect(this.masterGain);
  }

  async play(): Promise<void> {
    await ensureAudioContextResumed(this.ctx);
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
  }

  seek(seconds: number): void {
    const clamped = Math.max(0, Math.min(this.duration, seconds));
    this.playheadSec = clamped;
    const frame = Math.floor(clamped * this.ctx.sampleRate);
    for (const ch of this.channels) {
      ch.filter.sourcePosition = Math.min(frame, ch.buffer.length);
      ch.isEnded = false;
    }
  }

  /**
   * Cambia la tonalidad en semitonos (-12 a +12).
   * Mediante WSOLA en SoundTouch, el pitch sube o baja de forma limpia SIN modificar la velocidad (tempo).
   */
  setSemitones(semitones: number): void {
    this.currentSemitones = semitones;
    for (const ch of this.channels) {
      ch.soundTouch.pitchSemitones = semitones;
    }
  }

  /** Cambia la velocidad de reproducción (tempo) independientemente de la tonalidad. */
  setTempo(tempo: number): void {
    this.currentTempo = tempo;
    for (const ch of this.channels) {
      ch.soundTouch.tempo = tempo;
    }
  }

  setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    const effective = this.isMasterMuted ? 0 : this.masterVolume;
    this.masterGain.gain.setValueAtTime(effective, this.ctx.currentTime);
  }

  setMasterMuted(muted: boolean): void {
    this.isMasterMuted = muted;
    const effective = muted ? 0 : this.masterVolume;
    this.masterGain.gain.setValueAtTime(effective, this.ctx.currentTime);
  }

  updateChannel(name: string, updates: { volume?: number; muted?: boolean; solo?: boolean }): void {
    const ch = this.channels.find((c) => c.name === name);
    if (!ch) return;
    if (typeof updates.volume === "number") ch.volume = Math.max(0, Math.min(1, updates.volume));
    if (typeof updates.muted === "boolean") ch.muted = updates.muted;
    if (typeof updates.solo === "boolean") ch.solo = updates.solo;
  }

  getCurrentTime(): number {
    return Math.max(0, Math.min(this.duration, this.playheadSec));
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
  }
}
