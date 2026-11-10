import { apiRequest } from '@/core/api/apiClient';
import { adoptLocalUser, wipeLocalDataOnSignOut } from '@/core/offline/session';
import { endSession, markPasswordChange, startSession } from './sessionService';

// Abre a sessão com o token recebido e informa o que o app precisa saber para decidir a próxima tela:
// se a conta já tem alunos (pula o cadastro inicial) e se ainda tem senha provisória.
export async function openSession({ token, user }) {
  startSession(token);
  markPasswordChange(user.mustChangePassword);
  await adoptLocalUser(user.id);
  const children = await apiRequest('/children');
  return { hasChildren: children.length > 0, mustChangePassword: user.mustChangePassword };
}

// Entra com e-mail e senha (a conta é conferida pela API).
export async function login({ email, password }) {
  return openSession(await apiRequest('/auth/login', { method: 'POST', body: { email: email.trim(), password } }));
}

// Primeiro acesso: troca a senha provisória pela que a AT escolheu. Resolve com { hasChildren }.
export async function defineFirstPassword(newPassword) {
  await apiRequest('/auth/first-password', { method: 'POST', body: { newPassword } });
  markPasswordChange(false);
  const children = await apiRequest('/children');
  return { hasChildren: children.length > 0 };
}

// Sair da conta: envia o que estiver pendente, apaga os dados locais (se nada ficou para trás) e encerra a sessão.
export async function signOut() {
  await wipeLocalDataOnSignOut();
  endSession();
}
