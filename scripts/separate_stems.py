#!/usr/bin/env python3
"""
Separación de pistas (stems) con Demucs (Meta AI) para TabChurch.

Uso:
    python scripts/separate_stems.py --input cancion.mp3 --output carpeta/ [--model htdemucs_6s]

Protocolo de salida (stdout, una línea por evento) que interpreta src/lib/stems-queue.ts:
    PROGRESS <0-100>
    DONE {"stems": [{"name": "vocals", "file": "vocals.mp3"}, ...]}
    ERROR <mensaje>

Se evita torchaudio para la E/S de audio (en versiones recientes depende de ffmpeg/torchcodec):
la lectura y escritura se hace con soundfile (libsndfile >= 1.1 soporta MP3).
"""

import argparse
import json
import os
import sys
import types

# Los modelos oficiales de Demucs se publican como paquetes pickle; torch >= 2.6 los bloquea por defecto.
os.environ.setdefault("TORCH_FORCE_NO_WEIGHTS_ONLY_LOAD", "1")


def emit(kind, payload=""):
    print(f"{kind} {payload}".rstrip(), flush=True)


def fail(message, code=1):
    emit("ERROR", " ".join(str(message).split()))
    return code


def pick_device(torch, requested):
    if requested and requested != "auto":
        return requested
    if torch.cuda.is_available():
        return "cuda"
    mps = getattr(torch.backends, "mps", None)
    if mps is not None and mps.is_available():
        return "mps"
    return "cpu"


def write_audio(sf, np, path_base, data, samplerate):
    """Escribe MP3 si libsndfile lo soporta; si no, WAV 16 bits. Devuelve la ruta final."""
    formats = sf.available_formats()
    if "MP3" in formats:
        path = path_base + ".mp3"
        try:
            sf.write(path, data, samplerate, format="MP3", subtype="MPEG_LAYER_III",
                     bitrate_mode="VARIABLE", compression_level=0.25)
            return path
        except TypeError:
            # soundfile antiguo sin parámetros de bitrate
            sf.write(path, data, samplerate, format="MP3", subtype="MPEG_LAYER_III")
            return path
        except Exception:
            try:
                os.remove(path)
            except OSError:
                pass
    path = path_base + ".wav"
    sf.write(path, data, samplerate, format="WAV", subtype="PCM_16")
    return path


