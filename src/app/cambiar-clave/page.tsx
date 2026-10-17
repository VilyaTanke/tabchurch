import { requireUser } from "@/lib/auth";
import { changePassword } from "@/app/actions";
import ActionForm, { Field } from "@/components/ActionForm";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Cambiar contraseña · TabChurch" };

export default async function ChangePasswordPage() {
  const user = await requireUser();
  return (
    <main className="auth-wrap">
      <Reveal selector=".auth-card, .auth-card .field, .auth-card .btn">
      <section className="card auth-card stack">
        <div>
          <span className="brand">TabChurch</span>
          <h1>Hola, {user.name}</h1>
          <p className="muted">
            {user.mustChangePw
              ? "Por seguridad, elige una contraseña nueva antes de continuar."
              : "Elige tu nueva contraseña."}
          </p>
        </div>
        <ActionForm action={changePassword} submitLabel="Guardar contraseña">
          <Field label="Nueva contraseña" name="password" type="password" autoComplete="new-password" />
          <Field label="Repite la contraseña" name="password2" type="password" autoComplete="new-password" />
        </ActionForm>
      </section>
      </Reveal>
    </main>
  );
}
