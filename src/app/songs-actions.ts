"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import type { FormState } from "@/app/actions";

export async function saveSong(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
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
    const res = db
      .update(schema.songs)
      .set({ ...values, updatedAt: Math.floor(Date.now() / 1000) })
      .where(and(eq(schema.songs.id, id), eq(schema.songs.ownerId, user.id)))
      .run();
    if (!res.changes) return { error: "No se encontró la canción" };
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
  const song = db
    .select({ id: schema.songs.id, originalKey: schema.songs.originalKey })
    .from(schema.songs)
    .where(and(eq(schema.songs.id, songId), eq(schema.songs.ownerId, user.id)))
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
  const id = Number(form.get("id"));
  db.delete(schema.songs).where(and(eq(schema.songs.id, id), eq(schema.songs.ownerId, user.id))).run();
  revalidatePath("/canciones");
  redirect("/canciones");
}

export async function importSongFromUrl(url: string) {
  await requireUser();
  const { scrapeSongFromUrl } = await import("@/lib/scraper");
  try {
    const data = await scrapeSongFromUrl(url);
    return { ok: true, song: data };
  } catch (err: any) {
    return { ok: false, error: err.message || "Error al importar el cifrado" };
  }
}
