import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, Pencil, Trash2, SlidersHorizontal, Radio } from "lucide-react";
import { db, schema } from "@/db";
import { canManageSongs, requireUser } from "@/lib/auth";
import { deleteSong } from "@/app/songs-actions";
import SongViewer from "@/components/SongViewer";
import PrintButton from "@/components/PrintButton";
import ZamarMiniPlayer from "@/components/ZamarMiniPlayer";

export default async function SongPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ fromList?: string; key?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { fromList, key: keyParam } = (await searchParams) || {};

  const song = db
    .select()
    .from(schema.songs)
    .where(eq(schema.songs.id, Number(id)))
    .get();
  if (!song) notFound();

  // Buscar información de la lista si venimos de una lista creada
  const fromSetlist = fromList
    ? db
        .select({ id: schema.setlists.id, name: schema.setlists.name })
        .from(schema.setlists)
        .where(eq(schema.setlists.id, Number(fromList)))
        .get()
    : null;

  // Buscar si esta canción tiene pista de audio vinculada en la galería
  const linkedTrack = db
    .select()
    .from(schema.tracks)
    .where(eq(schema.tracks.songId, song.id))
    .orderBy(desc(schema.tracks.createdAt))
    .get();

  const canEditOrDelete = canManageSongs(user);

  const activeKey = keyParam || song.currentKey || song.originalKey;
  const hasDiffKey = Boolean(song.originalKey && activeKey && song.originalKey !== activeKey);

  return (
    <div className="stack">
      <div>
        <Link
          href={fromSetlist ? `/listas/${fromSetlist.id}` : "/canciones"}
          className="muted"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <ArrowLeft size={14} />
          <span>{fromSetlist ? `Volver a lista (${fromSetlist.name})` : "Canciones"}</span>
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
          {fromSetlist && (
            <Link
              href={`/listas/${fromSetlist.id}`}
              className="badge"
              style={{
                background: "rgba(223, 186, 115, 0.18)",
                color: "var(--accent)",
                border: "1px solid rgba(212, 175, 55, 0.35)",
                fontSize: "0.78rem",
                padding: "0.2rem 0.55rem",
                textDecoration: "none",
              }}
              title="Volver a la lista de alabanza"
            >
              Lista: {fromSetlist.name}
            </Link>
          )}
        </p>
      </div>

      {linkedTrack && (
        <div
          className="card row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.85rem",
            background: "linear-gradient(90deg, rgba(223, 186, 115, 0.12) 0%, rgba(180, 83, 9, 0.05) 100%)",
            borderColor: "rgba(212, 175, 55, 0.35)",
            flexWrap: "wrap",
          }}
        >
          <div className="row" style={{ gap: "0.6rem", minWidth: 220 }}>
            <Radio size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <div>
              <div className="row" style={{ gap: "0.4rem", alignItems: "center" }}>
                <strong style={{ fontSize: "0.95rem" }}>Pista de Audio MP3 disponible</strong>
                {linkedTrack.stemsStatus === "done" && (
                  <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#059669" }}>
                    Stems listos
                  </span>
                )}
              </div>
              <p className="muted" style={{ fontSize: "0.82rem", margin: "2px 0 0" }}>
                {linkedTrack.title} {linkedTrack.artist ? `· ${linkedTrack.artist}` : ""}
              </p>
            </div>
          </div>

          <div className="row" style={{ gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
            <ZamarMiniPlayer
              trackId={linkedTrack.id}
              trackTitle={linkedTrack.title}
              durationSec={linkedTrack.durationSec}
              variant="banner"
            />
            <Link
              href={`/galeria/${linkedTrack.id}/estudio`}
              className="btn small gold"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}
            >
              <SlidersHorizontal size={14} />
              <span>Abrir en Estudio Z</span>
            </Link>
          </div>
        </div>
      )}

      {song.notes && <div className="card"><span className="muted">Notas</span><p style={{ whiteSpace: "pre-wrap" }}>{song.notes}</p></div>}
      <SongViewer
        songId={song.id}
        content={song.contentChordpro}
        originalKey={song.originalKey}
        currentKey={activeKey}
        canSaveKey={canEditOrDelete}
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
