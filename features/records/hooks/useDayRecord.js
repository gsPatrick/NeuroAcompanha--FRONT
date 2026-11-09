'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toDateKey } from '@/utils/calendar';
import { buildDayBlocks } from '@/features/routine/utils/routine';
import { loadRecord, recordId, saveRecord } from '../services/recordsStore';

const newEventId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Registro de HOJE de um aluno. status: loading | ready.
//  - blocks:  os momentos do dia (Acolhimento, Aulas, Lanche, Brincadeiras...), montados a partir da rotina na primeira
//             abertura do dia e depois só dela (mudar a rotina não altera um dia já aberto). Dá para renomear, remover e adicionar.
//  - events:  cada toque nas marcações rápidas { id, blockId, key, at, text? }.
//  - answers: prancheta { [blockId]: { [pergunta]: { answer: 'yes' | 'no' | null, obs } } }.
//  - summary: Resumo do dia { easy, hard, worked, progress, family }.
//  - cursor:  id do momento em que ela parou (reabre ali).
// Salva a cada mudança; o `id` inclui a data, então no dia seguinte o registro começa vazio.
export function useDayRecord(child) {
  const [state, setState] = useState({ status: 'loading', record: null });
  const idRef = useRef(null);
  const childId = child?.id;
  const routine = child?.routine;

  useEffect(() => {
    if (!childId) return undefined;
    let active = true;
    const id = recordId(childId, toDateKey(new Date()));
    idRef.current = id;
    loadRecord(id).then((saved) => {
      if (!active) return;
      // Registro de uma versão anterior do app (sem blocos): recomeça o dia já com a rotina.
      const usable = saved?.blocks ? saved : null;
      const record = usable ?? { id, childId, blocks: buildDayBlocks(routine), events: [], answers: {}, summary: {} };
      setState({ status: 'ready', record });
      if (!usable) saveRecord(record).catch(() => {});
    });
    return () => {
      active = false;
    };
    // A rotina só serve para montar o dia pela primeira vez; mudar depois não deve refazer o registro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);

  const update = useCallback((change) => {
    setState((current) => {
      if (!current.record) return current;
      const record = change(current.record);
      saveRecord(record).catch(() => {
        // Sem persistência: o registro vale só enquanto o app está aberto.
      });
      return { ...current, record };
    });
  }, []);

  const addMark = useCallback(
    (blockId, key) => update((record) => ({ ...record, events: [...record.events, { id: newEventId(), blockId, key, at: Date.now() }] })),
    [update],
  );

  const addNote = useCallback(
    (blockId, text) =>
      update((record) => ({ ...record, events: [...record.events, { id: newEventId(), blockId, key: 'note', at: Date.now(), text }] })),
    [update],
  );

  const removeEvent = useCallback(
    (id) => update((record) => ({ ...record, events: record.events.filter((event) => event.id !== id) })),
    [update],
  );

  const setAnswer = useCallback(
    (blockId, question, patch) =>
      update((record) => {
        const block = record.answers[blockId] ?? {};
        const current = block[question] ?? { answer: null, obs: '' };
        return { ...record, answers: { ...record.answers, [blockId]: { ...block, [question]: { ...current, ...patch } } } };
      }),
    [update],
  );

  // Lembra em qual momento ela parou, para reabrir o registro exatamente ali.
  const setCursor = useCallback((blockId) => update((record) => (record.cursor === blockId ? record : { ...record, cursor: blockId })), [update]);

  const setSummary = useCallback(
    (key, value) => update((record) => ({ ...record, summary: { ...record.summary, [key]: value } })),
    [update],
  );

  const renameBlock = useCallback(
    (blockId, title) =>
      update((record) => ({ ...record, blocks: record.blocks.map((block) => (block.id === blockId ? { ...block, title } : block)) })),
    [update],
  );

  // Remove o bloco e tudo o que foi marcado nele.
  const removeBlock = useCallback(
    (blockId) =>
      update((record) => {
        const { [blockId]: _removed, ...answers } = record.answers;
        return {
          ...record,
          blocks: record.blocks.filter((block) => block.id !== blockId),
          events: record.events.filter((event) => event.blockId !== blockId),
          answers,
        };
      }),
    [update],
  );

  return {
    status: state.status,
    record: state.record,
    addMark,
    addNote,
    removeEvent,
    setAnswer,
    setSummary,
    setCursor,
    renameBlock,
    removeBlock,
  };
}
