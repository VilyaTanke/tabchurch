"use client";

import { useEffect, useState } from "react";

export default function PwaManager() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Registrar el Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker de TabChurch registrado con éxito:", reg.scope);
        })
        .catch((err) => {
          console.warn("Fallo al registrar Service Worker:", err);
        });
    }

    // Monitorear conectividad online/offline
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        color: "#000",
        textAlign: "center",
        padding: "0.4rem 1rem",
        fontSize: "0.85rem",
        fontWeight: 700,
        boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
      }}
    >
      📶 Modo Sin Conexión activo — Puedes seguir consultando tus acordes y listas guardadas en caché
    </div>
  );
}
