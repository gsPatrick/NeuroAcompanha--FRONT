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

// Histórico por ano -> mês -> semanas, do mais novo para o mais antigo. Cada semana traz só os dias DAQUELE mês em que o
// aluno é atendido: { monday, first, last }. Meses e semanas sem dia nenhum não entram.
// [{ year, months: [{ month, date, weeks }] }]
export function buildHistory(routine, from, to = new Date()) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const years = new Map();

  for (let cursor = new Date(to.getFullYear(), to.getMonth(), 1); cursor >= new Date(start.getFullYear(), start.getMonth(), 1); cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)) {
    const weeks = mondaysOfMonth(cursor)
      .map((monday) => {
        // A semana vai até o último dia de atendimento dela (ex.: sexta, 13), mesmo que hoje seja segunda: o que importa é
        // a semana inteira. Só entra se já começou (algum dia até hoje).
        const days = weekDates(monday, routine).filter((date) => date.getMonth() === cursor.getMonth() && date >= start);
        return days.length && days[0] <= to ? { monday, first: days[0], last: days[days.length - 1] } : null;
      })
      .filter(Boolean)
      .reverse();
    if (!weeks.length) continue;
    const entry = years.get(cursor.getFullYear()) ?? [];
    entry.push({ month: cursor.getMonth(), date: new Date(cursor), weeks });
    years.set(cursor.getFullYear(), entry);
  }

  return [...years.entries()].map(([year, months]) => ({ year, months }));
}

// "09 a 13" (ou "Dia 30" quando a semana tem um dia só naquele mês).
export function formatWeekDays(first, last) {
  const pad = (value) => String(value).padStart(2, '0');
  return first.getDate() === last.getDate() ? `Dia ${pad(first.getDate())}` : `${pad(first.getDate())} a ${pad(last.getDate())}`;
}

// "Novembro"
export function formatMonthName(date) {
  return capitalize(new Intl.DateTimeFormat(LOCALE, { month: 'long' }).format(date));
}

export { toDateKey };
