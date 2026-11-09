import { mockStatusFor } from '@/features/attendance/services/attendance.mock';
import { loadRecord, recordId } from '@/features/records/services/recordsStore';
import { getRoutineDay } from '@/features/routine/utils/routine';
import { toDateKey } from '@/utils/calendar';
import { buildMockRecord } from './records.mock';

// O que houve com o aluno num dia. status:
//  off       a rotina do aluno não tem atendimento nesse dia da semana
//  future    o dia ainda não chegou
//  today     é hoje (record = o que já foi registrado, ou null se ainda nada)
//  suspended atendimento suspenso (exemplo)
//  done      atendimento feito; record = o registro do dia (o do aparelho, se existir; senão o de exemplo)
export async function getDayEntry(child, date) {
  const key = toDateKey(date);
  const todayKey = toDateKey(new Date());
  const entry = { key, date };

  if (!getRoutineDay(child.routine, date)?.attends) return { ...entry, status: 'off', record: null };
  if (key > todayKey) return { ...entry, status: 'future', record: null };

  const saved = await loadRecord(recordId(child.id, key));
  const record = saved?.blocks ? saved : null;

  if (key === todayKey) return { ...entry, status: 'today', record };
  if (record) return { ...entry, status: 'done', record };
  if (mockStatusFor(date) === 'suspended') return { ...entry, status: 'suspended', record: null };
  return { ...entry, status: 'done', record: buildMockRecord(child, date) };
}

export const getDayEntries = (child, dates) => Promise.all(dates.map((date) => getDayEntry(child, date)));
