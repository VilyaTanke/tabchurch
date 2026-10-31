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

export type ScrapedArtistSongView = {
  title: string;
  url: string;
  alreadyExists: boolean;
  existingId?: number;
};

export async function getArtistSongsAction(url: string): Promise<{
  ok: boolean;
  artist?: string;
  songs?: ScrapedArtistSongView[];
  error?: string;
}> {
  const user = await requireUser();
  if (!canManageSongs(user)) {
    return { ok: false, error: "Solo los editores o administradores pueden importar canciones" };
  }

  try {
    const { scrapeArtistSongs } = await import("@/lib/scraper");
    const catalog = await scrapeArtistSongs(url);

    // Obtener todas las canciones existentes para comparar
    const existingSongs = db
      .select({ id: schema.songs.id, title: schema.songs.title, artist: schema.songs.artist })
      .from(schema.songs)
      .all();

    const normalize = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();

    const songsWithStatus: ScrapedArtistSongView[] = catalog.songs.map((song) => {
      const normTitle = normalize(song.title);
      const normArtist = normalize(catalog.artist);

      const match = existingSongs.find((existing) => {
        const existNormTitle = normalize(existing.title);
        const existNormArtist = normalize(existing.artist || "");
        if (existNormTitle === normTitle) {
          if (!existNormArtist || !normArtist) return true;
          return existNormArtist.includes(normArtist) || normArtist.includes(existNormArtist);
        }
        return false;
      });

      return {
        title: song.title,
        url: song.url,
        alreadyExists: Boolean(match),
        existingId: match?.id,
      };
    });

    return {
      ok: true,
      artist: catalog.artist,
      songs: songsWithStatus,
    };
  } catch (err: unknown) {
    return { ok: false, error: (err as Error)?.message || "Error al escanear el artista." };
  }
}

export async function importSingleArtistSongAction(
  songUrl: string,
  artistFallback: string
): Promise<{ ok: boolean; title?: string; songId?: number; skipped?: boolean; error?: string }> {
  const user = await requireUser();
  if (!canManageSongs(user)) {
    return { ok: false, error: "Solo los editores o administradores pueden importar canciones" };
  }

  try {
    const { scrapeSongFromUrl } = await import("@/lib/scraper");
    const songData = await scrapeSongFromUrl(songUrl);

    // Verificar si ya existe en la base de datos
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();

    const normTitle = normalize(songData.title);
    const existing = db
      .select({ id: schema.songs.id, title: schema.songs.title })
      .from(schema.songs)
      .all()
      .find((s) => normalize(s.title) === normTitle);

    if (existing) {
      return { ok: true, skipped: true, title: songData.title, songId: existing.id };
    }

    const inserted = db
      .insert(schema.songs)
      .values({
        ownerId: user.id,
        title: songData.title,
        artist: songData.artist || artistFallback || null,
        originalKey: songData.originalKey,
        currentKey: songData.originalKey,
        contentChordpro: songData.contentChordpro,
      })
      .returning({ id: schema.songs.id })
      .get();

    return { ok: true, title: songData.title, songId: inserted.id };
  } catch (err: unknown) {
    return { ok: false, error: (err as Error)?.message || "Error al importar canción" };
  }
}

export async function finishArtistImportAction() {
  revalidatePath("/canciones");
  revalidatePath("/canciones/artistas");
  return { ok: true };
}
