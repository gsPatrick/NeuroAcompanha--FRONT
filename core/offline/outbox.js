import { ApiError, isOfflineError } from '@/core/api/apiClient';
import { getToken } from '@/core/api/tokenStore';
import { localAll, localDelete, localGet, localPut } from './localDb';

// Fila de envio (outbox): tudo o que a AT faz passa primeiro pelo aparelho e vai para a API aqui, em ordem, sem ela perceber.
// Sem internet, a fila espera e tenta de novo sozinha (quando a conexão volta, ao reabrir o app e a cada 20 s).
// Erro "definitivo" (a API recusou o pedido) tira o item da fila para não travar o resto.
//
// Cada item: { seq, kind, ...dados }. Quem sabe enviar cada `kind` registra um handler: (item) => Promise<resultado>.
const handlers = new Map();
const results = new Map(); // seq -> resultado do handler (ex.: { weekReport } de "fechar o dia")
let running = null;
let timer = null;
let inFlightSeq = null;

export const registerOutboxHandler = (kind, handler) => handlers.set(kind, handler);

async function nextSeq() {
  const meta = await localGet('meta', 'seq');
  const seq = (meta?.value ?? 0) + 1;
  await localPut('meta', { key: 'seq', value: seq });
  return seq;
}

export const listPending = async () => (await localAll('outbox')).sort((a, b) => a.seq - b.seq);

export async function hasPending(match) {
  return (await listPending()).some(match);
}

// Coloca um item no fim da fila e já tenta enviar. Devolve o `seq`.
export async function enqueue(entry) {
  const seq = await nextSeq();
  await localPut('outbox', { ...entry, seq });
  startRetrying();
  processOutbox().catch(() => {});
  return seq;
}

export const resultOf = (seq) => results.get(seq) ?? null;
export const isInFlight = (seq) => inFlightSeq === seq;

// Envia a fila, um item de cada vez e na ordem. Só uma rodada por vez (chamadas durante uma rodada esperam por ela).
export function processOutbox() {
  if (running) return running;
  running = (async () => {
    // Sem login não há para quem enviar (a fila fica guardada até entrar de novo).
    if (!getToken()) return;
    // Repete até esvaziar: o que a AT anotar enquanto uma rodada está enviando entra na rodada seguinte, sem esperar.
    for (let pending = await listPending(); pending.length; pending = await listPending()) {
      for (const item of pending) {
        const handler = handlers.get(item.kind);
        if (!handler) {
          await localDelete('outbox', item.seq);
          continue;
        }
        inFlightSeq = item.seq;
        try {
          results.set(item.seq, await handler(item));
          await localDelete('outbox', item.seq);
        } catch (error) {
          // Sem internet/servidor fora do ar, ou sessão vencida: para por aqui e tenta de novo depois, na mesma ordem.
          if (isOfflineError(error) || (error instanceof ApiError && error.status === 401)) return;
          // A API recusou de vez (ex.: dia suspenso): descarta este item e segue.
          console.warn('[offline] item descartado da fila:', item.kind, error?.code ?? error?.message);
          await localDelete('outbox', item.seq);
        } finally {
          inFlightSeq = null;
        }
      }
    }
  })().finally(() => {
    running = null;
  });
  return running;
}

// Espera a fila esvaziar por até `ms` (para telas que querem o resultado, ex.: fechar o dia). Nunca lança.
export async function syncNow(ms = 6000) {
  await Promise.race([processOutbox().catch(() => {}), new Promise((resolve) => setTimeout(resolve, ms))]);
}

function startRetrying() {
  if (timer || typeof window === 'undefined') return;
  timer = setInterval(async () => {
    if (!(await listPending()).length) {
      clearInterval(timer);
      timer = null;
      return;
    }
    processOutbox().catch(() => {});
  }, 20000);
}

if (typeof window !== 'undefined') {
  // Voltou a internet / voltou para o app: manda o que ficou esperando.
  window.addEventListener('online', () => processOutbox().catch(() => {}));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') processOutbox().catch(() => {});
  });
  // Reabriu o app com coisas pendentes de antes: retoma.
  listPending().then((pending) => {
    if (pending.length) {
      startRetrying();
      processOutbox().catch(() => {});
    }
  });
}
