import Link from "next/link";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Canciones · TabChurch" };

const PAGE_SIZE = 20;

export default async function SongsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const user = await requireUser();
  const { q = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const term = `%${q.trim().replace(/[%_]/g, "")}%`;
  const whereClause = q.trim()
    ? and(
        eq(schema.songs.ownerId, user.id),
        or(like(schema.songs.title, term), like(schema.songs.artist, term)),
      )
    : eq(schema.songs.ownerId, user.id);

  const totalCountResult = db
    .select({ count: sql<number>`count(*)` })
    .from(schema.songs)
    .where(whereClause)
    .get();

  const totalSongs = totalCountResult?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSongs / PAGE_SIZE));

  const songs = db
    .select()
    .from(schema.songs)
    .where(whereClause)
    .orderBy(desc(schema.songs.updatedAt))
    .limit(PAGE_SIZE)
    .offset(offset)
    .all();

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/canciones?${qs}` : "/canciones";
  };

  return (
    <div className="stack">
      <div className="row">
        <div className="grow">
          <h1>Canciones</h1>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            {totalSongs} {totalSongs === 1 ? "canción encontrada" : "canciones encontradas"}
            {totalPages > 1 ? ` · Página ${currentPage} de ${totalPages}` : ""}
          </p>
        </div>
        <Link href="/canciones/nueva" className="btn">+ Nueva</Link>
      </div>

      <form className="row" role="search">
        <input
          name="q"
          defaultValue={q}
          className="input grow"
          placeholder="Buscar por título o artista…"
          aria-label="Buscar canciones"
        />
        <button className="btn ghost">Buscar</button>
        {q && (
          <Link href="/canciones" className="btn ghost small">
            Limpiar filtro
          </Link>
        )}
      </form>

      {songs.length === 0 ? (
        <div className="card">
          <p className="muted">{q ? "Sin resultados para tu búsqueda." : "Aún no tienes canciones. ¡Crea la primera!"}</p>
        </div>
      ) : (
        <div className="grid two">
          {songs.map((s) => (
            <Link key={s.id} href={`/canciones/${s.id}`} className="card song-card">
              <div className="row">
                <strong className="grow">{s.title}</strong>
                {(s.currentKey || s.originalKey) && (
                  <span
                    className="badge admin"
                    title={s.originalKey && s.currentKey && s.originalKey !== s.currentKey ? `Tono original: ${s.originalKey}` : undefined}
                  >
                    {s.currentKey || s.originalKey}
                    {s.originalKey && s.currentKey && s.originalKey !== s.currentKey && (
                      <span style={{ opacity: 0.7, fontSize: "0.75em", marginLeft: "4px" }}>(orig. {s.originalKey})</span>
                    )}
                  </span>
                )}
              </div>
              <div className="muted" style={{ fontSize: "0.9rem" }}>
                {s.artist || "Sin artista"}{s.tempo ? ` · ${s.tempo} BPM` : ""}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="row" style={{ justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          {currentPage > 1 ? (
            <Link href={buildPageUrl(currentPage - 1)} className="btn ghost small">
              ‹ Anterior
            </Link>
          ) : (
            <button className="btn ghost small" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
              ‹ Anterior
            </button>
          )}

          <div className="row" style={{ gap: "0.35rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === currentPage;
              return (
                <Link
                  key={p}
                  href={buildPageUrl(p)}
                  className={`btn small ${isCurrent ? "" : "ghost"}`}
                  style={{ minWidth: "38px", padding: "0 0.6rem", textAlign: "center" }}
                >
                  {p}
                </Link>
              );
            })}
          </div>

          {currentPage < totalPages ? (
            <Link href={buildPageUrl(currentPage + 1)} className="btn ghost small">
              Siguiente ›
            </Link>
          ) : (
            <button className="btn ghost small" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
              Siguiente ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
