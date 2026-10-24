"use client";

import { useState } from "react";
import { Plus, Search, X, SlidersHorizontal, Sparkles, Music2 } from "lucide-react";
import TrackCard, { type GalleryTrackItem } from "@/components/TrackCard";
import AudioUploadModal from "@/components/AudioUploadModal";

export default function GalleryView({
  initialTracks,
  songsList,
  canManage,
}: {
  initialTracks: GalleryTrackItem[];
  songsList: { id: number; title: string; artist: string | null; key: string | null; bpm: number | null }[];
  canManage: boolean;
}) {
  const [tracks, setTracks] = useState<GalleryTrackItem[]>(initialTracks);
  const [search, setSearch] = useState("");
  const [filterStemsOnly, setFilterStemsOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = tracks.filter((t) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      t.title.toLowerCase().includes(term) ||
      (t.artist && t.artist.toLowerCase().includes(term));

    const matchesStems = !filterStemsOnly || t.stemsStatus === "done";
    return matchesSearch && matchesStems;
  });

  const handleDeleteTrack = (id: number) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="stack">
      {/* Encabezado */}
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <SlidersHorizontal size={26} style={{ color: "var(--accent)" }} />
            <span>Galería de Audios & MP3</span>
          </h1>
          <p className="muted" style={{ fontSize: "0.85rem", marginTop: "2px" }}>
            {tracks.length} {tracks.length === 1 ? "pista de audio" : "pistas de audio"} · Reproductor con transpositor y separación de pistas por IA
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            className="btn gold"
            onClick={() => setIsModalOpen(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={16} />
            <span>Subir Audio</span>
          </button>
        )}
      </div>

      {/* Buscador y Filtros */}
      <div className="row" style={{ gap: "0.5rem" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <input
            className="input"
            placeholder="Buscar por título o artista..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.4rem" }}
          />
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.9rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn small ${filterStemsOnly ? "" : "ghost"}`}
          onClick={() => setFilterStemsOnly(!filterStemsOnly)}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <Sparkles size={14} />
          <span>Solo con Stems</span>
        </button>
      </div>

      {/* Lista de Pistas de Audio */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
          <Music2 size={40} style={{ color: "var(--muted)", margin: "0 auto 0.75rem", opacity: 0.5 }} />
          <p className="muted" style={{ fontSize: "1rem" }}>
            {search || filterStemsOnly
              ? "No se encontraron audios con los filtros seleccionados."
              : "Aún no hay archivos de audio en la galería."}
          </p>
          {canManage && !search && (
            <button
              type="button"
              className="btn gold small"
              onClick={() => setIsModalOpen(true)}
              style={{ marginTop: "1rem" }}
            >
              <Plus size={14} />
              <span>Subir el primer audio</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid two" style={{ gap: "1rem" }}>
          {filtered.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              canManage={canManage}
              onDelete={handleDeleteTrack}
            />
          ))}
        </div>
      )}

      {/* Modal de subida de audio */}
      <AudioUploadModal
        songs={songsList}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
