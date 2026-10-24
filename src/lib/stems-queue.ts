import "server-only";
import fs from "node:fs";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import { eq, inArray, asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { stemsDirFor, trackFilePath } from "@/lib/media";
import { DEFAULT_STEM_MODEL, isStemModel, type StemFile, type StemModel } from "@/lib/stems";

/**
 * Cola en memoria (un trabajo a la vez) que ejecuta scripts/separate_stems.py con Demucs.
 * El estado se persiste en la tabla `tracks` para que la interfaz lo consulte.
 */
type QueueState = {
  initialized: boolean;
  running: number | null;
  child: ChildProcess | null;
  queue: number[];
};

const g = globalThis as unknown as { __stemsQueue?: QueueState };
const q: QueueState = (g.__stemsQueue ??= { initialized: false, running: null, child: null, queue: [] });

const SCRIPT = path.join(process.cwd(), "scripts", "separate_stems.py");

/** Localiza el intérprete de Python: STEMS_PYTHON > .venv-stems del proyecto > python del sistema. */
export function resolvePython(): string {
  if (process.env.STEMS_PYTHON) return process.env.STEMS_PYTHON;
  // Construcción dinámica para evitar que Turbopack analice estáticamente la carpeta .venv-stems
  // y falle por los symlinks de Linux apuntando fuera del proyecto (/usr/bin/python3).
  const venvDir = [process.cwd(), [".", "venv", "-stems"].join("")].join(path.sep);
  const exe = process.platform === "win32" ? ["Scripts", "python.exe"] : ["bin", "python"];
  const venv = [venvDir, ...exe].join(path.sep);
  try {
    if (fs.existsSync(venv)) return venv;
  } catch {
    // Si no se puede verificar, continuar al fallback
  }
  return process.platform === "win32" ? "python" : "python3";
}

const nowSec = () => Math.floor(Date.now() / 1000);

function setStatus(id: number, values: Partial<typeof schema.tracks.$inferInsert>) {
  db.update(schema.tracks)
    .set({ ...values, updatedAt: nowSec() })
    .where(eq(schema.tracks.id, id))
    .run();
}

function init() {
  if (q.initialized) return;
  q.initialized = true;
  // Trabajos que quedaron a medias (reinicio del servidor): se vuelven a encolar.
  const stale = db
    .select({ id: schema.tracks.id })
    .from(schema.tracks)
    .where(inArray(schema.tracks.stemsStatus, ["queued", "processing"]))
    .orderBy(asc(schema.tracks.updatedAt))
    .all();
  for (const s of stale) {
    setStatus(s.id, { stemsStatus: "queued", stemsProgress: 0 });
    if (!q.queue.includes(s.id)) q.queue.push(s.id);
  }
  pump();
}

export function enqueueSeparation(trackId: number, model: StemModel = DEFAULT_STEM_MODEL) {
  init();
  if (q.running === trackId || q.queue.includes(trackId)) return;
  setStatus(trackId, {
    stemsStatus: "queued",
    stemsProgress: 0,
    stemsError: null,
    stemsModel: isStemModel(model) ? model : DEFAULT_STEM_MODEL,
  });
  q.queue.push(trackId);
  pump();
}

/** 0 = procesándose ahora, n = posición en la cola, -1 = no está en cola. */
export function queuePosition(trackId: number) {
  init();
  if (q.running === trackId) return 0;
  const i = q.queue.indexOf(trackId);
  return i === -1 ? -1 : i + 1;
}

/** Cancela (si existe) el trabajo de una pista: se usa al borrarla. */
export function cancelSeparation(trackId: number) {
  q.queue = q.queue.filter((id) => id !== trackId);
  if (q.running === trackId && q.child) {
    try {
      q.child.kill();
    } catch {
      // ya terminado
    }
  }
}

function pump() {
  if (q.running !== null) return;
  const next = q.queue.shift();
  if (next === undefined) return;
  q.running = next;
  run(next)
    .catch((err) => {
      console.error("[stems] Error inesperado:", err);
      setStatus(next, { stemsStatus: "error", stemsError: String(err?.message ?? err) });
    })
    .finally(() => {
      q.running = null;
      q.child = null;
      pump();
    });
}

async function run(trackId: number) {
  const track = db.select().from(schema.tracks).where(eq(schema.tracks.id, trackId)).get();
  if (!track) return;

  const input = trackFilePath(track.fileName);
  if (!fs.existsSync(input)) {
    setStatus(trackId, { stemsStatus: "error", stemsError: "No se encontró el archivo de audio original." });
    return;
  }

  const outDir = stemsDirFor(trackId);
  await fs.promises.rm(outDir, { recursive: true, force: true }).catch(() => {});
  await fs.promises.mkdir(outDir, { recursive: true });

  const model = isStemModel(track.stemsModel) ? track.stemsModel : DEFAULT_STEM_MODEL;
  setStatus(trackId, { stemsStatus: "processing", stemsProgress: 1, stemsError: null, stemsList: null });

  const python = resolvePython();
  const args = [
    SCRIPT,
    "--input", input,
    "--output", outDir,
    "--model", model,
    "--overlap", "0.5",
    "--shifts", "1",
  ];
  if (process.env.STEMS_DEVICE) args.push("--device", process.env.STEMS_DEVICE);
  if (process.env.STEMS_THREADS) args.push("--threads", process.env.STEMS_THREADS);

  await new Promise<void>((resolve) => {
    let settled = false;
    let stems: StemFile[] | null = null;
    let reportedError = "";
    let stderrTail = "";
    let stdoutBuf = "";
    let lastProgress = 1;
    let lastWrite = 0;

    const finish = (ok: boolean, message?: string) => {
      if (settled) return;
      settled = true;
      if (ok && stems && stems.length) {
        setStatus(trackId, {
          stemsStatus: "done",
          stemsProgress: 100,
          stemsList: JSON.stringify(stems),
          stemsError: null,
        });
      } else {
        // Si la pista fue borrada mientras se procesaba, no hay nada que actualizar.
        setStatus(trackId, {
          stemsStatus: "error",
          stemsProgress: 0,
          stemsError: (message || "La separación falló sin dar detalles.").slice(0, 1500),
        });
      }
      resolve();
    };

    let child: ChildProcess;
    try {
      child = spawn(/*turbopackIgnore: true*/ python, args, {
        cwd: process.cwd(),
        windowsHide: true,
        env: { ...process.env, PYTHONUNBUFFERED: "1", PYTHONIOENCODING: "utf-8" },
      });
    } catch (err) {
      finish(false, `No se pudo iniciar Python (${python}): ${(err as Error).message}`);
      return;
    }
    q.child = child;

    const handleLine = (line: string) => {
      const sp = line.indexOf(" ");
      const kind = sp === -1 ? line : line.slice(0, sp);
      const payload = sp === -1 ? "" : line.slice(sp + 1).trim();
      if (kind === "PROGRESS") {
        const p = Math.max(1, Math.min(99, Math.round(Number(payload) || 0)));
        const t = Date.now();
        // limitar escrituras en la base de datos
        if (p !== lastProgress && (t - lastWrite > 700 || p - lastProgress >= 5)) {
          lastProgress = p;
          lastWrite = t;
          setStatus(trackId, { stemsProgress: p });
        }
      } else if (kind === "DONE") {
        try {
          const data = JSON.parse(payload);
          if (Array.isArray(data.stems)) stems = data.stems;
        } catch {
          reportedError = "Respuesta inválida del separador.";
        }
      } else if (kind === "ERROR") {
        reportedError = payload;
      }
    };

    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (chunk: string) => {
      stdoutBuf += chunk;
      let nl: number;
      while ((nl = stdoutBuf.indexOf("\n")) !== -1) {
        const line = stdoutBuf.slice(0, nl).trim();
        stdoutBuf = stdoutBuf.slice(nl + 1);
        if (line) handleLine(line);
      }
    });
    child.stderr?.setEncoding("utf8");
    child.stderr?.on("data", (chunk: string) => {
      stderrTail = (stderrTail + chunk).slice(-4000);
    });

    child.on("error", (err: NodeJS.ErrnoException) => {
      const msg =
        err.code === "ENOENT"
          ? `No se encontró Python (${python}). Instala el motor de separación con scripts/setup-stems (ver README).`
          : `Error al ejecutar Python: ${err.message}`;
      finish(false, msg);
    });

    child.on("close", (code, signal) => {
      if (stdoutBuf.trim()) handleLine(stdoutBuf.trim());
      if (code === 0 && stems) return finish(true);
      if (signal) return finish(false, "La separación se canceló.");
      const tail = stderrTail
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(-4)
        .join(" · ");
      finish(false, reportedError || tail || `El proceso terminó con código ${code}.`);
    });
  });
}
