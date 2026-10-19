import "server-only";
import * as cheerio from "cheerio";
import { convertChordsOverLyrics } from "./chordpro";

export type ScrapedSong = {
  title: string;
  artist: string;
  originalKey: string | null;
  contentChordpro: string;
};

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8,pt;q=0.7",
  "Cache-Control": "max-age=0",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

/**
 * Parsea el HTML directamente si la petición tiene éxito (200 OK)
 */
function parseHtml(html: string): ScrapedSong {
  const $ = cheerio.load(html);

  let title = $("h1").first().text().trim();
  let artist = "";
  let originalKey: string | null = null;
  let rawBody = "";

  // 1. Extraer artista y título de OpenGraph / Meta
  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  if (ogTitle.includes("-")) {
    const parts = ogTitle.split("-").map((p) => p.trim());
    if (parts.length >= 2) {
      if (!title || title.length < 2) {
        title = parts[0].replace(/\(acordes\)|\(chords\)/gi, "").trim();
      }
      artist = parts[1].replace(/Cifra Club/gi, "").trim();
    }
  }

  if (!artist) {
    artist =
      $('meta[property="og:article:author"]').attr("content") ||
      $('meta[name="author"]').attr("content") ||
      $("h2").first().text().trim();
  }

  // 2. Extraer tono si está presente
  const keyElem = $("#cifra_tom a, #cifra_tom, .cifra_tom, [data-tom]").first().text().trim();
  if (keyElem) {
    const km = keyElem.match(/([A-G][#b]?m?)/);
    if (km) originalKey = km[1];
  }

  // 3. Extraer el texto con los acordes
  const pre = $("pre").first();
  if (pre.length) {
    // CifraClub reemplazo <b>acorde</b> por [acorde]
    pre.find("b").each((_, el) => {
      const chordText = $(el).text().trim();
      if (chordText) {
        $(el).replaceWith(`[${chordText}]`);
      }
    });
    rawBody = pre.text();
  } else {
    rawBody = $(".cifra_conteudo").text() || $("article").text();
  }

  if (!rawBody || rawBody.trim().length === 0) {
    throw new Error("No se pudo detectar el texto del cifrado en este enlace.");
  }

  let contentChordpro = rawBody;
  if (!rawBody.includes("[")) {
    contentChordpro = convertChordsOverLyrics(rawBody);
  }

  if (!originalKey) {
    const firstChordMatch = contentChordpro.match(/\[([A-G][#b]?)([^\]]*)\]/);
    if (firstChordMatch) {
      const base = firstChordMatch[1];
      const isMinor = firstChordMatch[2].startsWith("m") && !firstChordMatch[2].startsWith("maj");
      originalKey = base + (isMinor ? "m" : "");
    }
  }

  return {
    title: title || "Canción Importada",
    artist: artist || "Artista Desconocido",
    originalKey,
    contentChordpro: contentChordpro.trim(),
  };
}

/**
 * Parsea el Markdown limpio devuelto por Jina Reader (que salta firewalls y Cloudflare)
 */
function parseJinaMarkdown(markdown: string): ScrapedSong {
  let title = "";
  let artist = "";
  let originalKey: string | null = null;

  // Title / Artist extraction
  const titleHeaderMatch = markdown.match(/Title:\s*(.+)/i);
  if (titleHeaderMatch) {
    const raw = titleHeaderMatch[1].trim();
    const lacuerdaMatch = raw.match(/^([^:]+):\s*Acordes.+?\((.+?)\)/i);
    if (lacuerdaMatch) {
      title = lacuerdaMatch[1].trim();
      artist = lacuerdaMatch[2].trim();
    } else {
      const parts = raw.split("-").map((p) => p.trim());
      if (parts.length >= 2) {
        title = parts[0].replace(/\(acordes\)|\(chords\)/gi, "").trim();
        artist = parts[1].replace(/Cifra Club/gi, "").trim();
      }
    }
  }

  if (!title) {
    const h1Match = markdown.match(/^#\s+(.+)$/m);
    if (h1Match) title = h1Match[1].replace(/\[.+?\]\(.+?\)/g, "").trim();
  }

  if (!artist) {
    const h2Match = markdown.match(/^##\s+\[?([^\]\n]+)\]?/m);
    if (h2Match) artist = h2Match[1].trim();
  }

  // Tono / Key
  const keyMatch = markdown.match(/(?:Key|Tono):\s*([A-G][#b]?m?)/i);
  if (keyMatch) {
    originalKey = keyMatch[1];
  }

  // Extracción del cuerpo
  let body = markdown;
  if (body.includes("Unpin chords list")) {
    body = body.split("Unpin chords list")[1];
  } else if (body.includes("Key:")) {
    const parts = body.split(/Key:\s*[A-G][#b]?m?/i);
    if (parts.length > 1) body = parts[1];
  } else if (body.includes("## Letras, Acordes y Tabs")) {
    body = body.split("## Letras, Acordes y Tabs")[1];
  }

  // Descartar pie de página y metadatos no musicales
  const footerMarkers = [
    "Song details",
    "Did you see an error?",
    "## All artists",
    "## Songs",
    "## Features",
    "Composition:",
    "Review composition",
    "Este fichero es trabajo propio",
    "Close ad",
    "* * *",
  ];
  for (const marker of footerMarkers) {
    if (body.includes(marker)) {
      body = body.split(marker)[0];
    }
  }

  // Convertir acordes de CifraClub: **C** -> [C]
  body = body.replace(/\*\*([A-G][#b]?(?:[a-zA-Z0-9/+#]*)?)\*\*/g, "[$1]");

  // Convertir enlaces de acordes de LaCuerda: [D](http...) -> [D]
  body = body.replace(/\[([A-G][#b]?(?:[a-zA-Z0-9/+#]*)?)\]\([^\)]+\)/g, "[$1]");

  // Limpiar imágenes markdown y enlaces residuales
  body = body.replace(/!\[[^\]]*\]\([^\)]+\)/g, "");
  body = body.replace(/^\s*(?:Key|Tono):\s*[A-G][#b]?m?\s*/im, "");

  let contentChordpro = body.trim();

  // Si no tiene acordes inline [C] y parece tener acordes sobre letras, convertir
  if (!contentChordpro.includes("[")) {
    contentChordpro = convertChordsOverLyrics(contentChordpro);
  }

  if (!originalKey) {
    const firstChordMatch = contentChordpro.match(/\[([A-G][#b]?)([^\]]*)\]/);
    if (firstChordMatch) {
      const base = firstChordMatch[1];
      const isMinor = firstChordMatch[2].startsWith("m") && !firstChordMatch[2].startsWith("maj");
      originalKey = base + (isMinor ? "m" : "");
    }
  }

  return {
    title: title || "Canción Importada",
    artist: artist || "Artista Desconocido",
    originalKey,
    contentChordpro: contentChordpro.trim(),
  };
}

/**
 * Extrae y convierte una canción de sitios como CifraClub o LaCuerda
 * Con tolerancia a fallos y fallback anti-bot
 */
export async function scrapeSongFromUrl(url: string): Promise<ScrapedSong> {
  const parsedUrl = new URL(url);
  let useFallback = false;

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(6000),
    });

    if (response.ok) {
      const html = await response.text();
      return parseHtml(html);
    }
    useFallback = true;
  } catch {
    useFallback = true;
  }

  if (useFallback) {
    try {
      const jinaResponse = await fetch(`https://r.jina.ai/${parsedUrl.toString()}`, {
        headers: {
          Accept: "text/plain",
          "X-No-Cache": "true",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (jinaResponse.ok) {
        const md = await jinaResponse.text();
        return parseJinaMarkdown(md);
      }
    } catch {
      throw new Error(
        "No se pudo conectar con el servidor para extraer la canción. Intenta nuevamente o copia los acordes manualmente."
      );
    }
  }

  throw new Error(
    "No se pudo acceder a la página web debido a la protección anti-bot del sitio origen. Intenta copiar y pegar la canción manualmente."
  );
}
