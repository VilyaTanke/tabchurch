import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { canManageSongs, getUser } from "@/lib/auth";
import { enqueueSeparation, queuePosition } from "@/lib/stems-queue";
import { isStemModel, DEFAULT_STEM_MODEL, parseStemsList } from "@/lib/stems";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const trackId = Number(id);
  if (!trackId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const track = db
    .select({
      id: schema.tracks.id,
      status: schema.tracks.stemsStatus,
      progress: schema.tracks.stemsProgress,
      error: schema.tracks.stemsError,
      model: schema.tracks.stemsModel,
      stemsList: schema.tracks.stemsList,
    })
    .from(schema.tracks)
    .where(eq(schema.tracks.id, trackId))
    .get();

  if (!track) {
    return NextResponse.json({ error: "Pista no encontrada" }, { status: 404 });
  }

  const pos = queuePosition(trackId);
  const stems = parseStemsList(track.stemsList);

  return NextResponse.json({
    status: track.status,
    progress: track.progress,
    error: track.error,
    model: track.model,
    queuePosition: pos,
    stems,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user || !canManageSongs(user)) {
    return NextResponse.json(
      { error: "No tienes permisos para iniciar la separación (se requiere rol Editor o Admin)." },
      { status: 403 }
    );
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

  let model = DEFAULT_STEM_MODEL;
  try {
    const body = await req.json();
    if (isStemModel(body.model)) model = body.model;
  } catch {
    // Si no envió body o no es JSON válido, usamos el default
  }

  enqueueSeparation(trackId, model);

  return NextResponse.json({
    ok: true,
    status: "queued",
    message: "La pista fue agregada a la cola de procesamiento de IA.",
  });
}
