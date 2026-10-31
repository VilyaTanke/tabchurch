"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  Square,
  ArrowLeft,
  Loader2,
  Music,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  getArtistSongsAction,
  importSingleArtistSongAction,
  finishArtistImportAction,
  type ScrapedArtistSongView,
} from "@/app/songs-actions";

type ImportStatus = "idle" | "scanning" | "ready" | "importing" | "finished";

type ImportResultItem = {
  title: string;
  url: string;
  status: "pending" | "importing" | "success" | "skipped" | "error";
  songId?: number;
  error?: string;
};

export default function ArtistImporter() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [artist, setArtist] = useState("");
  const [songs, setSongs] = useState<ScrapedArtistSongView[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [filterText, setFilterText] = useState("");
  const [isPending, startTransition] = useTransition();

  // Estados de progreso
  const [importResults, setImportResults] = useState<ImportResultItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  const handleScan = () => {
    if (!url.trim()) return;
    setError(null);
    setStatus("scanning");

    startTransition(async () => {
      const res = await getArtistSongsAction(url.trim());
      if (!res.ok || !res.songs) {
        setError(res.error || "No se pudo obtener el catálogo del artista.");
        setStatus("idle");
        return;
      }

      setArtist(res.artist || "Artista");
      setSongs(res.songs);

      // Por defecto, preseleccionar únicamente las que no existen en la biblioteca
      const newUrls = new Set(res.songs.filter((s) => !s.alreadyExists).map((s) => s.url));
      setSelectedUrls(newUrls);
      setStatus("ready");
    });
  };

  const filteredSongs = useMemo(() => {
    if (!filterText.trim()) return songs;
    const term = filterText.toLowerCase().trim();
    return songs.filter((s) => s.title.toLowerCase().includes(term));
  }, [songs, filterText]);

  const selectAllNew = () => {
    const newUrls = new Set(songs.filter((s) => !s.alreadyExists).map((s) => s.url));
    setSelectedUrls(newUrls);
  };

  const selectAll = () => {
    const allUrls = new Set(songs.map((s) => s.url));
    setSelectedUrls(allUrls);
  };

  const deselectAll = () => {
    setSelectedUrls(new Set());
  };

  const toggleSelect = (songUrl: string) => {
    const next = new Set(selectedUrls);
    if (next.has(songUrl)) {
      next.delete(songUrl);
    } else {
      next.add(songUrl);
    }
    setSelectedUrls(next);
  };

  const handleStartImport = async () => {
    const toImport = songs.filter((s) => selectedUrls.has(s.url));
    if (toImport.length === 0) return;

    setStatus("importing");
    setIsCancelled(false);
    setCurrentIndex(0);

    const initialResults: ImportResultItem[] = toImport.map((s) => ({
      title: s.title,
      url: s.url,
      status: "pending",
    }));
    setImportResults(initialResults);

    // Importación secuencial con pequeño retardo para evitar bloqueos
    for (let i = 0; i < toImport.length; i++) {
      if (isCancelled) break;

      setCurrentIndex(i);
      setImportResults((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: "importing" } : item))
      );

      const target = toImport[i];
      try {
        const res = await importSingleArtistSongAction(target.url, artist);
        if (res.ok) {
          setImportResults((prev) =>
            prev.map((item, idx) =>
              idx === i
                ? {
                    ...item,
                    status: res.skipped ? "skipped" : "success",
                    songId: res.songId,
                    title: res.title || item.title,
                  }
                : item
            )
          );
        } else {
          setImportResults((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, status: "error", error: res.error } : item
            )
          );
        }
      } catch (err: unknown) {
        setImportResults((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? { ...item, status: "error", error: (err as Error)?.message || "Fallo de conexión" }
              : item
          )
        );
      }

      // Pequeño retardo de cortesía de 600ms entre solicitudes
      if (i < toImport.length - 1) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    await finishArtistImportAction();
    setStatus("finished");
  };

  const progressPercent =
    importResults.length > 0 ? Math.round(((currentIndex + 1) / importResults.length) * 100) : 0;

  const countSuccess = importResults.filter((r) => r.status === "success").length;
  const countSkipped = importResults.filter((r) => r.status === "skipped").length;
  const countError = importResults.filter((r) => r.status === "error").length;

  return (
    <div className="stack" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Cabecera */}
      <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Link
            href="/canciones/artistas"
            className="muted"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", marginBottom: "0.4rem" }}
          >
            <ArrowLeft size={14} /> Volver a Artistas
          </Link>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Download size={26} /> Importador Masivo por Artista
          </h1>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            Descarga y cataloga automáticamente todos los cifrados de un grupo o cantante desde CifraClub o LaCuerda.
          </p>
        </div>
      </div>

      {/* PASO 1: Formulario de URL */}
      {status !== "importing" && status !== "finished" && (
        <div className="card stack" style={{ padding: "1.5rem" }}>
          <label style={{ fontWeight: 600 }}>Enlace de la página del artista</label>
          <div className="row" style={{ gap: "0.5rem" }}>
            <div className="grow" style={{ position: "relative" }}>
              <input
                type="url"
                className="input"
                style={{ width: "100%", paddingLeft: "2.25rem" }}
                placeholder="https://www.cifraclub.com.br/miel-san-marcos/ o https://lacuerda.net/tabs/m/miel_san_marcos/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleScan();
                  }
                }}
                disabled={status === "scanning" || isPending}
              />
              <Globe
                size={16}
                className="muted"
                style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
            <button
              type="button"
              className="btn"
              onClick={handleScan}
              disabled={!url.trim() || status === "scanning" || isPending}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}
            >
              {status === "scanning" || isPending ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Escaneando…</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Escanear artista</span>
                </>
              )}
            </button>
          </div>

          <div className="muted" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
            💡 <strong>Ejemplos compatibles:</strong>
            <span style={{ display: "block", marginTop: "0.2rem" }}>
              • CifraClub: <code>https://www.cifraclub.com.br/hillsong-worship/</code>
            </span>
            <span style={{ display: "block" }}>
              • LaCuerda: <code>https://lacuerda.net/tabs/m/marcos_witt/</code>
            </span>
          </div>

          {error && (
            <div className="alert error" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* PASO 2: Vista previa de catálogo y selección */}
      {status === "ready" && (
        <div className="card stack" style={{ padding: "1.5rem" }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Music size={20} /> {artist}
              </h2>
              <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                {songs.length} canciones encontradas • {songs.filter((s) => !s.alreadyExists).length} nuevas para importar • {songs.filter((s) => s.alreadyExists).length} ya en biblioteca
              </p>
            </div>
            <button
              type="button"
              className="btn"
              onClick={handleStartImport}
              disabled={selectedUrls.size === 0}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Download size={16} />
              <span>Importar seleccionadas ({selectedUrls.size})</span>
            </button>
          </div>

          {/* Acciones de selección rápida y filtro */}
          <div className="row" style={{ gap: "0.5rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div className="row" style={{ gap: "0.35rem" }}>
              <button type="button" className="chip" onClick={selectAllNew}>
                Solo nuevas ({songs.filter((s) => !s.alreadyExists).length})
              </button>
              <button type="button" className="chip alt" onClick={selectAll}>
                Todas ({songs.length})
              </button>
              <button type="button" className="chip alt" onClick={deselectAll}>
                Ninguna
              </button>
            </div>

            <div style={{ position: "relative", minWidth: 200 }}>
              <input
                type="text"
                className="input small"
                placeholder="Filtrar por título…"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ paddingLeft: "2rem" }}
              />
              <Search
                size={13}
                className="muted"
                style={{ position: "absolute", left: "0.6rem", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          {/* Lista de canciones */}
          <div
            style={{
              maxHeight: "450px",
              overflowY: "auto",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--surface-1)",
            }}
          >
            {filteredSongs.length === 0 ? (
              <p className="muted" style={{ padding: "1.5rem", textAlign: "center" }}>
                No se encontraron canciones que coincidan con el filtro.
              </p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {filteredSongs.map((song) => {
                  const isSelected = selectedUrls.has(song.url);
                  return (
                    <li
                      key={song.url}
                      onClick={() => toggleSelect(song.url)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.65rem 0.9rem",
                        borderBottom: "1px solid var(--border)",
                        cursor: "pointer",
                        background: isSelected ? "rgba(223, 186, 115, 0.08)" : "transparent",
                      }}
                    >
                      <div className="row" style={{ alignItems: "center", gap: "0.65rem" }}>
                        <span style={{ color: isSelected ? "var(--accent)" : "var(--muted)" }}>
                          {isSelected ? <CheckSquare size={17} /> : <Square size={17} />}
                        </span>
                        <span style={{ fontWeight: isSelected ? 600 : 400 }}>{song.title}</span>
                      </div>

                      <div className="row" style={{ alignItems: "center", gap: "0.5rem" }}>
                        {song.alreadyExists ? (
                          <span
                            className="chip"
                            style={{
                              fontSize: "0.7rem",
                              padding: "0.15rem 0.5rem",
                              background: "rgba(100, 116, 139, 0.15)",
                              color: "var(--muted)",
                              border: "none",
                            }}
                          >
                            Ya en biblioteca
                          </span>
                        ) : (
                          <span
                            className="chip ok"
                            style={{
                              fontSize: "0.7rem",
                              padding: "0.15rem 0.5rem",
                            }}
                          >
                            Nueva
                          </span>
                        )}
                        <a
                          href={song.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="muted"
                          title="Ver en origen"
                          style={{ display: "inline-flex", alignItems: "center" }}
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* PASO 3: Progreso de Importación */}
      {status === "importing" && (
        <div className="card stack" style={{ padding: "1.75rem" }}>
          <h2>Importando catálogo de {artist}…</h2>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Procesando canción {currentIndex + 1} de {importResults.length}. Por favor no cierres esta pestaña.
          </p>

          {/* Barra de progreso */}
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "var(--surface-2)",
              borderRadius: "999px",
              overflow: "hidden",
              margin: "0.5rem 0",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #dfba73, #d4af37)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{progressPercent}% completado</span>
            <button
              type="button"
              className="btn ghost small"
              onClick={() => setIsCancelled(true)}
              style={{ color: "var(--error)" }}
            >
              Detener proceso
            </button>
          </div>

          {/* Lista de progreso en tiempo real */}
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--surface-1)",
              padding: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {importResults.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.4rem 0.6rem",
                    fontSize: "0.85rem",
                    borderBottom: "1px solid rgba(0,0,0,0.03)",
                  }}
                >
                  <span style={{ fontWeight: item.status === "importing" ? 600 : 400 }}>
                    {item.title}
                  </span>

                  <div className="row" style={{ alignItems: "center", gap: "0.4rem" }}>
                    {item.status === "pending" && <span className="muted">En cola</span>}
                    {item.status === "importing" && (
                      <span style={{ color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <Loader2 size={13} className="spin" /> Importando…
                      </span>
                    )}
                    {item.status === "success" && (
                      <span className="text-ok" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <CheckCircle2 size={14} /> Importada
                      </span>
                    )}
                    {item.status === "skipped" && (
                      <span className="muted" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        Omitida (ya existía)
                      </span>
                    )}
                    {item.status === "error" && (
                      <span className="text-error" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }} title={item.error}>
                        <AlertCircle size={14} /> Error
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* PASO 4: Resumen final */}
      {status === "finished" && (
        <div className="card stack" style={{ padding: "2rem", textAlign: "center", alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(34, 197, 94, 0.15)",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.5rem",
            }}
          >
            <Sparkles size={28} />
          </div>

          <h2>¡Importación de {artist} completada!</h2>
          <p className="muted" style={{ maxWidth: 500, fontSize: "0.9rem" }}>
            Se han procesado {importResults.length} canciones del catálogo.
          </p>

          <div className="row" style={{ gap: "1rem", margin: "1rem 0" }}>
            <div className="card" style={{ padding: "0.75rem 1.25rem", minWidth: 100 }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#16a34a" }}>{countSuccess}</div>
              <div className="muted" style={{ fontSize: "0.75rem" }}>Nuevas guardadas</div>
            </div>
            {countSkipped > 0 && (
              <div className="card" style={{ padding: "0.75rem 1.25rem", minWidth: 100 }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{countSkipped}</div>
                <div className="muted" style={{ fontSize: "0.75rem" }}>Omitidas (existentes)</div>
              </div>
            )}
            {countError > 0 && (
              <div className="card" style={{ padding: "0.75rem 1.25rem", minWidth: 100 }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--error)" }}>{countError}</div>
                <div className="muted" style={{ fontSize: "0.75rem" }}>Con error</div>
              </div>
            )}
          </div>

          <div className="row" style={{ gap: "0.75rem" }}>
            <Link
              href={`/canciones/artistas?artist=${encodeURIComponent(artist)}`}
              className="btn"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Music size={16} /> Ver canciones de {artist}
            </Link>
            <button
              type="button"
              className="btn alt"
              onClick={() => {
                setStatus("idle");
                setUrl("");
                setSongs([]);
                setSelectedUrls(new Set());
              }}
            >
              Importar otro artista
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
