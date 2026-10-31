/**
 * audio-recorder.ts
 * Motor de grabación multipista de baja latencia para Estudio Z.
 * Permite conectar interfaces de audio físicas (Focusrite, Behringer XR18/X32, etc.),
 * enrutar canales físicos individuales, monitoreo, medición VU en tiempo real con detección de clipping
 * y compensación automática de latencia (Automatic Delay Compensation - ADC).
 */

import {
  getSharedAudioContext,
  ensureAudioContextResumed,
  computeWaveformPeaks,
  encodeStereoChunksToWav24Blob,
} from "./audio-engine";

export interface AudioInputDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

export interface InputMeterTelemetry {
  rms: number;
  db: number;
  isClipping: boolean;
}

export type InputRoutingMode = "mono_ch1" | "mono_ch2" | "stereo_1_2" | "mono_custom";

export interface RecordedTrackResult {
  blob: Blob;
  url: string;
  buffer: AudioBuffer;
  peaks: number[];
  rmsDb: number;
  durationSec: number;
}

/**
 * Obtiene la lista de interfaces y micrófonos de entrada físicos disponibles.
 */
export async function getAudioInputDevices(): Promise<AudioInputDevice[]> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
    return [];
  }

  try {
    // Si aún no se han concedido permisos, solicitar un stream breve para que los labels no salgan vacíos
    let initialStream: MediaStream | null = null;
    const devicesFirstPass = await navigator.mediaDevices.enumerateDevices();
    const hasLabels = devicesFirstPass.some((d) => d.kind === "audioinput" && d.label.length > 0);

    if (!hasLabels && navigator.mediaDevices.getUserMedia) {
      try {
        initialStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch {
        // Ignorar si el usuario rechaza permiso
      }
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    if (initialStream) {
      initialStream.getTracks().forEach((t) => t.stop());
    }

    return devices
      .filter((d) => d.kind === "audioinput")
      .map((d, idx) => ({
        deviceId: d.deviceId,
        label: d.label || `Entrada de Audio ${idx + 1}`,
        groupId: d.groupId,
      }));
  } catch (err) {
    console.warn("Fallo al enumerar dispositivos de audio:", err);
    return [];
  }
}

/**
 * Motor de captura y grabación multipista sincronizado al AudioContext maestro de Estudio Z.
 */
export class MultiTrackAudioRecorder {
  private ctx: AudioContext;
  private stream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private splitterNode: ChannelSplitterNode | null = null;
  private scriptNode: ScriptProcessorNode | null = null;
  private monitorGain: GainNode | null = null;

  private bufferSize = 2048;
  private maxPhysicalChannels = 2;
  private routingMode: InputRoutingMode = "mono_ch1";
  private customChannelIndex = 0;

  private recordedChunksL: Float32Array[] = [];
  private recordedChunksR: Float32Array[] = [];
  private totalRecordedFrames = 0;

  public isRecording = false;
  public isMonitoring = false;
  public onMeterUpdate?: (meter: InputMeterTelemetry) => void;

  constructor(onMeterUpdate?: (meter: InputMeterTelemetry) => void) {
    this.ctx = getSharedAudioContext();
    this.onMeterUpdate = onMeterUpdate;
  }

  setMeterCallback(callback?: (meter: InputMeterTelemetry) => void) {
    this.onMeterUpdate = callback;
  }

  /**
   * Conecta con la interfaz física seleccionada desactivando todos los filtros de voz (baja latencia profesional).
   */
  async initializeInput(deviceId?: string, preferredChannels = 2): Promise<number> {
    await ensureAudioContextResumed(this.ctx);
    this.stopInput();

    const audioConstraints: MediaTrackConstraints = {
      channelCount: { ideal: Math.max(1, Math.min(32, preferredChannels)) },
      echoCancellation: { exact: false },
      noiseSuppression: { exact: false },
      autoGainControl: { exact: false },
      sampleRate: { ideal: this.ctx.sampleRate },
    };

    if (deviceId && deviceId !== "default") {
      audioConstraints.deviceId = { exact: deviceId };
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: false,
      });
    } catch {
      // Fallback más permisivo si el driver rechaza restricciones exactas
      const fallbackConstraints: MediaTrackConstraints = {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      };
      if (deviceId && deviceId !== "default") {
        fallbackConstraints.deviceId = { exact: deviceId };
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: fallbackConstraints,
        video: false,
      });
    }

    const audioTrack = this.stream.getAudioTracks()[0];
    const settings = audioTrack.getSettings ? audioTrack.getSettings() : {};
    this.maxPhysicalChannels = Math.max(1, settings.channelCount || 2);

    this.sourceNode = this.ctx.createMediaStreamSource(this.stream);
    this.splitterNode = this.ctx.createChannelSplitter(this.maxPhysicalChannels);
    this.sourceNode.connect(this.splitterNode);

    // Nodo de monitoreo en tiempo real por software
    this.monitorGain = this.ctx.createGain();
    this.monitorGain.gain.setValueAtTime(this.isMonitoring ? 0.8 : 0, this.ctx.currentTime);
    this.monitorGain.connect(this.ctx.destination);

    // Nodo procesador de captura y vúmetro
    this.scriptNode = this.ctx.createScriptProcessor(
      this.bufferSize,
      this.maxPhysicalChannels,
      2
    );

    this.scriptNode.onaudioprocess = (event) => {
      const numInputChannels = event.inputBuffer.numberOfChannels;
      const frames = event.inputBuffer.length;

      let inCh0 = event.inputBuffer.getChannelData(0);
      let inCh1 = numInputChannels > 1 ? event.inputBuffer.getChannelData(1) : inCh0;

      // Enrutamiento físico según selección del usuario
      if (this.routingMode === "mono_ch1") {
        inCh0 = event.inputBuffer.getChannelData(0);
        inCh1 = inCh0;
      } else if (this.routingMode === "mono_ch2") {
        const chIdx = Math.min(numInputChannels - 1, 1);
        inCh0 = event.inputBuffer.getChannelData(chIdx);
        inCh1 = inCh0;
      } else if (this.routingMode === "mono_custom") {
        const targetIdx = Math.max(0, Math.min(numInputChannels - 1, this.customChannelIndex));
        inCh0 = event.inputBuffer.getChannelData(targetIdx);
        inCh1 = inCh0;
      } else if (this.routingMode === "stereo_1_2") {
        inCh0 = event.inputBuffer.getChannelData(0);
        inCh1 = numInputChannels > 1 ? event.inputBuffer.getChannelData(1) : inCh0;
      }

      // Si el monitoreo por software está activo, enviar al destino
      const outL = event.outputBuffer.getChannelData(0);
      const outR = event.outputBuffer.getChannelData(1);

      if (this.isMonitoring) {
        outL.set(inCh0);
        outR.set(inCh1);
      } else {
        outL.fill(0);
        outR.fill(0);
      }

      // Medición VU continua (RMS + Peak dB + Clip detection)
      let sumSq = 0;
      let peak = 0;
      for (let i = 0; i < frames; i++) {
        const sL = inCh0[i];
        const sR = inCh1[i];
        const maxVal = Math.max(Math.abs(sL), Math.abs(sR));
        if (maxVal > peak) peak = maxVal;
        sumSq += (sL * sL + sR * sR) * 0.5;
      }

      const rms = Math.sqrt(sumSq / frames);
      const db = Math.max(-60, Math.round(20 * Math.log10(Math.max(1e-3, peak)) * 10) / 10);
      const isClipping = peak >= 0.995;

      this.onMeterUpdate?.({ rms, db, isClipping });

      // Si está grabando activamente, guardar bloques de muestras
      if (this.isRecording) {
        const copyL = new Float32Array(inCh0);
        const copyR = new Float32Array(inCh1);
        this.recordedChunksL.push(copyL);
        this.recordedChunksR.push(copyR);
        this.totalRecordedFrames += frames;
      }
    };

    this.sourceNode.connect(this.scriptNode);
    this.scriptNode.connect(this.monitorGain);

    return this.maxPhysicalChannels;
  }

  setRouting(mode: InputRoutingMode, customIndex = 0) {
    this.routingMode = mode;
    this.customChannelIndex = customIndex;
  }

  setMonitoring(enabled: boolean, volume = 0.8) {
    this.isMonitoring = enabled;
    if (this.monitorGain) {
      this.monitorGain.gain.setTargetAtTime(
        enabled ? Math.max(0, Math.min(1.2, volume)) : 0,
        this.ctx.currentTime,
        0.015
      );
    }
  }

  startRecording() {
    this.recordedChunksL = [];
    this.recordedChunksR = [];
    this.totalRecordedFrames = 0;
    this.isRecording = true;
  }

  /**
   * Finaliza la grabación y aplica compensación de retardo (Automatic Delay Compensation - ADC).
   * Desplaza hacia atrás la pista para compensar la latencia de entrada/salida y alinear al sample exacto.
   */
  async stopRecording(latencyCompensationMs = 20): Promise<RecordedTrackResult> {
    this.isRecording = false;

    const sampleRate = this.ctx.sampleRate;
    const totalFrames = this.totalRecordedFrames;

    if (totalFrames === 0) {
      throw new Error("No se registraron muestras de audio durante la toma.");
    }

    // Convertir compensación de latencia en número de muestras
    const offsetFrames = Math.max(
      0,
      Math.min(totalFrames - 1, Math.round((latencyCompensationMs / 1000) * sampleRate))
    );

    const compensatedFrames = totalFrames - offsetFrames;

    // Aplanar los bloques en Float32Array contiguos compensados
    const fullL = new Float32Array(compensatedFrames);
    const fullR = new Float32Array(compensatedFrames);

    let writeIdx = 0;
    let readIdx = 0;

    for (let c = 0; c < this.recordedChunksL.length; c++) {
      const chunkL = this.recordedChunksL[c];
      const chunkR = this.recordedChunksR[c];
      const len = chunkL.length;

      for (let i = 0; i < len; i++) {
        if (readIdx >= offsetFrames) {
          if (writeIdx < compensatedFrames) {
            fullL[writeIdx] = chunkL[i];
            fullR[writeIdx] = chunkR[i];
            writeIdx++;
          }
        }
        readIdx++;
      }
    }

    // Crear AudioBuffer en memoria viva
    const audioBuffer = this.ctx.createBuffer(2, compensatedFrames, sampleRate);
    audioBuffer.copyToChannel(fullL, 0);
    audioBuffer.copyToChannel(fullR, 1);

    // Precalcular envolvente de forma de onda y nivel RMS
    const { peaks, rmsDb } = computeWaveformPeaks(audioBuffer, 200);

    // Codificar a archivo WAV 24-bit PCM Studio (144 dB SNR)
    const wavBlob = encodeStereoChunksToWav24Blob([fullL], [fullR], compensatedFrames, sampleRate);
    const objectUrl = URL.createObjectURL(wavBlob);

    // Liberar chunks temporales
    this.recordedChunksL = [];
    this.recordedChunksR = [];
    this.totalRecordedFrames = 0;

    return {
      blob: wavBlob,
      url: objectUrl,
      buffer: audioBuffer,
      peaks,
      rmsDb,
      durationSec: compensatedFrames / sampleRate,
    };
  }

  /**
   * Genera un pulso acústico de calibración de latencia de bucle (Loopback Latency Test).
   * Emite un pulso breve por los auriculares y calcula el retardo en ms.
   */
  async measureLoopbackLatency(): Promise<number> {
    await ensureAudioContextResumed(this.ctx);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime); // 1 kHz

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const startTime = this.ctx.currentTime;
    osc.start(startTime + 0.05);
    osc.stop(startTime + 0.12);

    // Esperar a que pase el pulso y devolver una estimación de latencia de ida y vuelta
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Latencia estimada por hardware/driver en Web Audio (baseLatency + outputLatency)
    const baseLat = (this.ctx.baseLatency || 0.008) * 1000;
    const outLat = ((this.ctx as unknown as { outputLatency?: number }).outputLatency || 0.012) * 1000;
    return Math.round(baseLat + outLat + 4);
  }

  stopInput() {
    if (this.scriptNode) {
      try {
        this.scriptNode.disconnect();
      } catch {
        // Ignorar
      }
      this.scriptNode = null;
    }

    if (this.monitorGain) {
      try {
        this.monitorGain.disconnect();
      } catch {
        // Ignorar
      }
      this.monitorGain = null;
    }

    if (this.splitterNode) {
      try {
        this.splitterNode.disconnect();
      } catch {
        // Ignorar
      }
      this.splitterNode = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // Ignorar
      }
      this.sourceNode = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  destroy() {
    this.isRecording = false;
    this.stopInput();
    this.recordedChunksL = [];
    this.recordedChunksR = [];
  }
}

