import { ShieldCheck, Pencil, User } from "lucide-react";

type Props = {
  role: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function RoleBadge({ role, size = "md", className = "" }: Props) {
  const iconSize = size === "lg" ? 15 : size === "sm" ? 10 : 12;

  if (role === "admin") {
    return (
      <span
        className={`role-badge role-admin ${size} ${className}`}
        title="Administrador"
        aria-label="Administrador"
      >
        <ShieldCheck size={iconSize} strokeWidth={2.4} />
      </span>
    );
  }

  if (role === "editor") {
    return (
      <span
        className={`role-badge role-editor ${size} ${className}`}
        title="Editor"
        aria-label="Editor"
      >
        <Pencil size={iconSize - 1} strokeWidth={2.4} />
      </span>
    );
  }

  return (
    <span
      className={`role-badge role-user ${size} ${className}`}
      title="Usuario"
      aria-label="Usuario"
    >
      <User size={iconSize - 1} strokeWidth={2.4} />
    </span>
  );
}
