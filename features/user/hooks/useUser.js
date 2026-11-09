'use client';

import { useEffect, useState } from 'react';
import { getUser } from '../services/userService';

// status: loading | success | error
export function useUser() {
  const [state, setState] = useState({ status: 'loading', user: null });

  useEffect(() => {
    let active = true;
    getUser()
      .then((user) => active && setState({ status: 'success', user }))
      .catch(() => active && setState({ status: 'error', user: null }));
    return () => {
      active = false;
    };
  }, []);

  return state;
}