def main():
    parser = argparse.ArgumentParser(description="Separa un audio en stems con Demucs.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--model", default="htdemucs_6s")
    parser.add_argument("--device", default="auto", help="auto | cpu | cuda | mps")
    parser.add_argument("--shifts", type=int, default=1)
    parser.add_argument("--overlap", type=float, default=0.5, help="0.5 (50%) recomendado para evitar clicks en transiciones")
    parser.add_argument("--threads", type=int, default=0)
    args = parser.parse_args()

    if args.model not in ("htdemucs_6s", "htdemucs", "htdemucs_ft"):
        return fail(f"Modelo no permitido: {args.model}", 2)

    emit("PROGRESS", 1)
    try:
        import numpy as np
        import soundfile as sf
        import torch
        from demucs.pretrained import get_model
        from demucs.apply import apply_model
        import demucs.apply as demucs_apply
    except ImportError as exc:
        name = getattr(exc, "name", None) or str(exc)
        return fail(
            f"Falta la dependencia de Python '{name}'. Instala el motor con scripts/setup-stems "
            f"(intérprete actual: {sys.executable}).",
            2,
        )

    device = pick_device(torch, args.device)
    if device == "cpu":
        threads = args.threads or os.cpu_count() or 1
        torch.set_num_threads(max(1, threads))

    # --- Cargar modelo (la primera vez descarga los pesos, ~80 MB) ---
    try:
        model = get_model(args.model)
    except Exception as exc:  # noqa: BLE001
        return fail(f"No se pudo cargar el modelo {args.model}: {exc}")
    model.eval()
    samplerate = int(model.samplerate)
    emit("PROGRESS", 5)

    # --- Leer audio ---
    try:
        data, sr = sf.read(args.input, dtype="float32", always_2d=True)  # (frames, canales)
    except Exception as exc:  # noqa: BLE001
        return fail(f"No se pudo leer el audio: {exc}")
    if data.shape[0] == 0:
        return fail("El archivo de audio está vacío.")

    wav = torch.from_numpy(np.ascontiguousarray(data.T))  # (canales, frames)
    if wav.shape[0] == 1:
        wav = wav.repeat(2, 1)
    elif wav.shape[0] > 2:
        wav = wav[:2]

    if sr != samplerate:
        import julius  # dependencia de demucs
        wav = julius.resample_frac(wav, int(sr), samplerate)
    emit("PROGRESS", 8)

    # Normalización igual que demucs.separate
    ref = wav.mean(0)
    mean = ref.mean()
    std = ref.std() + 1e-8
    wav = (wav - mean) / std

    # --- Progreso: sustituimos el tqdm interno de demucs.apply por uno que emite PROGRESS ---
    n_models = len(getattr(model, "models", [model]))
    expected_loops = max(1, n_models * max(1, args.shifts))
    state = {"loops": 0}

    def progress_tqdm(iterable, **_kwargs):
        items = list(iterable)
        total = max(1, len(items))
        loop_index = state["loops"]
        state["loops"] += 1
        for i, item in enumerate(items):
            yield item
            frac = (min(loop_index, expected_loops - 1) + (i + 1) / total) / expected_loops
            emit("PROGRESS", int(8 + frac * 82))

    demucs_apply.tqdm = types.SimpleNamespace(tqdm=progress_tqdm)

    # --- Separar ---
    try:
        with torch.no_grad():
            sources = apply_model(
                model,
                wav[None],
                device=device,
                shifts=args.shifts,
                split=True,
                overlap=args.overlap,
                progress=True,
                num_workers=0,
            )[0]
    except RuntimeError as exc:
        if device != "cpu" and "out of memory" in str(exc).lower():
            emit("PROGRESS", 8)
            if device == "cuda":
                torch.cuda.empty_cache()
            state["loops"] = 0
            with torch.no_grad():
                sources = apply_model(model, wav[None], device="cpu", shifts=args.shifts,
                                      split=True, overlap=args.overlap, progress=True, num_workers=0)[0]
        else:
            return fail(f"Error durante la separación: {exc}")

    sources = sources * std + mean
    emit("PROGRESS", 91)

    # --- Guardar stems a máxima calidad (MP3 320 kbps o WAV sin pérdidas) ---
    os.makedirs(args.output, exist_ok=True)
    names = list(model.sources)
    written = []
    from demucs.audio import save_audio

    for i, (name, src) in enumerate(zip(names, sources)):
        out_mp3 = os.path.join(args.output, f"{name}.mp3")
        saved_file = f"{name}.mp3"
        try:
            # 320 kbps MP3 de calidad estudio con protección anti-saturación rescale
            save_audio(src, out_mp3, samplerate, bitrate=320, clip="rescale", preset=2)
        except Exception:
            # Fallback seguro a WAV 16-bit PCM sin compresión
            out_wav = os.path.join(args.output, f"{name}.wav")
            saved_file = f"{name}.wav"
            arr = src.detach().cpu().numpy().T
            peak = float(np.abs(arr).max()) if arr.size else 0.0
            arr = arr / max(1.01 * peak, 1.0)
            sf.write(out_wav, arr.astype(np.float32), samplerate, format="WAV", subtype="PCM_16")

        written.append({"name": name, "file": saved_file})
        emit("PROGRESS", int(91 + (i + 1) / len(names) * 8))

    emit("DONE", json.dumps({"stems": written, "samplerate": samplerate, "device": device}))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        sys.exit(fail("Cancelado", 130))
    except Exception as exc:  # noqa: BLE001
        sys.exit(fail(f"Error inesperado: {exc}"))
