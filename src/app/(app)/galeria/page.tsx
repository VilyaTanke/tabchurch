import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { canManageSongs, requireUser } from "@/lib/auth";
import GalleryView from "@/components/GalleryView";
import type { GalleryTrackItem } from "@/components/TrackCard";

export const metadata = {
  title: "Galería de Audios & MP3 · Tab-NuevaVida",
};

export default async function GalleryPage() {
  const user = await requireUser();

  // Obtener pistas de audio de la galería
  const rawTracks = db
    .select({
      id: schema.tracks.id,
      title: schema.tracks.title,
      artist: schema.tracks.artist,
      musicalKey: schema.tracks.musicalKey,
      bpm: schema.tracks.bpm,
      durationSec: schema.tracks.durationSec,
      sizeBytes: schema.tracks.sizeBytes,
      stemsStatus: schema.tracks.stemsStatus,
      stemsProgress: schema.tracks.stemsProgress,
      stemsModel: schema.tracks.stemsModel,
      stemsList: schema.tracks.stemsList,
      stemsError: schema.tracks.stemsError,
      createdAt: schema.tracks.createdAt,
      songId: schema.tracks.songId,
      songTitle: schema.songs.title,
      songOrigKey: schema.songs.originalKey,
      songCurrKey: schema.songs.currentKey,
    })
    .from(schema.tracks)
    .leftJoin(schema.songs, eq(schema.tracks.songId, schema.songs.id))
    .orderBy(desc(schema.tracks.createdAt))
    .all();

  const formattedTracks: GalleryTrackItem[] = rawTracks.map((t) => ({
    id: t.id,
    title: t.title,
    artist: t.artist,
    musicalKey: t.musicalKey,
    bpm: t.bpm,
    durationSec: t.durationSec,
    sizeBytes: t.sizeBytes,
    stemsStatus: t.stemsStatus,
    stemsProgress: t.stemsProgress,
    stemsModel: t.stemsModel,
    stemsList: t.stemsList,
    stemsError: t.stemsError,
    createdAt: t.createdAt,
    song: t.songId
      ? {
          id: t.songId,
          title: t.songTitle || "",
          originalKey: t.songOrigKey,
          currentKey: t.songCurrKey,
        }
      : null,
  }));

  // Lista de canciones para el selector de vinculación
  const songsList = db
    .select({
      id: schema.songs.id,
      title: schema.songs.title,
      artist: schema.songs.artist,
      key: schema.songs.currentKey,
      bpm: schema.songs.tempo,
    })
    .from(schema.songs)
    .orderBy(schema.songs.title)
    .all();

  const canManage = canManageSongs(user);

  return (
    <GalleryView
      initialTracks={formattedTracks}
      songsList={songsList}
      canManage={canManage}
    />
  );
}
