import Link from "next/link";
import { asc, desc, eq, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { getUserGroups } from "@/lib/groups";

export default async function Home() {
  const user = await requireUser();
  const myGroups = getUserGroups(user.id);
  const groupIds = myGroups.map((g) => g.id);

  const setlists = db
    .select({
      id: schema.setlists.id,
      name: schema.setlists.name,
      eventDate: schema.setlists.eventDate,
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
    .limit(4)
    .all();

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1>Hola, {user.name} 👋</h1>
          <p className="muted">Panel principal de alabanza y acordes.</p>
        </div>
        <div className="row">
          <Link href="/canciones/nueva" className="btn small">
            + Nueva Canción
          </Link>
          <Link href="/listas" className="btn small ghost">
            + Nueva Lista
          </Link>
        </div>
      </div>

      <div className="grid two">
        <section className="card stack">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>Próximas listas</h2>
            <Link href="/listas" className="muted" style={{ fontSize: "0.85rem" }}>
              Ver todas →
            </Link>
          </div>
          {setlists.length === 0 ? (
            <p className="muted">Aún no tienes listas creadas o compartidas.</p>
          ) : (
            <div className="stack" style={{ gap: "0.5rem" }}>
              {setlists.map((sl) => (
                <div key={sl.id} className="sl-row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <Link href={`/listas/${sl.id}`} style={{ fontWeight: 600 }}>
                      {sl.name}
                    </Link>
                    <div className="muted" style={{ fontSize: "0.8rem" }}>
                      {sl.count} canciones
                      {sl.groupName ? ` · 👥 ${sl.groupName}` : " · Personal"}
                      {sl.eventDate ? ` · ${sl.eventDate}` : ""}
                    </div>
                  </div>
                  <Link
                    href={`/listas/${sl.id}/escenario`}
                    className="btn small"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #06b6d4)",
                      fontSize: "0.75rem",
                      padding: "0 0.6rem",
                    }}
                  >
                    🎤 Escenario
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card stack">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>Tus grupos ({myGroups.length})</h2>
            <Link href="/grupos" className="muted" style={{ fontSize: "0.85rem" }}>
              Gestionar →
            </Link>
          </div>
          {myGroups.length === 0 ? (
            <p className="muted">
              No perteneces a ningún grupo aún. Ve a la sección de Grupos para crear uno.
            </p>
          ) : (
            <div className="stack" style={{ gap: "0.5rem" }}>
              {myGroups.map((g) => (
                <Link key={g.id} href={`/grupos/${g.id}`} className="sl-row">
                  <div className="grow">
                    <strong>{g.name}</strong>
                    <div className="muted" style={{ fontSize: "0.8rem" }}>
                      Rol: {g.role === "owner" ? "Propietario" : g.role === "editor" ? "Editor" : "Lector"}
                    </div>
                  </div>
                  <span className="muted">›</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
