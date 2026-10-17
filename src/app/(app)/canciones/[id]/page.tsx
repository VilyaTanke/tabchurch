import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { deleteSong } from "@/app/songs-actions";
import SongViewer from "@/components/SongViewer";
import PrintButton from "@/components/PrintButton";

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const song = db
    .select()
    .from(schema.songs)
    .where(and(eq(schema.songs.id, Number(id)), eq(schema.songs.ownerId, user.id)))
    .get();
  if (!song) notFound();

  const activeKey = song.currentKey || song.originalKey;
  const hasDiffKey = Boolean(song.originalKey && song.currentKey && song.originalKey !== song.currentKey);

  return (
    <div className="stack">
      <div>
        <Link href="/canciones" className="muted">← Canciones</Link>
        <h1>{song.title}</h1>
        <p className="muted" style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.25rem" }}>
          <span>{song.artist || "Sin artista"}</span>
          {song.tempo ? <span>· {song.tempo} BPM</span> : null}
          {activeKey ? (
            <span>
              · Tono: <strong style={{ color: "var(--accent)" }}>{activeKey}</strong>
            </span>
          ) : null}
          {hasDiffKey && (
            <span
              className="badge"
              style={{
                background: "rgba(255, 200, 107, 0.15)",
                color: "var(--accent)",
                border: "1px solid rgba(255, 200, 107, 0.3)",
                fontSize: "0.78rem",
                padding: "0.2rem 0.5rem",
              }}
              title="Tono original de la canción"
            >
              Original: {song.originalKey}
            </span>
          )}
        </p>
      </div>
      {song.notes && <div className="card"><span className="muted">Notas</span><p style={{ whiteSpace: "pre-wrap" }}>{song.notes}</p></div>}
      <SongViewer
        songId={song.id}
        content={song.contentChordpro}
        originalKey={song.originalKey}
        currentKey={song.currentKey}
      />
      <div className="row">
        <Link href={`/canciones/${song.id}/editar`} className="btn ghost">Editar</Link>
        <PrintButton />
        <form action={deleteSong}>
          <input type="hidden" name="id" value={song.id} />
          <button className="btn danger" formNoValidate>Eliminar</button>
        </form>
      </div>
    </div>
  );
}
