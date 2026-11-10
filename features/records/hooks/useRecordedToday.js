'use client';

import { useEffect, useState } from 'react';
import { toDateKey } from '@/utils/calendar';
import { loadRecord, recordId } from '../services/recordsStore';

// Ids dos alunos que já têm algo registrado HOJE (marcação, resposta ou resumo): o painel mostra "Continuar registro".
export function useRecordedToday(childIds) {
  const [recorded, setRecorded] = useState(() => new Set());
  const key = childIds.join('|');

  useEffect(() => {
    let active = true;
    const today = toDateKey(new Date());
    Promise.all(
      childIds.map(async (id) => {
        // Sem conseguir ler (rede), o cartão só não mostra "Continuar registro".
        const record = await loadRecord(recordId(id, today)).catch(() => null);
        const has = record && (record.events?.length || Object.keys(record.answers ?? {}).length || Object.values(record.summary ?? {}).some((text) => text?.trim()));
        return has ? id : null;
      }),
    ).then((ids) => active && setRecorded(new Set(ids.filter(Boolean))));
    return () => {
      active = false;
    };
    // `key` resume a lista de ids.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return recorded;
}
