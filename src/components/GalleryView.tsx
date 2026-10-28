"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  Music2,
  ListMusic,
  LayoutGrid,
  Play,
  Download,
  Trash2,
  Sliders,
  ExternalLink,
} from "lucide-react";
import TrackCard, { type GalleryTrackItem } from "@/components/TrackCard";
import AudioUploadModal from "@/components/AudioUploadModal";
import UnifiedAudioPlayer from "@/components/UnifiedAudioPlayer";
import { formatDuration, parseStemsList } from "@/lib/stems";
import { transposeKey } from "@/lib/chordpro";
import {
  getSharedAudioContext,
  ensureAudioContextResumed,
  loadAudioBuffer,
  SoundTouchChannel,
  renderTransposedMp3,
  clearAudioBufferCache,
} from "@/lib/audio-engine";

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
  const [viewMode, setViewMode] = useState<"playlist" | "grid">("playlist");

  // Estado del Reproductor Maestro Unificado
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [semitones, setSemitones] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");

  // Estado de guardado de tono en MP3
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Instancia única del canal de reproducción con SoundTouch
  const playerChannelRef = useRef<SoundTouchChannel | null>(null);
  const onEndedCallbackRef = useRef<() => void>(() => {});

  // Lista filtrada según búsqueda y stems
  const filtered = tracks.filter((t) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      t.title.toLowerCase().includes(term) ||
      (t.artist && t.artist.toLowerCase().includes(term));

    const matchesStems = !filterStemsOnly || t.stemsStatus === "done";
    return matchesSearch && matchesStems;
  });

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || null;
  const activeIndex = activeTrack ? filtered.findIndex((t) => t.id === activeTrack.id) : -1;
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < filtered.length - 1;

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      if (playerChannelRef.current) {
        playerChannelRef.current.destroy();
        playerChannelRef.current = null;
      }
    };
  }, []);

  // Coordinación con reproductores mini de Zamar
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ playerId: string; trackId: number }>;
      if (customEvent.detail?.playerId !== "gallery-master") {
        if (playerChannelRef.current && isPlaying) {
          playerChannelRef.current.isPlaying = false;
          setIsPlaying(false);
        }
      }
    };
    window.addEventListener("zamar-audio-play", handleGlobalPlay);
    return () => window.removeEventListener("zamar-audio-play", handleGlobalPlay);
  }, [isPlaying]);

  // Actualizar semitonos en tiempo real en el motor SoundTouch
  useEffect(() => {
    if (playerChannelRef.current) {
      playerChannelRef.current.setSemitones(semitones);
    }
  }, [semitones]);

  // Actualizar volumen y silencio en tiempo real
  useEffect(() => {
    if (playerChannelRef.current) {
      playerChannelRef.current.setVolume(volume);
      playerChannelRef.current.setMuted(isMuted);
    }
  }, [volume, isMuted]);

  // Loop de animación para actualizar el tiempo actual con suavidad
  useEffect(() => {
    let animId: number;
    const tick = () => {
      if (playerChannelRef.current && isPlaying) {
        setCurrentTime(playerChannelRef.current.getCurrentTime());
      }
      if (isPlaying) {
        animId = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) {
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Carga y reproducción de una pista seleccionada
  const playTrack = useCallback(
    async (trackToPlay: GalleryTrackItem, autoStart = true) => {
      try {
        setIsLoadingAudio(true);
        const ctx = getSharedAudioContext();
        await ensureAudioContextResumed(ctx);

        // Si ya había una pista cargada, la destruimos
        if (playerChannelRef.current) {
          playerChannelRef.current.destroy();
          playerChannelRef.current = null;
        }

        setActiveTrackId(trackToPlay.id);
        setSemitones(0);
        setCurrentTime(0);

        const buffer = await loadAudioBuffer(`/api/tracks/${trackToPlay.id}`, ctx);
        setDuration(buffer.duration);

        // Si la pista no tenía duración registrada en BD, persistirla silenciosamente
        if (!trackToPlay.durationSec && buffer.duration > 0) {
          const roundedDur = Math.round(buffer.duration * 10) / 10;
          setTracks((prev) =>
            prev.map((t) => (t.id === trackToPlay.id ? { ...t, durationSec: roundedDur } : t))
          );
          fetch(`/api/tracks/${trackToPlay.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ durationSec: roundedDur }),
          }).catch(() => {});
        }

        const ch = new SoundTouchChannel(ctx, buffer, ctx.destination);
        ch.setSemitones(0);
        ch.setVolume(volume);
        ch.setMuted(isMuted);

        ch.onEnded = () => {
          onEndedCallbackRef.current();
        };

        playerChannelRef.current = ch;
        setIsLoadingAudio(false);

        if (autoStart) {
          window.dispatchEvent(
            new CustomEvent("zamar-audio-play", {
              detail: { playerId: "gallery-master", trackId: trackToPlay.id },
            })
          );
          ch.isPlaying = true;
          setIsPlaying(true);
        } else {
          ch.isPlaying = false;
          setIsPlaying(false);
        }
      } catch (err) {
        console.error("Error al cargar pista de audio en reproductor maestro:", err);
        setIsLoadingAudio(false);
        setIsPlaying(false);
      }
    },
    [volume, isMuted]
  );

  // Mantener la referencia del callback de finalización siempre sincronizada con el estado más reciente
  useEffect(() => {
    onEndedCallbackRef.current = () => {
      if (repeatMode === "one") {
        if (playerChannelRef.current) {
          playerChannelRef.current.seek(0);
          playerChannelRef.current.isPlaying = true;
          setIsPlaying(true);
        }
        return;
      }

      if (activeIndex >= 0 && activeIndex < filtered.length - 1) {
        playTrack(filtered[activeIndex + 1], true);
      } else if (repeatMode === "all" && filtered.length > 0) {
        playTrack(filtered[0], true);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
  }, [repeatMode, activeIndex, filtered, playTrack]);

  // Alternar play/pause en la pista activa o cargar una nueva
  const handleTogglePlay = (trackId?: number) => {
    const targetId = trackId ?? activeTrackId;
    if (!targetId) {
      if (filtered.length > 0) {
        playTrack(filtered[0], true);
      }
      return;
    }

    if (targetId === activeTrackId && playerChannelRef.current) {
      if (isPlaying) {
        playerChannelRef.current.isPlaying = false;
        setIsPlaying(false);
      } else {
        playerChannelRef.current.isPlaying = true;
        setIsPlaying(true);
      }
    } else {
      const target = tracks.find((t) => t.id === targetId);
      if (target) {
        playTrack(target, true);
      }
    }
  };

  const handleSeek = (seconds: number) => {
    if (playerChannelRef.current) {
      playerChannelRef.current.seek(seconds);
    }
    setCurrentTime(seconds);
  };

  const handlePrev = () => {
    if (currentTime > 3 && playerChannelRef.current) {
      handleSeek(0);
      return;
    }
    if (activeIndex > 0) {
      playTrack(filtered[activeIndex - 1], isPlaying);
    } else if (filtered.length > 0) {
      playTrack(filtered[filtered.length - 1], isPlaying);
    }
  };

  const handleNext = () => {
    if (activeIndex >= 0 && activeIndex < filtered.length - 1) {
      playTrack(filtered[activeIndex + 1], isPlaying);
    } else if (filtered.length > 0) {
      playTrack(filtered[0], isPlaying);
    }
  };

  const handleToggleRepeat = () => {
    setRepeatMode((prev) => (prev === "none" ? "all" : prev === "all" ? "one" : "none"));
  };

  // Guardar el MP3 con la tonalidad modificada permanentemente en el servidor
  const handleSaveTransposedKey = async () => {
    if (!activeTrack || semitones === 0) return;
    if (!canManage) {
      alert("No tienes permisos para modificar este archivo (se requiere rol Editor o Admin).");
      return;
    }

    try {
      setIsSavingKey(true);
      setSaveProgress(5);

      const ctx = getSharedAudioContext();
      await ensureAudioContextResumed(ctx);

      // Obtener o cargar el buffer de audio de la pista activa
      let sourceBuffer = playerChannelRef.current?.buffer;
      if (!sourceBuffer) {
        sourceBuffer = await loadAudioBuffer(`/api/tracks/${activeTrack.id}`, ctx);
      }

      // Calcular el nuevo tono si la canción tiene tono registrado
      const baseKey = (activeTrack.musicalKey || activeTrack.song?.currentKey || activeTrack.song?.originalKey || "").trim();
      let newKey: string | null = null;
      if (baseKey) {
        newKey = transposeKey(baseKey, semitones) || `${baseKey} (${semitones > 0 ? `+${semitones}` : semitones})`;
      }

      // Renderizar el audio transpuesto offline mediante SoundTouch y LameJS
      const mp3Blob = await renderTransposedMp3(
        sourceBuffer,
        semitones,
        (pct) => setSaveProgress(pct)
      );

      const formData = new FormData();
      formData.append("file", mp3Blob, `${activeTrack.title}.mp3`);
      if (newKey) {
        formData.append("musicalKey", newKey);
      }

      const res = await fetch(`/api/tracks/${activeTrack.id}/transposed`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error || "No se pudo guardar el archivo MP3 modificado en el servidor.");
      }

      const updatedTrack: GalleryTrackItem = {
        ...activeTrack,
        musicalKey: newKey || activeTrack.musicalKey,
        sizeBytes: mp3Blob.size,
        stemsStatus: "none",
        stemsProgress: 0,
        stemsList: null,
        stemsError: null,
      };

      // Limpiar caché en memoria para que las próximas reproducciones/descargas tomen el nuevo archivo
      clearAudioBufferCache(`/api/tracks/${activeTrack.id}`);

      // Actualizar la lista local de canciones
      setTracks((prev) => prev.map((t) => (t.id === activeTrack.id ? updatedTrack : t)));

      // Restablecer semitonos a 0 porque ahora el MP3 base ya está grabado en el nuevo tono
      setSemitones(0);

      // Recargar buffer actualizado en el canal si el reproductor está activo
      if (playerChannelRef.current) {
        const wasPlaying = playerChannelRef.current.isPlaying;
        const currentPos = playerChannelRef.current.getCurrentTime();
        playerChannelRef.current.destroy();

        // Cargar el nuevo archivo directamente con cache-busting
        const freshBuffer = await loadAudioBuffer(`/api/tracks/${activeTrack.id}?t=${Date.now()}`, ctx);
        const ch = new SoundTouchChannel(ctx, freshBuffer, ctx.destination);
        ch.setSemitones(0);
        ch.setVolume(volume);
        ch.setMuted(isMuted);
        ch.seek(currentPos);
        ch.onEnded = () => onEndedCallbackRef.current();
        ch.isPlaying = wasPlaying;
        playerChannelRef.current = ch;
      }

      setSaveSuccessMsg(
        newKey
          ? `¡Tono guardado con éxito! El archivo MP3 ahora está en tono ${newKey}.`
          : "¡Tono modificado guardado con éxito en el archivo MP3!"
      );
      setTimeout(() => setSaveSuccessMsg(null), 4500);
    } catch (err: unknown) {
      console.error("Error al guardar tono modificado:", err);
      alert((err as Error)?.message || "Ocurrió un error al guardar el archivo MP3 modificado.");
    } finally {
      setIsSavingKey(false);
      setSaveProgress(0);
    }
  };

  const handleDeleteTrack = (id: number) => {
    if (activeTrackId === id) {
      if (playerChannelRef.current) {
        playerChannelRef.current.destroy();
        playerChannelRef.current = null;
      }
      setActiveTrackId(null);
      setIsPlaying(false);
    }
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  // Callback cuando se sube una nueva canción mediante el modal
  const handleTrackUploaded = (newTrack: GalleryTrackItem) => {
    setTracks((prev) => [newTrack, ...prev]);
    // Seleccionar y reproducir automáticamente la nueva canción en el reproductor unificado
    playTrack(newTrack, true);
  };

  return (
    <div className="stack zamar-page-container" style={{ paddingBottom: activeTrack ? "140px" : "2rem" }}>
      {/* Encabezado Principal */}
      <div className="zamar-header-row">
        <div>
          <h1 style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <SlidersHorizontal size={26} style={{ color: "var(--accent)" }} />
            <span>Zamar</span>
          </h1>
          <p className="muted" style={{ fontSize: "0.85rem", marginTop: "2px" }}>
            {tracks.length} {tracks.length === 1 ? "canción" : "canciones"} en la lista · Reproductor unificado con transpositor y guardado de MP3
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            className="btn gold zamar-add-btn"
            onClick={() => setIsModalOpen(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={16} />
            <span>Agregar Canción</span>
          </button>
        )}
      </div>

      {/* Buscador, Filtros y Selector de Vista */}
      <div className="zamar-controls-bar">
        <div className="zamar-search-box">
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

        <div className="zamar-filters-right">
          <button
            type="button"
            className={`btn small ${filterStemsOnly ? "" : "ghost"}`}
            onClick={() => setFilterStemsOnly(!filterStemsOnly)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Sparkles size={14} />
            <span>Solo con Stems</span>
          </button>

          {/* Selector de modo de vista: Lista vs Tarjetas */}
          <div className="view-mode-toggle" role="group" aria-label="Modo de visualización">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === "playlist" ? "active" : ""}`}
              onClick={() => setViewMode("playlist")}
              title="Vista de Lista de Reproducción"
            >
              <ListMusic size={16} />
              <span>Lista</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Vista de Tarjetas"
            >
              <LayoutGrid size={16} />
              <span>Tarjetas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Reproducción / Grid de Pistas */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
          <Music2 size={40} style={{ color: "var(--muted)", margin: "0 auto 0.75rem", opacity: 0.5 }} />
          <p className="muted" style={{ fontSize: "1rem" }}>
            {search || filterStemsOnly
              ? "No se encontraron canciones con los filtros seleccionados."
              : "Aún no hay canciones en la lista de reproducción."}
          </p>
          {canManage && !search && (
            <button
              type="button"
              className="btn gold small"
              onClick={() => setIsModalOpen(true)}
              style={{ marginTop: "1rem" }}
            >
              <Plus size={14} />
              <span>Cargar la primera canción</span>
            </button>
          )}
        </div>
      ) : viewMode === "playlist" ? (
        /* VISTA 1: Lista de Reproducción Interactiva */
        <div className="card playlist-table-wrapper" style={{ padding: "0.5rem" }}>
          <div className="playlist-table-header">
            <span className="col-num">#</span>
            <span className="col-title">Título y Artista</span>
            <span className="col-key">Tono</span>
            <span className="col-duration">Duración</span>
            <span className="col-stems">Stems</span>
            <span className="col-actions">Acciones</span>
          </div>

          <div className="playlist-items-list">
            {filtered.map((track, idx) => {
              const isCurrent = track.id === activeTrackId;
              const isCurrentPlaying = isCurrent && isPlaying;
              const baseKey = track.musicalKey || track.song?.currentKey || track.song?.originalKey;
              const stems = parseStemsList(track.stemsList);
              const hasStems = track.stemsStatus === "done" && stems.length > 0;

              return (
                <div
                  key={track.id}
                  className={`playlist-row ${isCurrent ? "active" : ""}`}
                  onClick={() => handleTogglePlay(track.id)}
                  title="Haz clic para reproducir en el reproductor principal"
                >
                  {/* Número o Botón Play/Pause */}
                  <div className="col-num">
                    <button
                      type="button"
                      className="playlist-play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlay(track.id);
                      }}
                    >
                      {isCurrentPlaying ? (
                        <div className="mini-equalizer">
                          <span className="mini-bar b1" />
                          <span className="mini-bar b2" />
                          <span className="mini-bar b3" />
                        </div>
                      ) : (
                        <>
                          <span className="track-index-num">{idx + 1}</span>
                          <Play size={13} className="track-hover-play" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Título, Artista y Canción vinculada */}
                  <div className="col-title">
                    <div className="playlist-title-line">
                      <strong className="playlist-track-title">{track.title}</strong>
                      {baseKey && (
                        <span className="badge playlist-badge-inline" style={{ background: "rgba(223, 186, 115, 0.15)", color: "var(--accent)" }}>
                          {baseKey}
                        </span>
                      )}
                    </div>
                    <div className="playlist-track-sub">
                      <span>{track.artist || "Sin artista"}</span>
                      {track.durationSec ? <span className="playlist-sub-duration">· {formatDuration(track.durationSec)}</span> : null}
                      {track.bpm ? <span className="hide-xs">· {track.bpm} BPM</span> : null}
                      {track.song && (
                        <Link
                          href={`/canciones/${track.song.id}`}
                          className="playlist-song-link"
                          onClick={(e) => e.stopPropagation()}
                          title="Ver letra y acordes"
                        >
                          <ExternalLink size={10} />
                          <span>Acordes</span>
                        </Link>
                      )}
                      {hasStems && (
                        <span className="badge playlist-stems-inline" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#059669" }}>
                          {stems.length} Stems
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tonalidad */}
                  <div className="col-key">
                    {baseKey ? (
                      <span className="badge" style={{ background: "rgba(223, 186, 115, 0.15)", color: "var(--accent)" }}>
                        {baseKey}
                      </span>
                    ) : (
                      <span className="muted">--</span>
                    )}
                  </div>

                  {/* Duración */}
                  <div className="col-duration">
                    <span className="time-text">{formatDuration(track.durationSec)}</span>
                  </div>

                  {/* Stems IA */}
                  <div className="col-stems" onClick={(e) => e.stopPropagation()}>
                    {hasStems ? (
                      <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#059669" }}>
                        {stems.length} Stems
                      </span>
                    ) : track.stemsStatus === "processing" || track.stemsStatus === "queued" ? (
                      <span className="badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#d97706" }}>
                        IA {track.stemsProgress}%
                      </span>
                    ) : (
                      <span className="muted" style={{ fontSize: "0.78rem" }}>
                        Audio original
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="col-actions" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/galeria/${track.id}/estudio`}
                      className="btn ghost small playlist-action-btn"
                      title="Abrir en Estudio Z (Stems)"
                    >
                      <Sliders size={14} />
                      <span className="hide-md">Estudio Z</span>
                    </Link>

                    <a
                      href={`/api/tracks/${track.id}?download=1`}
                      className="btn ghost small playlist-action-btn"
                      title="Descargar MP3"
                      download
                    >
                      <Download size={14} />
                    </a>

                    {canManage && (
                      <button
                        type="button"
                        className="btn danger small playlist-action-btn"
                        onClick={async () => {
                          if (!confirm(`¿Eliminar definitivamente "${track.title}"?`)) return;
                          try {
                            const res = await fetch(`/api/tracks/${track.id}`, { method: "DELETE" });
                            if (res.ok) handleDeleteTrack(track.id);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        title="Eliminar canción"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VISTA 2: Cuadrícula de Tarjetas */
        <div className="grid two" style={{ gap: "1rem" }}>
          {filtered.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isActive={track.id === activeTrackId}
              isPlaying={track.id === activeTrackId && isPlaying}
              onSelect={() => handleTogglePlay(track.id)}
              canManage={canManage}
              onDelete={handleDeleteTrack}
            />
          ))}
        </div>
      )}

      {/* Reproductor Maestro Unificado (Barra inferior permanente) */}
      <UnifiedAudioPlayer
        track={activeTrack}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        currentTime={currentTime}
        duration={duration}
        semitones={semitones}
        volume={volume}
        isMuted={isMuted}
        repeatMode={repeatMode}
        hasPrev={hasPrev}
        hasNext={hasNext}
        canManage={canManage}
        isSavingKey={isSavingKey}
        saveProgress={saveProgress}
        saveSuccessMsg={saveSuccessMsg}
        onTogglePlay={() => handleTogglePlay()}
        onSeek={handleSeek}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleRepeat={handleToggleRepeat}
        onChangeSemitones={setSemitones}
        onSaveKey={handleSaveTransposedKey}
        onChangeVolume={setVolume}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

      {/* Modal de subida de audio */}
      <AudioUploadModal
        songs={songsList}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTrackUploaded={handleTrackUploaded}
      />
    </div>
  );
}
