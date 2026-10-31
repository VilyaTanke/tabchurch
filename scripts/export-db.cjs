const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/tabchurch.db");
const db = new Database(dbPath);

// Exportamos de forma segura las tablas de contenido sin incluir hashes de contraseñas ni borrar usuarios en destino
const tables = ["churches", "songs", "groups", "group_members", "setlists", "setlist_items"];
let sql = "PRAGMA foreign_keys = OFF;\nBEGIN TRANSACTION;\n";

for (const t of tables) {
  try {
    const rows = db.prepare(`SELECT * FROM ${t}`).all();
    if (rows.length > 0) {
      for (const r of rows) {
        const cols = Object.keys(r);
        const vals = cols.map((c) => {
          const v = r[c];
          if (v === null || v === undefined) return "NULL";
          if (typeof v === "number") return v;
          return `'${String(v).replace(/'/g, "''")}'`;
        });
        sql += `INSERT OR REPLACE INTO ${t} (${cols.join(", ")}) VALUES (${vals.join(", ")});\n`;
      }
    }
  } catch (err) {
    console.warn(`Tabla ${t} no encontrada o vacía:`, err.message);
  }
}

sql += "COMMIT;\nPRAGMA foreign_keys = ON;\n";

const seedPath = path.join(__dirname, "seed.sql");
fs.writeFileSync(seedPath, sql, "utf-8");

const outDir = path.join(__dirname, "../data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "dump.sql"), sql, "utf-8");

console.log("✅ Exportación SQL generada de forma segura en scripts/seed.sql y data/dump.sql (sin exponer contraseñas de usuarios).");
db.close();
