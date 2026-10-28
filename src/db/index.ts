import "server-only";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const DDL = `
CREATE TABLE IF NOT EXISTS churches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  address TEXT,
  notes TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  must_change_pw INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  avatar TEXT,
  church_id INTEGER REFERENCES churches(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  original_key TEXT,
  current_key TEXT,
  tempo INTEGER,
  content_chordpro TEXT NOT NULL DEFAULT '',
  notes TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS group_members (
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  PRIMARY KEY (group_id, user_id)
);
CREATE TABLE IF NOT EXISTS setlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date TEXT,
  notes TEXT
);
CREATE TABLE IF NOT EXISTS setlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setlist_id INTEGER NOT NULL REFERENCES setlists(id) ON DELETE CASCADE,
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  key_override TEXT,
  notes TEXT,
  two_columns INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT,
  song_id INTEGER REFERENCES songs(id) ON DELETE SET NULL,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  original_name TEXT,
  mime_type TEXT,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  duration_sec REAL,
  musical_key TEXT,
  bpm INTEGER,
  stems_status TEXT NOT NULL DEFAULT 'none',
  stems_progress INTEGER NOT NULL DEFAULT 0,
  stems_model TEXT,
  stems_list TEXT,
  stems_error TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS tracks_song_idx ON tracks(song_id);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS users_church_idx ON users(church_id);
CREATE INDEX IF NOT EXISTS songs_updated_idx ON songs(updated_at DESC);
CREATE INDEX IF NOT EXISTS songs_artist_idx ON songs(artist);
CREATE INDEX IF NOT EXISTS setlists_owner_idx ON setlists(owner_id);
CREATE INDEX IF NOT EXISTS setlists_group_idx ON setlists(group_id);
CREATE INDEX IF NOT EXISTS setlist_items_setlist_pos_idx ON setlist_items(setlist_id, position);
CREATE INDEX IF NOT EXISTS setlist_items_song_idx ON setlist_items(song_id);
`;

function ensureColumn(sqlite: Database.Database, table: string, column: string, definition: string) {
  const cols = sqlite.pragma(`table_info(${table})`) as Array<{ name: string }>;
  if (!cols.some((c) => c.name === column)) {
    sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
  }
}

function init() {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const sqlite = new Database(path.join(dir, "tabchurch.db"));
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(DDL);

  // Migraciones incrementales seguras verificando metadatos reales de la tabla
  ensureColumn(sqlite, "songs", "current_key", "TEXT");
  ensureColumn(sqlite, "setlist_items", "two_columns", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn(sqlite, "setlists", "group_id", "INTEGER REFERENCES groups(id) ON DELETE CASCADE");
  ensureColumn(sqlite, "users", "avatar", "TEXT");
  ensureColumn(sqlite, "users", "church_id", "INTEGER REFERENCES churches(id) ON DELETE SET NULL");

  // Asegurar que los índices existan también en bases de datos ya creadas
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS tracks_song_idx ON tracks(song_id);
    CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS users_church_idx ON users(church_id);
    CREATE INDEX IF NOT EXISTS songs_updated_idx ON songs(updated_at DESC);
    CREATE INDEX IF NOT EXISTS songs_artist_idx ON songs(artist);
    CREATE INDEX IF NOT EXISTS setlists_owner_idx ON setlists(owner_id);
    CREATE INDEX IF NOT EXISTS setlists_group_idx ON setlists(group_id);
    CREATE INDEX IF NOT EXISTS setlist_items_setlist_pos_idx ON setlist_items(setlist_id, position);
    CREATE INDEX IF NOT EXISTS setlist_items_song_idx ON setlist_items(song_id);
  `);

  const db = drizzle(sqlite, { schema });

  // Seed del primer administrador (debe cambiar la clave al entrar).
  const hasAdmin = db.select().from(schema.users).where(eq(schema.users.role, "admin")).get();
  if (!hasAdmin) {
    const pw = process.env.ADMIN_PASSWORD ?? "admin1234";
    db.insert(schema.users)
      .values({
        username: process.env.ADMIN_USERNAME ?? "admin",
        name: "Administrador",
        passwordHash: bcrypt.hashSync(pw, 10),
        role: "admin",
        mustChangePw: true,
      })
      .onConflictDoNothing()
      .run();
  }
  return db;
}

const g = globalThis as unknown as { __db?: ReturnType<typeof init> };
export const db = (g.__db ??= init());
export { schema };
