"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { canManageSongs, requireUser } from "@/lib/auth";
import type { FormState } from "@/app/actions";

export async function saveSong(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  if (!canManageSongs(user)) {
    return { error: "Solo los editores o administradores pueden agregar o editar canciones" };
  }

  const id = Number(form.get("id")) || null;
  const title = String(form.get("title") ?? "").trim();
  if (!title) return { error: "El título es obligatorio" };
  const tempoRaw = Number(form.get("tempo"));
  const originalKey = String(form.get("originalKey") ?? "").trim() || null;
  const currentKey = String(form.get("currentKey") ?? "").trim() || originalKey;
  const values = {
    title,
    artist: String(form.get("artist") ?? "").trim() || null,
    originalKey,
    currentKey,
    tempo: tempoRaw >= 30 && tempoRaw <= 300 ? Math.round(tempoRaw) : null,
    contentChordpro: String(form.get("content") ?? ""),
    notes: String(form.get("notes") ?? "").trim() || null,
  };

  let songId = id;
  if (id) {
    const existing = db
      .select({ id: schema.songs.id })
      .from(schema.songs)
      .where(eq(schema.songs.id, id))
      .get();

    if (!existing) return { error: "No se encontró la canción" };

    db.update(schema.songs)
      .set({ ...values, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(schema.songs.id, id))
      .run();
  } else {
    songId = Number(
      db.insert(schema.songs).values({ ...values, ownerId: user.id }).returning({ id: schema.songs.id }).get().id,
    );
  }
  revalidatePath("/canciones");
  redirect(`/canciones/${songId}`);
}

export async function updateSongKey(songId: number, newKey: string): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  if (!canManageSongs(user)) {
    return { ok: false, error: "Solo los editores o administradores pueden guardar el tono de la canción" };
  }

  const song = db
    .select({ id: schema.songs.id, originalKey: schema.songs.originalKey })
    .from(schema.songs)
    .where(eq(schema.songs.id, songId))
    .get();

  if (!song) return { ok: false, error: "No se encontró la canción" };

  const originalKey = song.originalKey || newKey;

  db.update(schema.songs)
    .set({
      currentKey: newKey,
      originalKey,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(schema.songs.id, songId))
    .run();

  revalidatePath(`/canciones/${songId}`);
  revalidatePath("/canciones");
  revalidatePath("/listas");
  return { ok: true };
}

export async function deleteSong(form: FormData) {
  const user = await requireUser();
  if (!canManageSongs(user)) {
    return;
  }

  const id = Number(form.get("id"));
  const song = db.select({ id: schema.songs.id }).from(schema.songs).where(eq(schema.songs.id, id)).get();
  if (!song) return;

  db.delete(schema.songs).where(eq(schema.songs.id, id)).run();
  revalidatePath("/canciones");
  redirect("/canciones");
}

export async function deleteMultipleSongs(
  ids: number[]
): Promise<{ ok: boolean; count?: number; error?: string }> {
  const user = await requireUser();
  if (!canManageSongs(user)) {
    return {
      ok: false,
      error: "Solo los editores o administradores pueden eliminar canciones.",
    };
  }

  const validIds = ids.map(Number).filter((n) => Number.isInteger(n) && n > 0);
  if (validIds.length === 0) {
    return { ok: false, error: "No se seleccionó ninguna canción para eliminar." };
  }

  try {
    db.delete(schema.songs)
      .where(inArray(schema.songs.id, validIds))
      .run();

    revalidatePath("/canciones");
    revalidatePath("/listas");
    return { ok: true, count: validIds.length };
  } catch (err: unknown) {
    console.error("Error al eliminar canciones seleccionadas:", err);
    return {
      ok: false,
      error: (err as Error)?.message || "Error al eliminar las canciones seleccionadas.",
    };
  }
}

export async function importSongFromUrl(url: string) {
  const user = await requireUser();
  if (!canManageSongs(user)) {
    return { ok: false, error: "Solo los editores o administradores pueden importar canciones" };
  }
  const { scrapeSongFromUrl } = await import("@/lib/scraper");
  try {
    const data = await scrapeSongFromUrl(url);
    return { ok: true, song: data };
  } catch (err: unknown) {
    return { ok: false, error: (err as Error)?.message || "Error al importar el cifrado" };
  }
}
