import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

export type GroupRole = "owner" | "editor" | "member";

/** Obtener el rol del usuario en un grupo específico, o null si no pertenece al grupo */
export function getUserGroupRole(userId: number, groupId: number): GroupRole | null {
  const membership = db
    .select({ role: schema.groupMembers.role })
    .from(schema.groupMembers)
    .where(
      and(
        eq(schema.groupMembers.groupId, groupId),
        eq(schema.groupMembers.userId, userId)
      )
    )
    .get();

  return (membership?.role as GroupRole) ?? null;
}

/** Obtener todos los grupos a los que pertenece un usuario con su rol */
export function getUserGroups(userId: number) {
  return db
    .select({
      id: schema.groups.id,
      name: schema.groups.name,
      createdBy: schema.groups.createdBy,
      role: schema.groupMembers.role,
    })
    .from(schema.groupMembers)
    .innerJoin(schema.groups, eq(schema.groups.id, schema.groupMembers.groupId))
    .where(eq(schema.groupMembers.userId, userId))
    .orderBy(asc(schema.groups.name))
    .all();
}

/** Obtener los detalles de un grupo */
export function getGroupDetails(groupId: number) {
  return db
    .select()
    .from(schema.groups)
    .where(eq(schema.groups.id, groupId))
    .get();
}

/** Obtener los miembros de un grupo */
export function getGroupMembers(groupId: number) {
  return db
    .select({
      userId: schema.users.id,
      name: schema.users.name,
      username: schema.users.username,
      avatar: schema.users.avatar,
      role: schema.groupMembers.role,
    })
    .from(schema.groupMembers)
    .innerJoin(schema.users, eq(schema.users.id, schema.groupMembers.userId))
    .where(eq(schema.groupMembers.groupId, groupId))
    .orderBy(asc(schema.users.name))
    .all();
}

/** Obtener las listas compartidas de un grupo */
export function getGroupSetlists(groupId: number) {
  return db
    .select({
      id: schema.setlists.id,
      name: schema.setlists.name,
      eventDate: schema.setlists.eventDate,
      ownerId: schema.setlists.ownerId,
      ownerName: schema.users.name,
    })
    .from(schema.setlists)
    .innerJoin(schema.users, eq(schema.users.id, schema.setlists.ownerId))
    .where(eq(schema.setlists.groupId, groupId))
    .orderBy(asc(schema.setlists.eventDate))
    .all();
}
