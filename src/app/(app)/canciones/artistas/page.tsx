import Link from "next/link";
import { asc, desc, eq, like, or, sql } from "drizzle-orm";
import {
  Plus,
  Clock,
  User,
  Search,
  X,
  ArrowRight,
} from "lucide-react";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Artistas · Tab-NuevaVida" };

export default async function ArtistsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; artist?: string }> }) {
  const user = await requireUser();
  const { q = "", artist = "" } = await searchParams;

  // 1. Obtener lista de todos los artistas con conteo de canciones globales
  const artistsSummary = db
    .select({
      artist: sql<string>`coalesce(nullif(trim(${schema.songs.artist}), ''), 'Sin artista')`,
      count: sql<number>`count(*)`,
    })
    .from(schema.songs)
    .groupBy(sql`coalesce(nullif(trim(${schema.songs.artist}), ''), 'Sin artista')`)
    .orderBy(asc(sql`coalesce(nullif(trim(${schema.songs.artist}), ''), 'Sin artista')`))
    .all();

  // Filtrar artistas si hay búsqueda rápida
  const filteredArtists = artistsSummary.filter((a) =>
    a.artist.toLowerCase().includes(q.toLowerCase().trim())
  );

  // 2. Si se selecciona un artista, obtener sus canciones
  let selectedSongs: any[] = [];
  if (artist) {
    const isSinArtista = artist === "Sin artista";
    selectedSongs = db
      .select()
      .from(schema.songs)
      .where(
        isSinArtista
          ? sql`${schema.songs.artist} IS NULL OR trim(${schema.songs.artist}) = ''`
          : sql`LOWER(trim(${schema.songs.artist})) = LOWER(trim(${artist}))`
      )
      .orderBy(asc(schema.songs.title))
      .all();
  }

  return (
    <div className="stack">
      {/* Navegación de pestañas: Todas / Por Artista */}
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Biblioteca de Canciones</h1>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Explora tus cifrados organizados por autor o agrupación.
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

      <div className="row" style={{ gap: "0.5rem" }}>
        <Link
          href="/canciones"
          className="btn ghost small"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Clock size={14} />
          <span>Últimas agregadas</span>
        </Link>
        <Link
          href="/canciones/artistas"
          className="btn small"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <User size={14} />
          <span>Por Artista ({artistsSummary.length})</span>
        </Link>
      </div>

      {/* Buscador de artistas */}
      <form className="row" role="search">
        <input
          name="q"
          defaultValue={q}
          className="input grow"
          placeholder="Filtrar artista (ej. Barak, Hillsong, Miel San Marcos)…"
          aria-label="Filtrar artistas"
        />
        <button
          className="btn ghost"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <Search size={14} />
          <span>Filtrar</span>
        </button>
        {q && (
          <Link
            href="/canciones/artistas"
            className="btn ghost small"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <X size={13} />
            <span>Limpiar</span>
          </Link>
        )}
      </form>

      {/* Si hay un artista seleccionado, mostrar sus canciones primero con opción de volver */}
      {artist && (
        <section className="card stack" style={{ border: "1px solid rgba(212, 175, 55, 0.4)", background: "rgba(223, 186, 115, 0.08)" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <span className="muted" style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Artista seleccionado
              </span>
              <h2>{artist} ({selectedSongs.length} canciones)</h2>
            </div>
            <Link
              href="/canciones/artistas"
              className="btn ghost small"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            >
              <X size={13} />
              <span>Cerrar artista</span>
            </Link>
          </div>

          <div className="grid two">
            {selectedSongs.map((s) => (
              <Link key={s.id} href={`/canciones/${s.id}`} className="card song-card">
                <div className="row">
                  <strong className="grow">{s.title}</strong>
                  {(s.currentKey || s.originalKey) && (
                    <span className="badge admin">
                      {s.currentKey || s.originalKey}
                      {s.originalKey && s.currentKey && s.originalKey !== s.currentKey && (
                        <span style={{ opacity: 0.7, fontSize: "0.75em", marginLeft: "4px" }}>
                          (orig. {s.originalKey})
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  {s.tempo ? `${s.tempo} BPM` : "Sin tempo definido"}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cuadrícula de Artistas */}
      <h2>Todos los Artistas ({filteredArtists.length})</h2>
      {filteredArtists.length === 0 ? (
        <div className="card">
          <p className="muted">No se encontraron artistas con ese nombre.</p>
        </div>
      ) : (
        <div className="grid two">
          {filteredArtists.map((a) => {
            const isSelected = artist.toLowerCase() === a.artist.toLowerCase();
            return (
              <Link
                key={a.artist}
                href={`/canciones/artistas?artist=${encodeURIComponent(a.artist)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className="card song-card"
                style={{
                  borderColor: isSelected ? "var(--primary)" : undefined,
                  background: isSelected ? "var(--surface-2)" : undefined,
                }}
              >
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "1.05rem" }}>{a.artist}</strong>
                  <span className="badge" style={{ fontSize: "0.8rem", padding: "0.25rem 0.6rem" }}>
                    {a.count} {a.count === 1 ? "canción" : "canciones"}
                  </span>
                </div>
                <span
                  className="muted"
                  style={{ fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                >
                  <span>Ver repertorio</span>
                  <ArrowRight size={13} />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
