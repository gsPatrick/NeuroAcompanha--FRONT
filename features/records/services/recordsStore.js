// Registro do dia de cada aluno, guardado no aparelho em IndexedDB (dado sensível: comportamento de uma criança).
// Um registro por aluno por dia (id = `${alunoId}:${AAAA-MM-DD}`): ao virar o dia, o registro começa vazio.
// Nada é enviado para fora. Quando existir backend, a fonte de verdade passa a ser o servidor.
const DB_NAME = 'neuro-acompanha-records';
const DB_VERSION = 1;
const STORE = 'records';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const promisify = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const recordId = (childId, dateKey) => `${childId}:${dateKey}`;

// Retorna null se ainda não houver registro (ou se o armazenamento estiver bloqueado, ex.: janela privada).
export async function loadRecord(id) {
  try {
    const database = await openDatabase();
    const record = await promisify(database.transaction(STORE, 'readonly').objectStore(STORE).get(id));
    database.close();
    return record ?? null;
  } catch {
    return null;
  }
}

export async function saveRecord(record) {
  const database = await openDatabase();
  await promisify(database.transaction(STORE, 'readwrite').objectStore(STORE).put(record));
  database.close();
}

// Coloca um momento novo logo DEPOIS de `afterBlockId` (se não existir, vai para o fim do dia) e deixa o cursor nele:
// o registro reabre no momento novo. Faz tudo de uma vez (ler, mudar, gravar) para a tela anterior já encontrar o momento ao voltar.
export async function insertBlock(id, block, afterBlockId) {
  const record = await loadRecord(id);
  if (!record) throw new Error('Registro do dia não encontrado.');
  const position = record.blocks.findIndex((item) => item.id === afterBlockId);
  const at = position === -1 ? record.blocks.length : position + 1;
  const blocks = [...record.blocks.slice(0, at), block, ...record.blocks.slice(at)];
  await saveRecord({ ...record, blocks, cursor: block.id });
}
