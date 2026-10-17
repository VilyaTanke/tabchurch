import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { deleteSong } from "@/app/songs-actions";
import SongViewer from "@/components/SongViewer";

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
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
      <div>
        <Link href="/canciones" className="muted">← Canciones</Link>
        <h1>{song.title}</h1>
        <p className="muted">
          {song.artist || "Sin artista"}
          {song.tempo ? ` · ${song.tempo} BPM` : ""}
        </p>
      </div>
      {song.notes && <div className="card"><span className="muted">Notas</span><p style={{ whiteSpace: "pre-wrap" }}>{song.notes}</p></div>}
      <SongViewer content={song.contentChordpro} originalKey={song.originalKey} />
      <div className="row">
        <Link href={`/canciones/${song.id}/editar`} className="btn ghost">Editar</Link>
        <form action={deleteSong}>
          <input type="hidden" name="id" value={song.id} />
          <button className="btn danger" formNoValidate>Eliminar</button>
        </form>
      </div>
    </div>
  );
}
