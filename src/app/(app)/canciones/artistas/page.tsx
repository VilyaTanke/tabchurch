import Link from "next/link";
import { asc, desc, eq, like, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Artistas · TabChurch" };

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
        <Link href="/canciones/nueva" className="btn">+ Nueva</Link>
      </div>

      <div className="row" style={{ gap: "0.5rem" }}>
        <Link href="/canciones" className="btn ghost small">
          🕒 Últimas agregadas
        </Link>
        <Link href="/canciones/artistas" className="btn small">
          🎤 Por Artista ({artistsSummary.length})
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
        <button className="btn ghost">Filtrar</button>
        {q && (
          <Link href="/canciones/artistas" className="btn ghost small">
            Limpiar
          </Link>
        )}
      </form>

      {/* Si hay un artista seleccionado, mostrar sus canciones primero con opción de volver */}
      {artist && (
        <section className="card stack" style={{ border: "1px solid var(--primary)", background: "rgba(139, 123, 255, 0.05)" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <span className="muted" style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Artista seleccionado
              </span>
              <h2>{artist} ({selectedSongs.length} canciones)</h2>
            </div>
            <Link href="/canciones/artistas" className="btn ghost small">
              ✕ Cerrar artista
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
                <span className="muted" style={{ fontSize: "0.8rem" }}>
                  Ver repertorio de este artista →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
