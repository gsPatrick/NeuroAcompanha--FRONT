'use client';

import { useCallback, useEffect, useState } from 'react';
import { APP_VERSION, NO_AUTO_RELOAD_PATHS } from '@/constants/appVersion';

const CHECK_EVERY_MS = 5 * 60 * 1000;
const RELOADED_FOR_KEY = 'neuro-acompanha:reloaded-for';

// Pergunta ao servidor qual versão está publicada. Retorna a versão, ou null se não deu para saber (ex.: sem internet).
async function fetchServerVersion() {
  try {
    const response = await fetch('/api/version', { cache: 'no-store' });
    if (!response.ok) return null;
    const { version } = await response.json();
    return typeof version === 'string' ? version : null;
  } catch {
    return null;
  }
}

// Já recarregamos para esta versão nesta sessão? Evita um laço de recarregamentos se, por algum motivo
// (ex.: cache de uma CDN), a página continuar vindo na versão antiga.
const alreadyReloadedFor = (version) => {
  try {
    return window.sessionStorage.getItem(RELOADED_FOR_KEY) === version;
  } catch {
    return false;
  }
};

const rememberReload = (version) => {
  try {
    window.sessionStorage.setItem(RELOADED_FOR_KEY, version);
  } catch {
    // Sem armazenamento: segue sem a proteção (o recarregamento só acontece ao voltar para o app).
  }
};

// Mantém o app instalado atualizado, sem precisar desinstalar.
//  - watch: confere ao abrir, ao voltar do segundo plano, ao voltar a ter internet e a cada 5 minutos.
//  - Ao VOLTAR para o app com versão nova, recarrega sozinho (exceto nas telas de formulário: aí só avisa).
//  - Se a versão nova aparecer com o app já aberto na tela, não recarrega: mostra o aviso para o usuário escolher.
export function useAppUpdate({ watch = true } = {}) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [checking, setChecking] = useState(false);

  // Retorna se existe versão nova. Marca `updateAvailable` quando existe.
  const check = useCallback(async () => {
    setChecking(true);
    const serverVersion = await fetchServerVersion();
    setChecking(false);

    const isNew = serverVersion !== null && serverVersion !== APP_VERSION;
    if (isNew) setUpdateAvailable(true);
    return { isNew, serverVersion };
  }, []);

  // Aplica a atualização: recarregar busca o HTML e os arquivos novos direto do servidor.
  const apply = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (!watch) return undefined;

    check();

    const onVisible = async () => {
      if (document.visibilityState !== 'visible') return;

      const { isNew, serverVersion } = await check();
      const onFormScreen = NO_AUTO_RELOAD_PATHS.some((path) => window.location.pathname.startsWith(path));

      if (isNew && !onFormScreen && !alreadyReloadedFor(serverVersion)) {
        rememberReload(serverVersion);
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', check);
    const interval = window.setInterval(check, CHECK_EVERY_MS);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', check);
      window.clearInterval(interval);
    };
  }, [watch, check]);

  return { updateAvailable, checking, check, apply };
}
