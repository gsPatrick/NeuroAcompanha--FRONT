import { apiRequest } from '@/core/api/apiClient';
import { cachedRequest } from '@/core/offline/cache';

// Presença de TODOS os alunos da AT num período (AAAA-MM-DD), sem o conteúdo dos registros:
// [{ childId, date, status: 'open' | 'finished' | 'suspended', filled }]. `filled` = um dia ainda aberto que já tem algo registrado.
// `cacheKey` separa quem pede períodos diferentes (calendário x números do mês); sem internet vale a última resposta dele.
export const listAttendance = (from, to, cacheKey = 'attendance') =>
  cachedRequest(cacheKey, () => apiRequest('/attendance', { query: { from, to } })).then((rows) => rows.filter((row) => row.date >= from && row.date <= to));

// O aluno foi atendido nesse dia? (dia fechado, ou aberto mas com registro)
const wasAttended = (row) => row.status === 'finished' || (row.status === 'open' && row.filled);

// Calendário: { 'AAAA-MM-DD': 'done' | 'suspended' } só de dias que já passaram. O dia vale como suspenso quando
// TODOS os atendimentos dele foram suspensos; basta um atendimento feito para valer como feito.
export function buildAttendanceMap(rows, todayKey) {
  const byDate = new Map();
  rows
    .filter((row) => row.date < todayKey)
    .forEach((row) => byDate.set(row.date, [...(byDate.get(row.date) ?? []), row]));

  const map = {};
  byDate.forEach((dayRows, date) => {
    if (dayRows.some(wasAttended)) map[date] = 'done';
    else if (dayRows.every((row) => row.status === 'suspended')) map[date] = 'suspended';
  });
  return map;
}

// Números do período, somando as crianças: atendimentos feitos e suspensos nos dias que já passaram.
export function countAttendance(rows, todayKey) {
  const past = rows.filter((row) => row.date < todayKey);
  return { done: past.filter(wasAttended).length, suspended: past.filter((row) => row.status === 'suspended').length };
}
