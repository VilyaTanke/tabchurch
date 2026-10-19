import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireSongEditor } from "@/lib/auth";
import SongEditor from "@/components/SongEditor";

export const metadata = { title: "Editar canción · TabChurch" };

export default async function EditSongPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSongEditor();
  const { id } = await params;
  const song = db
    .select()
    .from(schema.songs)
    .where(eq(schema.songs.id, Number(id)))
    .get();
  if (!song) notFound();
  return (
    <div className="stack">
      <h1>Editar canción</h1>
      <SongEditor song={song} />
    </div>
  );
}
