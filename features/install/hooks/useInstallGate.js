'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { startCapturingInstallPrompt } from '../utils/installPromptStore';
import { isInstallDismissed, isStandalone, readPlatform } from '../utils/installState';

export const INSTALL_ROUTE = '/instalar';

// Guarda de instalação, ligada no app inteiro:
//  - celular ou tablet abrindo no NAVEGADOR (não instalado) -> leva para a página de instalação, a menos que a pessoa
//    já tenha escolhido "Continuar no navegador";
//  - app já instalado aberto em /instalar -> volta para a tela inicial.
// No computador nada disso acontece (não há o que instalar).
export function useInstallGate() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Captura o aviso de instalação do Android o quanto antes (ele só vem uma vez).
    startCapturingInstallPrompt();
  }, []);

  useEffect(() => {
    const standalone = isStandalone();

    if (standalone && pathname === INSTALL_ROUTE) {
      router.replace('/');
      return;
    }

    if (!standalone && pathname !== INSTALL_ROUTE && readPlatform().isMobile && !isInstallDismissed()) {
      router.replace(INSTALL_ROUTE);
    }
  }, [pathname, router]);
}
