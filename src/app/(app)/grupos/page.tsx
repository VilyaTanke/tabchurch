import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getUserGroups } from "@/lib/groups";
import { createGroup } from "@/app/groups-actions";
import ActionForm, { Field } from "@/components/ActionForm";

export const metadata = { title: "Grupos · Tab-NuevaVida" };

export default async function GroupsPage() {
  const user = await requireUser();
  const groups = getUserGroups(user.id);

  const roleLabel: Record<string, string> = {
    owner: "Propietario",
    editor: "Editor",
    member: "Miembro",
  };

  return (
    <div className="stack">
      <h1>Grupos y Equipos</h1>
      <p className="muted">
        Crea grupos con otros músicos para compartir listas de alabanza y sincronizar los servicios.
      </p>

      <section className="card stack">
        <h2>Crear nuevo grupo</h2>
        <ActionForm action={createGroup} submitLabel="Crear Grupo" resetOnOk>
          <Field
            label="Nombre del Grupo (ej. Alabanza Principal, Jóvenes, Banda Domingo)"
            name="name"
          />
        </ActionForm>
      </section>

      <h2>Tus Grupos ({groups.length})</h2>
      {groups.length === 0 ? (
        <div className="card">
          <p className="muted">
            Aún no formas parte de ningún grupo. Crea uno arriba o pide a un administrador/propietario que te agregue.
          </p>
        </div>
      ) : (
        <div className="grid two">
          {groups.map((g) => (
            <Link key={g.id} href={`/grupos/${g.id}`} className="card song-card">
              <div className="row">
                <strong className="grow" style={{ fontSize: "1.1rem" }}>
                  {g.name}
                </strong>
                <span className={`badge ${g.role === "owner" ? "admin" : ""}`}>
                  {roleLabel[g.role] || g.role}
                </span>
              </div>
              <span
                className="muted"
                style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
              >
                <span>Ver listas compartidas y miembros</span>
                <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
