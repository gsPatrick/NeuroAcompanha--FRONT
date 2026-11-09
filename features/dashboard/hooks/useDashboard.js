'use client';

import { useCallback, useEffect, useState } from 'react';
import { getDashboard } from '../services/dashboardService';

// status: loading | success | error
export function useDashboard() {
  const [state, setState] = useState({ status: 'loading', data: null });

  const load = useCallback(async () => {
    setState({ status: 'loading', data: null });
    try {
      const data = await getDashboard();
      setState({ status: 'success', data });
    } catch {
      setState({ status: 'error', data: null });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
