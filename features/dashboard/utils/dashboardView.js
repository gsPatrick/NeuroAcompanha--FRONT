const STATUS_PRIORITY = { next: 0, scheduled: 1, done: 2 };

// Os atendimentos de hoje, um por aluno: o próximo primeiro, depois os agendados e por último os concluídos.
// Entre atendimentos com o mesmo status, a ordem original é mantida.
export function selectTodayAppointments(appointments) {
  return [...appointments].sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);
}
