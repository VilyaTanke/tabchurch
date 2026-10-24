<#
  Instala el motor de separación de pistas (Demucs) en un entorno virtual .venv-stems
  dentro del proyecto. La app lo detecta automáticamente.

  Uso (desde la raíz del proyecto):
    powershell -ExecutionPolicy Bypass -File scripts/setup-stems.ps1          # CPU
    powershell -ExecutionPolicy Bypass -File scripts/setup-stems.ps1 -Gpu     # GPU NVIDIA (CUDA 12.8, RTX 50xx incluidas)

  Requiere Python 3.10 - 3.13 (PyTorch aún no publica ruedas para versiones más nuevas).
#>
param(
  [switch]$Gpu,
  [string]$Python = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$venv = Join-Path $root ".venv-stems"
$vpy = Join-Path $venv "Scripts\python.exe"

function Find-Python {
  foreach ($v in @("3.12", "3.11", "3.13", "3.10")) {
    try {
      $exe = & py "-$v" -c "import sys; print(sys.executable)" 2>$null
      if ($LASTEXITCODE -eq 0 -and $exe) { return $exe.Trim() }
    } catch { }
  }
  return $null
}

if (-not (Test-Path $vpy)) {
  if (-not $Python) { $Python = Find-Python }
  if (-not $Python) {
    Write-Error "No se encontró Python 3.10-3.13. Instala Python 3.12 desde https://www.python.org/downloads/ y vuelve a ejecutar."
  }
  Write-Host "==> Creando entorno virtual con $Python" -ForegroundColor Cyan
  & $Python -m venv $venv
}

Write-Host "==> Actualizando pip" -ForegroundColor Cyan
& $vpy -m pip install --upgrade pip

$index = if ($Gpu) { "https://download.pytorch.org/whl/cu128" } else { "https://download.pytorch.org/whl/cpu" }
Write-Host "==> Instalando PyTorch desde $index (puede tardar)" -ForegroundColor Cyan
& $vpy -m pip install torch --index-url $index

Write-Host "==> Instalando Demucs y dependencias" -ForegroundColor Cyan
& $vpy -m pip install -r (Join-Path $PSScriptRoot "requirements-stems.txt")

Write-Host "==> Descargando modelos de IA (htdemucs_6s y htdemucs)" -ForegroundColor Cyan
$env:TORCH_FORCE_NO_WEIGHTS_ONLY_LOAD = "1"
& $vpy -c "from demucs.pretrained import get_model; get_model('htdemucs_6s'); get_model('htdemucs'); print('Modelos listos')"

Write-Host "==> Verificación" -ForegroundColor Cyan
& $vpy -c "import torch, soundfile as sf; print('torch', torch.__version__, '| CUDA:', torch.cuda.is_available()); print('Soporte MP3 en soundfile:', 'MP3' in sf.available_formats())"

Write-Host "`nListo. Reinicia 'npm run dev' para que la app use el motor." -ForegroundColor Green
