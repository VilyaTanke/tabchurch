import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "@/db";

const COOKIE = "tc_session";
const DAYS = 30;

export async function createSession(userId: number) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = Math.floor(Date.now() / 1000) + DAYS * 86400;
  db.insert(schema.sessions).values({ id, userId, expiresAt }).run();
  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DAYS * 86400,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  if (id) db.delete(schema.sessions).where(eq(schema.sessions.id, id)).run();
  jar.delete(COOKIE);
}

export async function getUser() {
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  const now = Math.floor(Date.now() / 1000);
  const row = db
    .select({ user: schema.users })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.id, id), gt(schema.sessions.expiresAt, now)))
    .get();
  if (!row || !row.user.active) return null;
  return row.user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}
