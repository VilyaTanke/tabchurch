"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Check, Loader2, AlertCircle } from "lucide-react";
import { deleteMultipleSongs } from "@/app/songs-actions";

export interface SongItem {
  id: number;
  title: string;
  artist: string | null;
  originalKey: string | null;
  currentKey: string | null;
  tempo: number | null;
}

export interface SongLibraryManagerProps {
  songs: SongItem[];
  canManage: boolean;
  totalSongs: number;
  currentPage: number;
  totalPages: number;
  children?: ReactNode;
}

export default function SongLibraryManager({
  songs,
  canManage,
  totalSongs,
  currentPage,
  totalPages,
  children,
}: SongLibraryManagerProps) {
  const router = useRouter();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      // Salir del modo de selección
      setIsSelectionMode(false);
      setSelectedIds(new Set());
    } else {
      // Activar modo de selección
      setIsSelectionMode(true);
      setSelectedIds(new Set());
      setSuccessMsg("");
      setErrorMsg("");
    }
  };

  const toggleSelectSong = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === songs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(songs.map((s) => s.id)));
    }
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    if (count === 0) return;

    const message =
      count === 1
        ? "¿Estás seguro de que deseas eliminar la canción seleccionada? Esta acción es definitiva y no se puede deshacer."
        : `¿Estás seguro de que deseas eliminar las ${count} canciones seleccionadas? Esta acción es definitiva y no se puede deshacer.`;

    if (!window.confirm(message)) return;

    startTransition(async () => {
      setErrorMsg("");
      const res = await deleteMultipleSongs(Array.from(selectedIds));
      if (res.ok) {
        setSelectedIds(new Set());
        setIsSelectionMode(false);
        setSuccessMsg(
          res.count === 1
            ? "Canción eliminada correctamente."
            : `Se han eliminado ${res.count} canciones correctamente.`
        );
        setTimeout(() => setSuccessMsg(""), 3500);
        router.refresh();
      } else {
        setErrorMsg(res.error || "Ocurrió un error al eliminar las canciones.");
      }
    });
  };

  return (
    <div className="stack">
      {/* Cabecera principal */}
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div className="grow">
          <h1>Biblioteca de Canciones</h1>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            {totalSongs} {totalSongs === 1 ? "canción" : "canciones"} en total
            {totalPages > 1 ? ` · Página ${currentPage} de ${totalPages}` : ""}
          </p>
        </div>

        {canManage && (
          <div className="row" style={{ gap: "0.5rem", alignItems: "center" }}>
            {songs.length > 0 && (
              <button
                type="button"
                className={`btn small ${isSelectionMode ? "danger" : "ghost"}`}
                onClick={toggleSelectionMode}
                title={isSelectionMode ? "Salir del modo de selección" : "Seleccionar canciones para eliminar"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  borderColor: isSelectionMode ? undefined : "rgba(225, 29, 72, 0.4)",
                  color: isSelectionMode ? undefined : "var(--danger)",
                }}
              >
                <Trash2 size={15} />
                <span>{isSelectionMode ? "Cancelar selección" : "Eliminar"}</span>
              </button>
            )}

            <Link
              href="/canciones/nueva"
              className="btn small"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Plus size={16} />
              <span>Nueva</span>
            </Link>
          </div>
        )}
      </div>

      {/* Contenido secundario (Pestañas de vista y Buscador) */}
      {children}

      {/* Notificación de éxito */}
      {successMsg && (
        <div
          className="alert"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            color: "#059669",
            borderColor: "rgba(16, 185, 129, 0.35)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Notificación de error */}
      {errorMsg && (
        <div className="alert error" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Barra flotante/superior del modo de selección */}
      {isSelectionMode && (
        <div
          className="card row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(90deg, rgba(225, 29, 72, 0.1) 0%, rgba(225, 29, 72, 0.04) 100%)",
            borderColor: "rgba(225, 29, 72, 0.45)",
            padding: "0.75rem 1rem",
            borderRadius: "14px",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div className="row" style={{ gap: "0.85rem", alignItems: "center" }}>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.88rem",
              }}
            >
              <input
                type="checkbox"
                style={{ width: "18px", height: "18px", accentColor: "var(--danger)", cursor: "pointer" }}
                checked={songs.length > 0 && selectedIds.size === songs.length}
                onChange={toggleSelectAll}
              />
              <span>Seleccionar todas ({songs.length})</span>
            </label>

            {selectedIds.size > 0 && (
              <span
                className="badge"
                style={{
                  background: "rgba(225, 29, 72, 0.2)",
                  color: "var(--danger)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                }}
              >
                {selectedIds.size} {selectedIds.size === 1 ? "canción seleccionada" : "canciones seleccionadas"}
              </span>
            )}
          </div>

          <div className="row" style={{ gap: "0.5rem", alignItems: "center" }}>
            <button
              type="button"
              className="btn danger small"
              disabled={selectedIds.size === 0 || isPending}
              onClick={handleDeleteSelected}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              {isPending ? <Loader2 size={15} className="spin" /> : <Trash2 size={15} />}
              <span>
                {isPending ? "Eliminando…" : `Eliminar ${selectedIds.size > 0 ? `(${selectedIds.size})` : ""}`}
              </span>
            </button>
            <button
              type="button"
              className="btn ghost small"
              disabled={isPending}
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedIds(new Set());
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Grilla de Canciones */}
      {songs.length === 0 ? (
        <div className="card">
          <p className="muted">No hay canciones disponibles.</p>
        </div>
      ) : (
        <div className="grid two">
          {songs.map((s) => {
            const isSelected = selectedIds.has(s.id);

            // Modo Selección: Tarjeta interactiva con checkbox (sin navegación)
            if (isSelectionMode) {
              return (
                <div
                  key={s.id}
                  className={`card song-card song-card-selectable ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSelectSong(s.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggleSelectSong(s.id);
                    }
                  }}
                >
                  <div className="row" style={{ alignItems: "center", gap: "0.6rem" }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "var(--danger)",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      aria-label={`Seleccionar ${s.title}`}
                    />
                    <strong className="grow" style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.title}
                    </strong>
                    {(s.currentKey || s.originalKey) && (
                      <span className="badge admin" style={{ flexShrink: 0 }}>
                        {s.currentKey || s.originalKey}
                        {s.originalKey && s.currentKey && s.originalKey !== s.currentKey && (
                          <span style={{ opacity: 0.7, fontSize: "0.75em", marginLeft: "4px" }}>
                            (orig. {s.originalKey})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="muted" style={{ fontSize: "0.9rem", paddingLeft: "1.7rem" }}>
                    {s.artist || "Sin artista"}
                    {s.tempo ? ` · ${s.tempo} BPM` : ""}
                  </div>
                </div>
              );
            }

            // Modo Normal: Enlace a la vista de la canción
            return (
              <Link key={s.id} href={`/canciones/${s.id}`} className="card song-card">
                <div className="row">
                  <strong className="grow">{s.title}</strong>
                  {(s.currentKey || s.originalKey) && (
                    <span
                      className="badge admin"
                      title={
                        s.originalKey && s.currentKey && s.originalKey !== s.currentKey
                          ? `Tono original: ${s.originalKey}`
                          : undefined
                      }
                    >
                      {s.currentKey || s.originalKey}
                      {s.originalKey && s.currentKey && s.originalKey !== s.currentKey && (
                        <span style={{ opacity: 0.7, fontSize: "0.75em", marginLeft: "4px" }}>
                          (orig. {s.originalKey})
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="muted" style={{ fontSize: "0.9rem" }}>
                  {s.artist || "Sin artista"}
                  {s.tempo ? ` · ${s.tempo} BPM` : ""}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
