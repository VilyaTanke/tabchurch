"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label }: { label?: string }) {
  return (
    <button
      className="btn ghost small"
      onClick={() => window.print()}
      title="Exportar a PDF o enviar a imprimir"
      style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
    >
      <Printer size={15} />
      <span>{label || "Imprimir / PDF"}</span>
    </button>
  );
}
