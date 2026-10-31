import Link from "next/link";
import { and, asc, desc, like, or, sql } from "drizzle-orm";
import {
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
import AlphabetFilter from "@/components/AlphabetFilter";

export const metadata = { title: "Canciones · Tab-NuevaVida" };

const PAGE_SIZE = 20;

function getPaginationWindow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) pages.push("ellipsis");
  for (let p = left; p <= right; p++) {
    pages.push(p);
  }
  if (right < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export default async function SongsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; page?: string; letter?: string }> }) {
  const user = await requireUser();
  const { q = "", page = "1", letter = "" } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const conditions = [];

  if (q.trim()) {
    const term = `%${q.trim().replace(/[%_]/g, "")}%`;
    conditions.push(or(like(schema.songs.title, term), like(schema.songs.artist, term)));
  }

  const normLetter = letter.trim().toUpperCase();
  if (normLetter && normLetter !== "ALL") {
    if (normLetter === "#" || normLetter === "0-9") {
      conditions.push(
        sql`SUBSTR(TRIM(${schema.songs.title}), 1, 1) GLOB '[0-9]*' OR SUBSTR(TRIM(${schema.songs.title}), 1, 1) NOT GLOB '[a-zA-ZáéíóúÁÉÍÓÚñÑ]*'`
      );
    } else if (normLetter === "A") {
      conditions.push(sql`SUBSTR(TRIM(${schema.songs.title}), 1, 1) IN ('A', 'a', 'Á', 'á')`);
    } else if (normLetter === "E") {
      conditions.push(sql`SUBSTR(TRIM(${schema.songs.title}), 1, 1) IN ('E', 'e', 'É', 'é')`);
    } else if (normLetter === "I") {
      conditions.push(sql`SUBSTR(TRIM(${schema.songs.title}), 1, 1) IN ('I', 'i', 'Í', 'í')`);
    } else if (normLetter === "O") {
      conditions.push(sql`SUBSTR(TRIM(${schema.songs.title}), 1, 1) IN ('O', 'o', 'Ó', 'ó')`);
    } else if (normLetter === "U") {
      conditions.push(sql`SUBSTR(TRIM(${schema.songs.title}), 1, 1) IN ('U', 'u', 'Ú', 'ú')`);
    } else if (normLetter === "N") {
      conditions.push(sql`SUBSTR(TRIM(${schema.songs.title}), 1, 1) IN ('N', 'n', 'Ñ', 'ñ')`);
    } else {
      conditions.push(sql`LOWER(SUBSTR(TRIM(${schema.songs.title}), 1, 1)) = ${normLetter.toLowerCase()}`);
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const totalCountResult = db
    .select({ count: sql<number>`count(*)` })
    .from(schema.songs)
    .where(whereClause)
    .get();

  const totalSongs = totalCountResult?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSongs / PAGE_SIZE));

  const isLetterFiltered = Boolean(normLetter && normLetter !== "ALL");

  const songs = db
    .select()
    .from(schema.songs)
    .where(whereClause)
    .orderBy(isLetterFiltered ? asc(schema.songs.title) : desc(schema.songs.updatedAt))
    .limit(PAGE_SIZE)
    .offset(offset)
    .all();

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (isLetterFiltered) params.set("letter", normLetter);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/canciones?${qs}` : "/canciones";
  };

  const pageItems = getPaginationWindow(currentPage, totalPages);

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

        {/* Abecedario para filtrar canciones por inicial */}
        <AlphabetFilter
          currentLetter={letter}
          baseUrl="/canciones"
          preserveParams={{ q }}
          allLabel="Todas"
        />

        <form className="row" role="search">
          <input
            name="q"
            defaultValue={q}
            className="input grow"
            placeholder="Buscar por título o artista…"
            aria-label="Buscar canciones"
          />
          {letter && <input type="hidden" name="letter" value={letter} />}
          <button
            className="btn ghost"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Search size={14} />
            <span>Buscar</span>
          </button>
          {(q || isLetterFiltered) && (
            <Link
              href="/canciones"
              className="btn ghost small"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            >
              <X size={13} />
              <span>Limpiar filtros</span>
            </Link>
          )}
        </form>
      </SongLibraryManager>

      {/* Controles de paginación con ventana y puntos suspensivos */}
      {totalPages > 1 && (
        <div className="row" style={{ justifyContent: "center", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
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

          <div className="row" style={{ gap: "0.35rem", flexWrap: "wrap" }}>
            {pageItems.map((item, idx) => {
              if (item === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="muted"
                    style={{ padding: "0 0.35rem", userSelect: "none" }}
                  >
                    …
                  </span>
                );
              }
              const isCurrent = item === currentPage;
              return (
                <Link
                  key={item}
                  href={buildPageUrl(item)}
                  className={`btn small ${isCurrent ? "" : "ghost"}`}
                  style={{ minWidth: "38px", padding: "0 0.6rem", textAlign: "center" }}
                >
                  {item}
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
