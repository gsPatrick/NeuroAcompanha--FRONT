'use client';

import { useEffect } from 'react';
import Framework7 from 'framework7/lite-bundle';
import Framework7React, { App, View } from 'framework7-react';
import UpdateBanner from '@/components/layout/UpdateBanner/UpdateBanner';
import { framework7Params } from '@/core/framework7/framework7.config';
import { useAppUpdate } from '@/features/app-update/hooks/useAppUpdate';
import { useInstallGate } from '@/features/install/hooks/useInstallGate';
import { installHaptics } from '@/utils/haptics';

Framework7.use(Framework7React);

export default function AppShellClient({ children }) {
  // Vibração curta em todo toque em algo interativo (um único ouvinte para o app inteiro).
  useEffect(() => installHaptics(), []);

  // Mantém o app instalado na versão mais nova (ver features/app-update).
  const { updateAvailable, apply } = useAppUpdate();

  // No celular, abrir pelo navegador leva à página de instalação (ver features/install).
  useInstallGate();

  return (
    <App {...framework7Params}>
      <View main>{children}</View>
      <UpdateBanner visible={updateAvailable} onUpdate={apply} />
    </App>
  );
}
