import { buildAttendanceMock } from '@/features/attendance/services/attendance.mock';
import { attendsOn } from '@/features/routine/utils/routine';
import { getChildren } from '@/features/children/services/childrenService';
import { getUser } from '@/features/user/services/userService';
import { dashboardMock } from './dashboard.mock';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Alunos cadastrados no onboarding têm `conditions`; os dados de exemplo não.
const isRegistered = (child) => Array.isArray(child.conditions);

// Dados de exibição do aluno no cartão do dia.
const toAppointment = (id, status, child) => ({
  id,
  childId: child.id,
  // Dia da semana em que a AT atende este aluno (vem da rotina cadastrada).
  attendsToday: attendsOn(child.routine),
  status,
  child: child.name,
  avatar: child.avatar,
  photo: child.photo ?? undefined,
  diagnoses: child.diagnoses ?? [],
});

// MOCK: simula a latência da rede para exercitar o estado de carregamento.
// Troque o corpo por chamadas à API mantendo o mesmo retorno.
export async function getDashboard() {
  const [children, user] = await Promise.all([getChildren(), getUser(), wait(500)]);

  let appointments;
  if (children.some(isRegistered)) {
    // Alunos cadastrados no onboarding: um cartão para cada um, na ordem do cadastro.
    appointments = children.map((child) => toAppointment(`today-${child.id}`, 'next', child));
  } else {
    const byId = new Map(children.map((child) => [child.id, child]));
    appointments = dashboardMock.appointments
      .filter((appointment) => byId.has(appointment.childId))
      .map((appointment) => toAppointment(appointment.id, appointment.status, byId.get(appointment.childId)));
  }

  return { user, appointments, children, attendance: buildAttendanceMock() };
}
