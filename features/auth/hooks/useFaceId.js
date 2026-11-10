'use client';

import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { disableFaceId, enableFaceId, isFaceIdEnabledHere, isFaceIdSupported } from '../services/faceIdService';

// Face ID no perfil: `supported` (o aparelho tem biometria), `enabled` (ligado neste aparelho) e `toggle`.
export function useFaceId() {
  const showToast = useToast();
  const [state, setState] = useState({ supported: false, enabled: false });

  useEffect(() => {
    let active = true;
    isFaceIdSupported().then((supported) => active && setState({ supported, enabled: isFaceIdEnabledHere() }));
    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (state.enabled) {
        await disableFaceId();
        setState((current) => ({ ...current, enabled: false }));
        showToast('Face ID desativado.');
      } else {
        await enableFaceId();
        setState((current) => ({ ...current, enabled: true }));
        showToast('Face ID ativado.');
      }
    } catch (error) {
      // Cancelar o pedido do aparelho não é erro.
      if (error?.name !== 'NotAllowedError') showToast('Não foi possível alterar o Face ID.');
    }
  }, [state.enabled, showToast]);

  return { ...state, toggle };
}
