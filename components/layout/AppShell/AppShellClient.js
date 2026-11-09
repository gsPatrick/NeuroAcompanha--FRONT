'use client';

import { useEffect, useState } from 'react';
import Framework7 from 'framework7/lite-bundle';
import Framework7React, { App, View } from 'framework7-react';
import Splash from '@/components/layout/Splash/Splash';
import UpdateBanner from '@/components/layout/UpdateBanner/UpdateBanner';
import { framework7Params } from '@/core/framework7/framework7.config';
import { useAuthGate } from '@/features/auth/hooks/useAuthGate';
import { useAppUpdate } from '@/features/app-update/hooks/useAppUpdate';
import { useInstallGate } from '@/features/install/hooks/useInstallGate';
import { installHaptics } from '@/utils/haptics';

Framework7.use(Framework7React);

const SPLASH_MIN_MS = 1100;
const SPLASH_FADE_MS = 300;

export default function AppShellClient({ children }) {
  // Vibração curta em todo toque em algo interativo (um único ouvinte para o app inteiro).
  useEffect(() => installHaptics(), []);

  // Mantém o app instalado na versão mais nova (ver features/app-update).
  const { updateAvailable, apply } = useAppUpdate();

  // No celular, abrir pelo navegador leva à página de instalação (ver features/install).
  useInstallGate();

  // Sem sessão, qualquer tela leva à entrada (pergunta de login).
  useAuthGate();

  // A abertura fica visível um tempo mínimo e some suavemente, mesmo com o app carregando rápido.
  const [splash, setSplash] = useState('visible');
  useEffect(() => {
    const leave = setTimeout(() => setSplash('leaving'), SPLASH_MIN_MS);
    const done = setTimeout(() => setSplash('gone'), SPLASH_MIN_MS + SPLASH_FADE_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, []);

  return (
    <App {...framework7Params}>
      <View main>{children}</View>
      <UpdateBanner visible={updateAvailable} onUpdate={apply} />
      {splash !== 'gone' ? <Splash leaving={splash === 'leaving'} /> : null}
    </App>
  );
}
