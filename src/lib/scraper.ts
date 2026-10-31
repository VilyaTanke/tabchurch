import "server-only";
import dns from "node:dns/promises";
import net from "node:net";
import * as cheerio from "cheerio";
import { convertChordsOverLyrics, isChord } from "./chordpro";

export type ScrapedSong = {
  title: string;
  artist: string;
  originalKey: string | null;
  contentChordpro: string;
};

export type ArtistSongItem = {
  title: string;
  url: string;
};

export type ArtistScrapedCatalog = {
  artist: string;
  songs: ArtistSongItem[];
};

/**
 * Reemplaza los marcadores \uE000acorde\uE001 por [acorde] preservando
 * la columna exacta de cada acorde respecto a la letra inferior.
 */
function replaceMarkersPreservingColumns(line: string): string {
  if (!line.includes("\uE000")) return line;
  const re = /\uE000([^\uE001]+)\uE001/g;
  let origCol = 0;
  let out = "";
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    const between = line.slice(lastIdx, m.index);
    origCol += between.length;
    if (lastIdx === 0) {
      out += between;
    } else if (/^\s+$/.test(between)) {
      const neededSpaces = Math.max(1, origCol - out.length);
      out += " ".repeat(neededSpaces);
    } else {
      out += between;
    }
    const chord = m[1].trim();
    out += `[${chord}]`;
    origCol += m[1].length;
    lastIdx = m.index + m[0].length;
  }
  out += line.slice(lastIdx);
  return out;
}

