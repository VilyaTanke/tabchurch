/**
 * tablet-profiler.ts
 * Perfilador adaptativo de recursos de hardware (RAM, CPU, Batería, Almacenamiento Flash)
 * para garantizar reproducción de audio estable y sin interrupciones en tablets y dispositivos móviles.
 */

export type HardwareTier = "pro" | "standard" | "eco";

export interface HardwareProfile {
  tier: HardwareTier;
  isTablet: boolean;
  isTouch: boolean;
  deviceMemoryGb?: number;
  hardwareConcurrency: number;
  batteryLevel?: number;
  isCharging?: boolean;
  recommendedBufferSize: 2048 | 4096 | 8192;
  recommendedFps: 60 | 30 | 20;
  maxMemoryBuffers: number;
  wsolaSeekWindowMs: number;
  sampleRateCap: number; // 0 para nativo, o 44100
}

export const STEMS_CACHE_NAME = "tabchurch-audio-stems-v1";

/**
 * Detecta si el entorno actual es una tablet (iPadOS, Android Tablet, Windows Touch).
 */
export function isTabletDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const minDim = Math.min(width, height);
  const maxDim = Math.max(width, height);

  const hasTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;

  const ua = navigator.userAgent.toLowerCase();
  const isTabletUA =
    /ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk/i.test(
      ua
    ) ||
    (ua.includes("macintosh") && navigator.maxTouchPoints > 1);

  const isTabletDims = hasTouch && minDim >= 600 && maxDim <= 1366;
  return Boolean(isTabletUA || isTabletDims);
}

/**
 * Obtiene el perfil de hardware del dispositivo actual.
 */
export async function getHardwareProfile(forceEcoMode = false): Promise<HardwareProfile> {
  const isTablet = isTabletDevice();
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const nav = typeof navigator !== "undefined" ? navigator : ({} as Navigator);
  const navAny = nav as unknown as { deviceMemory?: number; getBattery?: () => Promise<{ level: number; charging: boolean }> };

  const deviceMemoryGb = navAny.deviceMemory;
  const hardwareConcurrency = nav.hardwareConcurrency || 4;

  let batteryLevel: number | undefined;
  let isCharging: boolean | undefined;

  try {
    if (typeof navAny.getBattery === "function") {
      const b = await navAny.getBattery();
      batteryLevel = b.level;
      isCharging = b.charging;
    }
  } catch {
    // Ignorar si la API no está soportada o bloqueada por política
  }

  // Criterios para determinar el Tier de hardware
  let tier: HardwareTier = "standard";

  if (forceEcoMode) {
    tier = "eco";
  } else if (batteryLevel !== undefined && batteryLevel <= 0.2 && isCharging === false) {
    // Si la batería es menor al 20% y está desconectada, entrar en modo eco preventivo
    tier = "eco";
  } else if (!isTablet && !isTouch && (deviceMemoryGb === undefined || deviceMemoryGb >= 6) && hardwareConcurrency >= 6) {
    // Desktop potente
    tier = "pro";
  } else if (isTablet && ((deviceMemoryGb !== undefined && deviceMemoryGb >= 6) || hardwareConcurrency >= 8)) {
    // iPad Pro M-series o Tablet Android de gama alta
    tier = "pro";
  } else if ((deviceMemoryGb !== undefined && deviceMemoryGb < 3) || hardwareConcurrency <= 2) {
    // Tablet de recursos limitados
    tier = "eco";
  } else {
    tier = "standard";
  }

  const configs: Record<HardwareTier, Omit<HardwareProfile, "tier" | "isTablet" | "isTouch" | "deviceMemoryGb" | "hardwareConcurrency" | "batteryLevel" | "isCharging">> = {
    pro: {
      recommendedBufferSize: 2048,
      recommendedFps: 60,
      maxMemoryBuffers: 8,
      wsolaSeekWindowMs: 15,
      sampleRateCap: 0,
    },
    standard: {
      recommendedBufferSize: 4096,
      recommendedFps: 30,
      maxMemoryBuffers: 6,
      wsolaSeekWindowMs: 12,
      sampleRateCap: 44100,
    },
    eco: {
      recommendedBufferSize: 4096,
      recommendedFps: 20,
      maxMemoryBuffers: 4,
      wsolaSeekWindowMs: 10,
      sampleRateCap: 44100,
    },
  };

  const selected = configs[tier];

  return {
    tier,
    isTablet,
    isTouch,
    deviceMemoryGb,
    hardwareConcurrency,
    batteryLevel,
    isCharging,
    ...selected,
  };
}

