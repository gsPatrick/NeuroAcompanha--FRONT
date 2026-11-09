'use client';

import { useEffect, useState } from 'react';
import { getChildren } from '../services/childrenService';

// status: loading | success | error
export function useChildren() {
  const [state, setState] = useState({ status: 'loading', children: [] });

  useEffect(() => {
    let active = true;
    getChildren()
      .then((children) => active && setState({ status: 'success', children }))
      .catch(() => active && setState({ status: 'error', children: [] }));
    return () => {
      active = false;
    };
  }, []);

  return state;
}
