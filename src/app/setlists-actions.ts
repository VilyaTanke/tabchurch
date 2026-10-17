"use server";

import { and, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { getSetlistFor } from "@/lib/setlists";
import type { FormState } from "@/app/actions";

async function owned(setlistId: number) {
  const user = await requireUser();
  const list = getSetlistFor(user.id, setlistId);
  if (!list) throw new Error("Lista no encontrada");
  return { user, list };
}

export async function createSetlist(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { error: "Ponle un nombre a la lista" };
  const eventDate = String(form.get("eventDate") ?? "") || null;
  const row = db
    .insert(schema.setlists)
    .values({ ownerId: user.id, name, eventDate })
    .returning({ id: schema.setlists.id })
    .get();
  revalidatePath("/listas");
  redirect(`/listas/${row.id}`);
}

export async function updateSetlist(form: FormData) {
  const id = Number(form.get("id"));
  await owned(id);
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
  await owned(id);
  db.delete(schema.setlists).where(eq(schema.setlists.id, id)).run();
  revalidatePath("/listas");
  redirect("/listas");
}

export async function addSongToSetlist(setlistId: number, songId: number) {
  const { user } = await owned(setlistId);
  const song = db
    .select()
    .from(schema.songs)
    .where(and(eq(schema.songs.id, songId), eq(schema.songs.ownerId, user.id)))
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
  return { id: row.id, originalKey: song.originalKey };
}

export async function removeSetlistItem(setlistId: number, itemId: number) {
  await owned(setlistId);
  db.delete(schema.setlistItems)
    .where(and(eq(schema.setlistItems.id, itemId), eq(schema.setlistItems.setlistId, setlistId)))
    .run();
  revalidatePath(`/listas/${setlistId}`);
}

export async function reorderSetlist(setlistId: number, orderedItemIds: number[]) {
  await owned(setlistId);
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
  await owned(setlistId);
  db.update(schema.setlistItems)
    .set({ keyOverride: key || null })
    .where(and(eq(schema.setlistItems.id, itemId), eq(schema.setlistItems.setlistId, setlistId)))
    .run();
  revalidatePath(`/listas/${setlistId}`);
}
