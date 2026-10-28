import Link from "next/link";
import { desc, eq, or, sql } from "drizzle-orm";
import {
  Plus,
  ListPlus,
  ArrowRight,
  Users,
  Mic2,
  ChevronRight,
} from "lucide-react";
import { db, schema } from "@/db";
import { canManageSongs, requireUser } from "@/lib/auth";
import { getUserGroups } from "@/lib/groups";
import RoleBadge from "@/components/RoleBadge";
import UserAvatar from "@/components/UserAvatar";

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
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <Link href="/perfil" title="Editar foto de perfil" style={{ display: "inline-block", transition: "transform 0.2s ease" }} className="hover-scale">
            <UserAvatar src={user.avatar} name={user.name} size="lg" />
          </Link>
          <div>
            <h1 style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
              <span>Hola, {user.name}</span>
              <RoleBadge role={user.role} size="lg" />
            </h1>
            <p className="muted">Panel principal de alabanza y acordes.</p>
          </div>
        </div>
        <div className="row">
          {canManageSongs(user) && (
            <Link
              href="/canciones/nueva"
              className="btn small"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Plus size={15} />
              <span>Nueva Canción</span>
            </Link>
          )}
          <Link
            href="/listas"
            className="btn small ghost"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <ListPlus size={15} />
            <span>Nueva Lista</span>
          </Link>
        </div>
      </div>

      <div className="grid two">
        <section className="card stack">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>Próximas listas</h2>
            <Link
              href="/listas"
              className="muted"
              style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              <span>Ver todas</span>
              <ArrowRight size={13} />
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
                    <div className="muted" style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap" }}>
                      <span>{sl.count} canciones</span>
                      {sl.groupName ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                          · <Users size={12} /> {sl.groupName}
                        </span>
                      ) : (
                        <span>· Personal</span>
                      )}
                      {sl.eventDate ? <span>· {sl.eventDate}</span> : null}
                    </div>
                  </div>
                  <Link
                    href={`/listas/${sl.id}/escenario`}
                    className="btn small"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #06b6d4)",
                      fontSize: "0.75rem",
                      padding: "0 0.6rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <Mic2 size={13} />
                    <span>Escenario</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card stack">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>Tus grupos ({myGroups.length})</h2>
            <Link
              href="/grupos"
              className="muted"
              style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              <span>Gestionar</span>
              <ArrowRight size={13} />
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
                  <ChevronRight size={16} className="muted" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
