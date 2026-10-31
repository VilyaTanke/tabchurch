import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { canUserEditSetlist, getSetlistFor, getSetlistItems } from "@/lib/setlists";
import StageMode from "@/components/StageMode";

export const metadata = {
  title: "Modo Escenario · Tab-NuevaVida",
};

export default async function SetlistStagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const setlistId = Number(id);

  const list = getSetlistFor(user.id, setlistId, user.role === "admin");
  if (!list) notFound();

  const items = getSetlistItems(setlistId);
  if (items.length === 0) {
    notFound();
  }

  const canEdit = canUserEditSetlist(user, list);

  const songs = items.map((it) => ({
    itemId: it.id,
    id: it.song.id,
    title: it.song.title,
    artist: it.song.artist,
    originalKey: it.song.originalKey,
    currentKey: it.song.currentKey,
    keyOverride: it.keyOverride,
    contentChordpro: it.song.contentChordpro,
    notes: it.itemNotes || it.song.notes,
    tempo: it.song.tempo,
    twoColumns: Boolean(it.twoColumns),
  }));

  return (
    <StageMode
      songs={songs}
      setlistId={list.id}
      canEdit={canEdit}
    />
  );
}
