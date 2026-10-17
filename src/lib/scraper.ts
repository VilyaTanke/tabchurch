import "server-only";
import * as cheerio from "cheerio";
import { convertChordsOverLyrics } from "./chordpro";

export type ScrapedSong = {
  title: string;
  artist: string;
  originalKey: string | null;
  contentChordpro: string;
};

/**
 * Extrae y convierte una canción de sitios como CifraClub o LaCuerda
 */
export async function scrapeSongFromUrl(url: string): Promise<ScrapedSong> {
  const parsedUrl = new URL(url);
  const response = await fetch(parsedUrl.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml",
    },
  });

  if (!response.ok) {
    throw new Error(`No se pudo acceder a la página web (Error ${response.status})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  let title = $("h1").first().text().trim();
  let artist = "";
  let originalKey: string | null = null;
  let rawBody = "";

  // 1. Extraer artista y título
  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  if (ogTitle.includes("-")) {
    const parts = ogTitle.split("-").map((p) => p.trim());
    if (parts.length >= 2) {
      if (!title || title.length < 2) {
        title = parts[0].replace(/\(acordes\)|\(chords\)/gi, "").trim();
      }
      artist = parts[1];
    }
  }

  if (!artist) {
    artist = $('meta[property="og:article:author"]').attr("content") ||
      $('meta[name="author"]').attr("content") ||
      $("h2").first().text().trim();
  }

  // 2. Extraer el texto con los acordes
  const pre = $("pre").first();
  if (pre.length) {
    // Si contiene etiquetas <b> con los acordes (típico de CifraClub)
    // Reemplazamos los <b>acorde</b> por [acorde] directamente para máxima fidelidad
    pre.find("b").each((_, el) => {
      const chordText = $(el).text().trim();
      if (chordText) {
        $(el).replaceWith(`[${chordText}]`);
      }
    });
    rawBody = pre.text();
  } else {
    // Fallback: buscar divs de acordes o contenedor principal
    rawBody = $(".cifra_conteudo").text() || $("article").text();
  }

  if (!rawBody || rawBody.trim().length === 0) {
    throw new Error("No se pudo detectar el texto del cifrado en este enlace.");
  }

  // 3. Limpieza y conversión a ChordPro si aún tiene formato tradicional
  let contentChordpro = rawBody;
  if (!rawBody.includes("[")) {
    contentChordpro = convertChordsOverLyrics(rawBody);
  }

  // 4. Detectar o estimar tono
  const firstChordMatch = contentChordpro.match(/\[([A-G][#b]?)([^\]]*)\]/);
  if (firstChordMatch) {
    // Si tiene 'm' menor, considerarlo
    const base = firstChordMatch[1];
    const isMinor = firstChordMatch[2].startsWith("m") && !firstChordMatch[2].startsWith("maj");
    originalKey = base + (isMinor ? "m" : "");
  }

  return {
    title: title || "Canción Importada",
    artist: artist || "Artista Desconocido",
    originalKey,
    contentChordpro: contentChordpro.trim(),
  };
}
