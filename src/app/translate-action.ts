"use server";

import { requireUser } from "@/lib/auth";

/**
 * Traduce texto de canciones (inglés, portugués, etc.) al español
 * conservando los acordes entre corchetes [Acorde] intactos.
 */
export async function translateLyricsToSpanish(chordproText: string): Promise<{ ok: boolean; text?: string; error?: string }> {
  await requireUser();

  if (!chordproText || !chordproText.trim()) {
    return { ok: false, error: "No hay texto para traducir" };
  }

  try {
    const lines = chordproText.split("\n");
    const translatedLines: string[] = [];

    // Traducir por bloques o líneas de letra respetando los tokens de acordes
    for (const line of lines) {
      // Si es una directiva o línea vacía o solo acordes, conservarla
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("{")) {
        translatedLines.push(line);
        continue;
      }

      // Separar letra y acordes: reemplazamos [acorde] con marcadores especiales
      const chords: string[] = [];
      const textToTranslate = line.replace(/\[([^\]]+)\]/g, (_, chord) => {
        chords.push(chord);
        return `___CHORD_${chords.length - 1}___`;
      });

      // Si la línea solo contenía acordes y espacios, no necesita traducción
      const cleanText = textToTranslate.replace(/___CHORD_\d+___/g, "").trim();
      if (!cleanText || cleanText.length < 2) {
        translatedLines.push(line);
        continue;
      }

      // Llamar a Google Translate API pública libre
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(textToTranslate)}`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
      );

      if (!res.ok) {
        translatedLines.push(line);
        continue;
      }

      const data = await res.json();
      let translatedLine = "";
      if (Array.isArray(data) && Array.isArray(data[0])) {
        for (const item of data[0]) {
          if (item && item[0]) translatedLine += item[0];
        }
      } else {
        translatedLine = textToTranslate;
      }

      // Restaurar los acordes [Acorde] en su lugar original
      for (let i = 0; i < chords.length; i++) {
        // En caso de que el traductor haya agregado espacios o modificado la etiqueta
        const regex = new RegExp(`___\\s*CHORD_\\s*${i}\\s*___`, "gi");
        translatedLine = translatedLine.replace(regex, `[${chords[i]}]`);
      }

      translatedLines.push(translatedLine);
    }

    return { ok: true, text: translatedLines.join("\n") };
  } catch (err: any) {
    console.error("Error al traducir letra:", err);
    return { ok: false, error: "No se pudo completar la traducción en este momento." };
  }
}
