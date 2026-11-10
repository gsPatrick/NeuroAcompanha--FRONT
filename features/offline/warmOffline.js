// Deixa no aparelho as telas que a AT usa no dia a dia, para abrirem mesmo sem internet (ex.: o registro de cada aluno).
// Roda uma vez por abertura do app, em segundo plano e sem pressa. Só tem efeito com o service worker ativo (produção).
const DONE_KEY = 'neuro-acompanha:warmed';

const STATIC_PATHS = ['/', '/criancas', '/agenda', '/profile', '/profile/editar', '/criancas/novo'];

const pathsFor = (children) => [
  ...STATIC_PATHS,
  ...children.flatMap((child) => [`/registro/${child.id}`, `/registro/${child.id}/novo`, `/registro/${child.id}/editar`, `/criancas/${child.id}`, `/criancas/${child.id}/editar`]),
];

// Espera o service worker assumir a página (na primeira visita ele ainda não controla): sem isso, as telas buscadas aqui não seriam guardadas.
const whenControlled = () =>
  new Promise((resolve) => {
    if (navigator.serviceWorker.controller) return resolve();
    navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
    return setTimeout(resolve, 15000);
  });

export function warmOffline(children, router) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  const signature = children.map((child) => child.id).join(',');
  try {
    if (window.sessionStorage.getItem(DONE_KEY) === signature) return;
  } catch {
    // Sem sessionStorage: aquece de novo a cada abertura da tela (sem problema).
  }

  const paths = pathsFor(children);
  const run = async () => {
    await whenControlled();
    for (const path of paths) {
      try {
        router.prefetch(path); // baixa o código da tela
        await fetch(path, { headers: { Accept: 'text/html' }, credentials: 'same-origin' }); // o service worker guarda a página
      } catch {
        // Sem internet agora: tenta de novo na próxima abertura.
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    // Só vale como "feito" se terminou tudo.
    try {
      window.sessionStorage.setItem(DONE_KEY, signature);
    } catch {
      // Sem sessionStorage: sem problema.
    }
  };
  setTimeout(() => (window.requestIdleCallback ? window.requestIdleCallback(run) : run()), 3000);
}
