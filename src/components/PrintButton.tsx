"use client";

export default function PrintButton({ label = "🖨️ Imprimir / PDF" }: { label?: string }) {
  return (
    <button
      className="btn ghost small"
      onClick={() => window.print()}
      title="Exportar a PDF o enviar a imprimir"
    >
      {label}
    </button>
  );
}
