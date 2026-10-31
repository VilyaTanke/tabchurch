// Mock de 'server-only' para permitir la ejecución de scripts independientes fuera del bundle de Next.js
try {
  const serverOnlyPath = require.resolve("server-only");
  require.cache[serverOnlyPath] = {
    id: serverOnlyPath,
    filename: serverOnlyPath,
    loaded: true,
    exports: {},
  } as unknown as NodeModule;
} catch {
  // Ignorar si no está instalado
}

import Database from "better-sqlite3";
import path from "node:path";

async function run() {
  const artistUrl = process.argv[2];
  if (!artistUrl || !artistUrl.startsWith("http")) {
    console.error("❌ Uso incorrecto.");
    console.error("Uso: npm run import:artist -- \"<url_del_artista>\"");
    console.error("Ejemplo: npm run import:artist -- \"https://www.cifraclub.com.br/miel-san-marcos/\"");
    process.exit(1);
  }

  // Importar scraper dinámicamente tras aplicar el mock de server-only
  const { scrapeArtistSongs, scrapeSongFromUrl } = await import("../src/lib/scraper");

  const dbPath = path.resolve(process.cwd(), "data/tabchurch.db");
  const db = new Database(dbPath);

  console.log(`\n🔍 Escaneando artista desde: ${artistUrl} ...`);
  let catalog;
  try {
    catalog = await scrapeArtistSongs(artistUrl);
  } catch (err: unknown) {
    console.error("❌ Error al escanear el catálogo del artista:", (err as Error)?.message || err);
    process.exit(1);
  }

  const { artist, songs } = catalog;
  console.log(`\n🎵 Artista: \x1b[33m${artist}\x1b[0m`);
  console.log(`📋 Canciones encontradas: ${songs.length}`);

  // Obtener canciones existentes en la base de datos
  const existingRows = db.prepare("SELECT id, title, artist FROM songs").all() as {
    id: number;
    title: string;
    artist: string | null;
  }[];

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const toImport = songs.filter((song) => {
    const norm = normalize(song.title);
    return !existingRows.some((row) => normalize(row.title) === norm);
  });

  const alreadyExistingCount = songs.length - toImport.length;
  console.log(`✅ Ya existentes en la biblioteca: ${alreadyExistingCount}`);
  console.log(`📥 Nuevas por importar: \x1b[32m${toImport.length}\x1b[0m\n`);

  if (toImport.length === 0) {
    console.log("✨ Todas las canciones del catálogo ya están en la biblioteca.");
    process.exit(0);
  }

  // Obtener un usuario de referencia (el primer admin o usuario existente)
  const firstUser = db.prepare("SELECT id FROM users ORDER BY id ASC LIMIT 1").get() as { id: number } | undefined;
  const ownerId = firstUser?.id ?? 1;

  const insertStmt = db.prepare(`
    INSERT INTO songs (owner_id, title, artist, original_key, current_key, content_chordpro, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
  `);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < toImport.length; i++) {
    const target = toImport[i];
    const prefix = `[${i + 1}/${toImport.length}]`;
    process.stdout.write(`${prefix} Descargando "${target.title}"... `);

    try {
      const scraped = await scrapeSongFromUrl(target.url);
      const titleToSave = scraped.title || target.title;
      const artistToSave = scraped.artist || artist;

      insertStmt.run(
        ownerId,
        titleToSave,
        artistToSave,
        scraped.originalKey,
        scraped.originalKey,
        scraped.contentChordpro
      );

      console.log(`\x1b[32mOK\x1b[0m (Tono: ${scraped.originalKey || "N/A"})`);
      successCount++;
    } catch (err: unknown) {
      console.log(`\x1b[31mERROR\x1b[0m: ${(err as Error)?.message || "Fallo al procesar"}`);
      errorCount++;
    }

    // Cortesía entre descargas
    if (i < toImport.length - 1) {
      await new Promise((r) => setTimeout(r, 700));
    }
  }

  console.log("\n==========================================");
  console.log(`🎉 Proceso completado:`);
  console.log(`   • Nuevas importadas: \x1b[32m${successCount}\x1b[0m`);
  if (alreadyExistingCount > 0) {
    console.log(`   • Ya existían: ${alreadyExistingCount}`);
  }
  if (errorCount > 0) {
    console.log(`   • Con errores: \x1b[31m${errorCount}\x1b[0m`);
  }
  console.log("==========================================\n");
}

run().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