function cleanScrapedText(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => replaceMarkersPreservingColumns(l.trimEnd()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Verifica si una dirección IPv4 o IPv6 pertenece a rangos privados, loopback o link-local (protección SSRF). */
function isPrivateOrReservedIp(ip: string): boolean {
  const normalized = ip.toLowerCase().trim();
  if (normalized === "::1" || normalized === "::" || normalized === "0.0.0.0") return true;

  const v4Mapped = normalized.startsWith("::ffff:") ? normalized.slice(7) : normalized;

  if (net.isIPv4(v4Mapped)) {
    const parts = v4Mapped.split(".").map(Number);
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true;
    return false;
  }

  if (net.isIPv6(normalized)) {
    if (
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80") ||
      normalized.startsWith("ff")
    ) {
      return true;
    }
  }

  return false;
}

/** Valida que la URL sea HTTP/HTTPS pública y no apunte a servicios internos (anti-SSRF). */
async function validatePublicUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("La URL proporcionada no es válida.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Solo se permiten enlaces con protocolo HTTP o HTTPS.");
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".localhost")
  ) {
    throw new Error("No se permiten direcciones locales o internas.");
  }

  if (net.isIP(hostname)) {
    if (isPrivateOrReservedIp(hostname)) {
      throw new Error("No se permiten direcciones IP privadas o reservadas.");
    }
    return parsed;
  }

  const records = await dns.lookup(hostname, { all: true }).catch(() => []);
  if (!records.length) {
    throw new Error("No se pudo resolver el dominio del enlace.");
  }
  for (const rec of records) {
    if (isPrivateOrReservedIp(rec.address)) {
      throw new Error("El dominio apunta a una dirección de red interna no permitida.");
    }
  }

  return parsed;
}

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

  // 3. Extraer el texto con los acordes preservando las columnas exactas
  const pre = $("pre").first();
  if (pre.length) {
    // CifraClub usa <b>acorde</b> y LaCuerda usa <a>acorde</a> dentro de <pre>
    pre.find("b, a").each((_, el) => {
      const chordText = $(el).text().replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
      if (chordText && ($(el).is("b") || isChord(chordText))) {
        $(el).replaceWith(`\uE000${chordText}\uE001`);
      }
    });
    rawBody = cleanScrapedText(pre.text());
  } else {
    rawBody = cleanScrapedText($(".cifra_conteudo").text() || $("article").text());
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
    if (firstChordMatch && isChord(firstChordMatch[1] + firstChordMatch[2])) {
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
  let body = markdown.replace(/[\u200B-\u200D\uFEFF]/g, "");
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
    "## Related songs",
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

  // Convertir acordes de CifraClub: **C** -> marcador para preservar columnas
  body = body.replace(/\*\*([A-G][#b]?(?:[a-zA-Z0-9/+#()-]*)?)\*\*/g, "\uE000$1\uE001");

  // Convertir enlaces de acordes de LaCuerda: [D](http...) -> marcador para preservar columnas
  body = body.replace(/\[([A-G][#b]?(?:[a-zA-Z0-9/+#()-]*)?)\]\([^)]+\)/g, "\uE000$1\uE001");


  // Limpiar imágenes markdown y enlaces residuales
  body = body.replace(/!\[[^\]]*\]\([^)]+\)/g, "");
  body = body.replace(/^\s*(?:Key|Tono):\s*[A-G][#b]?m?\s*/im, "");

  let contentChordpro = cleanScrapedText(body);

  // Si no tiene acordes inline [C] y parece tener acordes sobre letras, convertir
  if (!contentChordpro.includes("[")) {
    contentChordpro = convertChordsOverLyrics(contentChordpro);
  }

  if (!originalKey) {
    const firstChordMatch = contentChordpro.match(/\[([A-G][#b]?)([^\]]*)\]/);
    if (firstChordMatch && isChord(firstChordMatch[1] + firstChordMatch[2])) {
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
 * Con validación anti-SSRF, tolerancia a fallos y fallback anti-bot
 */
export async function scrapeSongFromUrl(url: string): Promise<ScrapedSong> {
  const parsedUrl = await validatePublicUrl(url);
  let useFallback = false;

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: BROWSER_HEADERS,
      redirect: "follow",
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
    // 1. Intentar Jina en modo HTML para conservar intacto el <pre> y todos los espacios
    try {
      const jinaHtmlResponse = await fetch(`https://r.jina.ai/${parsedUrl.toString()}`, {
        headers: {
          "X-Return-Format": "html",
          "X-No-Cache": "true",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (jinaHtmlResponse.ok) {
        const html = await jinaHtmlResponse.text();
        return parseHtml(html);
      }
    } catch {
      // Continuar a fallback Markdown si falla el modo HTML
    }

    // 2. Fallback secundario en modo texto/markdown
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

/**
 * Extrae la lista completa de canciones de un artista desde CifraClub o LaCuerda
 */
export async function scrapeArtistSongs(artistUrl: string): Promise<ArtistScrapedCatalog> {
  const parsedUrl = await validatePublicUrl(artistUrl);
  const hostname = parsedUrl.hostname.toLowerCase();

  async function fetchHtml(urlStr: string): Promise<string> {
    try {
      const res = await fetch(urlStr, {
        headers: BROWSER_HEADERS,
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return await res.text();
    } catch {
      // Fallback a Jina
    }

    try {
      const jinaRes = await fetch(`https://r.jina.ai/${urlStr}`, {
        headers: { "X-Return-Format": "html", "X-No-Cache": "true" },
        signal: AbortSignal.timeout(15000),
      });
      if (jinaRes.ok) return await jinaRes.text();
    } catch {
      // Fallback fallo
    }

    throw new Error(`No se pudo obtener la página del artista (${urlStr}).`);
  }

  if (hostname.includes("cifraclub.com")) {
    const html = await fetchHtml(parsedUrl.toString());
    const $ = cheerio.load(html);

    let artist = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || "";
    artist = artist.replace(/\s*cifras\s*$/i, "").trim() || "Artista";

    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    const artistSlug = pathParts[0] || "";
    const artistPath = `/${artistSlug}/`;

    const songMap = new Map<string, string>();

    // 1. Explorar páginas ordenadas alfabéticamente si CifraClub tiene el botón /explorar/
    let exploreLink = $('a[href*="/explorar/musicas/?artist="]').attr("href") || "";
    if (exploreLink) {
      if (!exploreLink.startsWith("http")) {
        exploreLink = `https://${hostname}${exploreLink.startsWith("/") ? "" : "/"}${exploreLink}`;
      }
      const expUrl = new URL(exploreLink);
      expUrl.searchParams.set("order", "alphabetical");

      for (let page = 1; page <= 8; page++) {
        expUrl.searchParams.set("page", String(page));
        try {
          const pageHtml = await fetchHtml(expUrl.toString());
          const $p = cheerio.load(pageHtml);
          let pageCount = 0;
          $p(`a[href*="/${artistSlug}/"]`).each((_, el) => {
            const href = $p(el).attr("href");
            if (!href || href === artistPath || href.includes("?")) return;
            const parts = href.split("/").filter(Boolean);
            if (
              parts.length === 2 &&
              parts[0] === artistSlug &&
              !["discografia", "fotos", "playlists", "albuns", "videoaulas", "letra"].includes(parts[1])
            ) {
              let title =
                $p(el).find(".primaryLabel span, .primaryLabel").first().text().trim() ||
                $p(el).text().trim();
              title = title.replace(/^\d+\s*/, "").replace(/Opções$/i, "").trim();
              if (title && !title.toLowerCase().startsWith("letra") && !title.toLowerCase().startsWith("cifra")) {
                const fullSongUrl = `https://${hostname}/${artistSlug}/${parts[1]}/`;
                if (!songMap.has(fullSongUrl)) {
                  songMap.set(fullSongUrl, title);
                  pageCount++;
                }
              }
            }
          });
          if (pageCount === 0) break;
        } catch {
          break;
        }
      }
    }

    // 2. Extraer también de la página principal del artista
    $(`a[href*="/${artistSlug}/"]`).each((_, el) => {
      const href = $(el).attr("href");
      if (!href || href === artistPath || href.includes("?")) return;
      const parts = href.split("/").filter(Boolean);
      if (
        parts.length === 2 &&
        parts[0] === artistSlug &&
        !["discografia", "fotos", "playlists", "albuns", "videoaulas", "letra"].includes(parts[1])
      ) {
        let title =
          $(el).find(".primaryLabel span, .primaryLabel").first().text().trim() ||
          $(el).text().trim();
        title = title.replace(/^\d+\s*/, "").replace(/Opções$/i, "").trim();
        if (title && !title.toLowerCase().startsWith("letra") && !title.toLowerCase().startsWith("cifra")) {
          const fullSongUrl = `https://${hostname}/${artistSlug}/${parts[1]}/`;
          if (!songMap.has(fullSongUrl)) {
            songMap.set(fullSongUrl, title);
          }
        }
      }
    });

    const songs: ArtistSongItem[] = Array.from(songMap.entries()).map(([url, title]) => ({ title, url }));
    return { artist, songs };
  }

  if (hostname.includes("lacuerda.net")) {
    const html = await fetchHtml(parsedUrl.toString());
    const $ = cheerio.load(html);

    let artist = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || "";
    artist = artist.replace(/letras.*$/i, "").replace(/acordes.*$/i, "").trim() || "Artista";

    const songMap = new Map<string, string>();
    const baseUrl = parsedUrl.origin;
    const currentPath = parsedUrl.pathname.endsWith("/") ? parsedUrl.pathname : parsedUrl.pathname + "/";

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      let title = $(el).text().trim();
      if (!href || !title || href.startsWith("#") || href.includes("javascript")) return;

      if (href.startsWith("/tabs/") && href.split("/").filter(Boolean).length <= 2) return;
      if (title.toLowerCase() === "acordes de guitarra" || title.toLowerCase() === "letras") return;

      title = title.replace(/\s+acordes\s*$/i, "").replace(/\s+tab\s*$/i, "").trim();
      if (!title || title.length <= 1) return;

      let fullUrl = "";
      if (href.startsWith("http")) {
        if (!href.includes(parsedUrl.pathname)) return;
        fullUrl = href;
      } else if (href.startsWith("/")) {
        fullUrl = `${baseUrl}${href}`;
      } else {
        fullUrl = `${baseUrl}${currentPath}${href}`;
      }

      if (!fullUrl.endsWith(currentPath) && !songMap.has(fullUrl)) {
        songMap.set(fullUrl, title);
      }
    });

    const songs: ArtistSongItem[] = Array.from(songMap.entries()).map(([url, title]) => ({ title, url }));
    return { artist, songs };
  }

  throw new Error("Actualmente solo se admite importar catálogos de artistas desde CifraClub o LaCuerda.");
}
