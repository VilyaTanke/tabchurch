"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Plus,
  FileText,
  Save,
  Check,
  Columns2,
  ListOrdered,
  Music,
} from "lucide-react";
import { KEYS } from "@/lib/chordpro";
import {
  addSongToSetlist,
  removeSetlistItem,
  reorderSetlist,
  setItemKey,
  updateSetlistItemConfig,
  saveAllSetlistItems,
} from "@/app/setlists-actions";
import ZamarMiniPlayer from "@/components/ZamarMiniPlayer";

export type ItemTrack = {
  id: number;
  title: string;
  durationSec: number | null;
};

export type Item = {
  id: number;
  songId: number;
  title: string;
  artist: string | null;
  originalKey: string | null;
  keyOverride: string | null;
  notes?: string | null;
  twoColumns?: boolean;
  audioTrack?: ItemTrack | null;
};
export type LibSong = { id: number; title: string; artist: string | null };

function Row({
  item,
  setlistId,
  onRemove,
  onKey,
  onNotes,
  onTwoColumns,
}: {
  item: Item;
  setlistId: number;
  onRemove: () => void;
  onKey: (k: string) => void;
  onNotes: (n: string) => void;
  onTwoColumns: (val: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const [showNotes, setShowNotes] = useState(Boolean(item.notes));
  const [saved, setSaved] = useState(false);
  const [isSaving, startSave] = useTransition();

  const handleSave = () => {
    startSave(async () => {
      await updateSetlistItemConfig(setlistId, item.id, {
        keyOverride: item.keyOverride,
        notes: item.notes,
        twoColumns: item.twoColumns,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <li
      ref={setNodeRef}
      className={`sl-row ${isDragging ? "dragging" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {/* Cabecera del ítem: Asa de arrastre + Título/Artista + Botón Eliminar */}
      <div className="sl-row-header">
        <button
          type="button"
          className="sl-drag-handle"
          aria-label={`Mover ${item.title}`}
          {...attributes}
          {...listeners}
          title="Arrastra para reordenar"
        >
          <GripVertical size={18} />
        </button>

        <div className="sl-row-info grow">
          <strong className="sl-row-title">{item.title}</strong>
          <div className="sl-row-artist">{item.artist || "Sin artista"}</div>
        </div>

        <button
          type="button"
          className="btn danger small sl-btn-remove"
          onClick={onRemove}
          aria-label={`Quitar ${item.title}`}
          title="Quitar canción de la lista"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Mini reproductor de Zamar si tiene pista MP3 vinculada */}
      {item.audioTrack && (
        <div className="sl-row-player">
          <ZamarMiniPlayer
            trackId={item.audioTrack.id}
            trackTitle={item.audioTrack.title}
            durationSec={item.audioTrack.durationSec}
            showStudioLink
            variant="inline"
          />
        </div>
      )}

      {/* Barra de configuración táctil y lectura */}
      <div className="sl-row-actions">
        <button
          type="button"
          className={`btn ghost small sl-action-btn ${showNotes || item.notes ? "active" : ""}`}
          onClick={() => setShowNotes((s) => !s)}
          title="Notas e indicaciones para la canción"
        >
          <FileText size={15} />
          <span>{item.notes ? "Nota" : "+Nota"}</span>
        </button>

        <div className="sl-key-wrapper">
          <span className="sl-key-label">Tono:</span>
          <select
            className="key-select"
            aria-label="Tono en esta lista"
            value={item.keyOverride ?? item.originalKey ?? ""}
            onChange={(e) => onKey(e.target.value)}
          >
            <option value="">—</option>
            {KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`btn ghost small sl-action-btn ${item.twoColumns ? "active" : ""}`}
          onClick={() => onTwoColumns(!item.twoColumns)}
          title={
            item.twoColumns
              ? "Modo escenario: 2 columnas (click para 1 col)"
              : "Modo escenario: 1 columna (click para 2 cols)"
          }
        >
          <Columns2 size={15} />
          <span>{item.twoColumns ? "2 Cols" : "1 Col"}</span>
        </button>

        <button
          type="button"
          className="btn ghost small sl-action-btn"
          onClick={handleSave}
          disabled={isSaving}
          title="Guardar configuración de esta canción"
          style={{
            color: saved ? "#10b981" : undefined,
            borderColor: saved ? "#10b981" : undefined,
          }}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          <span>{saved ? "Listo" : "Guardar"}</span>
        </button>
      </div>

      {showNotes && (
        <div className="sl-row-notes">
          <input
            type="text"
            className="sl-notes-input"
            placeholder="Indicaciones para esta canción (ej: Intro solo piano, Bajar en coro 2...)"
            value={item.notes ?? ""}
            onChange={(e) => onNotes(e.target.value)}
            aria-label={`Indicaciones para ${item.title}`}
          />
        </div>
      )}
    </li>
  );
}

export default function SetlistEditor({
  setlistId,
  initial,
  library,
  tracksBySongId,
}: {
  setlistId: number;
  initial: Item[];
  library: LibSong[];
  tracksBySongId?: Record<number, ItemTrack>;
}) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState<"order" | "add">("order");
  const [, start] = useTransition();
  const [isSavingAll, startSaveAll] = useTransition();
  const [allSaved, setAllSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const inList = useMemo(() => new Set(items.map((i) => i.songId)), [items]);
  const available = library.filter(
    (s) =>
      !inList.has(s.id) &&
      `${s.title} ${s.artist ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const next = arrayMove(
      items,
      items.findIndex((i) => i.id === active.id),
      items.findIndex((i) => i.id === over.id)
    );
    setItems(next);
    start(() => reorderSetlist(setlistId, next.map((i) => i.id)));
  }

  const handleSaveAll = () => {
    startSaveAll(async () => {
      await saveAllSetlistItems(
        setlistId,
        items.map((it) => ({
          id: it.id,
          keyOverride: it.keyOverride,
          notes: it.notes,
          twoColumns: it.twoColumns,
        }))
      );
      setAllSaved(true);
      setTimeout(() => setAllSaved(false), 2500);
    });
  };

  return (
    <div className="stack">
      {/* Selector segmentado para Tablet portrait y Móvil */}
      <div className="sl-segmented-tabs" role="tablist" aria-label="Secciones del editor">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "order"}
          className={`sl-tab-btn ${activeTab === "order" ? "active" : ""}`}
          onClick={() => setActiveTab("order")}
        >
          <ListOrdered size={16} />
          <span>Orden del servicio ({items.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "add"}
          className={`sl-tab-btn ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          <Music size={16} />
          <span>Añadir canciones ({available.length})</span>
        </button>
      </div>

      <div className="sl-editor-grid">
        {/* Columna: Orden del Servicio */}
        <section
          className={`card stack sl-col-order ${activeTab === "order" ? "active-tab" : ""}`}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <h2>Orden del servicio ({items.length})</h2>
            {items.length > 0 && (
              <button
                type="button"
                className="btn small"
                onClick={handleSaveAll}
                disabled={isSavingAll}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: allSaved ? "#10b981" : undefined,
                  borderColor: allSaved ? "#10b981" : undefined,
                }}
                title="Guardar todas las configuraciones de las canciones"
              >
                {allSaved ? <Check size={14} /> : <Save size={14} />}
                <span>{allSaved ? "Todo guardado" : "Guardar todo"}</span>
              </button>
            )}
          </div>

          {items.length === 0 && (
            <p className="muted">
              Aún no has añadido canciones a esta lista. Añade canciones desde la biblioteca.
            </p>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <ol className="sl-list">
                {items.map((it) => (
                  <Row
                    key={it.id}
                    item={it}
                    setlistId={setlistId}
                    onRemove={() => {
                      setItems((l) => l.filter((x) => x.id !== it.id));
                      start(() => removeSetlistItem(setlistId, it.id));
                    }}
                    onKey={(k) => {
                      setItems((l) =>
                        l.map((x) => (x.id === it.id ? { ...x, keyOverride: k || null } : x))
                      );
                      start(() => setItemKey(setlistId, it.id, k));
                    }}
                    onNotes={(n) => {
                      setItems((l) => l.map((x) => (x.id === it.id ? { ...x, notes: n } : x)));
                    }}
                    onTwoColumns={(val) => {
                      setItems((l) => l.map((x) => (x.id === it.id ? { ...x, twoColumns: val } : x)));
                    }}
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
        </section>

        {/* Columna: Biblioteca para Añadir Canciones */}
        <section
          className={`card stack sl-col-add ${activeTab === "add" ? "active-tab" : ""}`}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Añadir canción</h2>
            <span className="muted" style={{ fontSize: "0.85rem" }}>
              {available.length} disponibles
            </span>
          </div>

          <input
            className="input"
            placeholder="Buscar por título o artista…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Filtrar canciones"
          />

          <ul className="sl-list">
            {available.length === 0 && (
              <li className="muted">
                No hay más canciones{library.length === 0 ? " — crea una primero." : "."}
              </li>
            )}
            {available.map((s) => (
              <li key={s.id} className="sl-library-row">
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="row" style={{ gap: "0.45rem", alignItems: "center" }}>
                    <strong className="sl-row-title">{s.title}</strong>
                    {tracksBySongId?.[s.id] && (
                      <span
                        className="badge"
                        style={{
                          fontSize: "0.7rem",
                          background: "rgba(223, 186, 115, 0.18)",
                          color: "var(--accent)",
                          padding: "0.1rem 0.4rem",
                        }}
                      >
                        MP3
                      </span>
                    )}
                  </div>
                  <div className="sl-row-artist">{s.artist || "Sin artista"}</div>
                </div>
                <button
                  type="button"
                  className="btn small sl-btn-add"
                  onClick={() => {
                    start(async () => {
                      const added = await addSongToSetlist(setlistId, s.id);
                      if (added) {
                        setItems((l) => [
                          ...l,
                          {
                            id: added.id,
                            songId: s.id,
                            title: s.title,
                            artist: s.artist,
                            originalKey: added.originalKey,
                            keyOverride: null,
                            audioTrack: tracksBySongId?.[s.id] || null,
                          },
                        ]);
                      }
                    });
                  }}
                  title={`Añadir ${s.title} al orden`}
                >
                  <Plus size={15} />
                  <span>Añadir</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
