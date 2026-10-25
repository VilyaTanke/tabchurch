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
  SlidersHorizontal,
} from "lucide-react";
import { db, schema } from "@/db";
import { canManageSongs, requireUser } from "@/lib/auth";
import SongLibraryManager from "@/components/SongLibraryManager";

export const metadata = { title: "Canciones · Tab-NuevaVida" };

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
      <SongLibraryManager
        songs={songs}
        canManage={canManageSongs(user)}
        totalSongs={totalSongs}
        currentPage={currentPage}
        totalPages={totalPages}
      >
        {/* Pestañas de Vista */}
        <div className="row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
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
          <Link
            href="/galeria"
            className="btn ghost small"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <SlidersHorizontal size={14} style={{ color: "var(--accent)" }} />
            <span>Zamar</span>
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
      </SongLibraryManager>

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
