// DADOS FICTÍCIOS (mock). As crianças vêm de features/children e a pessoa logada de features/user.
// Um atendimento por aluno, na ordem em que aparecem na tela inicial (um cartão embaixo do outro).
// Quando existir backend, este arquivo é removido e o dashboardService passa a chamar a API.
export const dashboardMock = {
  appointments: [
    { id: 'a1', childId: 'c1', status: 'next' },
    { id: 'a2', childId: 'c7', status: 'scheduled' },
  ],
};
