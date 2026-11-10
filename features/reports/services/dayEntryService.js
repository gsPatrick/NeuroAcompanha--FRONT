import { listRecords } from '@/features/records/services/recordsStore';
import { getRoutineDay } from '@/features/routine/utils/routine';
import { toDateKey } from '@/utils/calendar';

// O que houve com o aluno num dia. status:
//  off       a rotina do aluno não tem atendimento nesse dia da semana
//  future    o dia ainda não chegou
//  today     é hoje (record = o que já foi registrado, ou null se ainda nada)
//  suspended atendimento suspenso
//  done      atendimento feito; record = o registro do dia
//  none      dia de atendimento que passou sem nenhum registro
// `updatedAt`: última alteração do dia na API (o relatório da semana usa para saber se ficou desatualizado).
function buildEntry(child, date, saved, todayKey) {
  const key = toDateKey(date);
  const entry = { key, date, updatedAt: saved?.updatedAt };
  // Dia reaberto depois de suspenso fica sem momentos: ainda não é um registro.
  const record = saved?.blocks.length ? saved : null;

  if (saved?.status === 'suspended') return { ...entry, status: 'suspended', record: null };
  if (!getRoutineDay(child.routine, date)?.attends) return { ...entry, status: 'off', record: null };
  if (key > todayKey) return { ...entry, status: 'future', record: null };
  if (key === todayKey) return { ...entry, status: 'today', record };
  return record ? { ...entry, status: 'done', record } : { ...entry, status: 'none', record: null };
}

export async function getDayEntries(child, dates) {
  const todayKey = toDateKey(new Date());
  const keys = dates.map(toDateKey).filter((key) => key <= todayKey).sort();
  const saved = keys.length ? await listRecords(child.id, keys[0], keys[keys.length - 1]) : [];
  const byDate = new Map(saved.map((record) => [record.date, record]));

  return dates.map((date) => buildEntry(child, date, byDate.get(toDateKey(date)), todayKey));
}

export const getDayEntry = async (child, date) => (await getDayEntries(child, [date]))[0];
