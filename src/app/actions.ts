"use server";

import bcrypt from "bcryptjs";
import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { createSession, destroySession, requireAdmin, requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type FormState = { error?: string; ok?: string } | undefined;

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const user = db.select().from(schema.users).where(eq(schema.users.username, username)).get();
  if (!user || !user.active || !bcrypt.compareSync(password, user.passwordHash)) {
    return { error: "Usuario o contraseña incorrectos" };
  }
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
  const role = form.get("role") === "admin" ? "admin" : "user";
  if (!name || !username) return { error: "Nombre y usuario son obligatorios" };
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) return { error: "Usuario: 3-30 caracteres (letras, números, . _ -)" };
  if (password.length < 8) return { error: "La contraseña temporal debe tener al menos 8 caracteres" };
  if (db.select().from(schema.users).where(eq(schema.users.username, username)).get()) {
    return { error: "Ese usuario ya existe" };
  }
  db.insert(schema.users)
    .values({ name, username, email, role, passwordHash: bcrypt.hashSync(password, 10), mustChangePw: true })
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
  if (!id || isNaN(id)) return { error: "ID de usuario inválido" };
  if (!name || !username) return { error: "Nombre y usuario son obligatorios" };
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
    return { error: "Usuario: 3-30 caracteres (letras, números, . _ -)" };
  }

  const existing = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
  if (!existing) return { error: "Usuario no encontrado" };

  const roleInput = form.get("role");
  const role = roleInput ? (roleInput === "admin" ? "admin" : "user") : existing.role;

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
    })
    .where(eq(schema.users.id, id))
    .run();

  revalidatePath("/admin");
  return { ok: `Usuario «${username}» actualizado correctamente.` };
}
