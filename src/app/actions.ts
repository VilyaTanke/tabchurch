"use server";

import bcrypt from "bcryptjs";
import { and, eq, ne } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { createSession, destroySession, requireAdmin, requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type FormState = { error?: string; ok?: string } | undefined;

// Control en memoria de intentos fallidos de inicio de sesión (protección contra fuerza bruta)
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_LOGIN_ATTEMPTS = 6;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): { allowed: boolean; waitSec?: number } {
  const now = Date.now();
  // Limpieza oportunista de entradas caducadas
  if (loginAttempts.size > 500) {
    for (const [k, v] of loginAttempts.entries()) {
      if (v.resetAt <= now) loginAttempts.delete(k);
    }
  }
  const entry = loginAttempts.get(key);
  if (!entry || entry.resetAt <= now) {
    return { allowed: true };
  }
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    return { allowed: false, waitSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearFailedAttempts(key: string) {
  loginAttempts.delete(key);
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "local";
  const rateKey = `${ip}:${username}`;

  const limit = checkRateLimit(rateKey);
  if (!limit.allowed) {
    const mins = Math.max(1, Math.ceil((limit.waitSec ?? 60) / 60));
    return {
      error: `Demasiados intentos fallidos. Por seguridad, espera ${mins} min antes de volver a intentarlo.`,
    };
  }

  const user = db.select().from(schema.users).where(eq(schema.users.username, username)).get();
  if (!user || !user.active || !bcrypt.compareSync(password, user.passwordHash)) {
    recordFailedAttempt(rateKey);
    return { error: "Usuario o contraseña incorrectos" };
  }

  clearFailedAttempts(rateKey);
  await createSession(user.id);
  redirect(user.mustChangePw ? "/cambiar-clave" : "/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const pw = String(form.get("password") ?? "");
  const pw2 = String(form.get("password2") ?? "");
  if (pw.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres" };
  if (pw !== pw2) return { error: "Las contraseñas no coinciden" };
  db.update(schema.users)
    .set({ passwordHash: bcrypt.hashSync(pw, 10), mustChangePw: false })
    .where(eq(schema.users.id, user.id))
    .run();
  redirect("/");
}

export async function createUser(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(form.get("name") ?? "").trim();
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const email = String(form.get("email") ?? "").trim() || null;
  const password = String(form.get("password") ?? "");
  const roleInput = form.get("role");
  const role = roleInput === "admin" ? "admin" : roleInput === "editor" ? "editor" : "user";
  const churchIdVal = form.get("churchId");
  const churchId = churchIdVal && String(churchIdVal).trim() !== "" ? Number(churchIdVal) : null;

  if (!name || !username) return { error: "Nombre y usuario son obligatorios" };
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) return { error: "Usuario: 3-30 caracteres (letras, números, . _ -)" };
  if (password.length < 8) return { error: "La contraseña temporal debe tener al menos 8 caracteres" };
  if (db.select().from(schema.users).where(eq(schema.users.username, username)).get()) {
    return { error: "Ese usuario ya existe" };
  }
  db.insert(schema.users)
    .values({ name, username, email, role, churchId, passwordHash: bcrypt.hashSync(password, 10), mustChangePw: true })
    .run();
  revalidatePath("/admin");
  return { ok: `Usuario «${username}» creado. Deberá cambiar la contraseña al entrar.` };
}

export async function toggleUserActive(form: FormData) {
  const admin = await requireAdmin();
  const id = Number(form.get("id"));
  if (id === admin.id) return;
  const u = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
  if (!u) return;
  db.update(schema.users).set({ active: !u.active }).where(eq(schema.users.id, id)).run();
  if (u.active) db.delete(schema.sessions).where(eq(schema.sessions.userId, id)).run();
  revalidatePath("/admin");
}

export async function resetPassword(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return;
  db.update(schema.users)
    .set({ passwordHash: bcrypt.hashSync(password, 10), mustChangePw: true })
    .where(eq(schema.users.id, id))
    .run();
  db.delete(schema.sessions).where(eq(schema.sessions.userId, id)).run();
  revalidatePath("/admin");
}

export async function updateUser(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = Number(form.get("id"));
  const name = String(form.get("name") ?? "").trim();
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const email = String(form.get("email") ?? "").trim() || null;
  const churchIdVal = form.get("churchId");
  const churchId = churchIdVal && String(churchIdVal).trim() !== "" ? Number(churchIdVal) : null;

  if (!id || isNaN(id)) return { error: "ID de usuario inválido" };
  if (!name || !username) return { error: "Nombre y usuario son obligatorios" };
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
    return { error: "Usuario: 3-30 caracteres (letras, números, . _ -)" };
  }

  const existing = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
  if (!existing) return { error: "Usuario no encontrado" };

  const roleInput = form.get("role");
  const role = roleInput
    ? roleInput === "admin"
      ? "admin"
      : roleInput === "editor"
      ? "editor"
      : "user"
    : existing.role;

  if (id === admin.id && role !== "admin") {
    return { error: "No puedes quitarte el rol de administrador a ti mismo" };
  }

  const duplicate = db
    .select()
    .from(schema.users)
    .where(and(eq(schema.users.username, username), ne(schema.users.id, id)))
    .get();
  if (duplicate) {
    return { error: "Ese nombre de usuario ya está registrado por otra cuenta" };
  }

  db.update(schema.users)
    .set({
      name,
      username,
      email,
      role,
      churchId,
    })
    .where(eq(schema.users.id, id))
    .run();

  revalidatePath("/admin");
  return { ok: `Usuario «${username}» actualizado correctamente.` };
}

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim() || null;
  const avatar = String(form.get("avatar") ?? "").trim() || null;

  if (!name) return { error: "El nombre es obligatorio" };

  db.update(schema.users)
    .set({
      name,
      email,
      avatar,
    })
    .where(eq(schema.users.id, user.id))
    .run();

  revalidatePath("/", "layout");
  revalidatePath("/perfil");
  revalidatePath("/admin");
  return { ok: "Tu perfil ha sido actualizado correctamente." };
}

export async function createChurch(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(form.get("name") ?? "").trim();
  const city = String(form.get("city") ?? "").trim() || null;
  const address = String(form.get("address") ?? "").trim() || null;
  const notes = String(form.get("notes") ?? "").trim() || null;

  if (!name || name.length < 2) {
    return { error: "El nombre de la iglesia debe tener al menos 2 caracteres" };
  }

  const existing = db.select().from(schema.churches).where(eq(schema.churches.name, name)).get();
  if (existing) {
    return { error: `Ya existe una iglesia registrada con el nombre «${name}»` };
  }

  db.insert(schema.churches)
    .values({ name, city, address, notes })
    .run();

  revalidatePath("/admin");
  return { ok: `Iglesia «${name}» creada correctamente.` };
}

export async function updateChurch(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(form.get("id"));
  const name = String(form.get("name") ?? "").trim();
  const city = String(form.get("city") ?? "").trim() || null;
  const address = String(form.get("address") ?? "").trim() || null;
  const notes = String(form.get("notes") ?? "").trim() || null;

  if (!id || isNaN(id)) return { error: "ID de iglesia inválido" };
  if (!name || name.length < 2) return { error: "El nombre de la iglesia es obligatorio" };

  const duplicate = db
    .select()
    .from(schema.churches)
    .where(and(eq(schema.churches.name, name), ne(schema.churches.id, id)))
    .get();
  if (duplicate) {
    return { error: `Ya existe otra iglesia registrada con el nombre «${name}»` };
  }

  db.update(schema.churches)
    .set({ name, city, address, notes })
    .where(eq(schema.churches.id, id))
    .run();

  revalidatePath("/admin");
  return { ok: `Iglesia «${name}» actualizada correctamente.` };
}

export async function deleteChurch(form: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(form.get("id"));
  if (!id || isNaN(id)) return;

  // Desasignar usuarios de esta iglesia
  db.update(schema.users)
    .set({ churchId: null })
    .where(eq(schema.users.churchId, id))
    .run();

  // Eliminar la iglesia
  db.delete(schema.churches)
    .where(eq(schema.churches.id, id))
    .run();

  revalidatePath("/admin");
}

export async function assignUserChurch(form: FormData): Promise<void> {
  await requireAdmin();
  const userId = Number(form.get("userId"));
  const churchIdVal = form.get("churchId");
  const churchId = churchIdVal && String(churchIdVal).trim() !== "" ? Number(churchIdVal) : null;
  if (!userId || isNaN(userId)) return;

  db.update(schema.users)
    .set({ churchId })
    .where(eq(schema.users.id, userId))
    .run();

  revalidatePath("/admin");
}
