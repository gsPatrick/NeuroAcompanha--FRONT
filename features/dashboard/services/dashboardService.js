import { buildAttendanceMap, listAttendance } from '@/features/attendance/services/attendanceService';
import { attendsOn } from '@/features/routine/utils/routine';
import { getChildren } from '@/features/children/services/childrenService';
import { getUser } from '@/features/user/services/userService';
import { toDateKey } from '@/utils/calendar';

// O calendário mostra os últimos meses; buscamos esse período de uma vez.
const HISTORY_DAYS = 120;

// Dados de exibição do aluno no cartão do dia.
const toAppointment = (child) => ({
  id: `today-${child.id}`,
  childId: child.id,
  // Dia da semana em que a AT atende este aluno (vem da rotina cadastrada).
  attendsToday: attendsOn(child.routine),
  status: 'next',
  child: child.name,
  avatar: child.avatar,
  photo: child.photo ?? undefined,
  diagnoses: child.diagnoses ?? [],
});

// Tudo da tela inicial: a AT, um cartão por aluno (na ordem do cadastro), os atendimentos de hoje já suspensos
// e a presença dos últimos dias para o calendário.
export async function getDashboard() {
  const now = new Date();
  const today = toDateKey(now);
  const from = toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - HISTORY_DAYS));

  const [children, user, rows] = await Promise.all([getChildren(), getUser(), listAttendance(from, today)]);

  return {
    user,
    children,
    appointments: children.map(toAppointment),
    suspendedIds: rows.filter((row) => row.date === today && row.status === 'suspended').map((row) => `today-${row.childId}`),
    attendance: buildAttendanceMap(rows, today),
  };
}
