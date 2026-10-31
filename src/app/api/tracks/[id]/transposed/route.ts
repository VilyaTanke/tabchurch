import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { canManageSongs, getUser } from "@/lib/auth";
import { stemsDirFor, trackFilePath } from "@/lib/media";
import { cancelSeparation } from "@/lib/stems-queue";
import { MAX_UPLOAD_MB } from "@/lib/stems";

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

    if (file.size <= 0 || file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `El archivo transpuesto supera el límite permitido de ${MAX_UPLOAD_MB} MB.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validación básica de cabecera MP3 (ID3 o frame sync 0xFF 0xE0)
    const isId3 = buffer.length > 3 && buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33;
    const isMpegSync = buffer.length > 2 && buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
    if (!isId3 && !isMpegSync) {
      return NextResponse.json({ error: "El archivo generado no es un flujo MP3 válido." }, { status: 400 });
    }

    // Sobrescribir el archivo de la pista en disco con la versión transpuesta
    const filePath = trackFilePath(track.fileName);
    await fs.promises.writeFile(filePath, buffer);

    // Si la pista tenía stems separados en el tono anterior, limpiarlos para evitar que suenen en distinto tono
    cancelSeparation(trackId);
    await fs.promises.rm(stemsDirFor(trackId), { recursive: true, force: true }).catch(() => {});

    const updateData: Partial<typeof schema.tracks.$inferInsert> = {
      sizeBytes: buffer.length,
      stemsStatus: "none",
      stemsProgress: 0,
      stemsList: null,
      stemsError: null,
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
