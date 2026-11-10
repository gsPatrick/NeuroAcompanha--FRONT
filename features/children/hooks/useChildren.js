'use client';

import { useCallback, useEffect, useState } from 'react';
import { getChildren } from '../services/childrenService';

// status: loading | success | error. `reload` busca de novo (depois de criar, editar ou trocar a foto).
export function useChildren() {
  const [state, setState] = useState({ status: 'loading', children: [] });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    getChildren()
      .then((children) => active && setState({ status: 'success', children }))
      .catch(() => active && setState((current) => (current.status === 'success' ? current : { status: 'error', children: [] })));
    return () => {
      active = false;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);
  return { ...state, reload };
}
