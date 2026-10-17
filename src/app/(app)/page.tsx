import { requireUser } from "@/lib/auth";

export default async function Home() {
  const user = await requireUser();
  return (
    <div className="stack">
      <div>
        <h1>Hola, {user.name} 👋</h1>
        <p className="muted">Tu espacio de cifrados y listas.</p>
      </div>
      <div className="grid two">
        <section className="card"><h2>Próximas listas</h2><p className="muted">Aún no hay listas (fase 3).</p></section>
        <section className="card"><h2>Tus grupos</h2><p className="muted">Aún no hay grupos (fase 4).</p></section>
      </div>
    </div>
  );
}
