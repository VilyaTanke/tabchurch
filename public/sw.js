const CACHE_NAME = "tabchurch-v1";
const OFFLINE_URLS = [
  "/",
  "/canciones",
  "/listas",
  "/grupos",
  "/manifest.json",
  "/login-bg.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch((err) => {
        console.warn("Error en precache inicial PWA:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Ignorar peticiones que no sean GET o no sean HTTP/HTTPS
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Guardar copia fresca en caché para assets estáticos y páginas
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.includes("/_next/static/") ||
            event.request.url.includes("/canciones") ||
            event.request.url.includes("/listas") ||
            event.request.destination === "style" ||
            event.request.destination === "script" ||
            event.request.destination === "image" ||
            event.request.destination === "font")
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En caso de estar offline, responder desde caché
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si es una navegación y no está en caché, intentar entregar inicio
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});
