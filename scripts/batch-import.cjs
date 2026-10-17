const cheerio = require("cheerio");
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "data", "tabchurch.db");
const sqlite = new Database(dbPath);

// Asegurar que la columna current_key exista
try {
  sqlite.exec("ALTER TABLE songs ADD COLUMN current_key TEXT;");
} catch {}

const TARGET_ARTISTS = [
  { name: "Hillsong Worship", slug: "hillsong-worship", max: 10 },
  { name: "Miel San Marcos", slug: "miel-san-marcos", max: 10 },
  { name: "Elevation Worship", slug: "elevation-worship", max: 10 },
  { name: "Grupo Barak", slug: "grupo-barak", max: 10 },
  { name: "Felipe Santos", slug: "felipe-santos", max: 10 },
  { name: "Thalles Roberto", slug: "thalles-roberto", max: 10 },
  { name: "Danilo Montero", slug: "danilo-montero", max: 10 },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Convertir cifrado si no viene con corchetes
function convertChordsOverLyrics(text) {
  const lines = text.replace(/\r/g, "").split("\n");
  const CHORD_RE = /^([A-G])([#b]?)([^/\s]*)(?:\/([A-G])([#b]?))?$/;
  const isChord = (token) => {
    const m = CHORD_RE.exec(token);
    if (!m) return false;
    return /^(m|M|maj|min|dim|aug|sus|add|\+|°|ø|-|\d|\(|\)|#|b)*$/.test(m[3]);
  };
  const isChordLine = (l) => {
    const toks = l.trim().split(/\s+/).filter(Boolean);
    return toks.length > 0 && toks.every(isChord);
  };

  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!isChordLine(l)) {
      out.push(l);
      continue;
    }
    const next = lines[i + 1];
    const positions = [];
    for (const m of l.matchAll(/\S+/g)) positions.push({ col: m.index, chord: m[0] });

    if (next !== undefined && next.trim() && !isChordLine(next)) {
      let result = "";
      let cursor = 0;
      for (const p of positions) {
        const col = Math.min(p.col, next.length);
        result += next.slice(cursor, col) + `[${p.chord}]`;
        cursor = col;
      }
      result += next.slice(cursor);
      out.push(result);
      i++;
    } else {
      out.push(positions.map((p) => `[${p.chord}]`).join(" "));
    }
  }
  return out.join("\n");
}

async function scrapeSongPage(url, defaultArtist) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const $ = cheerio.load(html);

  let title = $("h1").first().text().trim();
  let artist = defaultArtist;

  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  if (ogTitle.includes("-")) {
    const parts = ogTitle.split("-").map((p) => p.trim());
    if (parts.length >= 2) {
      title = parts[0].replace(/\(acordes\)|\(chords\)/gi, "").trim();
      artist = parts[1] || defaultArtist;
    }
  }

  // Acordes dentro de <pre>
  const pre = $("pre").first();
  let rawBody = "";
  if (pre.length) {
    pre.find("b").each((_, el) => {
      const chord = $(el).text().trim();
      if (chord) {
        $(el).replaceWith(`[${chord}]`);
      }
    });
    rawBody = pre.text();
  }

  if (!rawBody || rawBody.length < 50) return null;

  let chordpro = rawBody;
  if (!rawBody.includes("[")) {
    chordpro = convertChordsOverLyrics(rawBody);
  }

  // Detectar primer tono
  let originalKey = null;
  const firstChord = chordpro.match(/\[([A-G][#b]?)([^\]]*)\]/);
  if (firstChord) {
    const base = firstChord[1];
    const isMinor = firstChord[2].startsWith("m") && !firstChord[2].startsWith("maj");
    originalKey = base + (isMinor ? "m" : "");
  }

  return {
    title,
    artist,
    originalKey,
    currentKey: originalKey,
    contentChordpro: chordpro.trim(),
  };
}

async function getArtistSongUrls(slug, limit) {
  const url = `https://www.cifraclub.com/${slug}/`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) return [];
  const html = await res.text();
  const $ = cheerio.load(html);

  const seen = new Set();
  const list = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (
      href &&
      href.startsWith(`/${slug}/`) &&
      href !== `/${slug}/` &&
      !href.includes("?") &&
      !href.includes("#")
    ) {
      const parts = href.split("/").filter(Boolean);
      if (
        parts.length === 2 &&
        !["discografia", "fotos", "noticias", "videos", "curiosidades"].includes(parts[1])
      ) {
        if (!seen.has(href)) {
          seen.add(href);
          list.push(`https://www.cifraclub.com${href}`);
        }
      }
    }
  });

  return list.slice(0, limit);
}

async function run() {
  console.log("🚀 Iniciando importación de repertorio cristiano desde CifraClub...\n");

  // Obtener usuario admin o el primer usuario
  const admin = sqlite.prepare("SELECT id FROM users LIMIT 1").get();
  if (!admin) {
    console.error("❌ No hay usuarios en la base de datos.");
    return;
  }
  const ownerId = admin.id;

  const insertSong = sqlite.prepare(`
    INSERT INTO songs (owner_id, title, artist, original_key, current_key, tempo, content_chordpro, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
  `);

  const existingSong = sqlite.prepare(`
    SELECT id FROM songs WHERE LOWER(title) = LOWER(?) AND LOWER(artist) = LOWER(?)
  `);

  let totalImported = 0;

  for (const item of TARGET_ARTISTS) {
    console.log(`📌 Procesando artista: ${item.name} (${item.slug})...`);
    const urls = await getArtistSongUrls(item.slug, item.max);
    console.log(`   Se encontraron ${urls.length} canciones para importar.`);

    for (let i = 0; i < urls.length; i++) {
      const songUrl = urls[i];
      try {
        const songData = await scrapeSongPage(songUrl, item.name);
        if (!songData) {
          console.log(`   ⚠️ Omitida: ${songUrl} (sin formato de acordes compatible)`);
          continue;
        }

        const exists = existingSong.get(songData.title, songData.artist);
        if (exists) {
          console.log(`   ⏩ Ya existe: ${songData.title} - ${songData.artist}`);
          continue;
        }

        insertSong.run(
          ownerId,
          songData.title,
          songData.artist,
          songData.originalKey,
          songData.currentKey,
          null, // tempo
          songData.contentChordpro,
          `Importada de CifraClub (${songUrl})`
        );

        totalImported++;
        console.log(`   ✅ [${totalImported}] Importada: "${songData.title}" (${songData.originalKey || 'Tono no detectado'})`);
      } catch (err) {
        console.log(`   ❌ Error en ${songUrl}:`, err.message);
      }

      // Pequeña pausa de cortesía para no saturar
      await sleep(350);
    }
    console.log("");
  }

  console.log(`🎉 ¡Proceso finalizado! Total de canciones importadas a la base de datos: ${totalImported}`);
}

run().catch(console.error);
