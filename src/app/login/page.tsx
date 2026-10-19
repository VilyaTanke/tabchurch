import Image from "next/image";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { login } from "@/app/actions";
import ActionForm, { Field } from "@/components/ActionForm";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Entrar · Tab-NuevaVida" };

export default async function LoginPage() {
  if (await getUser()) redirect("/");
  return (
    <main className="auth-wrap">
      <Reveal selector=".auth-card, .auth-card .field, .auth-card .btn">
      <section className="card auth-card stack">
        <div>
          <Image
            src="/logo.png"
            alt="Tab-NuevaVida"
            width={240}
            height={58}
            priority
            style={{
              width: "100%",
              maxWidth: "230px",
              height: "auto",
              display: "block",
              borderRadius: "8px",
              marginBottom: "1rem",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          />
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
