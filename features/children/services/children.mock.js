// DADOS FICTÍCIOS (mock) dos alunos da AT.
// `avatar` descreve a ilustração (ver PersonIllustration): vale quando o aluno está sem foto e não identifica a criança.
// Quando existir backend, este arquivo é removido e o childrenService passa a chamar a API.
const daysAgo = (days) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const childrenMock = [
  {
    id: 'c1',
    name: 'Maria Fernanda',
    // Foto opcional (exige autorização do responsável). Sem ela, vale a ilustração em `avatar`.
    photo: '/images/maria-fernanda-rosto.jpg',
    // Dado sensível de saúde: só aparece para quem tem vínculo com a criança (regra do backend).
    diagnoses: [['TEA', 'Nível 2']],
    avatar: { hair: 'ponytail', hairColor: 'ginger', skin: 'light', clothing: 'navy', tile: 'peach' },
    lastActivityAt: daysAgo(0),
    lastReportAt: daysAgo(12),
  },
  {
    id: 'c7',
    name: 'Theo Barreto',
    // Sem foto: vale a ilustração em `avatar`. Diagnóstico ainda não informado.
    avatar: { hair: 'short', hairColor: 'brown', skin: 'medium', clothing: 'mist', tile: 'mist' },
    diagnoses: [],
    lastActivityAt: daysAgo(0),
    lastReportAt: daysAgo(3),
  },
];
