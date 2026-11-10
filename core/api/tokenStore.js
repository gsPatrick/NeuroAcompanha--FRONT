// Token de acesso da AT (JWT emitido pela API). Fica no aparelho enquanto a sessão durar.
// Dados sensíveis (crianças, registros) NÃO ficam no aparelho: vêm sempre da API.
const STORAGE_KEY = 'neuro-acompanha:token';

export function getToken() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Sem persistência: a sessão vale só até recarregar.
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nada a limpar.
  }
}
