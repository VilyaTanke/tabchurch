const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbDir = path.join(__dirname, "../data");
fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, "tabchurch.db");
const dumpPath = path.join(dbDir, "dump.sql");

if (!fs.existsSync(dumpPath)) {
  console.error("No se encontró data/dump.sql");
  process.exit(1);
}

const db = new Database(dbPath);
const sql = fs.readFileSync(dumpPath, "utf-8");

db.exec(sql);
console.log("Datos importados con éxito en " + dbPath);

const songs = db.prepare("SELECT count(*) as count FROM songs").get();
const users = db.prepare("SELECT count(*) as count FROM users").get();
console.log(`Verificación: ${users.count} usuarios, ${songs.count} canciones.`);
db.close();
