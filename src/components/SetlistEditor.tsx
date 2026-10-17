"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KEYS } from "@/lib/chordpro";
import {
  addSongToSetlist, removeSetlistItem, reorderSetlist, setItemKey,
} from "@/app/setlists-actions";

export type Item = {
  id: number; songId: number; title: string; artist: string | null;
  originalKey: string | null; keyOverride: string | null;
};
export type LibSong = { id: number; title: string; artist: string | null };

function Row({
  item, onRemove, onKey,
}: { item: Item; onRemove: () => void; onKey: (k: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <li
      ref={setNodeRef}
      className={`sl-row ${isDragging ? "dragging" : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button className="drag-handle" aria-label={`Mover ${item.title}`} {...attributes} {...listeners}>⠿</button>
      <div className="grow" style={{ minWidth: 0 }}>
        <strong className="ellipsis">{item.title}</strong>
        <div className="muted ellipsis" style={{ fontSize: "0.85rem" }}>{item.artist || "Sin artista"}</div>
      </div>
      <select
        className="input key-select"
        aria-label="Tono en esta lista"
        value={item.keyOverride ?? item.originalKey ?? ""}
        onChange={(e) => onKey(e.target.value)}
      >
        <option value="">—</option>
        {KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
      </select>
      <button className="btn danger small" onClick={onRemove} aria-label={`Quitar ${item.title}`}>✕</button>
    </li>
  );
}

export default function SetlistEditor({
  setlistId, initial, library,
}: { setlistId: number; initial: Item[]; library: LibSong[] }) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [, start] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const inList = useMemo(() => new Set(items.map((i) => i.songId)), [items]);
  const available = library.filter(
    (s) => !inList.has(s.id) && `${s.title} ${s.artist ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const next = arrayMove(items, items.findIndex((i) => i.id === active.id), items.findIndex((i) => i.id === over.id));
    setItems(next);
    start(() => reorderSetlist(setlistId, next.map((i) => i.id)));
  }

  return (
    <div className="grid two" style={{ alignItems: "start" }}>
      <section className="card stack">
        <h2>Orden del servicio ({items.length})</h2>
        {items.length === 0 && <p className="muted">Añade canciones desde la biblioteca →</p>}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <ol className="sl-list">
              {items.map((it) => (
                <Row
                  key={it.id}
                  item={it}
                  onRemove={() => {
                    setItems((l) => l.filter((x) => x.id !== it.id));
                    start(() => removeSetlistItem(setlistId, it.id));
                  }}
                  onKey={(k) => {
                    setItems((l) => l.map((x) => (x.id === it.id ? { ...x, keyOverride: k || null } : x)));
                    start(() => setItemKey(setlistId, it.id, k));
                  }}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      </section>

      <section className="card stack">
        <h2>Añadir canción</h2>
        <input className="input" placeholder="Filtrar…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filtrar canciones" />
        <ul className="sl-list">
          {available.length === 0 && <li className="muted">No hay más canciones{library.length === 0 ? " — crea una primero." : "."}</li>}
          {available.map((s) => (
            <li key={s.id} className="sl-row">
              <div className="grow" style={{ minWidth: 0 }}>
                <strong className="ellipsis">{s.title}</strong>
                <div className="muted ellipsis" style={{ fontSize: "0.85rem" }}>{s.artist || "Sin artista"}</div>
              </div>
              <button
                className="btn small"
                onClick={() => {
                  start(async () => {
                    const added = await addSongToSetlist(setlistId, s.id);
                    if (added)
                      setItems((l) => [
                        ...l,
                        { id: added.id, songId: s.id, title: s.title, artist: s.artist, originalKey: added.originalKey, keyOverride: null },
                      ]);
                  });
                }}
              >+ Añadir</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
