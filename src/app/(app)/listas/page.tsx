import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { createSetlist } from "@/app/setlists-actions";
import ActionForm, { Field } from "@/components/ActionForm";

export const metadata = { title: "Listas · TabChurch" };

export default async function SetlistsPage() {
  const user = await requireUser();
  const lists = db
    .select({
      id: schema.setlists.id,
      name: schema.setlists.name,
      eventDate: schema.setlists.eventDate,
      count: sql<number>`(select count(*) from setlist_items where setlist_id = ${schema.setlists.id})`,
    })
    .from(schema.setlists)
    .where(eq(schema.setlists.ownerId, user.id))
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
        </ActionForm>
      </section>

      {lists.length === 0 ? (
        <div className="card"><p className="muted">Aún no tienes listas.</p></div>
      ) : (
        <div className="grid two">
          {lists.map((l) => (
            <Link key={l.id} href={`/listas/${l.id}`} className="card song-card">
              <strong>{l.name}</strong>
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
