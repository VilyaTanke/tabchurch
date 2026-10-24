import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { canManageSongs, getUser } from "@/lib/auth";
import { removeTrackFiles, serveFile, trackFilePath } from "@/lib/media";
import { cancelSeparation } from "@/lib/stems-queue";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return new Response("No autenticado", { status: 401 });
  }

  const { id } = await params;
  const trackId = Number(id);
  if (!trackId) {
    return new Response("ID inválido", { status: 400 });
  }

  const track = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
  if (!track) {
    return new Response("Pista no encontrada", { status: 404 });
  }

  const filePath = trackFilePath(track.fileName);
  const isDownload = req.nextUrl.searchParams.get("download") === "1";
  const downloadName = isDownload ? (track.originalName || `${track.title}.mp3`) : undefined;

  return serveFile(req, filePath, { download: downloadName });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user || !canManageSongs(user)) {
    return NextResponse.json({ error: "Permiso denegado." }, { status: 403 });
  }

  const { id } = await params;
  const trackId = Number(id);
  if (!trackId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const track = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
  if (!track) {
    return NextResponse.json({ error: "Pista no encontrada" }, { status: 404 });
  }

  cancelSeparation(trackId);
  await removeTrackFiles(trackId, track.fileName);
  db.delete(schema.tracks).where(eq(schema.tracks.id, trackId)).run();

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user || !canManageSongs(user)) {
    return NextResponse.json({ error: "Permiso denegado." }, { status: 403 });
  }

  const { id } = await params;
  const trackId = Number(id);
  if (!trackId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const track = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
  if (!track) {
    return NextResponse.json({ error: "Pista no encontrada" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const updateData: Partial<typeof schema.tracks.$inferInsert> = {
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (typeof body.title === "string" && body.title.trim()) updateData.title = body.title.trim();
    if ("artist" in body) updateData.artist = body.artist ? String(body.artist).trim() : null;
    if ("musicalKey" in body) updateData.musicalKey = body.musicalKey ? String(body.musicalKey).trim() : null;
    if ("bpm" in body) updateData.bpm = body.bpm ? Number(body.bpm) || null : null;
    if ("songId" in body) updateData.songId = body.songId ? Number(body.songId) || null : null;

    db.update(schema.tracks).set(updateData).where(eq(schema.tracks.id, trackId)).run();

    const updated = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
    return NextResponse.json({ ok: true, track: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error)?.message || "Error al actualizar" }, { status: 400 });
  }
}
