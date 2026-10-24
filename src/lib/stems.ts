// Metadatos compartidos (cliente y servidor) para pistas de audio y stems.

export type StemName = "vocals" | "drums" | "bass" | "guitar" | "piano" | "other" | "original";

export type StemFile = { name: string; file: string };

export type StemsStatus = "none" | "queued" | "processing" | "done" | "error";

export const STEM_META: Record<string, { label: string; color: string; order: number }> = {
  vocals: { label: "Voz", color: "#f5c451", order: 1 },
  drums: { label: "Batería", color: "#ff7a59", order: 2 },
  bass: { label: "Bajo", color: "#a78bfa", order: 3 },
  guitar: { label: "Guitarras", color: "#34d399", order: 4 },
  piano: { label: "Piano", color: "#60a5fa", order: 5 },
  other: { label: "Otros", color: "#f472b6", order: 6 },
  original: { label: "Mezcla original", color: "#dfba73", order: 0 },
};

export function stemLabel(name: string) {
  return STEM_META[name]?.label ?? name;
}

export function stemColor(name: string) {
  return STEM_META[name]?.color ?? "#94a3b8";
}

/** Modelos de Demucs permitidos. */
export const STEM_MODELS = {
  htdemucs_6s: {
    label: "6 pistas",
    description: "Voz, batería, bajo, guitarras, piano y otros",
  },
  htdemucs: {
    label: "4 pistas (más precisa)",
    description: "Voz, batería, bajo y otros",
  },
} as const;

export type StemModel = keyof typeof STEM_MODELS;

export const DEFAULT_STEM_MODEL: StemModel = "htdemucs_6s";

export function isStemModel(v: unknown): v is StemModel {
  return typeof v === "string" && v in STEM_MODELS;
}

export function parseStemsList(raw: string | null | undefined): StemFile[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((s): s is StemFile => s && typeof s.name === "string" && typeof s.file === "string")
      .sort((a, b) => (STEM_META[a.name]?.order ?? 99) - (STEM_META[b.name]?.order ?? 99));
  } catch {
    return [];
  }
}

export function formatDuration(sec: number | null | undefined) {
  if (sec == null || !Number.isFinite(sec)) return "--:--";
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ACCEPTED_AUDIO_EXT = [".mp3", ".wav", ".ogg", ".flac"] as const;
export const MAX_UPLOAD_MB = 80;
