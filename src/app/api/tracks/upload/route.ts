import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { db, schema } from "@/db";
import { canManageSongs, getUser } from "@/lib/auth";
import { ensureMediaDirs, trackFilePath } from "@/lib/media";
import { enqueueSeparation } from "@/lib/stems-queue";
import { isStemModel, DEFAULT_STEM_MODEL, MAX_UPLOAD_MB } from "@/lib/stems";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user || !canManageSongs(user)) {
    return NextResponse.json(
      { error: "No tienes permisos para subir archivos de audio (se requiere rol Editor o Admin)." },
      { status: 403 }
    );
  }

  try {
    ensureMediaDirs();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo de audio." }, { status: 400 });
    }

    const title = (formData.get("title") as string)?.trim() || file.name.replace(/\.[^/.]+$/, "");
    const artist = (formData.get("artist") as string)?.trim() || null;
    const songIdRaw = formData.get("songId");
    const songId = songIdRaw ? Number(songIdRaw) || null : null;
    const musicalKey = (formData.get("musicalKey") as string)?.trim() || null;
    const bpmRaw = formData.get("bpm");
    const bpm = bpmRaw ? Number(bpmRaw) || null : null;
    const durationRaw = formData.get("durationSec");
    const durationSec = durationRaw && Number(durationRaw) > 0 ? Number(durationRaw) : null;
    const autoSeparate = formData.get("autoSeparate") === "true";
    const requestedModel = formData.get("model") as string;
    const stemModel = isStemModel(requestedModel) ? requestedModel : DEFAULT_STEM_MODEL;

    // Validación de extensiones
    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    if (![".mp3", ".wav", ".ogg", ".flac", ".m4a"].includes(ext)) {
      return NextResponse.json(
        { error: "Formato no soportado. Por favor sube un archivo MP3, WAV, OGG o FLAC." },
        { status: 400 }
      );
    }

    // Validación de tamaño (80 MB máximo)
    if (file.size <= 0 || file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `El archivo supera el límite máximo de ${MAX_UPLOAD_MB} MB.` },
        { status: 400 }
      );
    }

    // Nombre de archivo seguro y único
    const uniqueHash = randomBytes(8).toString("hex");
    const safeBaseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_\-\u00C0-\u017F]/g, "_")
      .slice(0, 50);
    const storedFileName = `${Date.now()}_${uniqueHash}_${safeBaseName}${ext}`;
    const destinationPath = trackFilePath(storedFileName);

    // Escribir archivo al disco en data/media/tracks/
    const bytes = await file.arrayBuffer();
    await fs.promises.writeFile(destinationPath, Buffer.from(bytes));

    // Insertar registro en SQLite
    const inserted = db
      .insert(schema.tracks)
      .values({
        title,
        artist,
        songId,
        uploadedBy: user.id,
        fileName: storedFileName,
        originalName,
        mimeType: file.type || "audio/mpeg",
        sizeBytes: file.size,
        durationSec,
        musicalKey,
        bpm,
        stemsStatus: "none",
        stemsProgress: 0,
        stemsModel: autoSeparate ? stemModel : null,
      })
      .returning()
      .get();

    // Si el usuario solicitó separar automáticamente
    if (autoSeparate && inserted?.id) {
      enqueueSeparation(inserted.id, stemModel);
    }

    return NextResponse.json({ ok: true, track: inserted });
  } catch (err: unknown) {
    console.error("Error al subir archivo de audio:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Ocurrió un error al procesar el archivo." },
      { status: 500 }
    );
  }
}
