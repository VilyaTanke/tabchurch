import { asc } from "drizzle-orm";
import { UserPlus } from "lucide-react";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { createUser } from "@/app/actions";
import ActionForm, { Field } from "@/components/ActionForm";
import UserRow from "@/components/UserRow";

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
          <UserRow key={u.id} user={u} currentUserId={me.id} />
        ))}
      </section>
    </div>
  );
}
