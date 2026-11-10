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

// Marcações antigas (o grupo "Rotina" saiu da tela: o lanche agora tem prancheta própria). Ficam aqui só para
// registros já feitos continuarem legíveis.
const LEGACY_GROUPS = [
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
  }
];

// Quais grupos de marcação aparecem em cada tipo de momento (nesta ordem).
//   Acolhimento: ocorrências | Aula: como está, ocorrências e conquistas | Lanche e Brincadeiras: só como está.
const GROUPS_BY_BLOCK_KIND = {
  welcome: ['occurrence'],
  class: ['mood', 'occurrence', 'win'],
  snack: ['mood'],
  play: ['mood'],
  other: ['mood', 'occurrence', 'win'],
};

export function getMarkGroupsForBlock(kind) {
  const keys = GROUPS_BY_BLOCK_KIND[kind] ?? GROUPS_BY_BLOCK_KIND.other;
  return keys.map((key) => MARK_GROUPS.find((group) => group.key === key));
}

const MARKS_BY_KEY = new Map(
  [...MARK_GROUPS, ...LEGACY_GROUPS].flatMap((group) => group.marks.map((mark) => [mark.key, { ...mark, group: group.key, tone: group.tone }])),
);

// Dados de exibição de uma marcação pelo `key` (ou da anotação livre, que não está na lista).
export function getMark(key) {
  return MARKS_BY_KEY.get(key) ?? { key, label: 'Anotação', group: 'note', tone: 'neutral' };
}
