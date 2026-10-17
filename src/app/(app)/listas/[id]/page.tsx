import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { deleteSetlist, updateSetlist } from "@/app/setlists-actions";
import SetlistEditor from "@/components/SetlistEditor";
import PrintButton from "@/components/PrintButton";
import { getSetlistFor, getSetlistItems } from "@/lib/setlists";

export default async function SetlistDetailPage({
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
  const library = db
    .select({
      id: schema.songs.id,
      title: schema.songs.title,
      artist: schema.songs.artist,
    })
    .from(schema.songs)
    .where(eq(schema.songs.ownerId, user.id))
    .orderBy(asc(schema.songs.title))
    .all();

  const formattedItems = items.map((it) => ({
    id: it.id,
    songId: it.song.id,
    title: it.song.title,
    artist: it.song.artist,
    originalKey: it.song.originalKey,
    keyOverride: it.keyOverride,
  }));

  return (
    <div className="stack">
      <div className="row">
        <div className="grow">
          <Link href="/listas" className="muted" style={{ fontSize: "0.9rem" }}>
            ← Volver a listas
          </Link>
          <h1>{list.name}</h1>
          <p className="muted">
            {list.eventDate
              ? new Date(list.eventDate + "T00:00").toLocaleDateString("es", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Sin fecha definida"}
          </p>
        </div>
        <div className="row">
          {items.length > 0 && (
            <>
              <Link
                href={`/listas/${list.id}/escenario`}
                className="btn"
                style={{
                  background: "linear-gradient(135deg, #10b981, #06b6d4)",
                  boxShadow: "0 8px 24px -8px rgba(16, 185, 129, 0.7)",
                }}
              >
                🎤 Modo Escenario
              </Link>
              <PrintButton label="🖨️ Imprimir Lista / PDF" />
            </>
          )}
          <form action={deleteSetlist}>
            <input type="hidden" name="id" value={list.id} />
            <button className="btn danger small">Eliminar</button>
          </form>
        </div>
      </div>

      <SetlistEditor
        setlistId={list.id}
        initial={formattedItems}
        library={library}
      />
    </div>
  );
}
