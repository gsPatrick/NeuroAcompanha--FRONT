'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toDateKey } from '@/utils/calendar';
import { parseDateKey } from '@/features/reports/utils/dates';
import { buildDayBlocks } from '@/features/routine/utils/routine';
import { isOfflineError } from '@/core/api/apiClient';
import { finishDay, loadRecord, recordId, reopenDay, saveRecord } from '../services/recordsStore';

const newEventId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Registro de um dia de um aluno (hoje, ou um dia que já passou para preencher/corrigir). status: loading | ready | error.
//  - blocks:  os momentos do dia (Acolhimento, Aulas, Lanche, Brincadeiras...), montados a partir da rotina na primeira
//             abertura do dia e depois só dela (mudar a rotina não altera um dia já aberto). Renomear, remover e adicionar são feitos pelas telas próprias (ver recordsStore).
//  - events:  marcações rápidas { id, blockId, key, at } (uma por marcação em cada momento) e anotações { key: 'note', text }.
//  - answers: prancheta { [blockId]: { [pergunta]: { answer: 'yes' | 'no' | null, obs } } }.
//  - summary: Resumo do dia { easy, hard, worked, progress, family }.
//  - cursor:  id do momento em que ela parou (reabre ali).
//  - record.status: open | finished (o dia foi fechado com `finish`).
// Salva no aparelho a cada mudança (e a fila leva para a API, mesmo sem internet); o `id` inclui a data, então no dia seguinte o registro começa vazio.
export function useDayRecord(child, dateKey = toDateKey(new Date())) {
  const [state, setState] = useState({ status: 'loading', record: null });
  const [attempt, setAttempt] = useState(0);
  const idRef = useRef(null);
  const childId = child?.id;
  const routine = child?.routine;

  useEffect(() => {
    if (!childId) return undefined;
    let active = true;
    const id = recordId(childId, dateKey);
    idRef.current = id;
    setState({ status: 'loading', record: null });

    (async () => {
      // Sem internet e sem cópia deste dia no aparelho: abre o dia em branco (a fila junta com o que a API tiver, depois).
      let openedOffline = false;
      let saved = null;
      try {
        saved = await loadRecord(id);
      } catch (error) {
        if (!isOfflineError(error)) throw error;
        openedOffline = true;
      }
      // Dia suspenso não recebe registro: quem abre o registro está atendendo, então o dia volta a valer.
      if (saved?.status === 'suspended') {
        await reopenDay(childId, dateKey);
        saved = await loadRecord(id);
      }
      // Dia sem momentos (novo, ou reaberto depois de suspenso): recomeça já com a rotina.
      const usable = saved?.blocks.length ? saved : null;
      const record = usable ?? { id, childId, date: dateKey, status: 'open', blocks: buildDayBlocks(routine, parseDateKey(dateKey)), events: [], answers: {}, summary: {} };
      if (!active) return;
      setState({ status: 'ready', record });
      if (!usable) saveRecord(record, { fresh: openedOffline }).catch(() => {});
    })().catch(() => active && setState({ status: 'error', record: null }));

    return () => {
      active = false;
    };
    // A rotina só serve para montar o dia pela primeira vez; mudar depois não deve refazer o registro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId, dateKey, attempt]);

  const update = useCallback((change) => {
    setState((current) => {
      if (!current.record) return current;
      const record = change(current.record);
      saveRecord(record).catch(() => {
        // Sem armazenamento no aparelho: o registro vale enquanto o app estiver aberto.
      });
      return { ...current, record };
    });
  }, []);

  // Cada marcação vale uma vez por momento: tocar marca (com o horário) e tocar de novo desmarca.
  const toggleMark = useCallback(
    (blockId, key) =>
      update((record) => {
        const marked = record.events.some((event) => event.blockId === blockId && event.key === key);
        const events = marked
          ? record.events.filter((event) => !(event.blockId === blockId && event.key === key))
          : [...record.events, { id: newEventId(), blockId, key, at: Date.now() }];
        // O momento em que ela mexeu por último é onde o registro reabre.
        return { ...record, events, cursor: blockId };
      }),
    [update],
  );

  const addNote = useCallback(
    (blockId, text) =>
      update((record) => ({ ...record, events: [...record.events, { id: newEventId(), blockId, key: 'note', at: Date.now(), text }], cursor: blockId })),
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
        return { ...record, answers: { ...record.answers, [blockId]: { ...block, [question]: { ...current, ...patch } } }, cursor: blockId };
      }),
    [update],
  );

  // Lembra em qual momento ela parou, para reabrir o registro exatamente ali.
  const setCursor = useCallback((blockId) => update((record) => (record.cursor === blockId ? record : { ...record, cursor: blockId })), [update]);

  const setSummary = useCallback(
    (key, value) => update((record) => ({ ...record, summary: { ...record.summary, [key]: value } })),
    [update],
  );

  // Fecha o dia na API. Resolve com { weekReport }: se a semana ficou completa, o relatório já começou a ser gerado.
  const finish = useCallback(async () => {
    const result = await finishDay(childId, dateKey);
    setState((current) => (current.record ? { ...current, record: { ...current.record, status: 'finished' } } : current));
    return result;
  }, [childId, dateKey]);

  return {
    status: state.status,
    record: state.record,
    retry: () => setAttempt((current) => current + 1),
    finish,
    toggleMark,
    addNote,
    removeEvent,
    setAnswer,
    setSummary,
    setCursor,
  };
}
