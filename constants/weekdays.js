// Dias possíveis para o relatório semanal (value segue Date#getDay: 1 = segunda ... 5 = sexta).
export const WEEKDAYS = [
  { value: 1, short: 'Seg', long: 'Segunda-feira' },
  { value: 2, short: 'Ter', long: 'Terça-feira' },
  { value: 3, short: 'Qua', long: 'Quarta-feira' },
  { value: 4, short: 'Qui', long: 'Quinta-feira' },
  { value: 5, short: 'Sex', long: 'Sexta-feira' },
];

export const DEFAULT_REPORT_DAY = 5;

export function getWeekdayLong(value) {
  return WEEKDAYS.find((day) => day.value === value)?.long ?? '';
}
