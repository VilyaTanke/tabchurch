"use client";

import { useActionState, useEffect, useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  UserX,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { resetPassword, toggleUserActive, updateUser } from "@/app/actions";

export type AdminUser = {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: string;
  active: boolean;
};

type Props = {
  user: AdminUser;
  currentUserId: number;
};

export default function UserRow({ user, currentUserId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateUser, undefined);
  const isSelf = user.id === currentUserId;

  useEffect(() => {
    if (state?.ok) {
      const timer = setTimeout(() => {
        setIsEditing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (isEditing) {
    return (
      <div className="user-row" style={{ padding: "0.75rem 0" }}>
        <form
          action={formAction}
          className="stack"
          key={`${user.id}-${user.name}-${user.username}-${user.email ?? ""}-${user.role}`}
          style={{
            width: "100%",
            background: "var(--surface-2)",
            padding: "1rem",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            gap: "0.85rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4
              style={{
                margin: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                fontSize: "0.95rem",
                color: "var(--text)",
              }}
            >
              <Pencil size={15} style={{ color: "var(--primary)" }} />
              <span>
                Editar usuario: <strong>{user.name}</strong>
              </span>
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn ghost small"
              style={{ padding: "0.25rem 0.5rem", minHeight: "auto" }}
              title="Cerrar edición"
            >
              <X size={16} />
            </button>
          </div>

          <input type="hidden" name="id" value={user.id} />

          <div className="grid two" style={{ gap: "0.75rem" }}>
            <div className="field">
              <label htmlFor={`edit-name-${user.id}`} style={{ fontSize: "0.85rem" }}>
                Nombre completo
              </label>
              <input
                id={`edit-name-${user.id}`}
                name="name"
                defaultValue={user.name}
                required
                className="input"
              />
            </div>

            <div className="field">
              <label htmlFor={`edit-username-${user.id}`} style={{ fontSize: "0.85rem" }}>
                Usuario (login)
              </label>
              <input
                id={`edit-username-${user.id}`}
                name="username"
                defaultValue={user.username}
                required
                autoComplete="off"
                className="input"
              />
            </div>

            <div className="field">
              <label htmlFor={`edit-email-${user.id}`} style={{ fontSize: "0.85rem" }}>
                Email (opcional)
              </label>
              <input
                id={`edit-email-${user.id}`}
                name="email"
                type="email"
                defaultValue={user.email ?? ""}
                className="input"
              />
            </div>

            <div className="field">
              <label htmlFor={`edit-role-${user.id}`} style={{ fontSize: "0.85rem" }}>
                Rol de usuario
              </label>
              {isSelf ? (
                <>
                  <input type="hidden" name="role" value="admin" />
                  <select
                    id={`edit-role-${user.id}`}
                    disabled
                    className="input"
                    defaultValue="admin"
                  >
                    <option value="admin">Administrador (tu cuenta activa)</option>
                  </select>
                </>
              ) : (
                <select
                  id={`edit-role-${user.id}`}
                  name="role"
                  className="input"
                  defaultValue={user.role}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              )}
            </div>
          </div>

          {state?.error && (
            <div className="alert error" role="alert" style={{ margin: 0 }}>
              {state.error}
            </div>
          )}
          {state?.ok && (
            <div className="alert ok" role="status" style={{ margin: 0 }}>
              {state.ok}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
              marginTop: "0.25rem",
            }}
          >
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn ghost small"
              disabled={pending}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            >
              <X size={14} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="btn small"
              disabled={pending}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            >
              <Check size={14} />
              <span>{pending ? "Guardando…" : "Guardar cambios"}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="user-row">
      <div>
        <strong>{user.name}</strong> <span className="muted">@{user.username}</span>{" "}
        {user.role === "admin" && (
          <span
            className="badge admin"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
          >
            <ShieldCheck size={12} />
            <span>admin</span>
          </span>
        )}{" "}
        {!user.active && <span className="badge off">desactivado</span>}
        {user.email && (
          <div className="muted" style={{ fontSize: "0.85rem" }}>
            {user.email}
          </div>
        )}
      </div>

      <div className="row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="btn ghost small"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <Pencil size={13} />
          <span>Editar</span>
        </button>

        <form action={resetPassword} className="row" style={{ gap: "0.35rem" }}>
          <input type="hidden" name="id" value={user.id} />
          <input
            name="password"
            className="input"
            style={{ width: 140, minHeight: 38 }}
            placeholder="Nueva clave"
            minLength={8}
            required
          />
          <button
            className="btn ghost small"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <KeyRound size={13} />
            <span>Restablecer</span>
          </button>
        </form>

        {user.id !== currentUserId && (
          <form action={toggleUserActive}>
            <input type="hidden" name="id" value={user.id} />
            <button
              className={`btn small ${user.active ? "danger" : "ghost"}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            >
              {user.active ? (
                <>
                  <UserX size={13} />
                  <span>Desactivar</span>
                </>
              ) : (
                <>
                  <UserCheck size={13} />
                  <span>Activar</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
