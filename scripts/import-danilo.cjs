const cheerio = require("cheerio");
const Database = require("better-sqlite3");
const path = require("path");

const sqlite = new Database(path.join(process.cwd(), "data", "tabchurch.db"));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function run() {
  console.log("🔍 Obteniendo lista completa de álbumes de Danilo Montero...");

  const admin = sqlite.prepare("SELECT id FROM users LIMIT 1").get();
  const ownerId = admin.id;

  const res = await fetch("https://www.cifraclub.com/danilo-montero/discografia.html", {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36" },
  });

  const albums = new Set();
  if (res.ok) {
    const html = await res.text();
    const $ = cheerio.load(html);
    $("a").each((_, el) => {
      const h = $(el).attr("href");
      if (h && h.includes("/danilo-montero/discografia/")) {
        albums.add(`https://www.cifraclub.com${h}`);
      }
    });
  }

  // Also include main page
  const allSongUrls = new Set();
  const mainRes = await fetch("https://www.cifraclub.com/danilo-montero/", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (mainRes.ok) {
    const mHtml = await mainRes.text();
    const $m = cheerio.load(mHtml);
    $m("a[href^='/danilo-montero/']").each((_, el) => {
      const href = $m(el).attr("href");
      if (
        href &&
        href !== "/danilo-montero/" &&
        !href.includes("/discografia") &&
        !href.includes("?") &&
        !href.includes("#") &&
        !href.endsWith("/letra/")
      ) {
        allSongUrls.add(`https://www.cifraclub.com${href}`);
      }
    });
  }

  console.log(`Buscando canciones en ${albums.size} álbumes...`);
  for (const albumUrl of albums) {
    try {
      const aRes = await fetch(albumUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!aRes.ok) continue;
      const aHtml = await aRes.text();
      const $$ = cheerio.load(aHtml);
      $$("a[href^='/danilo-montero/']").each((_, el) => {
        const href = $$(el).attr("href");
        if (
          href &&
          href !== "/danilo-montero/" &&
          !href.includes("/discografia") &&
          !href.includes("?") &&
          !href.includes("#") &&
          !href.endsWith("/letra/")
        ) {
          allSongUrls.add(`https://www.cifraclub.com${href}`);
        }
      });
      await sleep(150);
    } catch (e) {
      console.error(e.message);
    }
  }

  const urlsList = Array.from(allSongUrls);
  console.log(`\n🎵 Encontradas ${urlsList.length} canciones con cifrado en total.`);

  const insertSong = sqlite.prepare(`
    INSERT INTO songs (owner_id, title, artist, original_key, current_key, tempo, content_chordpro, notes, created_at, updated_at)
    VALUES (?, ?, 'Danilo Montero', ?, ?, null, ?, ?, unixepoch(), unixepoch())
  `);

  const existingSong = sqlite.prepare(`
    SELECT id, title FROM songs WHERE LOWER(title) = LOWER(?) AND LOWER(artist) LIKE '%danilo montero%'
  `);

  let added = 0;
  let skipped = 0;

  for (let i = 0; i < urlsList.length; i++) {
    const url = urlsList[i];
    try {
      const pageRes = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!pageRes.ok) continue;

      const pageHtml = await pageRes.text();
      const $$ = cheerio.load(pageHtml);

      let title = $$("h1").first().text().trim();
      const ogTitle = $$('meta[property="og:title"]').attr("content") || "";
      if (ogTitle.includes("-")) {
        title = ogTitle.split("-")[0].replace(/\(acordes\)|\(chords\)/gi, "").trim();
      }

      if (!title) {
        continue;
      }

      const found = existingSong.get(title);
      if (found) {
        skipped++;
        continue;
      }

      const pre = $$("pre").first();
      let raw = "";
      if (pre.length) {
        pre.find("b").each((_, b) => {
          const chord = $$(b).text().trim();
          if (chord) $$(b).replaceWith(`[${chord}]`);
        });
        raw = pre.text();
      }

      if (!raw || raw.length < 40) continue;

      let chordpro = raw.includes("[") ? raw : convertChordsOverLyrics(raw);

      let key = null;
      const firstChord = chordpro.match(/\[([A-G][#b]?)([^\]]*)\]/);
      if (firstChord) {
        const base = firstChord[1];
        const isMinor = firstChord[2].startsWith("m") && !firstChord[2].startsWith("maj");
        key = base + (isMinor ? "m" : "");
      }

      insertSong.run(ownerId, title, key, key, chordpro.trim(), `Importada de CifraClub (${url})`);
      added++;
      console.log(`  ✅ [${added}] "${title}" (${key || '—'})`);
    } catch (err) {
      console.log(`  ❌ Error en ${url}:`, err.message);
    }

    await sleep(200);
  }

  console.log(`\n🎉 Finalizado: ${added} nuevas canciones importadas, ${skipped} omitidas por ya existir.`);
}

run().catch(console.error);
