// Armazenamento local do aparelho (IndexedDB), usado em silêncio para o app funcionar sem internet:
//  records  registros do dia (a cópia local, com o que ainda não foi enviado)
//  cache    últimas respostas da API (alunos, perfil, presença...) para abrir sem conexão
//  outbox   fila do que ainda precisa ser enviado à API, em ordem
//  meta     pequenos avisos internos (de quem são os dados locais, contador da fila)
// Tudo fica também espelhado em memória: leitura imediata e, se o navegador bloquear o IndexedDB (janela privada),
// o app segue funcionando enquanto estiver aberto. Dados sensíveis: são apagados ao sair da conta (ver clearLocalData).
const DB_NAME = 'neuro-acompanha-offline';
const DB_VERSION = 1;
const STORES = { records: 'id', cache: 'key', outbox: 'seq', meta: 'key' };

const memory = Object.fromEntries(Object.keys(STORES).map((name) => [name, new Map()]));
let dbPromise = null;

const promisify = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      Object.entries(STORES).forEach(([name, keyPath]) => request.result.createObjectStore(name, { keyPath }));
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Abre o banco e carrega tudo para a memória (uma vez).
function ready() {
  dbPromise ??= (async () => {
    if (typeof window === 'undefined' || !window.indexedDB) return null;
    try {
      const database = await openDatabase();
      for (const name of Object.keys(STORES)) {
        const all = await promisify(database.transaction(name, 'readonly').objectStore(name).getAll());
        all.forEach((item) => memory[name].set(item[STORES[name]], item));
      }
      return database;
    } catch {
      return null; // sem armazenamento persistente: vale só a memória
    }
  })();
  return dbPromise;
}

async function persist(name, change) {
  const database = await ready();
  if (!database) return;
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(name, 'readwrite');
      change(transaction.objectStore(name));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } catch {
    // Falhou gravar no disco: a memória segue valendo.
  }
}

export async function localGet(store, key) {
  await ready();
  return memory[store].get(key) ?? null;
}

export async function localAll(store) {
  await ready();
  return [...memory[store].values()];
}

export async function localPut(store, value) {
  await ready();
  memory[store].set(value[STORES[store]], value);
  await persist(store, (objectStore) => objectStore.put(value));
}

export async function localDelete(store, key) {
  await ready();
  memory[store].delete(key);
  await persist(store, (objectStore) => objectStore.delete(key));
}

// Apaga TUDO (ao sair da conta ou quando outra pessoa entra neste aparelho).
export async function clearAllLocal() {
  await ready();
  Object.keys(STORES).forEach((name) => memory[name].clear());
  await Promise.all(Object.keys(STORES).map((name) => persist(name, (objectStore) => objectStore.clear())));
}
