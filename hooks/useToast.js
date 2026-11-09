'use client';

import { useCallback } from 'react';
import { f7 } from 'framework7-react';

// Feedback curto e discreto, no padrão iOS.
export function useToast() {
  return useCallback((text) => {
    f7.toast.show({ text, position: 'center', closeTimeout: 1800 });
  }, []);
}
