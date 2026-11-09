import { getMark } from '../data/quickMarks';

// Quantas vezes cada marcação foi feita num bloco: { crisis: 2, calm: 1 }.
export function countByMark(events, blockId) {
  return events
    .filter((event) => event.blockId === blockId)
    .reduce((counts, event) => {
      counts[event.key] = (counts[event.key] ?? 0) + 1;
      return counts;
    }, {});
}

// Linha do tempo: a mais recente primeiro, já com rótulo e tom de cada marcação.
// Sem `blockId`, traz o dia todo e inclui o nome do bloco (`blockTitle`).
export function buildTimeline(events, blocks, blockId) {
  const titles = new Map(blocks.map((block) => [block.id, block.title]));
  return events
    .filter((event) => !blockId || event.blockId === blockId)
    .sort((a, b) => b.at - a.at)
    .map((event) => ({ ...event, ...getMark(event.key), blockTitle: titles.get(event.blockId) ?? '' }));
}

// Quantas perguntas da prancheta têm resposta ou observação neste bloco.
export function countAnswered(answers, blockId) {
  return Object.values(answers[blockId] ?? {}).filter((item) => item.answer || item.obs?.trim()).length;
}

// "3 marcações · 2 respostas" ou "" se ainda não houver nada.
export function describeBlockProgress(record, blockId) {
  const marks = record.events.filter((event) => event.blockId === blockId).length;
  const answered = countAnswered(record.answers, blockId);
  const parts = [];
  if (marks) parts.push(marks === 1 ? '1 marcação' : `${marks} marcações`);
  if (answered) parts.push(answered === 1 ? '1 resposta' : `${answered} respostas`);
  return parts.join(' · ');
}

// "14:32"
export function formatTime(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
}
