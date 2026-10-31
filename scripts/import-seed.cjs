const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbDir = path.join(__dirname, "../data");
fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, "tabchurch.db");
const seedPath = path.join(__dirname, "seed.sql");

if (!fs.existsSync(seedPath)) {
  console.error("No se encontró scripts/seed.sql");
  process.exit(1);
}

const db = new Database(dbPath);
let sql = fs.readFileSync(seedPath, "utf-8");

// Protección: filtrar cualquier sentencia antigua que borre o sobrescriba la tabla users
sql = sql
  .split(/\r?\n/)
  .filter((line) => {
    const trimmed = line.trim().toUpperCase();
    if (trimmed.startsWith("DELETE FROM USERS")) return false;
    if (trimmed.startsWith("INSERT OR REPLACE INTO USERS")) return false;
    if (trimmed.startsWith("INSERT INTO USERS")) return false;
    return true;
  })
  .join("\n");

console.log("Importando catálogo desde scripts/seed.sql (preservando cuentas de usuario existentes)...");
db.exec(sql);

const songs = db.prepare("SELECT count(*) as count FROM songs").get();
const users = db.prepare("SELECT count(*) as count FROM users").get();
console.log(`✅ Base de datos sincronizada con éxito:`);
console.log(`- Canciones: ${songs.count}`);
console.log(`- Usuarios conservados: ${users.count}`);
db.close();
