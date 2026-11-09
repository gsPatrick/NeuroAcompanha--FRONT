import { getMark } from '@/features/records/data/quickMarks';

// Números de um registro: momentos, marcações, ocorrências (vermelhas), conquistas (verdes), anotações e respostas da prancheta.
export function summarizeRecord(record) {
  if (!record) return { moments: 0, marks: 0, occurrences: 0, wins: 0, notes: 0, answers: 0 };
  const marks = record.events.filter((event) => event.key !== 'note');
  const tones = marks.map((event) => getMark(event.key).tone);
  return {
    moments: record.blocks.length,
    marks: marks.length,
    occurrences: tones.filter((tone) => tone === 'alert').length,
    wins: tones.filter((tone) => tone === 'good').length,
    notes: record.events.length - marks.length,
    answers: Object.values(record.answers ?? {}).reduce(
      (total, block) => total + Object.values(block).filter((item) => item.answer || item.obs?.trim()).length,
      0,
    ),
  };
}

// Totais de um conjunto de dias: atendimentos feitos, suspensos e as somas dos registros.
export function summarizeEntries(entries) {
  const totals = { done: 0, suspended: 0, occurrences: 0, wins: 0, marks: 0 };
  entries.forEach((entry) => {
    if (entry.status === 'suspended') totals.suspended += 1;
    if (entry.status === 'done' || (entry.status === 'today' && entry.record)) totals.done += 1;
    const numbers = summarizeRecord(entry.record);
    totals.occurrences += numbers.occurrences;
    totals.wins += numbers.wins;
    totals.marks += numbers.marks;
  });
  return totals;
}

export const STATUS_LABELS = {
  done: 'Atendido',
  suspended: 'Suspenso',
  today: 'Hoje',
  off: 'Não atende',
  future: 'Ainda não chegou',
};
