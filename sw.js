/* ============================================================================
   SERVICE WORKER — App Cinética Química
   ----------------------------------------------------------------------------
   REGRA CRÍTICA: a cada alteração no app, incremente a versão AQUI (CACHE)
   E no selo de versão dentro de cinetica.html (const VERSAO).
   Se não incrementar, o celular continua servindo a versão velha do cache.
   ----------------------------------------------------------------------------
   Estratégia:
     - HTML / navegação  -> NETWORK-FIRST (sempre tenta pegar a versão nova)
     - demais assets     -> CACHE-FIRST com preenchimento em runtime
       (áudios, imagens, three.js do CDN, manifest...)
   ========================================================================== */

const CACHE = 'cinetica-v1.25.0';

/* Arquivos essenciais pré-cacheados na instalação.
   Mantenha curto: áudios/imagens entram sozinhos no cache em runtime. */
const PRECACHE = [
  './',
  './index.html',
  './cinetica.html',
  './manifest.json',
  './libs/three.min.js'
];

/* ------------------------------- INSTALL -------------------------------- */
self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

/* ------------------------------- ACTIVATE ------------------------------- */
self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(
        chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* Permite que a página force a ativação imediata (botão "atualizar"). */
self.addEventListener('message', (ev) => {
  if (ev.data && ev.data.tipo === 'PULAR_ESPERA') self.skipWaiting();
});

/* -------------------------------- FETCH --------------------------------- */
self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const ehNavegacao =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  /* ---- 1) HTML / navegação: NETWORK-FIRST ---- */
  if (ehNavegacao) {
    ev.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia).catch(() => null));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('./cinetica.html'))
        )
    );
    return;
  }

  /* ---- 2) Assets: CACHE-FIRST + preenchimento em runtime ---- */
  ev.respondWith(
    caches.match(req).then((cacheado) => {
      if (cacheado) return cacheado;

      return fetch(req)
        .then((res) => {
          /* Só guarda respostas utilizáveis (inclui 'opaque' do CDN do Three.js). */
          const guardavel =
            res && (res.status === 200 || res.type === 'opaque') &&
            (url.protocol === 'http:' || url.protocol === 'https:');

          if (guardavel) {
            const copia = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copia).catch(() => null));
          }
          return res;
        })
        .catch(() => cacheado || Response.error());
    })
  );
});
