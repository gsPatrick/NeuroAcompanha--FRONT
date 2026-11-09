// Marcações rápidas do atendimento: a AT toca e o app anota o horário. Para mudar, incluir ou tirar uma opção,
// basta editar esta lista (nada mais depende dela). `tone` define a cor: good | alert | neutral.
export const MARK_GROUPS = [
  {
    key: 'mood',
    title: 'Como está agora',
    tone: 'neutral',
    marks: [
      { key: 'calm', label: 'Calmo(a)' },
      { key: 'happy', label: 'Animado(a)' },
      { key: 'anxious', label: 'Ansioso(a)' },
      { key: 'irritated', label: 'Irritado(a)' },
      { key: 'sad', label: 'Choroso(a)' },
      { key: 'tired', label: 'Cansado(a)' },
    ],
  },
  {
    key: 'occurrence',
    title: 'Ocorrências',
    tone: 'alert',
    marks: [
      { key: 'crisis', label: 'Crise' },
      { key: 'refusal', label: 'Recusa / birra' },
      { key: 'escape', label: 'Tentativa de fuga' },
      { key: 'stereotypy', label: 'Estereotipia' },
      { key: 'aggression', label: 'Agressividade' },
      { key: 'overload', label: 'Sobrecarga sensorial' },
    ],
  },
  {
    key: 'routine',
    title: 'Rotina',
    tone: 'neutral',
    marks: [
      { key: 'snack', label: 'Lanche / refeição' },
      { key: 'water', label: 'Água' },
      { key: 'bathroom', label: 'Banheiro' },
      { key: 'medication', label: 'Medicação' },
      { key: 'rest', label: 'Descanso' },
      { key: 'break', label: 'Pausa' },
    ],
  },
  {
    key: 'win',
    title: 'Conquistas',
    tone: 'good',
    marks: [
      { key: 'activityDone', label: 'Concluiu a atividade' },
      { key: 'askedHelp', label: 'Pediu ajuda' },
      { key: 'followedRule', label: 'Seguiu a instrução' },
      { key: 'interacted', label: 'Interagiu com alguém' },
      { key: 'eyeContact', label: 'Contato visual' },
      { key: 'newSkill', label: 'Algo novo' },
    ],
  },
];

const MARKS_BY_KEY = new Map(
  MARK_GROUPS.flatMap((group) => group.marks.map((mark) => [mark.key, { ...mark, group: group.key, tone: group.tone }])),
);

// Dados de exibição de uma marcação pelo `key` (ou da anotação livre, que não está na lista).
export function getMark(key) {
  return MARKS_BY_KEY.get(key) ?? { key, label: 'Anotação', group: 'note', tone: 'neutral' };
}
