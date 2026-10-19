import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
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
    .where(eq(schema.songs.id, Number(id)))
    .get();
  if (!song) notFound();

  const canEditOrDelete = song.ownerId === user.id || user.role === "admin";

  const activeKey = song.currentKey || song.originalKey;
  const hasDiffKey = Boolean(song.originalKey && song.currentKey && song.originalKey !== song.currentKey);

  return (
    <div className="stack">
      <div>
        <Link
          href="/canciones"
          className="muted"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <ArrowLeft size={14} />
          <span>Canciones</span>
        </Link>
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
        {canEditOrDelete && (
          <Link
            href={`/canciones/${song.id}/editar`}
            className="btn ghost"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Pencil size={14} />
            <span>Editar</span>
          </Link>
        )}
        <PrintButton />
        {canEditOrDelete && (
          <form action={deleteSong}>
            <input type="hidden" name="id" value={song.id} />
            <button
              className="btn danger"
              formNoValidate
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Trash2 size={14} />
              <span>Eliminar</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
