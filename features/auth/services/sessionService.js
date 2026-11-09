// Sessão MOCK: só um marcador de "já passou pela tela de entrada" (nenhum dado pessoal).
// Quando existir backend, troque por token em cookie httpOnly emitido pelo servidor.
const STORAGE_KEY = 'neuro-acompanha:session';

export function hasSession() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function startSession() {
  try {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // Sem persistência: vale só até recarregar.
  }
}

export function endSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nada a limpar.
  }
}
