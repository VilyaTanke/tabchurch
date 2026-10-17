import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getSetlistFor, getSetlistItems } from "@/lib/setlists";
import StageMode from "@/components/StageMode";

export const metadata = {
  title: "Modo Escenario · TabChurch",
};

export default async function SetlistStagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const setlistId = Number(id);

  const list = getSetlistFor(user.id, setlistId);
  if (!list) notFound();

  const items = getSetlistItems(setlistId);
  if (items.length === 0) {
    notFound();
  }

  const songs = items.map((it) => ({
    id: it.song.id,
    title: it.song.title,
    artist: it.song.artist,
    originalKey: it.song.originalKey,
    keyOverride: it.keyOverride,
    contentChordpro: it.song.contentChordpro,
    notes: it.itemNotes || it.song.notes,
    tempo: it.song.tempo,
  }));

  return (
    <StageMode
      songs={songs}
      setlistName={list.name}
      setlistId={list.id}
    />
  );
}
