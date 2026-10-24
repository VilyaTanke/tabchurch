import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getUser } from "@/lib/auth";
import { serveFile, stemFilePath } from "@/lib/media";
import { parseStemsList } from "@/lib/stems";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stem: string }> }
) {
  const user = await getUser();
  if (!user) {
    return new Response("No autenticado", { status: 401 });
  }

  const { id, stem } = await params;
  const trackId = Number(id);
  if (!trackId || !stem) {
    return new Response("Parámetros inválidos", { status: 400 });
  }

  const track = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
  if (!track) {
    return new Response("Pista no encontrada", { status: 404 });
  }

  const stems = parseStemsList(track.stemsList);
  // Puede venir el nombre lógico (ej: "vocals") o el nombre del archivo (ej: "vocals.mp3")
  const matched = stems.find((s) => s.name === stem || s.file === stem);
  const targetFileName = matched ? matched.file : stem;

  const filePath = stemFilePath(trackId, targetFileName);
  const isDownload = req.nextUrl.searchParams.get("download") === "1";
  const downloadName = isDownload ? `${track.title} - [${matched?.name || stem}].mp3` : undefined;

  return serveFile(req, filePath, { download: downloadName });
}
