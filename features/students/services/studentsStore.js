// Alunos cadastrados no onboarding, guardados no aparelho em IndexedDB (dados sensíveis: nome, foto, laudo).
// Nada é enviado para fora. Quando existir backend, a fonte de verdade passa a ser o servidor, e isto vira cache.
const DB_NAME = 'neuro-acompanha';
const DB_VERSION = 1;
const STORE = 'students';

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

// Retorna [] se não houver alunos ou se o armazenamento estiver bloqueado (ex.: janela privada).
export async function loadStudents() {
  try {
    const database = await openDatabase();
    const students = await promisify(database.transaction(STORE, 'readonly').objectStore(STORE).getAll());
    database.close();
    return students.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

// Substitui todos os alunos pelos informados (o cadastro do onboarding é sempre o conjunto completo).
export async function saveStudents(students) {
  const database = await openDatabase();

  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE, 'readwrite');
    const store = transaction.objectStore(STORE);
    store.clear();
    students.forEach((student) => store.put(student));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

  database.close();
}
