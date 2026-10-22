import { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import ProfileAvatarPicker from "@/components/ProfileAvatarPicker";

export const metadata: Metadata = {
  title: "Mi Perfil | Tab-NuevaVida",
  description: "Configura tu avatar de caricatura y los datos de tu cuenta.",
};

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="stack" style={{ gap: "1.25rem" }}>
      <div>
        <h1>Mi Perfil</h1>
        <p className="muted">
          Personaliza tu imagen con tu avatar 3D favorito y mantén tus datos actualizados.
        </p>
      </div>

      <ProfileAvatarPicker
        initialUser={{
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar ?? null,
        }}
      />
    </div>
  );
}
