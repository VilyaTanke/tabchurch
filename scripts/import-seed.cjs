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
const sql = fs.readFileSync(seedPath, "utf-8");

console.log("Importando datos desde scripts/seed.sql...");
db.exec(sql);

const songs = db.prepare("SELECT count(*) as count FROM songs").get();
const users = db.prepare("SELECT count(*) as count FROM users").get();
console.log(`✅ Base de datos actualizada con éxito:`);
console.log(`- Canciones: ${songs.count}`);
console.log(`- Usuarios: ${users.count}`);
db.close();
