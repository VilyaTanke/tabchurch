import { asc } from "drizzle-orm";
import { ShieldCheck, UserPlus, KeyRound, UserCheck, UserX } from "lucide-react";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { createUser, resetPassword, toggleUserActive } from "@/app/actions";
import ActionForm, { Field } from "@/components/ActionForm";

export const metadata = { title: "Administración · TabChurch" };

export default async function AdminPage() {
  const me = await requireAdmin();
  const users = db.select().from(schema.users).orderBy(asc(schema.users.name)).all();
  return (
    <div className="stack">
      <div>
        <h1>Panel de administración</h1>
        <p className="muted">Crea y gestiona las cuentas de usuario.</p>
      </div>

      <section className="card stack">
        <h2 style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
          <UserPlus size={18} />
          <span>Nuevo usuario</span>
        </h2>
        <ActionForm action={createUser} submitLabel="Crear usuario" resetOnOk>
          <div className="grid two">
            <Field label="Nombre completo" name="name" />
            <Field label="Usuario (login)" name="username" autoComplete="off" />
            <Field label="Email (opcional)" name="email" type="email" required={false} />
            <Field label="Contraseña temporal" name="password" type="text" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="role">Rol</label>
            <select id="role" name="role" className="input" defaultValue="user">
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </ActionForm>
      </section>

      <section className="card">
        <h2>Usuarios ({users.length})</h2>
        {users.map((u) => (
          <div key={u.id} className="user-row">
            <div>
              <strong>{u.name}</strong> <span className="muted">@{u.username}</span>{" "}
              {u.role === "admin" && (
                <span
                  className="badge admin"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                >
                  <ShieldCheck size={12} />
                  <span>admin</span>
                </span>
              )}{" "}
              {!u.active && <span className="badge off">desactivado</span>}
              {u.email && <div className="muted" style={{ fontSize: "0.85rem" }}>{u.email}</div>}
            </div>
            <div className="row">
              <form action={resetPassword} className="row">
                <input type="hidden" name="id" value={u.id} />
                <input name="password" className="input" style={{ width: 150, minHeight: 38 }}
                  placeholder="Nueva clave" minLength={8} required />
                <button
                  className="btn ghost small"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                >
                  <KeyRound size={13} />
                  <span>Restablecer</span>
                </button>
              </form>
              {u.id !== me.id && (
                <form action={toggleUserActive}>
                  <input type="hidden" name="id" value={u.id} />
                  <button
                    className={`btn small ${u.active ? "danger" : "ghost"}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    {u.active ? (
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
        ))}
      </section>
    </div>
  );
}
