import { MARK_GROUPS } from '@/features/records/data/quickMarks';
import { getCategoriesForBlock } from '@/features/records/data/prancheta';
import { buildDayBlocks } from '@/features/routine/utils/routine';
import { toDateKey } from '@/utils/calendar';

// DADOS FICTÍCIOS (mock): registro de dias passados, para o relatório ter o que mostrar sem backend.
// É sempre o mesmo para o mesmo aluno e dia (sorteio com semente). Quando existir backend, este arquivo é removido.
function seededRandom(text) {
  let hash = 1779033703 ^ text.length;
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  let state = hash >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOTES = [
  'Chegou animado(a) e logo quis começar.',
  'Precisou de pausa depois da atividade em grupo.',
  'Pediu ajuda sozinho(a) pela primeira vez hoje.',
  'Ficou incomodado(a) com o barulho da sala.',
  'Brincou com um colega e dividiu o brinquedo.',
];
const HELP_TEXTS = ['Pista verbal', 'Apoio com o modelo na lousa', 'Ajuda para iniciar', 'Repetir a instrução'];
const SUMMARIES = {
  easy: ['Leitura em voz alta', 'Atividade com jogo de encaixe', 'Contagem até 20', 'Pintura livre'],
  hard: ['Esperar a vez', 'Mudança de atividade', 'Ruído no recreio', 'Começar a tarefa escrita'],
  worked: ['Antecipar o que vem depois', 'Pausa curta com fone', 'Elogio logo após a tarefa', 'Agenda visual'],
  progress: ['Pediu ajuda mais vezes', 'Ficou mais tempo na tarefa', 'Aceitou melhor a troca de atividade', 'Falou espontaneamente com colegas'],
  family: ['Foi um dia tranquilo, com boa participação.', 'Teve um momento difícil, mas se recuperou rápido.', 'Dia ótimo! Participou de tudo e fez novos vínculos.'],
};

export function buildMockRecord(child, date) {
  const key = toDateKey(date);
  const random = seededRandom(`${child.id}:${key}`);
  const pick = (list) => list[Math.floor(random() * list.length)];

  const blocks = buildDayBlocks(child.routine, date);
  const events = [];
  const answers = {};

  blocks.forEach((block, index) => {
    // Horário de cada momento: começa às 8h e avança ~50 min por momento.
    const base = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0).getTime() + index * 50 * 60000;
    const count = 2 + Math.floor(random() * 4);
    for (let item = 0; item < count; item += 1) {
      const group = pick(random() < 0.88 ? MARK_GROUPS.filter((g) => g.key !== 'occurrence') : MARK_GROUPS);
      events.push({
        id: `${block.id}-e${item}`,
        blockId: block.id,
        key: pick(group.marks).key,
        at: base + item * 9 * 60000 + Math.floor(random() * 4) * 60000,
      });
    }
    if (random() < 0.4) events.push({ id: `${block.id}-n`, blockId: block.id, key: 'note', at: base + 40 * 60000, text: pick(NOTES) });

    const blockAnswers = {};
    getCategoriesForBlock(block.kind)
      .slice(0, 3)
      .forEach((category) => {
        category.questions.forEach((question) => {
          if (random() < 0.45) return;
          blockAnswers[question.key] = question.obsOnly
            ? { answer: null, obs: pick(HELP_TEXTS) }
            : { answer: random() < 0.6 ? 'yes' : 'no', obs: '' };
        });
      });
    answers[block.id] = blockAnswers;
  });

  const summary = Object.fromEntries(Object.entries(SUMMARIES).map(([field, options]) => [field, pick(options)]));
  return { id: `${child.id}:${key}`, childId: child.id, blocks, events, answers, summary };
}
