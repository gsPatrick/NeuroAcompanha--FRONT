'use client';

import { useEffect, useState } from 'react';
import { toDateKey } from '@/utils/calendar';
import { countAttendance, listAttendance } from '../services/attendanceService';

// Atendimentos feitos e suspensos neste mês (até ontem), somando as crianças. Enquanto carrega, zeros.
export function useMonthAttendance() {
  const [totals, setTotals] = useState({ done: 0, suspended: 0 });

  useEffect(() => {
    let active = true;
    const now = new Date();
    const first = toDateKey(new Date(now.getFullYear(), now.getMonth(), 1));
    const today = toDateKey(now);
    listAttendance(first, today)
      .then((rows) => active && setTotals(countAttendance(rows, today)))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return totals;
}
