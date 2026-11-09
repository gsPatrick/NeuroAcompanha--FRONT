import { toDateKey } from '@/utils/calendar';

const LOCALE = 'pt-BR';
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const addDays = (date, amount) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

// Segunda-feira da semana de `date` (a semana do relatório vai de segunda a domingo).
export function startOfWeek(date) {
  const offset = (date.getDay() + 6) % 7;
  return addDays(date, -offset);
}

// "2026-11-09" -> Date local (sem deslocamento de fuso).
export function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Dias da semana a mostrar: segunda a sexta sempre; sábado e domingo só se o aluno é atendido neles.
export function weekDates(monday, routine) {
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index)).filter(
    (date) => date.getDay() >= 1 && date.getDay() <= 5 ? true : Boolean(routine?.[date.getDay()]?.attends),
  );
}

// "9 a 13 de novembro" ou, atravessando o mês, "30 de out. a 3 de nov.".
export function formatRange(first, last) {
  if (first.getMonth() === last.getMonth()) {
    const month = new Intl.DateTimeFormat(LOCALE, { month: 'long' }).format(last);
    return `${first.getDate()} a ${last.getDate()} de ${month}`;
  }
  const short = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' });
  return `${short.format(first)} a ${short.format(last)}`;
}

// "Segunda-feira, 9 de novembro"
export function formatDayLong(date) {
  return capitalize(new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }).format(date));
}

// "Seg"
export function formatWeekdayShort(date) {
  return capitalize(new Intl.DateTimeFormat(LOCALE, { weekday: 'short' }).format(date).replace('.', ''));
}

// "Novembro de 2026"
export function formatMonthYear(date) {
  return capitalize(new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(date));
}

// Segundas-feiras das semanas que tocam o mês de `date`.
export function mondaysOfMonth(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const mondays = [];
  for (let monday = startOfWeek(first); monday <= last; monday = addDays(monday, 7)) mondays.push(monday);
  return mondays;
}

export { toDateKey };
