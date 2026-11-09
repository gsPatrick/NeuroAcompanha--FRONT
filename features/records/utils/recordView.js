import { getMark } from '../data/quickMarks';

// Quantas vezes cada marcação foi feita: { crisis: 2, calm: 1 }.
export function countByMark(events) {
  return events.reduce((counts, event) => {
    counts[event.key] = (counts[event.key] ?? 0) + 1;
    return counts;
  }, {});
}

// Linha do tempo: a mais recente primeiro, já com rótulo e tom de cada marcação.
export function buildTimeline(events) {
  return [...events]
    .sort((a, b) => b.at - a.at)
    .map((event) => ({ ...event, ...getMark(event.key), label: event.key === 'note' ? 'Anotação' : getMark(event.key).label }));
}

// "14:32"
export function formatTime(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
}
