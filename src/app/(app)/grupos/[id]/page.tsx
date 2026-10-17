import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  getGroupDetails,
  getGroupMembers,
  getGroupSetlists,
  getUserGroupRole,
} from "@/lib/groups";
import {
  addMemberToGroup,
  createGroupSetlist,
  removeGroupMember,
  updateMemberRole,
} from "@/app/groups-actions";
import ActionForm, { Field } from "@/components/ActionForm";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const groupId = Number(id);

  const group = getGroupDetails(groupId);
  if (!group) notFound();

  const myRole = getUserGroupRole(user.id, groupId);
  const isGlobalAdmin = user.role === "admin";
  const isOwner = myRole === "owner" || isGlobalAdmin;
  const canEdit = isOwner || myRole === "editor";

  // Si no es miembro ni admin, no tiene acceso
  if (!myRole && !isGlobalAdmin) {
    notFound();
  }

  const members = getGroupMembers(groupId);
  const setlists = getGroupSetlists(groupId);

  const roleLabel: Record<string, string> = {
    owner: "Propietario",
    editor: "Editor",
    member: "Lector",
  };

  return (
    <div className="stack">
      <div>
        <Link href="/grupos" className="muted" style={{ fontSize: "0.9rem" }}>
          ← Volver a grupos
        </Link>
        <div className="row" style={{ marginTop: "0.4rem" }}>
          <h1 className="grow">{group.name}</h1>
          {myRole && (
            <span className={`badge ${isOwner ? "admin" : ""}`}>
              Tu rol: {roleLabel[myRole] || myRole}
            </span>
          )}
        </div>
      </div>

      <div className="grid two" style={{ alignItems: "start" }}>
        {/* Columna Izquierda: Listas Compartidas */}
        <section className="card stack">
          <div className="row">
            <h2 className="grow">Listas Compartidas ({setlists.length})</h2>
          </div>

          {canEdit && (
            <div style={{ padding: "0.75rem", background: "var(--surface-2)", borderRadius: "12px" }}>
              <strong style={{ fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>
                + Nueva lista en este grupo
              </strong>
              <ActionForm action={createGroupSetlist} submitLabel="Crear lista compartida" resetOnOk>
                <input type="hidden" name="groupId" value={groupId} />
                <div className="field">
                  <input
                    name="name"
                    className="input"
                    placeholder="Nombre (ej. Culto Domingo Mañana)"
                    required
                  />
                </div>
                <div className="field">
                  <input name="eventDate" type="date" className="input" />
                </div>
              </ActionForm>
            </div>
          )}

          {setlists.length === 0 ? (
            <p className="muted">No hay listas compartidas en este grupo aún.</p>
          ) : (
            <div className="stack" style={{ gap: "0.6rem" }}>
              {setlists.map((sl) => (
                <div key={sl.id} className="sl-row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <Link
                      href={`/listas/${sl.id}`}
                      style={{ fontWeight: 600, color: "var(--text)" }}
                    >
                      {sl.name}
                    </Link>
                    <div className="muted" style={{ fontSize: "0.8rem" }}>
                      Creado por {sl.ownerName}
                      {sl.eventDate ? ` · ${sl.eventDate}` : ""}
                    </div>
                  </div>
                  <div className="row">
                    <Link
                      href={`/listas/${sl.id}/escenario`}
                      className="btn small"
                      style={{
                        background: "linear-gradient(135deg, #10b981, #06b6d4)",
                        fontSize: "0.8rem",
                        padding: "0 0.8rem",
                      }}
                    >
                      🎤 Escenario
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Columna Derecha: Miembros del Grupo */}
        <section className="card stack">
          <h2>Miembros del Grupo ({members.length})</h2>

          {isOwner && (
            <div style={{ padding: "0.75rem", background: "var(--surface-2)", borderRadius: "12px" }}>
              <strong style={{ fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>
                + Agregar miembro por @usuario
              </strong>
              <ActionForm action={addMemberToGroup} submitLabel="Añadir al grupo" resetOnOk>
                <input type="hidden" name="groupId" value={groupId} />
                <div className="field">
                  <input
                    name="username"
                    className="input"
                    placeholder="Nombre de usuario (ej: ana)"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="role" style={{ fontSize: "0.8rem" }}>
                    Permiso en el grupo
                  </label>
                  <select id="role" name="role" className="input" defaultValue="member">
                    <option value="member">Lector (Solo ver y modo escenario)</option>
                    <option value="editor">Editor (Crear y editar listas)</option>
                  </select>
                </div>
              </ActionForm>
            </div>
          )}

          <div className="stack" style={{ gap: "0.5rem" }}>
            {members.map((m) => (
              <div key={m.userId} className="sl-row" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>{m.name}</strong> <span className="muted">@{m.username}</span>
                  <div style={{ marginTop: "2px" }}>
                    <span className={`badge ${m.role === "owner" ? "admin" : ""}`}>
                      {roleLabel[m.role] || m.role}
                    </span>
                  </div>
                </div>

                <div className="row">
                  {isOwner && m.userId !== user.id && m.role !== "owner" && (
                    <>
                      <form action={updateMemberRole}>
                        <input type="hidden" name="groupId" value={groupId} />
                        <input type="hidden" name="userId" value={m.userId} />
                        <select
                          name="role"
                          className="input"
                          style={{ minHeight: "34px", fontSize: "0.8rem", padding: "0 0.5rem" }}
                          defaultValue={m.role}
                          onChange={(e) => e.target.form?.requestSubmit()}
                        >
                          <option value="member">Lector</option>
                          <option value="editor">Editor</option>
                        </select>
                      </form>

                      <form action={removeGroupMember}>
                        <input type="hidden" name="groupId" value={groupId} />
                        <input type="hidden" name="userId" value={m.userId} />
                        <button className="btn danger small" title="Quitar del grupo">
                          ✕
                        </button>
                      </form>
                    </>
                  )}
                  {m.userId === user.id && m.role !== "owner" && (
                    <form action={removeGroupMember}>
                      <input type="hidden" name="groupId" value={groupId} />
                      <input type="hidden" name="userId" value={m.userId} />
                      <button className="btn ghost small">Salir del grupo</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
