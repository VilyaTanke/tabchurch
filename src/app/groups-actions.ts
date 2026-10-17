"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { getUserGroupRole } from "@/lib/groups";
import type { FormState } from "@/app/actions";

/** Crear un nuevo grupo */
export async function createGroup(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { error: "El nombre del grupo es obligatorio" };

  let groupId: number | null = null;
  db.transaction((tx) => {
    const g = tx
      .insert(schema.groups)
      .values({ name, createdBy: user.id })
      .returning({ id: schema.groups.id })
      .get();

    groupId = g.id;

    // Quien lo crea es automáticamente el 'owner'
    tx.insert(schema.groupMembers)
      .values({
        groupId: g.id,
        userId: user.id,
        role: "owner",
      })
      .run();
  });

  revalidatePath("/grupos");
  if (groupId) {
    redirect(`/grupos/${groupId}`);
  }
  return { ok: "Grupo creado" };
}

/** Añadir un miembro al grupo mediante su nombre de usuario */
export async function addMemberToGroup(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const groupId = Number(form.get("groupId"));
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const role = (form.get("role") as "editor" | "member") || "member";

  const myRole = getUserGroupRole(user.id, groupId);
  if (user.role !== "admin" && myRole !== "owner") {
    return { error: "No tienes permiso para agregar miembros a este grupo" };
  }

  const targetUser = db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .get();

  if (!targetUser) {
    return { error: `No se encontró ningún usuario con el nombre de usuario "${username}"` };
  }

  // Comprobar si ya es miembro
  const existing = db
    .select()
    .from(schema.groupMembers)
    .where(
      and(
        eq(schema.groupMembers.groupId, groupId),
        eq(schema.groupMembers.userId, targetUser.id)
      )
    )
    .get();

  if (existing) {
    return { error: "Este usuario ya pertenece al grupo" };
  }

  db.insert(schema.groupMembers)
    .values({
      groupId,
      userId: targetUser.id,
      role,
    })
    .run();

  revalidatePath(`/grupos/${groupId}`);
  return { ok: `Usuario @${username} agregado con éxito.` };
}

/** Cambiar el rol de un miembro */
export async function updateMemberRole(form: FormData) {
  const user = await requireUser();
  const groupId = Number(form.get("groupId"));
  const targetUserId = Number(form.get("userId"));
  const newRole = form.get("role") as "owner" | "editor" | "member";

  const myRole = getUserGroupRole(user.id, groupId);
  if (user.role !== "admin" && myRole !== "owner") return;

  db.update(schema.groupMembers)
    .set({ role: newRole })
    .where(
      and(
        eq(schema.groupMembers.groupId, groupId),
        eq(schema.groupMembers.userId, targetUserId)
      )
    )
    .run();

  revalidatePath(`/grupos/${groupId}`);
}

/** Eliminar a un miembro del grupo */
export async function removeGroupMember(form: FormData) {
  const user = await requireUser();
  const groupId = Number(form.get("groupId"));
  const targetUserId = Number(form.get("userId"));

  const myRole = getUserGroupRole(user.id, groupId);
  // Un usuario puede salir de un grupo por sí mismo, o el owner/admin puede removerlo
  if (user.id !== targetUserId && user.role !== "admin" && myRole !== "owner") {
    return;
  }

  db.delete(schema.groupMembers)
    .where(
      and(
        eq(schema.groupMembers.groupId, groupId),
        eq(schema.groupMembers.userId, targetUserId)
      )
    )
    .run();

  revalidatePath(`/grupos/${groupId}`);
  if (user.id === targetUserId) {
    redirect("/grupos");
  }
}

/** Crear una lista compartida dentro del grupo */
export async function createGroupSetlist(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const groupId = Number(form.get("groupId"));
  const name = String(form.get("name") ?? "").trim();
  const eventDate = String(form.get("eventDate") ?? "") || null;

  if (!name) return { error: "El nombre de la lista es obligatorio" };

  const myRole = getUserGroupRole(user.id, groupId);
  if (user.role !== "admin" && myRole !== "owner" && myRole !== "editor") {
    return { error: "Solo los editores o propietarios pueden crear listas en el grupo" };
  }

  const row = db
    .insert(schema.setlists)
    .values({
      ownerId: user.id,
      groupId,
      name,
      eventDate,
    })
    .returning({ id: schema.setlists.id })
    .get();

  revalidatePath(`/grupos/${groupId}`);
  revalidatePath("/listas");
  redirect(`/listas/${row.id}`);
}
