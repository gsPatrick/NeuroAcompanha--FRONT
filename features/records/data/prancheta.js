// Prancheta de observação diária (a mesma que a AT usa no papel), agora dentro de cada bloco da rotina.
// Cada pergunta tem Sim / Não / Obs. `obsOnly`: perguntas que pedem só texto (sem Sim/Não).
export const PRANCHETA = [
  {
    key: 'arrival',
    title: 'Chegada',
    questions: [
      { key: 'arrivedHow', label: 'Como chegou? (feliz, triste, agitado(a), sonolento(a))' },
      { key: 'enteredCalmly', label: 'Entrou na sala tranquilamente?' },
      { key: 'helpFarewell', label: 'Precisou de ajuda para se despedir da família?' },
    ],
  },
  {
    key: 'activities',
    title: 'Atividades',
    questions: [
      { key: 'didAlone', label: 'Fez sozinho(a)?' },
      { key: 'helpType', label: 'Que tipo de ajuda?', obsOnly: true },
      { key: 'finished', label: 'Terminou as atividades?' },
      { key: 'gaveUp', label: 'Desistiu no meio?' },
    ],
  },
  {
    key: 'attention',
    title: 'Atenção',
    questions: [
      { key: 'focused', label: 'Manteve a concentração?' },
      { key: 'distracted', label: 'Distraiu-se?' },
      { key: 'redirect', label: 'Precisou de redirecionamento?' },
      { key: 'timeOnTask', label: 'Quanto tempo permaneceu na tarefa?', obsOnly: true },
    ],
  },
  {
    key: 'communication',
    title: 'Comunicação',
    questions: [
      { key: 'askedHelp', label: 'Pediu ajuda?' },
      { key: 'answeredCall', label: 'Respondeu quando chamado(a)?' },
      { key: 'spoke', label: 'Conversou espontaneamente?' },
      { key: 'expressedNeeds', label: 'Expressou necessidades?' },
    ],
  },
  {
    key: 'social',
    title: 'Interação social',
    questions: [
      { key: 'playedWithPeers', label: 'Brincou com os colegas?' },
      { key: 'preferredAlone', label: 'Preferiu ficar sozinho(a)?' },
      { key: 'groupParticipation', label: 'Participou em grupo?' },
      { key: 'teacherInteraction', label: 'Interagiu com o(a) professor(a)?' },
    ],
  },
  {
    key: 'emotions',
    title: 'Emoções',
    questions: [
      { key: 'frustration', label: 'Frustração?' },
      { key: 'crying', label: 'Choro?' },
      { key: 'joy', label: 'Alegria?' },
      { key: 'anxiety', label: 'Ansiedade?' },
      { key: 'regulated', label: 'Como se regulou?', obsOnly: true },
    ],
  },
  {
    key: 'behavior',
    title: 'Comportamentos',
    questions: [
      { key: 'crisis', label: 'Crise?' },
      { key: 'repetitive', label: 'Comportamentos repetitivos?' },
      { key: 'leftRoom', label: 'Saiu da sala?' },
      { key: 'sensory', label: 'Sensibilidade sensorial?' },
    ],
  },
  {
    key: 'learning',
    title: 'Aprendizagem',
    questions: [
      { key: 'understood', label: 'Entendeu as orientações?' },
      { key: 'repeat', label: 'Precisou repetir?' },
      { key: 'learnedNew', label: 'Aprendeu algo novo?' },
      { key: 'difficulty', label: 'Dificuldade específica?' },
    ],
  },
  {
    key: 'mywork',
    title: 'Meu trabalho',
    questions: [
      { key: 'whatIDid', label: 'O que fiz para ajudar?', obsOnly: true },
      { key: 'verbalCues', label: 'Pistas verbais' },
      { key: 'redirected', label: 'Redirecionei a atenção' },
      { key: 'autonomy', label: 'Incentivei a autonomia' },
      { key: 'socialMediation', label: 'Mediação social' },
      { key: 'otherHelp', label: 'Outro' },
    ],
  },
  {
    key: 'different',
    title: 'Situações diferentes',
    questions: [
      { key: 'routineChange', label: 'Mudança de rotina?' },
      { key: 'tripExam', label: 'Passeio ou prova?' },
      { key: 'teacherAbsent', label: 'Professor(a) faltou?' },
      { key: 'sick', label: 'Gripado(a) ou sonolento(a)?' },
      { key: 'otherFact', label: 'Outro fato relevante?' },
    ],
  },
];

// Quais categorias da prancheta aparecem em cada tipo de bloco da rotina.
export const CATEGORIES_BY_BLOCK_KIND = {
  welcome: ['arrival', 'emotions', 'communication', 'different'],
  class: ['activities', 'attention', 'communication', 'learning', 'emotions', 'behavior', 'social', 'mywork', 'different'],
  snack: ['communication', 'social', 'emotions', 'behavior', 'mywork'],
  play: ['social', 'communication', 'emotions', 'behavior', 'mywork', 'different'],
  other: ['activities', 'communication', 'social', 'emotions', 'behavior', 'mywork', 'different'],
};

export function getCategoriesForBlock(kind) {
  const keys = CATEGORIES_BY_BLOCK_KIND[kind] ?? CATEGORIES_BY_BLOCK_KIND.other;
  return keys.map((key) => PRANCHETA.find((category) => category.key === key));
}

// "Resumo do dia" no fim da prancheta.
export const SUMMARY_FIELDS = [
  { key: 'easy', label: 'O que fez com facilidade?' },
  { key: 'hard', label: 'Maior dificuldade' },
  { key: 'worked', label: 'O que funcionou?' },
  { key: 'progress', label: 'Evolução percebida' },
  { key: 'family', label: 'Se a família perguntasse como foi o dia, eu diria:' },
];

export const BLOCK_KINDS = [
  { kind: 'class', label: 'Aula', askName: true, placeholder: 'Nome da matéria' },
  { kind: 'play', label: 'Brincadeira', askName: false, defaultTitle: 'Brincadeiras' },
  { kind: 'snack', label: 'Lanche', askName: false, defaultTitle: 'Lanche' },
  { kind: 'welcome', label: 'Acolhimento', askName: false, defaultTitle: 'Acolhimento' },
  { kind: 'other', label: 'Outro', askName: true, placeholder: 'Nome do momento' },
];
