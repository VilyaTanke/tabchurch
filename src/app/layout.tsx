import type { Metadata, Viewport } from "next";
import { Outfit, Cinzel } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ variable: "--font-sans", subsets: ["latin"] });
const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tab-NuevaVida · Cifrados para tu grupo",
  description: "Guarda cifrados de canciones, organiza listas y compártelas con tu grupo de alabanza.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/iconoApp.svg", type: "image/svg+xml" },
      { url: "/iconoApp.jpg", type: "image/jpeg" },
    ],
    apple: [
      { url: "/iconoApp.svg", type: "image/svg+xml" },
    ],
    shortcut: "/iconoApp.svg",
  },
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
import DeviceDetector from "@/components/DeviceDetector";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${cinzel.variable}`}>
      <body>
        <DeviceDetector />
        <PwaManager />
        {children}
      </body>
    </html>
  );
}
