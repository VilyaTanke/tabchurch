import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

/** Lista accesible para el usuario (por ahora solo las propias; los grupos llegan en la fase 4). */
export function getSetlistFor(userId: number, setlistId: number) {
  return db
    .select()
    .from(schema.setlists)
    .where(and(eq(schema.setlists.id, setlistId), eq(schema.setlists.ownerId, userId)))
    .get();
}

export function getSetlistItems(setlistId: number) {
  return db
    .select({
      id: schema.setlistItems.id,
      position: schema.setlistItems.position,
      keyOverride: schema.setlistItems.keyOverride,
      itemNotes: schema.setlistItems.notes,
      song: schema.songs,
    })
    .from(schema.setlistItems)
    .innerJoin(schema.songs, eq(schema.songs.id, schema.setlistItems.songId))
    .where(eq(schema.setlistItems.setlistId, setlistId))
    .orderBy(asc(schema.setlistItems.position))
    .all();
}
