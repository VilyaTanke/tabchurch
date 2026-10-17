import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { login } from "@/app/actions";
import ActionForm, { Field } from "@/components/ActionForm";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Entrar · TabChurch" };

export default async function LoginPage() {
  if (await getUser()) redirect("/");
  return (
    <main className="auth-wrap">
      <Reveal selector=".auth-card, .auth-card .field, .auth-card .btn">
      <section className="card auth-card stack">
        <div>
          <span className="brand">TabChurch</span>
          <h1>Bienvenido</h1>
          <p className="muted">Entra con la cuenta que te dio tu administrador.</p>
        </div>
        <ActionForm action={login} submitLabel="Entrar">
          <Field label="Usuario" name="username" autoComplete="username" />
          <Field label="Contraseña" name="password" type="password" autoComplete="current-password" />
        </ActionForm>
      </section>
      </Reveal>
    </main>
  );
}
