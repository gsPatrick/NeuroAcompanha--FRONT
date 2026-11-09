// Cada criança tem UM dia fixo na semana para o relatório semanal.
//
// Ciclo: a "data de vencimento" é a ocorrência mais recente desse dia da semana (hoje conta).
// O relatório está entregue se foi enviado nos 6 dias antes dessa data ou depois dela.
//   - não entregue e o dia já passou  -> overdue  (atrasado há N dias)
//   - não entregue e o dia é hoje     -> today    (vence hoje)
//   - entregue                        -> upcoming (próximo vencimento em N dias, 1 a 7)
export const REPORT_STATE = {
  OVERDUE: 'overdue',
  TODAY: 'today',
  UPCOMING: 'upcoming',
};

const DAYS_IN_WEEK = 7;
const MS_PER_DAY = 86_400_000;

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function getReportStatus(child, weekday, today = new Date()) {
  const daysSinceDue = (today.getDay() - weekday + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const dueDate = new Date(startOfDay(today).getTime() - daysSinceDue * MS_PER_DAY);
  const cycleStart = new Date(dueDate.getTime() - (DAYS_IN_WEEK - 1) * MS_PER_DAY);

  const delivered = child.lastReportAt ? startOfDay(new Date(child.lastReportAt)) >= cycleStart : false;

  if (delivered) {
    return { child, weekday, state: REPORT_STATE.UPCOMING, days: DAYS_IN_WEEK - daysSinceDue };
  }
  return {
    child,
    weekday,
    state: daysSinceDue === 0 ? REPORT_STATE.TODAY : REPORT_STATE.OVERDUE,
    days: daysSinceDue,
  };
}

const PRIORITY = { [REPORT_STATE.OVERDUE]: 0, [REPORT_STATE.TODAY]: 1, [REPORT_STATE.UPCOMING]: 2 };

// Ordena do mais urgente: atrasados (o mais atrasado primeiro), depois hoje, depois o que vence antes.
function compareUrgency(a, b) {
  if (a.state !== b.state) return PRIORITY[a.state] - PRIORITY[b.state];
  return a.state === REPORT_STATE.OVERDUE ? b.days - a.days : a.days - b.days;
}

// Retorna { primary, pending }: o relatório que merece destaque e os demais atrasados/que vencem hoje.
export function getWeeklyReportSummary(children, reportDays, defaultDay, today = new Date()) {
  if (!children.length) return null;

  const statuses = children
    .map((child) => getReportStatus(child, reportDays[child.id] ?? defaultDay, today))
    .sort(compareUrgency);

  const [primary, ...rest] = statuses;
  const pending = rest.filter((item) => item.state !== REPORT_STATE.UPCOMING);

  return { primary, pending };
}
