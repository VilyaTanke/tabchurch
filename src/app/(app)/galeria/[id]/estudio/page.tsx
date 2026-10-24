import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { canManageSongs, requireUser } from "@/lib/auth";
import { parseStemsList } from "@/lib/stems";
import StudioPlayer, { type StudioTrackData } from "@/components/StudioPlayer";

export const metadata = {
  title: "Estudio Z · Pistas & Stems · Tab-NuevaVida",
};

export default async function TrackStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const trackId = Number(id);
  if (!trackId) notFound();

  const track = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
  if (!track) notFound();

  // Si tiene canción asociada en la base de datos de acordes, cargarla
  let associatedSong = null;
  if (track.songId) {
    associatedSong = db
      .select({
        id: schema.songs.id,
        title: schema.songs.title,
        artist: schema.songs.artist,
        originalKey: schema.songs.originalKey,
        currentKey: schema.songs.currentKey,
        tempo: schema.songs.tempo,
        contentChordpro: schema.songs.contentChordpro,
      })
      .from(schema.songs)
      .where(eq(schema.songs.id, track.songId))
      .get() || null;
  }

  const studioData: StudioTrackData = {
    id: track.id,
    title: track.title,
    artist: track.artist,
    musicalKey: track.musicalKey,
    bpm: track.bpm,
    durationSec: track.durationSec,
    fileName: track.fileName,
    stemsStatus: track.stemsStatus,
    stemsProgress: track.stemsProgress,
    stemsModel: track.stemsModel,
    stemsList: parseStemsList(track.stemsList),
    stemsError: track.stemsError,
    song: associatedSong,
  };

  const canManage = canManageSongs(user);

  return <StudioPlayer initialTrack={studioData} canManage={canManage} />;
}
