'use client';

import { useSearchParams } from 'next/navigation';
import { toDateKey } from '@/utils/calendar';

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

// Dia do registro que está aberto: o de hoje, ou o de um dia que já passou (?data=AAAA-MM-DD) para preencher ou corrigir.
// Data inválida ou futura volta para hoje.
export function useRecordDate() {
  const requested = useSearchParams().get('data');
  const today = toDateKey(new Date());
  return requested && DATE_KEY.test(requested) && requested <= today ? requested : today;
}

// Caminho de uma tela do registro mantendo o dia aberto (hoje não precisa de parâmetro).
export function recordPath(childId, dateKey, screen = '') {
  const base = `/registro/${childId}${screen ? `/${screen}` : ''}`;
  return dateKey === toDateKey(new Date()) ? base : `${base}?data=${dateKey}`;
}
