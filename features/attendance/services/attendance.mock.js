import { toDateKey } from '@/utils/calendar';

// DADOS FICTÍCIOS (mock): histórico de atendimentos dos últimos ~45 dias, só em dias úteis.
// Formato: { 'AAAA-MM-DD': 'done' | 'suspended' }. Hoje não entra (o dia ainda está em andamento).
// Quando existir backend, este arquivo é removido e o serviço passa a chamar a API.
const DAYS_BACK = 45;
const SUSPENDED_EVERY = 6; // dia do mês múltiplo de 6 = atendimento suspenso (só para variar o exemplo)

// Regra do exemplo: dia do mês múltiplo de 6 = atendimento suspenso. Os relatórios usam a mesma regra do calendário.
export const mockStatusFor = (date) => (date.getDate() % SUSPENDED_EVERY === 0 ? 'suspended' : 'done');

export function buildAttendanceMock(today = new Date()) {
  const history = {};

  for (let offset = 1; offset <= DAYS_BACK; offset += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) continue;

    history[toDateKey(date)] = mockStatusFor(date);
  }

  return history;
}
