"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
  KeyRound,
  Shield,
  Sparkles,
  Church,
} from "lucide-react";
import { updateProfile } from "@/app/actions";
import { AVATAR_OPTIONS, getAvatarSrc } from "@/lib/avatars";
import RoleBadge from "@/components/RoleBadge";

interface ProfileAvatarPickerProps {
  initialUser: {
    id: number;
    name: string;
    username: string;
    email: string | null;
    role: string;
    avatar: string | null;
    churchName?: string | null;
  };
}

export default function ProfileAvatarPicker({ initialUser }: ProfileAvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    initialUser.avatar || AVATAR_OPTIONS[0].src
  );
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleAvatarSelect = (src: string) => {
    setSelectedAvatar(src);
  };

  return (
    <div className="profile-container stack" style={{ gap: "1.5rem" }}>
      <form action={formAction} className="profile-grid">
        {/* Hidden input with the chosen avatar */}
        <input type="hidden" name="avatar" value={selectedAvatar} />

        {/* Columna Izquierda: Selector de Avatar Estilo Referencia */}
        <section className="profile-card avatar-editor-card stack">
          <div className="avatar-editor-header">
            <div className="row" style={{ gap: "0.5rem" }}>
              <Sparkles size={18} style={{ color: "var(--accent)" }} />
              <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Foto de Perfil</h2>
            </div>
            <span className="badge" style={{ fontSize: "0.75rem" }}>
              8 Avatares 3D
            </span>
          </div>

          {/* Gran Vista Previa Circular */}
          <div className="avatar-preview-stage">
            <div className="avatar-preview-ring">
              <div
                className="avatar-preview-viewport"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <Image
                  src={getAvatarSrc(selectedAvatar)}
                  alt="Vista previa de avatar"
                  width={180}
                  height={180}
                  className="avatar-preview-img"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Controles de Zoom y Rotación */}
          <div className="avatar-controls-bar">
            <div className="avatar-control-zoom">
              <ZoomOut size={15} className="muted" />
              <input
                type="range"
                min="0.85"
                max="1.35"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                aria-label="Ajustar zoom de avatar"
                className="avatar-slider"
              />
              <ZoomIn size={15} className="muted" />
            </div>

            <button
              type="button"
              onClick={handleRotate}
              className="avatar-rotate-btn"
              title="Girar avatar"
            >
              <RotateCw size={14} />
              <span>Girar</span>
            </button>
          </div>

          <div className="avatar-divider">
            <span>o elige un avatar</span>
          </div>

          {/* Cuadrícula de Avatares (2 filas de 4) */}
          <div className="avatar-options-grid" role="radiogroup" aria-label="Selecciona un avatar">
            {AVATAR_OPTIONS.map((item) => {
              const isSelected = selectedAvatar === item.src || selectedAvatar === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleAvatarSelect(item.src)}
                  className={`avatar-choice-btn ${isSelected ? "selected" : ""}`}
                  aria-checked={isSelected}
                  role="radio"
                  title={item.name}
                >
                  <div className="avatar-choice-thumb">
                    <Image
                      src={item.src}
                      alt={item.name}
                      width={68}
                      height={68}
                      className="avatar-thumb-img"
                      unoptimized
                    />
                  </div>
                  {isSelected && (
                    <div className="avatar-selected-badge" aria-hidden>
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Columna Derecha: Datos de la Cuenta */}
        <section className="profile-card user-info-card stack">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Información de la Cuenta</h2>
            <RoleBadge role={initialUser.role} size="lg" />
          </div>

          {state?.error && (
            <div className="alert error" role="alert">
              {state.error}
            </div>
          )}
          {state?.ok && (
            <div className="alert ok" role="status">
              {state.ok}
            </div>
          )}

          <div className="field">
            <label htmlFor="name">Nombre Completo</label>
            <input
              id="name"
              name="name"
              defaultValue={initialUser.name}
              required
              className="input"
              placeholder="Tu nombre y apellidos"
            />
          </div>

          <div className="field">
            <label htmlFor="username">Nombre de Usuario (@)</label>
            <input
              id="username"
              value={`@${initialUser.username}`}
              disabled
              className="input disabled"
              readOnly
            />
            <span className="muted" style={{ fontSize: "0.78rem" }}>
              El nombre de usuario es tu identificador único de inicio de sesión.
            </span>
          </div>

          <div className="field">
            <label htmlFor="email">Correo Electrónico (opcional)</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={initialUser.email ?? ""}
              className="input"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className="field">
            <label>Rol en la Comunidad</label>
            <div
              className="input disabled"
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              <Shield size={16} className="muted" />
              <span>
                {initialUser.role === "admin"
                  ? "Administrador General"
                  : initialUser.role === "editor"
                  ? "Editor de Alabanzas"
                  : "Miembro / Lector"}
              </span>
            </div>
          </div>

          <div className="field">
            <label>Iglesia Asignada</label>
            <div
              className="input disabled"
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              <Church size={16} style={{ color: initialUser.churchName ? "var(--accent)" : "var(--muted)" }} />
              <span>{initialUser.churchName || "Sin iglesia asignada"}</span>
            </div>
          </div>

          <div style={{ paddingTop: "0.5rem" }} className="row">
            <button
              type="submit"
              className="btn"
              disabled={pending}
              style={{ flex: 1, display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
            >
              <Check size={16} />
              <span>{pending ? "Guardando cambios…" : "Guardar Perfil"}</span>
            </button>
          </div>

          <hr style={{ borderColor: "var(--border)", opacity: 0.6, margin: "0.5rem 0" }} />

          <div className="stack" style={{ gap: "0.6rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Seguridad y Contraseña</span>
            <Link
              href="/cambiar-clave"
              className="btn ghost small"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
              }}
            >
              <KeyRound size={14} />
              <span>Cambiar mi contraseña</span>
            </Link>
          </div>
        </section>
      </form>
    </div>
  );
}
