const CACHE_NAME = 'latente-os-v10';
const ASSETS = [
  './',
  './dashboard.html',
  './admin.html',
  './style.css',
  './manifest.json'
];

// ... (El resto del código del service-worker.js se queda exactamente igual de ahí para abajo)
// Instalar la aplicación en el dispositivo y guardar los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Limpiar cachés antiguos si haces actualizaciones del diseño
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Controlar las peticiones de red (Mantiene a Supabase funcionando online en tiempo real)
self.addEventListener('fetch', event => {
  // Las llamadas de datos a Supabase o APIs externas NO se guardan en caché para mantener los botones actualizados
  if (event.request.url.includes('supabase') || event.request.url.includes('api')) {
    return fetch(event.request);
  }
  
  // Para los archivos visuales (HTML, CSS), carga desde la caché para máxima velocidad
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});