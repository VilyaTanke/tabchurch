"use client";

import { useState, useActionState, useEffect } from "react";
import {
  Church,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Users,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { createChurch, updateChurch, deleteChurch, type FormState } from "@/app/actions";
import type { AdminChurch } from "@/components/UserRow";

export type ChurchWithCount = AdminChurch & {
  address?: string | null;
  userCount: number;
};

export default function ChurchManager({
  churches,
}: {
  churches: ChurchWithCount[];
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingChurch, setEditingChurch] = useState<ChurchWithCount | null>(null);
  const [deletingChurch, setDeletingChurch] = useState<ChurchWithCount | null>(null);

  const [createState, createAction, createPending] = useActionState(createChurch, undefined);
  const [updateState, updateAction, updatePending] = useActionState(updateChurch, undefined);

  useEffect(() => {
    if (createState?.ok) {
      const timer = setTimeout(() => {
        setIsCreateOpen(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [createState]);

  useEffect(() => {
    if (updateState?.ok) {
      const timer = setTimeout(() => {
        setEditingChurch(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [updateState]);

  return (
    <div className="stack" style={{ gap: "1rem" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
            <Church size={20} style={{ color: "var(--accent)" }} />
            <span>Iglesias ({churches.length})</span>
          </h2>
          <p className="muted" style={{ fontSize: "0.85rem", margin: "0.2rem 0 0" }}>
            Crea y administra las iglesias para organizar a los usuarios y sus agrupaciones.
          </p>
        </div>

        <button
          type="button"
          className="btn gold small"
          onClick={() => setIsCreateOpen(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Plus size={15} />
          <span>Nueva Iglesia</span>
        </button>
      </div>

      {/* Grid de iglesias existentes */}
      {churches.length === 0 ? (
        <div
          className="card stack"
          style={{
            alignItems: "center",
            textAlign: "center",
            padding: "2rem 1rem",
            background: "rgba(223, 186, 115, 0.04)",
            border: "1px dashed rgba(212, 175, 55, 0.3)",
          }}
        >
          <Church size={38} style={{ color: "var(--muted)", opacity: 0.5 }} />
          <p className="muted" style={{ margin: "0.25rem 0 0.75rem", fontSize: "0.95rem" }}>
            Aún no se ha registrado ninguna iglesia.
          </p>
          <button
            type="button"
            className="btn small"
            onClick={() => setIsCreateOpen(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={14} />
            <span>Crear la primera iglesia</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.85rem",
          }}
        >
          {churches.map((c) => (
            <div
              key={c.id}
              className="card stack"
              style={{
                padding: "1rem 1.15rem",
                gap: "0.65rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                transition: "border-color 0.2s, transform 0.2s",
              }}
            >
              <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "nowrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "rgba(223, 186, 115, 0.15)",
                        color: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Church size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <strong
                        style={{
                          fontSize: "1.05rem",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={c.name}
                      >
                        {c.name}
                      </strong>
                      {c.city && (
                        <span
                          className="muted"
                          style={{
                            fontSize: "0.8rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <MapPin size={11} />
                          <span>{c.city}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row" style={{ gap: "0.3rem", flexShrink: 0 }}>
                  <button
                    type="button"
                    className="btn ghost small"
                    onClick={() => setEditingChurch(c)}
                    title="Editar iglesia"
                    style={{ padding: "0.25rem 0.45rem" }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    className="btn danger small"
                    onClick={() => setDeletingChurch(c)}
                    title="Eliminar iglesia"
                    style={{ padding: "0.25rem 0.45rem" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {c.notes && (
                <p className="muted" style={{ fontSize: "0.82rem", margin: 0, fontStyle: "italic" }}>
                  {c.notes}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.45rem",
                  borderTop: "1px dashed var(--border)",
                  fontSize: "0.82rem",
                }}
              >
                <span
                  className="badge"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    background: c.userCount > 0 ? "rgba(223, 186, 115, 0.15)" : "var(--surface-2)",
                    color: c.userCount > 0 ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <Users size={12} />
                  <span>
                    {c.userCount} {c.userCount === 1 ? "usuario asignado" : "usuarios asignados"}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR IGLESIA */}
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div
            className="modal-box card stack"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px", width: "95%", padding: "1.5rem" }}
          >
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="row" style={{ gap: "0.5rem" }}>
                <Church size={20} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: "1.15rem" }}>Registrar Nueva Iglesia</h3>
              </div>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => setIsCreateOpen(false)}
                style={{ padding: "0.2rem 0.5rem" }}
              >
                <X size={16} />
              </button>
            </div>

            <form action={createAction} className="stack" style={{ gap: "0.85rem", marginTop: "0.5rem" }}>
              <div className="field">
                <label htmlFor="church-name">Nombre de la iglesia *</label>
                <input
                  id="church-name"
                  name="name"
                  required
                  placeholder="Ej: Nueva Vida Central"
                  className="input"
                  autoFocus
                />
              </div>

              <div className="grid two" style={{ gap: "0.75rem" }}>
                <div className="field">
                  <label htmlFor="church-city">Ciudad / Sede</label>
                  <input
                    id="church-city"
                    name="city"
                    placeholder="Ej: Madrid"
                    className="input"
                  />
                </div>
                <div className="field">
                  <label htmlFor="church-address">Dirección (opcional)</label>
                  <input
                    id="church-address"
                    name="address"
                    placeholder="Ej: Av. de la Paz 12"
                    className="input"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="church-notes">Notas adicionales (opcional)</label>
                <textarea
                  id="church-notes"
                  name="notes"
                  rows={2}
                  placeholder="Información de contacto, pastor o detalles..."
                  className="input"
                  style={{ padding: "0.5rem 0.75rem" }}
                />
              </div>

              {createState?.error && (
                <div className="alert error" role="alert" style={{ margin: 0 }}>
                  {createState.error}
                </div>
              )}
              {createState?.ok && (
                <div className="alert ok" role="status" style={{ margin: 0 }}>
                  {createState.ok}
                </div>
              )}

              <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={createPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn gold"
                  disabled={createPending}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Check size={15} />
                  <span>{createPending ? "Guardando…" : "Crear Iglesia"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR IGLESIA */}
      {editingChurch && (
        <div className="modal-backdrop" onClick={() => setEditingChurch(null)}>
          <div
            className="modal-box card stack"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px", width: "95%", padding: "1.5rem" }}
          >
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="row" style={{ gap: "0.5rem" }}>
                <Pencil size={18} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: "1.15rem" }}>Editar Iglesia</h3>
              </div>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => setEditingChurch(null)}
                style={{ padding: "0.2rem 0.5rem" }}
              >
                <X size={16} />
              </button>
            </div>

            <form action={updateAction} className="stack" style={{ gap: "0.85rem", marginTop: "0.5rem" }}>
              <input type="hidden" name="id" value={editingChurch.id} />

              <div className="field">
                <label htmlFor="edit-church-name">Nombre de la iglesia *</label>
                <input
                  id="edit-church-name"
                  name="name"
                  required
                  defaultValue={editingChurch.name}
                  className="input"
                />
              </div>

              <div className="grid two" style={{ gap: "0.75rem" }}>
                <div className="field">
                  <label htmlFor="edit-church-city">Ciudad / Sede</label>
                  <input
                    id="edit-church-city"
                    name="city"
                    defaultValue={editingChurch.city ?? ""}
                    className="input"
                  />
                </div>
                <div className="field">
                  <label htmlFor="edit-church-address">Dirección</label>
                  <input
                    id="edit-church-address"
                    name="address"
                    defaultValue={editingChurch.address ?? ""}
                    className="input"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="edit-church-notes">Notas adicionales</label>
                <textarea
                  id="edit-church-notes"
                  name="notes"
                  rows={2}
                  defaultValue={editingChurch.notes ?? ""}
                  className="input"
                  style={{ padding: "0.5rem 0.75rem" }}
                />
              </div>

              {updateState?.error && (
                <div className="alert error" role="alert" style={{ margin: 0 }}>
                  {updateState.error}
                </div>
              )}
              {updateState?.ok && (
                <div className="alert ok" role="status" style={{ margin: 0 }}>
                  {updateState.ok}
                </div>
              )}

              <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setEditingChurch(null)}
                  disabled={updatePending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn gold"
                  disabled={updatePending}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Check size={15} />
                  <span>{updatePending ? "Guardando…" : "Actualizar Iglesia"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR IGLESIA */}
      {deletingChurch && (
        <div className="modal-backdrop" onClick={() => setDeletingChurch(null)}>
          <div
            className="modal-box card stack"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "440px", width: "95%", padding: "1.5rem" }}
          >
            <div className="row" style={{ gap: "0.75rem", alignItems: "center" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "var(--danger, #ef4444)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem" }}>¿Eliminar iglesia?</h3>
                <p className="muted" style={{ margin: "0.2rem 0 0", fontSize: "0.88rem" }}>
                  Estás a punto de eliminar <strong>«{deletingChurch.name}»</strong>.
                </p>
              </div>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: "0.5rem 0" }}>
              {deletingChurch.userCount > 0
                ? `Esta iglesia tiene ${deletingChurch.userCount} usuario(s) asignado(s). Al eliminarla, los usuarios no se borrarán, pero quedarán sin iglesia asignada.`
                : "Esta iglesia no tiene usuarios asignados actualmente."}
            </p>

            <form
              action={async (formData) => {
                await deleteChurch(formData);
                setDeletingChurch(null);
              }}
              className="row"
              style={{ justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}
            >
              <input type="hidden" name="id" value={deletingChurch.id} />
              <button
                type="button"
                className="btn ghost"
                onClick={() => setDeletingChurch(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn danger">
                Sí, eliminar iglesia
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
