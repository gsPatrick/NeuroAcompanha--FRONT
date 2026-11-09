// Neurodivergências do cadastro do aluno e os níveis/especificadores que um laudo costuma registrar.
// Base: DSM-5-TR (níveis de suporte e gravidade) e CID-11, em pesquisa feita para este projeto.
// IMPORTANTE:
//  - Os níveis são opcionais no cadastro: nem todo laudo informa, e a conferência final é sempre do laudo.
//  - Onde NÃO há níveis oficiais (linguagem, dispraxia, tiques, altas habilidades), `levelGroups` fica vazio
//    ou traz só o TIPO (categoria diagnóstica), que não é nível de gravidade.
//  - A CID-11 não tem níveis de suporte para o TEA: "Nível 1/2/3" é o nível de suporte do DSM-5-TR
//    (o termo oficial é "nível"; "grau" é só o uso popular em alguns laudos).
//  - Altas habilidades/superdotação não é diagnóstico clínico (categoria da educação especial no Brasil).
//
// Formato: { id, label, fullName, hint?, levelGroups: [{ id, label, options: [{ id, label, description? }] }] }
// `label` aparece nas etiquetas do app (ex.: "TEA · Nível 2"); `description` só na hora de escolher.

const SEVERITY_DSM = [
  { id: 'leve', label: 'Leve' },
  { id: 'moderada', label: 'Moderada' },
  { id: 'grave', label: 'Grave' },
];

export const NEURODIVERGENCES = [
  {
    id: 'tea',
    label: 'TEA',
    fullName: 'Transtorno do Espectro Autista',
    hint: 'No DSM-5-TR, os níveis 1, 2 e 3 indicam o apoio de que a pessoa precisa, e não uma "gravidade clínica".',
    levelGroups: [
      {
        id: 'suporte',
        label: 'Nível de suporte',
        options: [
          { id: '1', label: 'Nível 1', description: 'Exige apoio' },
          { id: '2', label: 'Nível 2', description: 'Exige apoio substancial' },
          { id: '3', label: 'Nível 3', description: 'Exige apoio muito substancial' },
        ],
      },
      {
        id: 'intelectual',
        label: 'Deficiência intelectual associada',
        options: [
          { id: 'com', label: 'Com DI', description: 'Com comprometimento intelectual' },
          { id: 'sem', label: 'Sem DI', description: 'Sem comprometimento intelectual' },
        ],
      },
      {
        id: 'linguagem',
        label: 'Linguagem',
        options: [
          { id: 'prejudicada', label: 'Linguagem prejudicada', description: 'Com comprometimento da linguagem' },
          { id: 'preservada', label: 'Linguagem preservada', description: 'Sem comprometimento da linguagem' },
        ],
      },
    ],
  },
  {
    id: 'tdah',
    label: 'TDAH',
    fullName: 'Transtorno de Déficit de Atenção/Hiperatividade',
    levelGroups: [
      {
        id: 'apresentacao',
        label: 'Apresentação',
        options: [
          { id: 'combinada', label: 'Combinada', description: 'Desatenção e hiperatividade/impulsividade' },
          { id: 'desatenta', label: 'Desatenta', description: 'Predominantemente desatenta' },
          { id: 'hiperativa', label: 'Hiperativa/impulsiva', description: 'Predominantemente hiperativa/impulsiva' },
        ],
      },
      { id: 'gravidade', label: 'Gravidade atual', options: SEVERITY_DSM },
    ],
  },
  {
    id: 'di',
    label: 'Deficiência intelectual',
    fullName: 'Transtorno do Desenvolvimento Intelectual',
    hint: 'A gravidade se baseia no funcionamento adaptativo (conceitual, social e prático), não só no QI.',
    levelGroups: [
      {
        id: 'gravidade',
        label: 'Gravidade',
        options: [...SEVERITY_DSM, { id: 'profunda', label: 'Profunda' }],
      },
    ],
  },
  {
    id: 'dislexia',
    label: 'Dislexia',
    fullName: 'Aprendizagem: prejuízo na leitura',
    levelGroups: [{ id: 'gravidade', label: 'Gravidade atual', options: SEVERITY_DSM }],
  },
  {
    id: 'disgrafia',
    label: 'Disgrafia',
    fullName: 'Aprendizagem: prejuízo na expressão escrita',
    levelGroups: [{ id: 'gravidade', label: 'Gravidade atual', options: SEVERITY_DSM }],
  },
  {
    id: 'discalculia',
    label: 'Discalculia',
    fullName: 'Aprendizagem: prejuízo na matemática',
    levelGroups: [{ id: 'gravidade', label: 'Gravidade atual', options: SEVERITY_DSM }],
  },
  {
    id: 'linguagem',
    label: 'Linguagem e comunicação',
    fullName: 'Transtornos da linguagem e da comunicação',
    hint: 'Não há níveis oficiais de gravidade para este grupo: as opções acima são o tipo de transtorno.',
    levelGroups: [
      {
        id: 'tipo',
        label: 'Tipo',
        options: [
          { id: 'linguagem', label: 'Linguagem (TDL)', description: 'Transtorno do desenvolvimento da linguagem' },
          { id: 'fonologico', label: 'Sons da fala', description: 'Transtorno fonológico' },
          { id: 'fluencia', label: 'Fluência (gagueira)', description: 'Transtorno da fluência' },
          { id: 'pragmatico', label: 'Comunicação social', description: 'Transtorno pragmático' },
        ],
      },
    ],
  },
  {
    id: 'dispraxia',
    label: 'Dispraxia',
    fullName: 'Transtorno do Desenvolvimento da Coordenação',
    hint: 'Não há níveis oficiais de gravidade para esta condição.',
    levelGroups: [],
  },
  {
    id: 'tourette',
    label: 'Tourette / Tiques',
    fullName: 'Síndrome de Tourette e transtornos de tique',
    hint: 'Não há níveis oficiais de gravidade: as opções acima são o tipo de transtorno de tique.',
    levelGroups: [
      {
        id: 'tipo',
        label: 'Tipo',
        options: [
          { id: 'tourette', label: 'Tourette', description: 'Tiques motores múltiplos e ao menos um vocal' },
          { id: 'persistente', label: 'Tique persistente', description: 'Tique motor ou vocal crônico' },
          { id: 'provisorio', label: 'Tique provisório', description: 'Menos de 12 meses' },
        ],
      },
    ],
  },
  {
    id: 'ahsd',
    label: 'Altas habilidades',
    fullName: 'Altas habilidades ou superdotação',
    hint: 'Não é diagnóstico clínico nem tem níveis: no Brasil é uma categoria da educação especial.',
    levelGroups: [],
  },
];

export const getCondition = (id) => NEURODIVERGENCES.find((condition) => condition.id === id);
