import { createWeeklyRoutine } from '@/features/routine/utils/routine';

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
    // Maria Fernanda: segunda a sexta, sempre com acolhimento; as aulas mudam a cada dia.
    routine: createWeeklyRoutine({
      1: { welcome: true, classes: ['Português', 'Matemática', 'Ciências'] },
      2: { welcome: true, classes: ['Português', 'Matemática', 'História', 'Educação Física'] },
      3: { welcome: true, classes: ['Português', 'Matemática', 'Geografia', 'Artes'] },
      4: { welcome: true, classes: ['Português', 'Matemática', 'Inglês', 'Ciências'] },
      5: { welcome: true, classes: ['Português', 'Matemática', 'Educação Física'] },
    }),
    // Desde quando a AT acompanha (ISO): o histórico do perfil começa nessa data.
    startedAt: '2025-08-04',
    lastActivityAt: daysAgo(0),
    lastReportAt: daysAgo(12),
  },
  {
    id: 'c7',
    name: 'Theo Barreto',
    // Sem foto: vale a ilustração em `avatar`. Diagnóstico ainda não informado.
    avatar: { hair: 'short', hairColor: 'brown', skin: 'medium', clothing: 'mist', tile: 'mist' },
    diagnoses: [],
    // Theo Barreto: só segunda, quarta e sexta (na quarta não tem acolhimento).
    routine: createWeeklyRoutine({
      1: { welcome: true, classes: ['Português', 'Artes'] },
      3: { welcome: false, classes: ['Matemática', 'Educação Física'] },
      5: { welcome: true, classes: ['Português', 'Ciências'] },
    }),
    startedAt: '2026-02-02',
    lastActivityAt: daysAgo(0),
    lastReportAt: daysAgo(3),
  },
];
