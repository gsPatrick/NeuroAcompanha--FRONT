// Service worker do Neuro Acompanha: deixa o app abrir e funcionar sem internet.
//  - /_next/static/*  (arquivos com hash no nome, nunca mudam)  -> cache primeiro
//  - imagens, ícones, manifesto                                  -> usa o guardado e atualiza por trás
//  - páginas (HTML)                                              -> rede primeiro; sem rede (ou rede lenta), a última cópia
//  - API, /api/version e transições do Next (RSC)                -> sempre rede (se falhar, o Next abre a página por documento)
// Os DADOS (registros, alunos) não passam por aqui: ficam no IndexedDB do app (ver core/offline).
const STATIC = 'neuro-static';
const PAGES = 'neuro-pages';
const MAX_STATIC_ENTRIES = 400;
const SLOW_NETWORK_MS = 4000;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Limpa caches de versões antigas deste worker e mantém a pasta de arquivos com hash enxuta.
      const names = await caches.keys();
      await Promise.all(names.filter((name) => ![STATIC, PAGES].includes(name)).map((name) => caches.delete(name)));
      const cache = await caches.open(STATIC);
      const keys = await cache.keys();
      if (keys.length > MAX_STATIC_ENTRIES) await Promise.all(keys.slice(0, keys.length - MAX_STATIC_ENTRIES).map((key) => cache.delete(key)));
      await self.clients.claim();
    })(),
  );
});

// O que se guarda é o conteúdo JÁ decodificado: os cabeçalhos que descrevem como o corpo CHEGOU (gzip, chunked, tamanho)
// não valem mais e, repetidos numa resposta montada pelo worker, fazem o navegador recusar a página.
async function storable(response) {
  const headers = new Headers(response.headers);
  ['content-encoding', 'content-length', 'transfer-encoding'].forEach((name) => headers.delete(name));
  return new Response(await response.clone().blob(), { status: response.status, statusText: response.statusText, headers });
}

const isAsset = (url) => /\.(png|jpe?g|webp|svg|ico|woff2?)$/.test(url.pathname) || url.pathname.startsWith('/icon/') || url.pathname.startsWith('/splash/') || url.pathname === '/manifest.webmanifest';

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) cache.put(request, await storable(response));
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  const refresh = fetch(request).then(async (response) => {
    if (response.ok) cache.put(request, await storable(response));
    return response;
  });
  if (hit) {
    refresh.catch(() => {});
    return hit;
  }
  return refresh;
}

// A página é guardada pelo caminho, sem parâmetros (?ver=, ?data=...).
const pageKey = (url) => new Request(`${url.origin}${url.pathname}`);

const offlinePage = () =>
  new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Neuro Acompanha</title>' +
      '<body style="font-family:-apple-system,system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;color:#23396f;text-align:center;padding:24px">' +
      '<div><h1 style="font-size:1.25rem">Esta tela ainda não está disponível sem internet</h1><p>Volte ao início e continue pelo que já abriu antes.</p><p><a href="/">Ir para o início</a></p></div>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

// O HTML de cada tela lista os arquivos de código dela (nos <script> e nos dados que o Next embute). Ao guardar a página,
// guarda também esses arquivos: sem eles a tela abriria em branco/erro sem internet. Só baixa o que ainda não tem.
async function precacheAssetsOf(html) {
  const found = new Set([...html.matchAll(/static\/[A-Za-z0-9_\-/.]+\.(?:js|css|woff2)/g)].map((match) => `/_next/${match[0]}`));
  const cache = await caches.open(STATIC);
  await Promise.all(
    [...found].map(async (path) => {
      if (await cache.match(path)) return;
      try {
        const response = await fetch(path);
        if (response.ok) await cache.put(path, await storable(response));
      } catch {
        // Sem rede agora: fica para a próxima vez.
      }
    }),
  );
}

async function networkFirstPage(event, request) {
  const url = new URL(request.url);
  const key = pageKey(url);
  const cache = await caches.open(PAGES);
  const cached = await cache.match(key);

  try {
    // Com cópia guardada, rede lenta não trava: passou do limite, vale a cópia.
    const response = await (cached ? timeout(fetch(request), SLOW_NETWORK_MS) : fetch(request));
    if (response.ok && !response.redirected) {
      cache.put(key, await storable(response));
      event.waitUntil(response.clone().text().then(precacheAssetsOf).catch(() => {}));
    }
    return response;
  } catch {
    return cached ?? offlinePage();
  }
}

const timeout = (promise, ms) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('lento')), ms))]);

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // a API (outro endereço) nunca passa por aqui
  if (url.pathname.startsWith('/api/')) return;
  if (request.headers.get('RSC')) return;

  if (url.pathname.startsWith('/_next/static/')) event.respondWith(cacheFirst(request));
  else if (url.pathname.startsWith('/_next/image') || isAsset(url)) event.respondWith(staleWhileRevalidate(request));
  else if (request.mode === 'navigate' || (request.headers.get('accept') ?? '').includes('text/html')) event.respondWith(networkFirstPage(event, request));
});
