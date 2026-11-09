import { getMark } from '@/features/records/data/quickMarks';
import { SUMMARY_FIELDS, findQuestion } from '@/features/records/data/prancheta';
import { formatTime } from '@/features/records/utils/recordView';
import { formatDayLong, formatRange } from './dates';
import { STATUS_LABELS, summarizeEntries } from './reportView';

const ANSWERS = { yes: 'Sim', no: 'Não' };

// Marcações de um momento juntas ("Crise ×2, Calmo(a)"), na ordem em que aconteceram pela primeira vez.
function describeMarks(events) {
  const counts = new Map();
  events
    .filter((event) => event.key !== 'note')
    .sort((a, b) => a.at - b.at)
    .forEach((event) => counts.set(event.key, (counts.get(event.key) ?? 0) + 1));
  return [...counts.entries()].map(([key, count]) => (count > 1 ? `${getMark(key).label} ×${count}` : getMark(key).label)).join(', ');
}

function describeDay(entry) {
  const lines = [`${formatDayLong(entry.date)}: ${entry.status === 'today' && entry.record ? 'Em andamento' : STATUS_LABELS[entry.status]}`];
  if (!entry.record) return lines;

  entry.record.blocks.forEach((block) => {
    const events = entry.record.events.filter((event) => event.blockId === block.id);
    const answers = Object.entries(entry.record.answers?.[block.id] ?? {}).filter(([, item]) => item.answer || item.obs?.trim());
    if (!events.length && !answers.length) return;

    lines.push(`  ${block.title}`);
    const marks = describeMarks(events);
    if (marks) lines.push(`    Marcações: ${marks}`);
    events
      .filter((event) => event.key === 'note')
      .forEach((event) => lines.push(`    Anotação (${formatTime(event.at)}): ${event.text}`));
    answers.forEach(([key, item]) => {
      const answer = [item.answer ? ANSWERS[item.answer] : null, item.obs?.trim()].filter(Boolean).join(' — ');
      lines.push(`    ${findQuestion(key).label} ${answer}`);
    });
  });

  SUMMARY_FIELDS.filter((field) => entry.record.summary?.[field.key]?.trim()).forEach((field, index) => {
    if (index === 0) lines.push('  Resumo do dia');
    lines.push(`    ${field.label} ${entry.record.summary[field.key].trim()}`);
  });
  return lines;
}

// Texto do relatório da semana, pronto para compartilhar ou copiar.
export function buildWeekReportText({ child, entries, monday, last, author }) {
  const totals = summarizeEntries(entries);
  const days = entries.filter((entry) => entry.status !== 'off' && entry.status !== 'future');

  return [
    `Relatório semanal — ${child.name}`,
    `Semana de ${formatRange(monday, last)} de ${last.getFullYear()}`,
    author ? `Acompanhante terapêutica: ${author}` : null,
    '',
    `Atendimentos: ${totals.done} · Suspensos: ${totals.suspended} · Conquistas: ${totals.wins} · Ocorrências: ${totals.occurrences}`,
    '',
    ...days.flatMap((entry) => [...describeDay(entry), '']),
  ]
    .filter((line) => line !== null)
    .join('\n')
    .trim();
}
