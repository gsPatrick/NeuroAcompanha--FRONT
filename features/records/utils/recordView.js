import { getMark } from '../data/quickMarks';

// Quais marcações rápidas estão marcadas num momento (as anotações não contam).
export function markedKeys(events, blockId) {
  return new Set(events.filter((event) => event.blockId === blockId && event.key !== 'note').map((event) => event.key));
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

// Momento em que o registro reabre: onde ela parou (cursor) ou, num dia que já tem conteúdo mas nunca guardou onde parou,
// o último momento preenchido. Dia em branco começa no primeiro.
export function findResumeBlockId(record) {
  // 'summary' = parou no Resumo do dia.
  if (record.cursor === 'summary' || (record.cursor && record.blocks.some((block) => block.id === record.cursor))) return record.cursor;
  const filled = record.blocks.filter(
    (block) => record.events.some((event) => event.blockId === block.id) || countAnswered(record.answers, block.id) > 0,
  );
  return (filled.at(-1) ?? record.blocks[0])?.id;
}
