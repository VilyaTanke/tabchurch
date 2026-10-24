import { sql } from "drizzle-orm";
import { integer, primaryKey, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const now = sql`(unixepoch())`;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email"),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "editor", "user"] }).notNull().default("user"),
  mustChangePw: integer("must_change_pw", { mode: "boolean" }).notNull().default(true),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  avatar: text("avatar"),
  createdAt: integer("created_at").notNull().default(now),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

export const songs = sqliteTable("songs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: integer("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  artist: text("artist"),
  originalKey: text("original_key"),
  currentKey: text("current_key"),
  tempo: integer("tempo"),
  contentChordpro: text("content_chordpro").notNull().default(""),
  notes: text("notes"),
  createdAt: integer("created_at").notNull().default(now),
  updatedAt: integer("updated_at").notNull().default(now),
});

export const groups = sqliteTable("groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
});

export const groupMembers = sqliteTable(
  "group_members",
  {
    groupId: integer("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["owner", "editor", "member"] }).notNull().default("member"),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] })],
);

export const setlists = sqliteTable("setlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: integer("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  groupId: integer("group_id").references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  eventDate: text("event_date"),
  notes: text("notes"),
});

export const setlistItems = sqliteTable("setlist_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  setlistId: integer("setlist_id").notNull().references(() => setlists.id, { onDelete: "cascade" }),
  songId: integer("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  keyOverride: text("key_override"),
  notes: text("notes"),
  twoColumns: integer("two_columns").notNull().default(0),
});

/** Pistas de audio (MP3) de la galería y su separación en stems con IA (Demucs). */
export const tracks = sqliteTable("tracks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artist: text("artist"),
  songId: integer("song_id").references(() => songs.id, { onDelete: "set null" }),
  uploadedBy: integer("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  fileName: text("file_name").notNull(),
  originalName: text("original_name"),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes").notNull().default(0),
  durationSec: real("duration_sec"),
  musicalKey: text("musical_key"),
  bpm: integer("bpm"),
  stemsStatus: text("stems_status", { enum: ["none", "queued", "processing", "done", "error"] })
    .notNull()
    .default("none"),
  stemsProgress: integer("stems_progress").notNull().default(0),
  stemsModel: text("stems_model"),
  /** JSON: [{ name: "vocals", file: "vocals.mp3" }, ...] */
  stemsList: text("stems_list"),
  stemsError: text("stems_error"),
  createdAt: integer("created_at").notNull().default(now),
  updatedAt: integer("updated_at").notNull().default(now),
});
