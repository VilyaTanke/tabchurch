import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { changePassword, logout } from "@/app/actions";
import ActionForm, { Field } from "@/components/ActionForm";
import Reveal from "@/components/Reveal";
import RoleBadge from "@/components/RoleBadge";
import BrandLogo from "@/components/BrandLogo";
import CrystalParallaxBackground from "@/components/CrystalParallaxBackground";

export const metadata = { title: "Cambiar contraseña · Tab-NuevaVida" };

export default async function ChangePasswordPage() {
  const user = await requireUser();
  return (
    <main className="auth-wrap">
      <CrystalParallaxBackground />
      <Reveal selector=".auth-card, .auth-card .field, .auth-card .btn">
        <section className="card auth-card stack">
          <div>
            <BrandLogo className="auth-logo" />
            <h1 style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span>Hola, {user.name}</span>
              <RoleBadge role={user.role} />
            </h1>
            <p className="muted">
              {user.mustChangePw
                ? "Por seguridad, debes crear una contraseña nueva antes de continuar."
                : "Elige tu nueva contraseña."}
            </p>
          </div>
          <ActionForm action={changePassword} submitLabel="Guardar contraseña">
            <Field label="Nueva contraseña" name="password" type="password" autoComplete="new-password" />
            <Field label="Repite la contraseña" name="password2" type="password" autoComplete="new-password" />
          </ActionForm>

          <form action={logout} style={{ marginTop: "0.25rem" }}>
            <button
              type="submit"
              className="btn ghost"
              style={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
              }}
            >
              <ArrowLeft size={16} />
              <span>Volver al login</span>
            </button>
          </form>
        </section>
      </Reveal>
    </main>
  );
}
