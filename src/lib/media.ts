import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

/** Carpeta persistente de medios (dentro de /data, ignorada por git y conservada en los despliegues). */
export const MEDIA_DIR = path.join(process.cwd(), "data", "media");
export const TRACKS_DIR = path.join(MEDIA_DIR, "tracks");
export const STEMS_DIR = path.join(MEDIA_DIR, "stems");

export function ensureMediaDirs() {
  fs.mkdirSync(TRACKS_DIR, { recursive: true });
  fs.mkdirSync(STEMS_DIR, { recursive: true });
}

export function trackFilePath(fileName: string) {
  // basename evita cualquier intento de path traversal
  return path.join(TRACKS_DIR, path.basename(fileName));
}

export function stemsDirFor(trackId: number) {
  return path.join(STEMS_DIR, String(Math.floor(trackId)));
}

export function stemFilePath(trackId: number, fileName: string) {
  return path.join(stemsDirFor(trackId), path.basename(fileName));
}

export function mimeForFile(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".mp3":
      return "audio/mpeg";
    case ".wav":
      return "audio/wav";
    case ".ogg":
      return "audio/ogg";
    case ".flac":
      return "audio/flac";
    default:
      return "application/octet-stream";
  }
}

export async function removeTrackFiles(trackId: number, fileName: string) {
  await fs.promises.rm(trackFilePath(fileName), { force: true }).catch(() => {});
  await fs.promises.rm(stemsDirFor(trackId), { recursive: true, force: true }).catch(() => {});
}

/** Sirve un archivo con soporte de peticiones Range (necesario para poder buscar en el audio). */
export async function serveFile(req: Request, filePath: string, opts: { download?: string } = {}) {
  const stat = await fs.promises.stat(filePath).catch(() => null);
  if (!stat || !stat.isFile()) return new Response("Archivo no encontrado", { status: 404 });

  const size = stat.size;
  const headers: Record<string, string> = {
    "Content-Type": mimeForFile(filePath),
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=86400",
    "Last-Modified": stat.mtime.toUTCString(),
  };
  if (opts.download) {
    headers["Content-Disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(opts.download)}`;
  }

  const range = req.headers.get("range");
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!m || (!m[1] && !m[2])) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    let start: number;
    let end: number;
    if (!m[1]) {
      // sufijo: últimos N bytes
      start = Math.max(0, size - Number(m[2]));
      end = size - 1;
    } else {
      start = Number(m[1]);
      end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    }
    if (start >= size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    const stream = fs.createReadStream(filePath, { start, end });
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  const stream = fs.createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: { ...headers, "Content-Length": String(size) },
  });
}
