import Link from "next/link";
import { and, desc, eq, like, or } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Canciones · TabChurch" };

export default async function SongsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string }> }) {
  const user = await requireUser();
  const { q = "" } = await searchParams;
  const term = `%${q.trim().replace(/[%_]/g, "")}%`;
  const songs = db
    .select()
    .from(schema.songs)
    .where(
      q.trim()
        ? and(
            eq(schema.songs.ownerId, user.id),
            or(like(schema.songs.title, term), like(schema.songs.artist, term)),
          )
        : eq(schema.songs.ownerId, user.id),
    )
    .orderBy(desc(schema.songs.updatedAt))
    .all();

  return (
    <div className="stack">
      <div className="row">
        <h1 className="grow">Canciones</h1>
        <Link href="/canciones/nueva" className="btn">+ Nueva</Link>
      </div>
      <form className="row" role="search">
        <input name="q" defaultValue={q} className="input grow" placeholder="Buscar por título o artista…" aria-label="Buscar canciones" />
        <button className="btn ghost">Buscar</button>
      </form>
      {songs.length === 0 ? (
        <div className="card">
          <p className="muted">{q ? "Sin resultados." : "Aún no tienes canciones. ¡Crea la primera!"}</p>
        </div>
      ) : (
        <div className="grid two">
          {songs.map((s) => (
            <Link key={s.id} href={`/canciones/${s.id}`} className="card song-card">
              <div className="row">
                <strong className="grow">{s.title}</strong>
                {s.originalKey && <span className="badge admin">{s.originalKey}</span>}
              </div>
              <div className="muted" style={{ fontSize: "0.9rem" }}>
                {s.artist || "Sin artista"}{s.tempo ? ` · ${s.tempo} BPM` : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
