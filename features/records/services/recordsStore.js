import { ApiError, apiRequest, isPermanentError } from '@/core/api/apiClient';

// Registro do dia de cada aluno. A fonte de verdade é a API (dado sensível: comportamento de uma criança).
// Um registro por aluno por dia (id = `${alunoId}:${AAAA-MM-DD}`): ao virar o dia, o registro começa vazio.
//
// Gravação: a tela manda o dia inteiro a cada toque. Para não atropelar (duas gravações ao mesmo tempo chegando fora de ordem),
// só uma sai por vez e, enquanto ela viaja, só vale a versão mais nova. Sem internet, a última versão fica esperando e sai
// sozinha quando a conexão volta (ou na próxima mudança).
export const recordId = (childId, dateKey) => `${childId}:${dateKey}`;

function parseId(id) {
  const split = id.lastIndexOf(':');
  return { childId: id.slice(0, split), dateKey: id.slice(split + 1) };
}

const recordPath = (childId, dateKey) => `/children/${childId}/records/${dateKey}`;

// Registro da API -> registro que as telas usam.
export const toRecord = (record) => ({
  id: recordId(record.childId, record.date),
  childId: record.childId,
  date: record.date,
  // open (em andamento) | finished (dia fechado) | suspended (atendimento suspenso)
  status: record.status,
  blocks: record.blocks ?? [],
  events: record.events ?? [],
  answers: record.answers ?? {},
  summary: record.summary ?? {},
  cursor: record.cursor ?? undefined,
  updatedAt: record.updatedAt,
});

const states = new Map(); // id -> { pending: registro esperando para sair, draining: Promise | null }

const stateOf = (id) => {
  if (!states.has(id)) states.set(id, { pending: null, draining: null });
  return states.get(id);
};

const put = (record) => {
  const { childId, dateKey } = parseId(record.id);
  return apiRequest(recordPath(childId, dateKey), {
    method: 'PUT',
    body: { blocks: record.blocks, events: record.events, answers: record.answers, summary: record.summary, cursor: record.cursor ?? null },
  });
};

function drain(id) {
  const state = stateOf(id);
  if (state.draining) return state.draining;

  state.draining = (async () => {
    try {
      while (state.pending) {
        const record = state.pending;
        state.pending = null;
        try {
          await put(record);
        } catch (error) {
          // Rede ou servidor: guarda a versão para tentar de novo (a menos que já exista uma mais nova).
          if (!isPermanentError(error) && !state.pending) state.pending = record;
          throw error;
        }
      }
    } finally {
      state.draining = null;
    }
  })();
  return state.draining;
}

// Grava o dia. Resolve quando ESTA versão (ou uma mais nova) já está na API; rejeita se não deu.
export function saveRecord(record) {
  stateOf(record.id).pending = record;
  return drain(record.id);
}

// Espera tudo o que está pendente deste registro sair. Rejeita se ainda não for possível gravar.
export async function flushRecord(id) {
  const state = states.get(id);
  if (state?.pending || state?.draining) await drain(id);
}

if (typeof window !== 'undefined') {
  // Voltou a internet: manda o que ficou esperando.
  window.addEventListener('online', () => {
    states.forEach((state, id) => {
      if (state.pending) drain(id).catch(() => {});
    });
  });
}

// Retorna null se ainda não houver registro nesse dia. Qualquer outra falha (rede, servidor) é lançada: quem chama NÃO deve
// tratar como "dia vazio", senão recomeçaria o dia por cima do que já está salvo.
export async function loadRecord(id) {
  await flushRecord(id).catch(() => {});
  const { childId, dateKey } = parseId(id);
  try {
    return toRecord(await apiRequest(recordPath(childId, dateKey)));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// Registros de um aluno num período (AAAA-MM-DD), do mais antigo ao mais novo.
export async function listRecords(childId, from, to) {
  const records = await apiRequest(`/children/${childId}/records`, { query: { from, to } });
  return records.map(toRecord);
}

// Fecha o dia. Resolve com { weekReport }: { weekStart, status } se com isso a semana ficou completa e o relatório
// começou a ser gerado; null se ainda faltam dias.
export async function finishDay(childId, dateKey) {
  await flushRecord(recordId(childId, dateKey));
  const { weekReport } = await apiRequest(`${recordPath(childId, dateKey)}/finish`, { method: 'POST' });
  return { weekReport };
}

// Liga/desliga "atendimento suspenso" no dia. Resolve com { weekReport } (ver finishDay).
export async function setDaySuspended(childId, dateKey, suspended) {
  if (suspended) await flushRecord(recordId(childId, dateKey)).catch(() => {});
  const record = await apiRequest(`${recordPath(childId, dateKey)}/${suspended ? 'suspend' : 'reopen'}`, { method: 'POST', body: {} });
  return { weekReport: record.weekReport ?? null };
}

// Dia suspenso não recebe registro: quem vai registrar nele reabre o dia antes.
export const reopenDay = (childId, dateKey) => setDaySuspended(childId, dateKey, false);

async function loadExisting(id) {
  const record = await loadRecord(id);
  if (!record) throw new Error('Registro do dia não encontrado.');
  return record;
}

// Coloca um momento novo logo DEPOIS de `afterBlockId` (se não existir, vai para o fim do dia) e deixa o cursor nele:
// o registro reabre no momento novo. Faz tudo de uma vez (ler, mudar, gravar) para a tela anterior já encontrar o momento ao voltar.
export async function insertBlock(id, block, afterBlockId) {
  const record = await loadExisting(id);
  const position = record.blocks.findIndex((item) => item.id === afterBlockId);
  const at = position === -1 ? record.blocks.length : position + 1;
  const blocks = [...record.blocks.slice(0, at), block, ...record.blocks.slice(at)];
  await saveRecord({ ...record, blocks, cursor: block.id });
}

// Troca o nome de um momento só no dia de hoje (a rotina cadastrada não muda).
export async function renameBlockInDay(id, blockId, title) {
  const record = await loadExisting(id);
  await saveRecord({ ...record, blocks: record.blocks.map((block) => (block.id === blockId ? { ...block, title } : block)) });
}

// Remove o momento do dia de hoje junto com tudo o que foi marcado nele; o cursor vai para o momento anterior.
export async function removeBlockFromDay(id, blockId) {
  const record = await loadExisting(id);
  const position = record.blocks.findIndex((block) => block.id === blockId);
  const blocks = record.blocks.filter((block) => block.id !== blockId);
  const { [blockId]: _removed, ...answers } = record.answers ?? {};
  await saveRecord({
    ...record,
    blocks,
    events: record.events.filter((event) => event.blockId !== blockId),
    answers,
    cursor: blocks[Math.max(0, position - 1)]?.id,
  });
}
