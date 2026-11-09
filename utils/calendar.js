// Funções puras do calendário mensal (semana começa no domingo, como no Google Agenda).

export const WEEKDAY_INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Chave do dia no formato AAAA-MM-DD (usa a data local, sem fuso).
export function toDateKey(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Grade do mês: lista de semanas, cada uma com 7 dias { date, inMonth }.
// Mostra os dias do mês anterior/seguinte que completam as semanas e não desenha semanas vazias.
export function buildMonthWeeks(year, month) {
  const firstDay = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstDay.getDay());

  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    return { date, inMonth: date.getMonth() === month };
  });

  const weeks = [];
  for (let start = 0; start < days.length; start += 7) {
    const week = days.slice(start, start + 7);
    if (week.some((day) => day.inMonth)) weeks.push(week);
  }
  return weeks;
}

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Ex.: { month: 'Novembro', year: '2026' }
export function formatMonthTitle(date) {
  const parts = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).formatToParts(date);
  const pick = (type) => parts.find((part) => part.type === type)?.value ?? '';
  return { month: capitalize(pick('month')), year: pick('year') };
}

// Ex.: "segunda-feira, 9 de novembro de 2026" (para leitores de tela)
export function formatAccessibleDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
