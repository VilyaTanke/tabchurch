import Link from "next/link";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import {
  Plus,
  Clock,
  User,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
    ? or(like(schema.songs.title, term), like(schema.songs.artist, term))
    : undefined;

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
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="grow">
          <h1>Biblioteca de Canciones</h1>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            {totalSongs} {totalSongs === 1 ? "canción" : "canciones"} en total
            {totalPages > 1 ? ` · Página ${currentPage} de ${totalPages}` : ""}
          </p>
        </div>
        <Link
          href="/canciones/nueva"
          className="btn"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Plus size={16} />
          <span>Nueva</span>
        </Link>
      </div>

      {/* Pestañas de Vista */}
      <div className="row" style={{ gap: "0.5rem" }}>
        <Link
          href="/canciones"
          className="btn small"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Clock size={14} />
          <span>Últimas agregadas</span>
        </Link>
        <Link
          href="/canciones/artistas"
          className="btn ghost small"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <User size={14} />
          <span>Por Artista</span>
        </Link>
      </div>

      <form className="row" role="search">
        <input
          name="q"
          defaultValue={q}
          className="input grow"
          placeholder="Buscar por título o artista…"
          aria-label="Buscar canciones"
        />
        <button
          className="btn ghost"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <Search size={14} />
          <span>Buscar</span>
        </button>
        {q && (
          <Link
            href="/canciones"
            className="btn ghost small"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <X size={13} />
            <span>Limpiar filtro</span>
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
            <Link
              href={buildPageUrl(currentPage - 1)}
              className="btn ghost small"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              <ChevronLeft size={15} />
              <span>Anterior</span>
            </Link>
          ) : (
            <button
              className="btn ghost small"
              disabled
              style={{ opacity: 0.4, cursor: "not-allowed", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              <ChevronLeft size={15} />
              <span>Anterior</span>
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
            <Link
              href={buildPageUrl(currentPage + 1)}
              className="btn ghost small"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              <span>Siguiente</span>
              <ChevronRight size={15} />
            </Link>
          ) : (
            <button
              className="btn ghost small"
              disabled
              style={{ opacity: 0.4, cursor: "not-allowed", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              <span>Siguiente</span>
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
