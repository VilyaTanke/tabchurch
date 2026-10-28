import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

/** Lista accesible para el usuario (propias, compartidas en su grupo o cualquier lista si es admin) */
export function getSetlistFor(userId: number, setlistId: number, isAdmin = false) {
  if (isAdmin) {
    const anyList = db
      .select()
      .from(schema.setlists)
      .where(eq(schema.setlists.id, setlistId))
      .get();
    if (anyList) return anyList;
  }

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

/** Determina si el usuario tiene permisos de edición sobre una lista (propietario, admin global o owner/editor del grupo) */
export function canUserEditSetlist(
  user: { id: number; role: string },
  setlist: { ownerId: number; groupId: number | null }
): boolean {
  if (user.role === "admin" || setlist.ownerId === user.id) return true;
  if (setlist.groupId) {
    const role = db
      .select({ role: schema.groupMembers.role })
      .from(schema.groupMembers)
      .where(
        and(
          eq(schema.groupMembers.groupId, setlist.groupId),
          eq(schema.groupMembers.userId, user.id)
        )
      )
      .get()?.role;
    return role === "owner" || role === "editor";
  }
  return false;
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
