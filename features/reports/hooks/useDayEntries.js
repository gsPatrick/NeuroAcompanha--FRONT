'use client';

import { useEffect, useState } from 'react';
import { getDayEntries } from '../services/dayEntryService';
import { toDateKey } from '@/utils/calendar';

// Os dias pedidos de um aluno, já com o status e o registro de cada um. status: loading | ready | error.
export function useDayEntries(child, dates) {
  const [state, setState] = useState({ status: 'loading', entries: [], key: '' });
  const key = `${child?.id}|${dates.map(toDateKey).join(',')}`;

  useEffect(() => {
    if (!child) return undefined;
    let active = true;
    getDayEntries(child, dates)
      .then((entries) => active && setState({ status: 'ready', entries, key }))
      .catch(() => active && setState({ status: 'error', entries: [], key }));
    return () => {
      active = false;
    };
    // `key` resume o aluno e a lista de dias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Enquanto troca de semana, os dias antigos não aparecem como se fossem os novos.
  return state.key === key ? state : { status: 'loading', entries: [], key };
}
