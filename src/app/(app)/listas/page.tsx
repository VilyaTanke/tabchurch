import Link from "next/link";
import { desc, eq, or, sql } from "drizzle-orm";
import { Users } from "lucide-react";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { createSetlist } from "@/app/setlists-actions";
import { getUserGroups } from "@/lib/groups";
import ActionForm, { Field } from "@/components/ActionForm";

export const metadata = { title: "Listas · Tab-NuevaVida" };

export default async function SetlistsPage() {
  const user = await requireUser();
  const myGroups = getUserGroups(user.id);
  const groupIds = myGroups.map((g) => g.id);

  // Listas propias o de grupos a los que pertenezco
  const lists = db
    .select({
      id: schema.setlists.id,
      name: schema.setlists.name,
      eventDate: schema.setlists.eventDate,
      groupId: schema.setlists.groupId,
      groupName: schema.groups.name,
      count: sql<number>`(select count(*) from setlist_items where setlist_id = ${schema.setlists.id})`,
    })
    .from(schema.setlists)
    .leftJoin(schema.groups, eq(schema.groups.id, schema.setlists.groupId))
    .where(
      groupIds.length > 0
        ? or(
            eq(schema.setlists.ownerId, user.id),
            sql`${schema.setlists.groupId} IN (${sql.join(groupIds.map((id) => sql`${id}`), sql`, `)})`
          )
        : eq(schema.setlists.ownerId, user.id)
    )
    .orderBy(desc(schema.setlists.eventDate), desc(schema.setlists.id))
    .all();

  return (
    <div className="stack">
      <h1>Listas</h1>
      <section className="card stack">
        <h2>Nueva lista</h2>
        <ActionForm action={createSetlist} submitLabel="Crear lista">
          <div className="grid two">
            <Field label="Nombre (p. ej. Domingo mañana)" name="name" />
            <Field label="Fecha (opcional)" name="eventDate" type="date" required={false} />
          </div>
          {myGroups.length > 0 && (
            <div className="field">
              <label htmlFor="groupId">Asignar a un grupo (opcional)</label>
              <select id="groupId" name="groupId" className="input" defaultValue="">
                <option value="">Personal (solo tú)</option>
                {myGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    Grupo: {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </ActionForm>
      </section>

      {lists.length === 0 ? (
        <div className="card"><p className="muted">Aún no tienes listas.</p></div>
      ) : (
        <div className="grid two">
          {lists.map((l) => (
            <Link key={l.id} href={`/listas/${l.id}`} className="card song-card">
              <div className="row">
                <strong className="grow">{l.name}</strong>
                {l.groupName && (
                  <span
                    className="badge admin"
                    title="Lista de grupo"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                  >
                    <Users size={12} />
                    <span>{l.groupName}</span>
                  </span>
                )}
              </div>
              <span className="muted" style={{ fontSize: "0.9rem" }}>
                {l.count} {l.count === 1 ? "canción" : "canciones"}
                {l.eventDate ? ` · ${new Date(l.eventDate + "T00:00").toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" })}` : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
