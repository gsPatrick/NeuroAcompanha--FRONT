'use client';

import { useCallback, useState } from 'react';
import { loadPreferences, savePreferences } from '../services/preferencesService';

export function usePreferences() {
  // As telas só renderizam no navegador (Framework7), então ler o armazenamento aqui é seguro.
  const [preferences, setPreferences] = useState(loadPreferences);

  const update = useCallback((changes) => {
    setPreferences((current) => {
      const next = { ...current, ...changes(current) };
      savePreferences(next);
      return next;
    });
  }, []);

  const setDailyChildren = useCallback(
    (dailyChildren) => update(() => ({ dailyChildren })),
    [update],
  );

  const setReportDay = useCallback(
    (childId, day) => update((current) => ({ reportDays: { ...current.reportDays, [childId]: day } })),
    [update],
  );

  const completeOnboarding = useCallback(() => update(() => ({ onboarded: true })), [update]);

  return { preferences, setDailyChildren, setReportDay, completeOnboarding };
}
