import { ApiError, apiRequest, isOfflineError } from '@/core/api/apiClient';
import { cachedRequest } from '@/core/offline/cache';
import { localAll, localDelete, localGet, localPut } from '@/core/offline/localDb';
import { enqueue, hasPending, isInFlight, listPending, processOutbox, registerOutboxHandler, resultOf, syncNow } from '@/core/offline/outbox';
import { mergeRecords } from '../utils/mergeRecords';

// Registro do dia de cada aluno. A fonte de verdade é a API (dado sensível: comportamento de uma criança), mas TUDO passa
// primeiro pelo aparelho: cada toque grava aqui na hora e a fila (core/offline/outbox) leva para a API em ordem. Sem internet
// a AT segue registrando normalmente; quando a conexão volta, o que ficou pendente sai sozinho. Nada disso aparece para ela.
// Um registro por aluno por dia (id = `${alunoId}:${AAAA-MM-DD}`): ao virar o dia, o registro começa vazio.
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

// ---------- Envio para a API (handlers da fila) ----------

// Entrada local de um registro: { id, record, dirty (há algo ainda não enviado), fresh (criado sem a AT ter visto a versão da API) }.
const localEntry = (id) => localGet('records', id);

// Depois de enviar um item: o registro só fica "limpo" quando não sobrou nada pendente dele.
async function refreshDirty(id, finishedSeq) {
  const entry = await localEntry(id);
  if (!entry) return;
  const stillPending = await hasPending((item) => item.id === id && item.seq !== finishedSeq);
  if (entry.dirty !== stillPending) await localPut('records', { ...entry, dirty: stillPending });
}

async function fetchServerRecord(childId, dateKey) {
  try {
    return toRecord(await apiRequest(recordPath(childId, dateKey)));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

registerOutboxHandler('save', async (item) => {
  const entry = await localEntry(item.id);
  if (!entry) return null;
  const { childId, dateKey } = parseId(item.id);

  // Dia aberto sem internet, sem ver o que já havia na API: junta com o que a API tiver (nada se perde nem duplica).
  let record = entry.record;
  if (entry.fresh) {
    const server = await fetchServerRecord(childId, dateKey);
    if (server) record = mergeRecords(server, record);
  }

  await apiRequest(recordPath(childId, dateKey), {
    method: 'PUT',
    body: { blocks: record.blocks, events: record.events, answers: record.answers, summary: record.summary, cursor: record.cursor ?? null },
  });

  // Se a AT mexeu de novo enquanto enviava, a cópia local mais nova já está na fila: não a sobrescreve.
  const latest = await localEntry(item.id);
  if (latest && latest.record === entry.record) await localPut('records', { ...latest, record, fresh: false });
  await refreshDirty(item.id, item.seq);
  return null;
});

const statusHandler = (path) => async (item) => {
  const result = await apiRequest(`${recordPath(item.childId, item.dateKey)}/${path}`, { method: 'POST', body: {} });
  await refreshDirty(item.id, item.seq);
  return { weekReport: result.weekReport ?? null };
};
registerOutboxHandler('finish', statusHandler('finish'));
registerOutboxHandler('suspend', statusHandler('suspend'));
registerOutboxHandler('reopen', statusHandler('reopen'));

// ---------- Uso pelas telas ----------

// Grava o dia no aparelho agora e põe o envio na fila. `fresh`: o dia foi aberto sem internet (ver mergeRecords).
export async function saveRecord(record, { fresh = false } = {}) {
  const entry = await localEntry(record.id);
  await localPut('records', { id: record.id, record, dirty: true, fresh: Boolean(entry?.fresh || fresh) });

  // Várias mudanças seguidas viram UM envio: só entra na fila se não há outro envio deste dia esperando (que ainda não começou).
  const tail = (await listPending()).filter((item) => item.id === record.id).at(-1);
  if (tail?.kind === 'save' && !isInFlight(tail.seq)) processOutbox().catch(() => {});
  else await enqueue({ kind: 'save', id: record.id });
}

// Retorna null se ainda não houver registro nesse dia. Sem internet, vale a cópia do aparelho; sem cópia, o erro de rede é lançado
// (quem chama decide: o registro de hoje abre em branco e é juntado depois). Falha que NÃO é de rede também é lançada.
export async function loadRecord(id) {
  await syncNow(4000); // antes de ler, tenta enviar o que ficou pendente
  const entry = await localEntry(id);
  if (entry?.dirty) return entry.record; // tem coisa ainda não enviada: a cópia local é a mais nova

  const { childId, dateKey } = parseId(id);
  try {
    const record = toRecord(await apiRequest(recordPath(childId, dateKey)));
    await localPut('records', { id, record, dirty: false, fresh: false });
    return record;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      if (entry) await localDelete('records', id);
      return null;
    }
    if (isOfflineError(error) && entry) return entry.record;
    throw error;
  }
}

// Registros de um aluno num período (AAAA-MM-DD), do mais antigo ao mais novo, já com o que a AT fez e ainda não foi enviado.
export async function listRecords(childId, from, to) {
  const rows = await cachedRequest(`records:${childId}:${from}:${to}`, () => apiRequest(`/children/${childId}/records`, { query: { from, to } }));
  const byId = new Map(rows.map(toRecord).map((record) => [record.id, record]));
  (await localAll('records'))
    .filter((entry) => entry.dirty && entry.record.childId === childId && entry.record.date >= from && entry.record.date <= to)
    .forEach((entry) => byId.set(entry.id, entry.record));
  return [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
}

// Muda o status do registro local (para as telas já refletirem) e deixa o envio na fila.
async function changeStatus(childId, dateKey, kind, status) {
  const id = recordId(childId, dateKey);
  const entry = await localEntry(id);
  if (entry) await localPut('records', { ...entry, record: { ...entry.record, status }, dirty: true });
  const seq = await enqueue({ kind, id, childId, dateKey });
  await syncNow(6000);
  return { weekReport: resultOf(seq)?.weekReport ?? null };
}

// Fecha o dia. Resolve com { weekReport }: { weekStart, status } se com isso a semana ficou completa e o relatório
// começou a ser gerado; null se ainda faltam dias (ou se está sem internet: o envio sai depois, e o relatório também).
export const finishDay = (childId, dateKey) => changeStatus(childId, dateKey, 'finish', 'finished');

// Liga/desliga "atendimento suspenso" no dia. Resolve com { weekReport } (ver finishDay).
export const setDaySuspended = (childId, dateKey, suspended) => changeStatus(childId, dateKey, suspended ? 'suspend' : 'reopen', suspended ? 'suspended' : 'open');

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
