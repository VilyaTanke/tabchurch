import { asc, eq } from "drizzle-orm";
import { UserPlus } from "lucide-react";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { createUser } from "@/app/actions";
import ActionForm, { Field } from "@/components/ActionForm";
import ChurchManager from "@/components/ChurchManager";
import UserOrganizationSection from "@/components/UserOrganizationSection";

export const metadata = { title: "Administración · Tab-NuevaVida" };

export default async function AdminPage() {
  const me = await requireAdmin();

  // Obtener todas las iglesias ordenadas alfabéticamente
  const allChurches = db
    .select()
    .from(schema.churches)
    .orderBy(asc(schema.churches.name))
    .all();

  // Obtener usuarios con el nombre de su iglesia vinculada
  const users = db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      username: schema.users.username,
      email: schema.users.email,
      role: schema.users.role,
      active: schema.users.active,
      avatar: schema.users.avatar,
      churchId: schema.users.churchId,
      churchName: schema.churches.name,
    })
    .from(schema.users)
    .leftJoin(schema.churches, eq(schema.users.churchId, schema.churches.id))
    .orderBy(asc(schema.users.name))
    .all();

  // Contar cuántos usuarios tiene cada iglesia
  const countMap: Record<number, number> = {};
  for (const u of users) {
    if (u.churchId) {
      countMap[u.churchId] = (countMap[u.churchId] || 0) + 1;
    }
  }

  const churchesWithCount = allChurches.map((c) => ({
    ...c,
    userCount: countMap[c.id] || 0,
  }));

  return (
    <div className="stack" style={{ gap: "1.75rem" }}>
      <div>
        <h1>Panel de administración</h1>
        <p className="muted">
          Crea y administra iglesias, organiza usuarios por sede y gestiona permisos del sistema.
        </p>
      </div>

      {/* 1. Gestión de Iglesias */}
      <section className="card stack" style={{ padding: "1.25rem" }}>
        <ChurchManager churches={churchesWithCount} />
      </section>

      {/* 2. Crear nuevo usuario */}
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
            <div className="field">
              <label htmlFor="role">Rol de usuario</label>
              <select id="role" name="role" className="input" defaultValue="user">
                <option value="user">Usuario (solo lectura)</option>
                <option value="editor">Editor (agregar y editar canciones)</option>
                <option value="admin">Administrador (control total)</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="new-user-church">Iglesia asignada</label>
              <select id="new-user-church" name="churchId" className="input" defaultValue="">
                <option value="">(Sin iglesia asignada)</option>
                {allChurches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.city ? `· ${c.city}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ActionForm>
      </section>

      {/* 3. Organización y filtrado de usuarios por iglesia */}
      <UserOrganizationSection
        users={users}
        churches={allChurches}
        currentUserId={me.id}
      />
    </div>
  );
}
