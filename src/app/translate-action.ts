"use server";

import { requireUser } from "@/lib/auth";

/**
 * Traduce texto de canciones (inglés, portugués, etc.) al español
 * conservando los acordes entre corchetes [Acorde] intactos.
 * Optimizado para enviar el texto agrupado en una sola petición HTTP.
 */
export async function translateLyricsToSpanish(
  chordproText: string
): Promise<{ ok: boolean; text?: string; error?: string }> {
  await requireUser();

  if (!chordproText || !chordproText.trim()) {
    return { ok: false, error: "No hay texto para traducir" };
  }

  try {
    const lines = chordproText.split("\n");
    const chords: string[] = [];
    const translatableIndices: number[] = [];
    const preparedLines: string[] = [];

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("{")) {
        continue;
      }

      const localMatches: number[] = [];
      const textToTranslate = line.replace(/\[([^\]]+)\]/g, (_, chord: string) => {
        const chordIdx = chords.length;
        chords.push(chord);
        localMatches.push(chordIdx);
        return `[[C_${chordIdx}]]`;
      });

      const cleanText = textToTranslate.replace(/\[\[C_\d+\]\]/g, "").trim();
      if (!cleanText || cleanText.length < 2) {
        continue;
      }

      translatableIndices.push(idx);
      preparedLines.push(textToTranslate);
    }

    if (preparedLines.length === 0) {
      return { ok: true, text: chordproText };
    }

    // Enviar las líneas agrupadas por bloques de hasta 2500 caracteres para minimizar llamadas HTTP
    const BATCH_LIMIT = 2500;
    const translatedPrepared: string[] = [];
    let currentBatch: string[] = [];
    let currentLen = 0;

    const flushBatch = async (batch: string[]) => {
      if (batch.length === 0) return;
      const joined = batch.join("\n");
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(joined)}`,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!res.ok) {
        translatedPrepared.push(...batch);
        return;
      }

      const data: unknown = await res.json();
      let fullTranslated = "";
      if (Array.isArray(data) && Array.isArray(data[0])) {
        for (const item of data[0]) {
          if (Array.isArray(item) && typeof item[0] === "string") {
            fullTranslated += item[0];
          }
        }
      } else {
        fullTranslated = joined;
      }

      const splitLines = fullTranslated.split("\n");
      for (let i = 0; i < batch.length; i++) {
        translatedPrepared.push(splitLines[i] ?? batch[i]);
      }
    };

    for (const pl of preparedLines) {
      if (currentLen + pl.length > BATCH_LIMIT && currentBatch.length > 0) {
        await flushBatch(currentBatch);
        currentBatch = [];
        currentLen = 0;
      }
      currentBatch.push(pl);
      currentLen += pl.length + 1;
    }
    await flushBatch(currentBatch);

    const outLines = [...lines];
    for (let j = 0; j < translatableIndices.length; j++) {
      const lineIdx = translatableIndices[j];
      let tLine = translatedPrepared[j] ?? preparedLines[j];
      tLine = tLine.replace(/\[\[\s*C_\s*(\d+)\s*\]\]/gi, (_, numStr: string) => {
        const cIdx = Number(numStr);
        return chords[cIdx] !== undefined ? `[${chords[cIdx]}]` : "";
      });
      outLines[lineIdx] = tLine;
    }

    return { ok: true, text: outLines.join("\n") };
  } catch (err: unknown) {
    console.error("Error al traducir letra:", err);
    return { ok: false, error: "No se pudo completar la traducción en este momento." };
  }
}
