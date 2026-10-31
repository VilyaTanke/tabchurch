"use client";

import { useEffect, useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribeOnlineStatus(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return !navigator.onLine;
}

function getServerSnapshot() {
  return false;
}

export default function PwaManager() {
  const isOffline = useSyncExternalStore(
    subscribeOnlineStatus,
    getOnlineSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    // Registrar el Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker de Tab-NuevaVida registrado con éxito:", reg.scope);
        })
        .catch((err) => {
          console.warn("Fallo al registrar Service Worker:", err);
        });
    }
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <WifiOff size={16} />
      <span>Modo Sin Conexión activo — Puedes seguir consultando tus acordes y listas guardadas en caché</span>
    </div>
  );
}
