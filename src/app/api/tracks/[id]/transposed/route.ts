import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { canManageSongs, getUser } from "@/lib/auth";
import { trackFilePath } from "@/lib/media";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user || !canManageSongs(user)) {
    return NextResponse.json({ error: "Permiso denegado. Se requiere rol de Editor o Admin." }, { status: 403 });
  }

  const { id } = await params;
  const trackId = Number(id);
  if (!trackId) {
    return NextResponse.json({ error: "ID de pista inválido" }, { status: 400 });
  }

  const track = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
  if (!track) {
    return NextResponse.json({ error: "Pista no encontrada" }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const musicalKey = formData.get("musicalKey") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No se envió el archivo de audio procesado." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sobrescribir el archivo de la pista en disco con la versión transpuesta
    const filePath = trackFilePath(track.fileName);
    await fs.promises.writeFile(filePath, buffer);

    const updateData: Partial<typeof schema.tracks.$inferInsert> = {
      sizeBytes: buffer.length,
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (musicalKey && musicalKey.trim()) {
      updateData.musicalKey = musicalKey.trim();
    }

    db.update(schema.tracks).set(updateData).where(eq(schema.tracks.id, trackId)).run();

    // Si la pista está vinculada a una canción, sincronizar el tono actual de la canción en la biblioteca
    if (track.songId && musicalKey && musicalKey.trim()) {
      db.update(schema.songs)
        .set({
          currentKey: musicalKey.trim(),
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(schema.songs.id, track.songId))
        .run();
    }

    const updated = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
    return NextResponse.json({ ok: true, track: updated });
  } catch (err: unknown) {
    console.error("Error al guardar MP3 transpuesto:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Error al guardar el archivo de audio modificado" },
      { status: 500 }
    );
  }
}
