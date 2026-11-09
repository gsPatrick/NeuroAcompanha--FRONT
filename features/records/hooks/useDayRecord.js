'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toDateKey } from '@/utils/calendar';
import { loadRecord, recordId, saveRecord } from '../services/recordsStore';

const newEventId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Registro de HOJE de um aluno. status: loading | ready.
// Cada toque vira um evento { id, key, at, text? }. Salva a cada mudança, então sair da tela no meio do
// atendimento não perde nada. O `id` inclui a data: no dia seguinte o registro começa vazio.
export function useDayRecord(childId) {
  const [state, setState] = useState({ status: 'loading', events: [] });
  const idRef = useRef(null);

  useEffect(() => {
    let active = true;
    const id = recordId(childId, toDateKey(new Date()));
    idRef.current = id;
    loadRecord(id).then((record) => active && setState({ status: 'ready', events: record?.events ?? [] }));
    return () => {
      active = false;
    };
  }, [childId]);

  const update = useCallback(
    (change) =>
      setState((current) => {
        const events = change(current.events);
        saveRecord({ id: idRef.current, childId, events }).catch(() => {
          // Sem persistência: o registro vale só enquanto o app está aberto.
        });
        return { ...current, events };
      }),
    [childId],
  );

  const addMark = useCallback((key) => update((events) => [...events, { id: newEventId(), key, at: Date.now() }]), [update]);

  const addNote = useCallback(
    (text) => update((events) => [...events, { id: newEventId(), key: 'note', at: Date.now(), text }]),
    [update],
  );

  const removeEvent = useCallback((id) => update((events) => events.filter((event) => event.id !== id)), [update]);

  return { status: state.status, events: state.events, addMark, addNote, removeEvent };
}
