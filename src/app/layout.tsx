import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tab-NuevaVida · Cifrados para tu grupo",
  description: "Guarda cifrados de canciones, organiza listas y compártelas con tu grupo de alabanza.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tab-NuevaVida",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1020",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import PwaManager from "@/components/PwaManager";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        <PwaManager />
        {children}
      </body>
    </html>
  );
}
