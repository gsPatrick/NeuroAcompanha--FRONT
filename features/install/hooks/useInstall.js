'use client';

import { useEffect, useState } from 'react';
import { hasInstallPrompt, promptInstall, subscribeInstallPrompt } from '../utils/installPromptStore';
import { isStandalone, readPlatform } from '../utils/installState';

// Situação da instalação para a página /instalar. `ready` só fica true no navegador (depois de montar).
export function useInstall() {
  const [state, setState] = useState({ ready: false, standalone: false, platform: null, canPrompt: false });

  useEffect(() => {
    const update = () =>
      setState({
        ready: true,
        standalone: isStandalone(),
        platform: readPlatform(),
        canPrompt: hasInstallPrompt(),
      });

    update();
    return subscribeInstallPrompt(update);
  }, []);

  return { ...state, promptInstall };
}
