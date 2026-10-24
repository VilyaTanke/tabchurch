declare module "soundtouchjs" {
  export interface FifoBuffer {
    clear(): void;
    receive(numFrames?: number): void;
  }

  export class RateTransposer {
    rate: number;
    inputBuffer: FifoBuffer;
    outputBuffer: FifoBuffer;
    clear(): void;
    process(): void;
  }

  export class Stretch {
    quickSeek: boolean;
    inputBuffer: FifoBuffer;
    outputBuffer: FifoBuffer;
    setParameters(sampleRate: number, sequenceMs: number, seekWindowMs: number, overlapMs: number): void;
    clear(): void;
    process(): void;
  }

  export class SoundTouch {
    rate: number;
    tempo: number;
    pitch: number;
    pitchSemitones: number;
    stretch: Stretch;
    transposer: RateTransposer;
    _inputBuffer: FifoBuffer;
    _intermediateBuffer: FifoBuffer;
    _outputBuffer: FifoBuffer;
    calculateEffectiveRateAndTempo(): void;
    clear(): void;
    process(): void;
  }

  export class WebAudioBufferSource {
    buffer: AudioBuffer;
    position: number;
    readonly dualChannel: boolean;
    constructor(buffer: AudioBuffer);
    extract(target: Float32Array, numFrames?: number, position?: number): number;
  }

  export class SimpleFilter {
    sourceSound: WebAudioBufferSource;
    historyBufferSize: number;
    sourcePosition: number;
    position: number;
    outputBufferPosition: number;
    callback: () => void;
    constructor(sourceSound: WebAudioBufferSource, pipe: SoundTouch, callback?: () => void);
    extract(target: Float32Array, numFrames: number): number;
    clear(): void;
    onEnd(): void;
  }

  export class PitchShifter {
    timePlayed: number;
    sourcePosition: number;
    tempo: number;
    rate: number;
    pitch: number;
    pitchSemitones: number;
    duration: number;
    sampleRate: number;
    percentagePlayed: number;
    readonly node: AudioNode;
    constructor(context: AudioContext, buffer: AudioBuffer, bufferSize?: number, onEnd?: () => void);
    connect(toNode: AudioNode): void;
    disconnect(): void;
    on(eventName: string, cb: (detail: unknown) => void): void;
    off(eventName?: string): void;
  }

  export const getWebAudioNode: (
    context: AudioContext,
    filter: SimpleFilter,
    sourcePositionCallback?: (sourcePosition: number) => void,
    bufferSize?: number
  ) => ScriptProcessorNode;
}
