import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

/** Lista accesible para el usuario (propias o compartidas en un grupo al que pertenece) */
export function getSetlistFor(userId: number, setlistId: number) {
  const own = db
    .select()
    .from(schema.setlists)
    .where(and(eq(schema.setlists.id, setlistId), eq(schema.setlists.ownerId, userId)))
    .get();

  if (own) return own;

  // Si no es propia, verificar si pertenece a un grupo del que el usuario es miembro
  const shared = db
    .select({ setlist: schema.setlists })
    .from(schema.setlists)
    .innerJoin(schema.groupMembers, eq(schema.groupMembers.groupId, schema.setlists.groupId))
    .where(and(eq(schema.setlists.id, setlistId), eq(schema.groupMembers.userId, userId)))
    .get();

  return shared?.setlist ?? null;
}

export function getSetlistItems(setlistId: number) {
  return db
    .select({
      id: schema.setlistItems.id,
      position: schema.setlistItems.position,
      keyOverride: schema.setlistItems.keyOverride,
      itemNotes: schema.setlistItems.notes,
      twoColumns: schema.setlistItems.twoColumns,
      song: schema.songs,
    })
    .from(schema.setlistItems)
    .innerJoin(schema.songs, eq(schema.songs.id, schema.setlistItems.songId))
    .where(eq(schema.setlistItems.setlistId, setlistId))
    .orderBy(asc(schema.setlistItems.position))
    .all();
}
