// Prancheta de observação diária (a mesma que a AT usa no papel), agora dentro de cada bloco da rotina.
// Cada pergunta tem um `type`, conforme o que ela pede:
//   yesno   Sim / Não (o padrão)
//   choice  escolher UMA entre as `options` (ex.: como chegou)
//   check   uma caixinha: marcar ou deixar em branco (ex.: o que eu fiz para ajudar)
//   text    só texto
export const PRANCHETA = [
  {
    key: 'arrival',
    title: 'Chegada',
    questions: [
      { key: 'arrivedHow', label: 'Como chegou?', type: 'choice', options: ['Feliz', 'Triste', 'Agitado(a)', 'Sonolento(a)'] },
      { key: 'enteredCalmly', label: 'Entrou na sala tranquilamente?' },
    ],
  },
  {
    key: 'activities',
    title: 'Atividades',
    questions: [
      { key: 'didAlone', label: 'Fez sozinho(a)?' },
      { key: 'helpType', label: 'Que tipo de ajuda?', type: 'text' },
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
      { key: 'timeOnTask', label: 'Quanto tempo permaneceu na tarefa?', type: 'text' },
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
      { key: 'regulated', label: 'Como se regulou?', type: 'text' },
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
      { key: 'whatIDid', label: 'O que fiz para ajudar?', type: 'text' },
      { key: 'verbalCues', label: 'Pistas verbais', type: 'check' },
      { key: 'redirected', label: 'Redirecionei a atenção', type: 'check' },
      { key: 'autonomy', label: 'Incentivei a autonomia', type: 'check' },
      { key: 'socialMediation', label: 'Mediação social', type: 'check' },
      { key: 'otherHelp', label: 'Outro', type: 'text' },
    ],
  },
  {
    key: 'snackTime',
    title: 'Lanche',
    questions: [
      { key: 'snackAte', label: 'Como foi a alimentação?', type: 'choice', options: ['Comeu bem', 'Comeu pouco', 'Recusou'] },
      { key: 'snackAlone', label: 'Comeu sozinho(a)?' },
      { key: 'snackSeated', label: 'Ficou sentado(a) durante o lanche?' },
      { key: 'snackNew', label: 'Aceitou alimentos novos?' },
      { key: 'snackAsked', label: 'Pediu o que queria (água, lanche)?' },
      { key: 'snackPeers', label: 'Interagiu com os colegas?' },
      { key: 'snackNote', label: 'Observação sobre o lanche', type: 'text' },
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
      { key: 'otherFact', label: 'Outro fato relevante?', type: 'text' },
    ],
  },
];

// Quais categorias da prancheta aparecem em cada tipo de bloco da rotina.
// Acolhimento: como chegou | Aula: aprendizagem | Lanche: prancheta do lanche | Brincadeiras: sem prancheta.
export const CATEGORIES_BY_BLOCK_KIND = {
  welcome: ['arrival'],
  class: ['learning'],
  snack: ['snackTime'],
  play: [],
  other: ['learning'],
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

const QUESTIONS_BY_KEY = new Map(PRANCHETA.flatMap((category) => category.questions.map((question) => [question.key, { ...question, category: category.title }])));

// Pergunta da prancheta pelo `key` (rótulo, categoria e se é só texto).
export const findQuestion = (key) => QUESTIONS_BY_KEY.get(key) ?? { key, label: key, category: '' };

// Resposta pronta para ler (relatório e tela do dia): "Sim", "Não", a opção escolhida ou "Marcado". Sem resposta, "".
export function describeAnswer(question, item) {
  if (!item?.answer) return '';
  if (item.answer === 'yes') return question.type === 'check' ? 'Marcado' : 'Sim';
  if (item.answer === 'no') return 'Não';
  return item.answer;
}
