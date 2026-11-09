import { mockStatusFor } from '@/features/attendance/services/attendance.mock';
import { getRoutineDay } from '@/features/routine/utils/routine';

// Números do mês da AT, somando as crianças: dias de atendimento feitos e suspensos até hoje.
// MOCK: usa a mesma regra de exemplo do calendário (dia múltiplo de 6 = suspenso); os dias de hoje em diante não contam.
export function countMonthAttendance(children, now = new Date()) {
  const totals = { done: 0, suspended: 0 };
  for (let day = 1; day < now.getDate(); day += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    children.forEach((child) => {
      if (!getRoutineDay(child.routine, date)?.attends) return;
      if (mockStatusFor(date) === 'suspended') totals.suspended += 1;
      else totals.done += 1;
    });
  }
  return totals;
}
