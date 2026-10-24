#!/usr/bin/env bash
# Instala el motor de separación de pistas (Demucs) en .venv-stems dentro del proyecto (Linux / VPS).
#
#   bash scripts/setup-stems.sh          # CPU (recomendado en el VPS)
#   bash scripts/setup-stems.sh --gpu    # GPU NVIDIA (CUDA 12.8)
#
# Requisitos previos en Ubuntu/Debian:  sudo apt-get install -y python3-venv libsndfile1
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV="$ROOT/.venv-stems"
INDEX="https://download.pytorch.org/whl/cpu"
if [[ "${1:-}" == "--gpu" ]]; then INDEX="https://download.pytorch.org/whl/cu128"; fi

PY="${STEMS_BASE_PYTHON:-}"
if [[ -z "$PY" ]]; then
  for v in python3.12 python3.11 python3.13 python3.10 python3; do
    if command -v "$v" >/dev/null 2>&1; then PY="$v"; break; fi
  done
fi
if [[ -z "$PY" ]]; then echo "No se encontró Python 3.10-3.13" >&2; exit 1; fi

if [[ ! -x "$VENV/bin/python" ]]; then
  echo "==> Creando entorno virtual con $PY"
  "$PY" -m venv "$VENV"
fi
VPY="$VENV/bin/python"

echo "==> Actualizando pip"
"$VPY" -m pip install --upgrade pip

echo "==> Instalando PyTorch desde $INDEX"
"$VPY" -m pip install torch --index-url "$INDEX"

echo "==> Instalando Demucs y dependencias"
"$VPY" -m pip install -r "$ROOT/scripts/requirements-stems.txt"

echo "==> Descargando modelos de IA"
TORCH_FORCE_NO_WEIGHTS_ONLY_LOAD=1 "$VPY" -c "from demucs.pretrained import get_model; get_model('htdemucs_6s'); get_model('htdemucs'); print('Modelos listos')"

echo "==> Verificación"
"$VPY" -c "import torch, soundfile as sf; print('torch', torch.__version__, '| CUDA:', torch.cuda.is_available()); print('Soporte MP3:', 'MP3' in sf.available_formats())"

echo "Listo. Reinicia la app (pm2 reload tabchurch) para usar el motor."
