import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import SongEditor from "@/components/SongEditor";

export const metadata = { title: "Editar canción · TabChurch" };

export default async function EditSongPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const song = db
    .select()
    .from(schema.songs)
    .where(and(eq(schema.songs.id, Number(id)), eq(schema.songs.ownerId, user.id)))
    .get();
  if (!song) notFound();
  return (
    <div className="stack">
      <h1>Editar canción</h1>
      <SongEditor song={song} />
    </div>
  );
}
