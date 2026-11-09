'use client';

import { useEffect, useState } from 'react';
import { getDayEntries } from '../services/dayEntryService';
import { toDateKey } from '@/utils/calendar';

// Os dias pedidos de TODAS as crianças: [{ child, entries }] na ordem das crianças. status: loading | ready.
export function useAgendaEntries(children, dates) {
  const [state, setState] = useState({ status: 'loading', rows: [], key: '' });
  const key = `${children.map((child) => child.id).join(',')}|${dates.map(toDateKey).join(',')}`;

  useEffect(() => {
    let active = true;
    Promise.all(children.map(async (child) => ({ child, entries: await getDayEntries(child, dates) }))).then(
      (rows) => active && setState({ status: 'ready', rows, key }),
    );
    return () => {
      active = false;
    };
    // `key` resume as crianças e os dias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state.key === key ? state : { status: 'loading', rows: [], key };
}
