"use server";

import { and, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { getSetlistFor } from "@/lib/setlists";
import type { FormState } from "@/app/actions";

async function canModify(setlistId: number) {
  const user = await requireUser();
  const list = getSetlistFor(user.id, setlistId);
  if (!list) throw new Error("Lista no encontrada");

  // Si es el creador de la lista o admin
  if (list.ownerId === user.id || user.role === "admin") {
    return { user, list };
  }

  // Si la lista es de un grupo, revisar si el usuario es owner o editor del grupo
  if (list.groupId) {
    const role = db
      .select({ role: schema.groupMembers.role })
      .from(schema.groupMembers)
      .where(
        and(
          eq(schema.groupMembers.groupId, list.groupId),
          eq(schema.groupMembers.userId, user.id)
        )
      )
      .get()?.role;

    if (role === "owner" || role === "editor") {
      return { user, list };
    }
  }

  throw new Error("No tienes permiso para editar esta lista");
}

export async function createSetlist(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { error: "Ponle un nombre a la lista" };
  const eventDate = String(form.get("eventDate") ?? "") || null;
  const groupIdRaw = form.get("groupId");
  const groupId = groupIdRaw ? Number(groupIdRaw) : null;

  const row = db
    .insert(schema.setlists)
    .values({ ownerId: user.id, groupId, name, eventDate })
    .returning({ id: schema.setlists.id })
    .get();
  revalidatePath("/listas");
  redirect(`/listas/${row.id}`);
}

export async function updateSetlist(form: FormData) {
  const id = Number(form.get("id"));
  await canModify(id);
  const name = String(form.get("name") ?? "").trim();
  if (!name) return;
  db.update(schema.setlists)
    .set({
      name,
      eventDate: String(form.get("eventDate") ?? "") || null,
      notes: String(form.get("notes") ?? "").trim() || null,
    })
    .where(eq(schema.setlists.id, id))
    .run();
  revalidatePath(`/listas/${id}`);
}

export async function deleteSetlist(form: FormData) {
  const id = Number(form.get("id"));
  await canModify(id);
  db.delete(schema.setlists).where(eq(schema.setlists.id, id)).run();
  revalidatePath("/listas");
  redirect("/listas");
}

export async function addSongToSetlist(setlistId: number, songId: number) {
  const { user } = await canModify(setlistId);
  const song = db
    .select()
    .from(schema.songs)
    .where(eq(schema.songs.id, songId))
    .get();
  if (!song) return null;
  const last = db
    .select({ m: max(schema.setlistItems.position) })
    .from(schema.setlistItems)
    .where(eq(schema.setlistItems.setlistId, setlistId))
    .get();
  const row = db
    .insert(schema.setlistItems)
    .values({ setlistId, songId, position: (last?.m ?? -1) + 1 })
    .returning({ id: schema.setlistItems.id })
    .get();
  revalidatePath(`/listas/${setlistId}`);
  return { id: row.id, originalKey: song.currentKey || song.originalKey };
}

export async function removeSetlistItem(setlistId: number, itemId: number) {
  await canModify(setlistId);
  db.delete(schema.setlistItems)
    .where(and(eq(schema.setlistItems.id, itemId), eq(schema.setlistItems.setlistId, setlistId)))
    .run();
  revalidatePath(`/listas/${setlistId}`);
}

export async function reorderSetlist(setlistId: number, orderedItemIds: number[]) {
  await canModify(setlistId);
  db.transaction((tx) => {
    orderedItemIds.forEach((itemId, position) => {
      tx.update(schema.setlistItems)
        .set({ position })
        .where(and(eq(schema.setlistItems.id, itemId), eq(schema.setlistItems.setlistId, setlistId)))
        .run();
    });
  });
  revalidatePath(`/listas/${setlistId}`);
}

export async function setItemKey(setlistId: number, itemId: number, key: string | null) {
  await canModify(setlistId);
  db.update(schema.setlistItems)
    .set({ keyOverride: key || null })
    .where(and(eq(schema.setlistItems.id, itemId), eq(schema.setlistItems.setlistId, setlistId)))
    .run();
  revalidatePath(`/listas/${setlistId}`);
  revalidatePath(`/listas/${setlistId}/escenario`);
}

export async function updateSetlistItemConfig(
  setlistId: number,
  itemId: number,
  data: { keyOverride?: string | null; notes?: string | null; twoColumns?: number | boolean }
) {
  await canModify(setlistId);
  const updates: { keyOverride?: string | null; notes?: string | null; twoColumns?: number } = {};
  if ("keyOverride" in data) updates.keyOverride = data.keyOverride || null;
  if ("notes" in data) updates.notes = data.notes?.trim() || null;
  if ("twoColumns" in data) updates.twoColumns = data.twoColumns ? 1 : 0;

  db.update(schema.setlistItems)
    .set(updates)
    .where(and(eq(schema.setlistItems.id, itemId), eq(schema.setlistItems.setlistId, setlistId)))
    .run();

  revalidatePath(`/listas/${setlistId}`);
  revalidatePath(`/listas/${setlistId}/escenario`);
  return { ok: true };
}

export async function saveAllSetlistItems(
  setlistId: number,
  items: Array<{ id: number; keyOverride?: string | null; notes?: string | null; twoColumns?: number | boolean }>
) {
  await canModify(setlistId);
  db.transaction((tx) => {
    for (const it of items) {
      const updates: { keyOverride?: string | null; notes?: string | null; twoColumns?: number } = {};
      if ("keyOverride" in it) updates.keyOverride = it.keyOverride || null;
      if ("notes" in it) updates.notes = it.notes !== undefined ? (it.notes?.trim() || null) : undefined;
      if ("twoColumns" in it) updates.twoColumns = it.twoColumns ? 1 : 0;

      tx.update(schema.setlistItems)
        .set(updates)
        .where(and(eq(schema.setlistItems.id, it.id), eq(schema.setlistItems.setlistId, setlistId)))
        .run();
    }
  });
  revalidatePath(`/listas/${setlistId}`);
  revalidatePath(`/listas/${setlistId}/escenario`);
  return { ok: true };
}
