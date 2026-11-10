'use client';

import { useCallback, useEffect, useState } from 'react';
import { getUser } from '../services/userService';

// status: loading | success | error. `reload` busca de novo (depois de editar o perfil ou trocar a foto).
export function useUser() {
  const [state, setState] = useState({ status: 'loading', user: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    getUser()
      .then((user) => active && setState({ status: 'success', user }))
      .catch(() => active && setState((current) => (current.status === 'success' ? current : { status: 'error', user: null })));
    return () => {
      active = false;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);
  return { ...state, reload };
}
