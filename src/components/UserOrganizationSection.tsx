"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Search,
  X,
  Church,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";
import UserRow, { type AdminUser, type AdminChurch } from "@/components/UserRow";

type Props = {
  users: AdminUser[];
  churches: AdminChurch[];
  currentUserId: number;
};

export default function UserOrganizationSection({
  users,
  churches,
  currentUserId,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedChurchId, setSelectedChurchId] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grouped">("grouped");

  // Conteo de usuarios por iglesia
  const churchCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: users.length,
      none: 0,
    };
    for (const c of churches) {
      counts[String(c.id)] = 0;
    }
    for (const u of users) {
      if (u.churchId) {
        counts[String(u.churchId)] = (counts[String(u.churchId)] || 0) + 1;
      } else {
        counts.none += 1;
      }
    }
    return counts;
  }, [users, churches]);

  // Filtrado de usuarios
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      // Filtro por texto
      if (q) {
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesUsername = u.username.toLowerCase().includes(q);
        const matchesEmail = u.email ? u.email.toLowerCase().includes(q) : false;
        const matchesChurch = u.churchName ? u.churchName.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesUsername && !matchesEmail && !matchesChurch) {
          return false;
        }
      }

      // Filtro por iglesia
      if (selectedChurchId === "all") return true;
      if (selectedChurchId === "none") return !u.churchId;
      return String(u.churchId) === selectedChurchId;
    });
  }, [users, search, selectedChurchId]);

  // Agrupación por iglesia para el modo "grouped"
  const groupedData = useMemo(() => {
    const groups: {
      id: string;
      name: string;
      city?: string | null;
      users: AdminUser[];
    }[] = [];

    // Si hay un filtro específico seleccionado, solo mostramos ese grupo
    const relevantChurches =
      selectedChurchId === "all"
        ? churches
        : selectedChurchId === "none"
        ? []
        : churches.filter((c) => String(c.id) === selectedChurchId);

    // Grupos de iglesias
    for (const c of relevantChurches) {
      const churchUsers = filteredUsers.filter((u) => u.churchId === c.id);
      if (churchUsers.length > 0 || (search === "" && selectedChurchId !== "all")) {
        groups.push({
          id: String(c.id),
          name: c.name,
          city: c.city,
          users: churchUsers,
        });
      }
    }

    // Grupo de usuarios sin iglesia
    if (selectedChurchId === "all" || selectedChurchId === "none") {
      const unassigned = filteredUsers.filter((u) => !u.churchId);
      if (unassigned.length > 0 || selectedChurchId === "none") {
        groups.push({
          id: "none",
          name: "Sin iglesia asignada",
          city: null,
          users: unassigned,
        });
      }
    }

    return groups;
  }, [filteredUsers, churches, selectedChurchId, search]);

  return (
    <div className="stack" style={{ gap: "1rem" }}>
      {/* Controles de filtro, búsqueda y vista */}
      <div className="card stack" style={{ padding: "1rem 1.25rem", gap: "0.85rem" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
            <Users size={20} style={{ color: "var(--accent)" }} />
            <span>Organización de Usuarios ({users.length})</span>
          </h2>

          {/* Selector de modo de vista: Agrupado vs Lista continua */}
          <div className="view-mode-toggle" role="group" aria-label="Modo de organización">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === "grouped" ? "active" : ""}`}
              onClick={() => setViewMode("grouped")}
              title="Organizar y agrupar por Iglesia"
            >
              <LayoutGrid size={15} />
              <span className="hide-sm">Por Iglesia</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="Ver lista continua"
            >
              <List size={15} />
              <span className="hide-sm">Lista general</span>
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            className="input"
            placeholder="Buscar usuario por nombre, @login, email o iglesia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.4rem" }}
          />
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.9rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Chips de filtro rápido por iglesia */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            overflowX: "auto",
            paddingBottom: "0.25rem",
          }}
        >
          <span className="muted" style={{ fontSize: "0.78rem", whiteSpace: "nowrap", marginRight: "0.2rem" }}>
            <Filter size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Filtrar:
          </span>

          <button
            type="button"
            className={`chip ${selectedChurchId === "all" ? "active" : ""}`}
            onClick={() => setSelectedChurchId("all")}
            style={{
              cursor: "pointer",
              padding: "0.25rem 0.65rem",
              fontSize: "0.8rem",
              borderRadius: "999px",
              background: selectedChurchId === "all" ? "var(--accent)" : "var(--surface-2)",
              color: selectedChurchId === "all" ? "#0d0c0b" : "var(--text)",
              border: "1px solid var(--border)",
              fontWeight: selectedChurchId === "all" ? 600 : 400,
              whiteSpace: "nowrap",
            }}
          >
            Todas ({churchCounts.all || 0})
          </button>

          {churches.map((c) => {
            const isSelected = selectedChurchId === String(c.id);
            const count = churchCounts[String(c.id)] || 0;
            return (
              <button
                key={c.id}
                type="button"
                className={`chip ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedChurchId(isSelected ? "all" : String(c.id))}
                style={{
                  cursor: "pointer",
                  padding: "0.25rem 0.65rem",
                  fontSize: "0.8rem",
                  borderRadius: "999px",
                  background: isSelected ? "var(--accent)" : "var(--surface-2)",
                  color: isSelected ? "#0d0c0b" : "var(--text)",
                  border: "1px solid var(--border)",
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <Church size={12} />
                <span>
                  {c.name} ({count})
                </span>
              </button>
            );
          })}

          <button
            type="button"
            className={`chip ${selectedChurchId === "none" ? "active" : ""}`}
            onClick={() => setSelectedChurchId(selectedChurchId === "none" ? "all" : "none")}
            style={{
              cursor: "pointer",
              padding: "0.25rem 0.65rem",
              fontSize: "0.8rem",
              borderRadius: "999px",
              background: selectedChurchId === "none" ? "var(--accent)" : "var(--surface-2)",
              color: selectedChurchId === "none" ? "#0d0c0b" : "var(--muted)",
              border: "1px solid var(--border)",
              fontWeight: selectedChurchId === "none" ? 600 : 400,
              whiteSpace: "nowrap",
            }}
          >
            Sin asignar ({churchCounts.none || 0})
          </button>
        </div>
      </div>

      {/* Resultados filtrados */}
      {filteredUsers.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
          <Users size={36} style={{ color: "var(--muted)", opacity: 0.5, margin: "0 auto 0.5rem" }} />
          <p className="muted" style={{ fontSize: "0.95rem" }}>
            No se encontraron usuarios con los criterios de búsqueda o filtro seleccionados.
          </p>
        </div>
      ) : viewMode === "grouped" ? (
        /* VISTA 1: Agrupada por Iglesia */
        <div className="stack" style={{ gap: "1.25rem" }}>
          {groupedData.map((group) => (
            <section
              key={group.id}
              className="card stack"
              style={{
                padding: "1.15rem",
                gap: "0.75rem",
                borderLeft: group.id === "none" ? "3px solid var(--muted)" : "3px solid var(--accent)",
              }}
            >
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <Church
                    size={18}
                    style={{ color: group.id === "none" ? "var(--muted)" : "var(--accent)" }}
                  />
                  <h3 style={{ margin: 0, fontSize: "1.05rem" }}>
                    {group.name} {group.city ? <span className="muted" style={{ fontSize: "0.85rem", fontWeight: 400 }}>· {group.city}</span> : null}
                  </h3>
                </div>
                <span
                  className="badge"
                  style={{
                    background: group.users.length > 0 ? "rgba(223, 186, 115, 0.15)" : "var(--surface-2)",
                    color: group.users.length > 0 ? "var(--accent)" : "var(--muted)",
                    fontSize: "0.8rem",
                  }}
                >
                  {group.users.length} {group.users.length === 1 ? "usuario" : "usuarios"}
                </span>
              </div>

              {group.users.length === 0 ? (
                <p className="muted" style={{ fontSize: "0.85rem", margin: "0.5rem 0", fontStyle: "italic" }}>
                  No hay usuarios asignados a esta iglesia en este momento.
                </p>
              ) : (
                group.users.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    currentUserId={currentUserId}
                    churches={churches}
                  />
                ))
              )}
            </section>
          ))}
        </div>
      ) : (
        /* VISTA 2: Lista general continua */
        <section className="card stack" style={{ padding: "1.15rem", gap: "0.5rem" }}>
          {filteredUsers.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              currentUserId={currentUserId}
              churches={churches}
            />
          ))}
        </section>
      )}
    </div>
  );
}
