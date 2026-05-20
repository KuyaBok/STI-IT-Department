const CACHE_NAME = "sti-calamba-v8";

const OFFLINE_ASSETS = [
  "./",
  "./index.html",
  "./about.html",
  "./programs.html",
  "./facilities.html",
  "./dashboard.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./Assets/Images/logo_sti.png",
  "./Assets/Images/favicon.ico"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isDocument = event.request.mode === "navigate" || event.request.destination === "document";
  const isCoreAsset = isSameOrigin && /\.(html|css|js)$/.test(requestUrl.pathname);

  if (isDocument || isCoreAsset) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() =>
          caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;
            return caches.match("./index.html");
          })
        )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        fetch(event.request)
          .then(networkResponse => {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