/* ==========================================================================
   GESTIÓN DE ALMACENAMIENTO FLASH / PERSISTENCIA OFFLINE EN DISCO DE LA TABLET
   ========================================================================== */

/**
 * Solicita persistencia de almacenamiento para evitar que el navegador depure la caché de audio.
 */
export async function requestStoragePersistence(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) return false;
  try {
    const isPersisted = await navigator.storage.persisted();
    if (isPersisted) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

/**
 * Comprueba si un stem de audio ya está almacenado en la memoria flash de la tablet.
 */
export async function isStemCachedLocally(url: string): Promise<boolean> {
  if (typeof window === "undefined" || !("caches" in window)) return false;
  try {
    const cache = await caches.open(STEMS_CACHE_NAME);
    const match = await cache.match(url);
    return Boolean(match);
  } catch {
    return false;
  }
}

/**
 * Guarda un stem de audio en la memoria flash local de la tablet para uso 100% offline.
 */
export async function saveStemToLocalCache(url: string): Promise<boolean> {
  if (typeof window === "undefined" || !("caches" in window)) return false;
  try {
    const cache = await caches.open(STEMS_CACHE_NAME);
    const existing = await cache.match(url);
    if (existing) return true;

    const res = await fetch(url);
    if (!res.ok) return false;
    await cache.put(url, res.clone());
    return true;
  } catch (err) {
    console.warn("Fallo al guardar stem en caché local de tablet:", err);
    return false;
  }
}

/**
 * Elimina un stem de la memoria flash de la tablet.
 */
export async function deleteStemFromLocalCache(url: string): Promise<boolean> {
  if (typeof window === "undefined" || !("caches" in window)) return false;
  try {
    const cache = await caches.open(STEMS_CACHE_NAME);
    return await cache.delete(url);
  } catch {
    return false;
  }
}

/**
 * Obtiene la estimación de uso de almacenamiento del dispositivo.
 */
export async function getStorageUsage(): Promise<{ usedMb: number; quotaMb: number; percent: number }> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return { usedMb: 0, quotaMb: 0, percent: 0 };
  }
  try {
    const estimate = await navigator.storage.estimate();
    const usedMb = Math.round((estimate.usage || 0) / (1024 * 1024));
    const quotaMb = Math.round((estimate.quota || 0) / (1024 * 1024));
    const percent = quotaMb > 0 ? Math.round((usedMb / quotaMb) * 100) : 0;
    return { usedMb, quotaMb, percent };
  } catch {
    return { usedMb: 0, quotaMb: 0, percent: 0 };
  }
}

/* ==========================================================================
   SCREEN WAKE LOCK (Evita que la pantalla se apague en el atril de ensayo)
   ========================================================================== */

let activeWakeLock: unknown = null;

export async function requestScreenWakeLock(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return false;
  try {
    const nav = navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } };
    activeWakeLock = await nav.wakeLock.request("screen");
    return true;
  } catch {
    // Si la tablet deniega el permiso (batería muy baja, pestaña inactiva), no lanzar error
    activeWakeLock = null;
    return false;
  }
}

export function releaseScreenWakeLock(): void {
  if (activeWakeLock) {
    try {
      const lock = activeWakeLock as { release?: () => Promise<void> };
      lock.release?.();
    } catch {
      // Ignorar
    } finally {
      activeWakeLock = null;
    }
  }
}

