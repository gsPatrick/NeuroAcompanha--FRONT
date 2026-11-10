import { clearToken, getToken, setToken } from '@/core/api/tokenStore';

// A sessão é o token da API: com ele a AT está dentro; sem ele, a tela de entrada.
export const hasSession = () => Boolean(getToken());

export const startSession = (token) => setToken(token);

// Conta com senha provisória: até definir a própria senha, o app só mostra a tela de definir senha.
const MUST_CHANGE_KEY = 'neuro-acompanha:must-change-password';

export function needsPasswordChange() {
  try {
    return window.localStorage.getItem(MUST_CHANGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markPasswordChange(required) {
  try {
    if (required) window.localStorage.setItem(MUST_CHANGE_KEY, '1');
    else window.localStorage.removeItem(MUST_CHANGE_KEY);
  } catch {
    // Sem armazenamento: o servidor continua exigindo a troca no próximo acesso.
  }
}

export function endSession() {
  clearToken();
  markPasswordChange(false);
}
